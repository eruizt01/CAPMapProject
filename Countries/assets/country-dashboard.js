(function (window) {
  const countryRegistry = window.CountryRegistry;

  function sanitizeCode(value, fallback) {
    if (!value) return fallback;
    return (
      value
        .toString()
        .replace(/[^A-Z]/gi, "")
        .toUpperCase() || fallback
    );
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeProject(project, defaultYear) {
    if (!project || typeof project !== "object") {
      return null;
    }

    const name = typeof project.name === "string" ? project.name.trim() : "";
    if (!name) {
      return null;
    }

    const rawYear =
      typeof project.year === "number" ? project.year : Number(project.year);
    const year =
      Number.isFinite(rawYear) && rawYear > 0 ? rawYear : defaultYear;

    return {
      ...project,
      name,
      category:
        typeof project.category === "string" && project.category.trim()
          ? project.category.trim()
          : "Uncategorized",
      report:
        typeof project.report === "string" && project.report.trim()
          ? project.report.trim()
          : "Not specified",
      year,
      details:
        typeof project.details === "string"
          ? project.details
          : typeof project.description === "string"
            ? project.description
            : "",
    };
  }

  const csvHeaders = [
    "Name",
    "Category",
    "Report",
    "Year",
    "Agency",
    "Software",
    "Ownership Model",
    "Area of Practice",
    "Challenges",
    "Notes",
    "Details",
  ];

  function escapeCsvCell(cell) {
    return `"${String(cell ?? "").replace(/"/g, '""')}"`;
  }

  function getProjectCsvRow(project) {
    return [
      project.name,
      project.category,
      project.report,
      project.year,
      project.agency || "",
      project.software || "",
      project.ownershipModel || "",
      project.practiceArea || "",
      project.challenges || "",
      project.notes || "",
      project.details,
    ];
  }

  function buildProjectsCSV(projects) {
    const rows = Array.isArray(projects) ? projects : [];
    return [
      csvHeaders.join(","),
      ...rows.map((project) =>
        getProjectCsvRow(project).map(escapeCsvCell).join(","),
      ),
    ].join("\n");
  }

  class CountryDashboard {
    constructor(config) {
      this.containerId = (config && config.containerId) || "app";
      this.viewMode = "cards";
      this.sortConfig = { key: null, direction: "asc" };
      this.currentFilters = { year: null, category: "all", agency: "all", search: "" };
      this.categoryChart = null;
      this.expandedDescriptions = new Set();
      this.expandedAdditionalDetails = new Set();
      this.warnings = [];
      this.chartAvailable = typeof window.Chart !== "undefined";

      if (!this.chartAvailable) {
        this.addWarning(
          "Category chart unavailable. The rest of the dashboard is still usable.",
        );
      }

      this.data = this.normalizeConfig(config);
      this.country = this.data.country;
      (this.data.notices || []).forEach((message) => this.addWarning(message));

      const years = this.data.projects.map((project) => project.year);
      if (years.length) {
        this.currentFilters.year = String(Math.max(...years));
      }

      this.filteredProjects = [...this.data.projects];
      this.render();
    }

    addWarning(message) {
      if (message && !this.warnings.includes(message)) {
        this.warnings.push(message);
      }
    }

    normalizeConfig(config) {
      const safeConfig = config && typeof config === "object" ? config : {};
      const country =
        typeof safeConfig.country === "string" && safeConfig.country.trim()
          ? safeConfig.country.trim()
          : "Unknown Jurisdiction";

      if (!safeConfig.country) {
        this.addWarning(
          "Dashboard configuration is missing a country name. Showing a fallback state.",
        );
      }

      const registryIsoCode = countryRegistry
        ? countryRegistry.getCountryIsoCode(country)
        : null;
      const registryDownloads = countryRegistry
        ? countryRegistry.getCountryYearDownloads(country)
        : {};
      const isoCode = sanitizeCode(safeConfig.isoCode || registryIsoCode, "UN");
      const flagUrl =
        safeConfig.flagUrl ||
        (isoCode === "UN"
          ? ""
          : `https://flagcdn.com/w80/${isoCode.toLowerCase()}.png`);

      let projects;
      if (Array.isArray(safeConfig.projects)) {
        projects = safeConfig.projects
          .map((project) => normalizeProject(project, new Date().getFullYear()))
          .filter(Boolean);

        if (projects.length !== safeConfig.projects.length) {
          this.addWarning(
            "Some project entries were skipped because they were malformed.",
          );
        }

        if (safeConfig.projects.length > 0 && projects.length === 0) {
          this.addWarning(
            "No valid project entries were available for this dashboard.",
          );
        }
      } else {
        projects = [];
      }

      return {
        ...safeConfig,
        country,
        isoCode,
        flagUrl,
        projects,
        yearDownloads: safeConfig.yearDownloads || registryDownloads || {},
        agencyYearDownloads: safeConfig.agencyYearDownloads || {},
        backLinkHref: safeConfig.backLinkHref || "../CAPMap.html",
        backLinkLabel: safeConfig.backLinkLabel || "← Back to map",
        breadcrumbHomeHref: safeConfig.breadcrumbHomeHref || "../CAPMap.html",
        breadcrumbHomeLabel: safeConfig.breadcrumbHomeLabel || "Home",
        emptyStateTitle:
          typeof safeConfig.emptyStateTitle === "string" &&
          safeConfig.emptyStateTitle.trim()
            ? safeConfig.emptyStateTitle.trim()
            : "No projects available",
        emptyStateMessage:
          typeof safeConfig.emptyStateMessage === "string" &&
          safeConfig.emptyStateMessage.trim()
            ? safeConfig.emptyStateMessage.trim()
            : "No project data is available for this jurisdiction.",
        notices: Array.isArray(safeConfig.notices)
          ? safeConfig.notices.filter(
              (notice) => typeof notice === "string" && notice.trim(),
            )
          : [],
        onBack:
          typeof safeConfig.onBack === "function" ? safeConfig.onBack : null,
      };
    }

    getContainer() {
      const container = document.getElementById(this.containerId);
      if (!container) {
        throw new Error(
          `Country dashboard requires a container with id="${this.containerId}".`,
        );
      }
      return container;
    }

    render() {
      const app = this.getContainer();
      app.innerHTML = this.renderDashboardView();
      this.attachDashboardListeners();
      if (this.chartAvailable) {
        this.initializeCategoryChart();
      }
      this.applyFilters();
    }

    attachDashboardListeners() {
      const root = this.getContainer();

      root.querySelectorAll("[data-dashboard-back]").forEach((link) => {
        link.addEventListener("click", (event) => {
          if (this.data.onBack) {
            event.preventDefault();
            this.data.onBack();
          }
        });
      });

      root.querySelectorAll(".year-pill").forEach((button) => {
        button.addEventListener("click", () => {
          const year = button.getAttribute("data-year") || null;
          this.currentFilters.year = year;
          this.applyFilters();
        });
      });

      const categoryFilter = root.querySelector("#category-filter");
      if (categoryFilter) {
        categoryFilter.addEventListener("change", (event) => {
          this.currentFilters.category = event.target.value;
          this.applyFilters();
        });
      }

      const agencyFilter = root.querySelector("#agency-filter");
      if (agencyFilter) {
        agencyFilter.addEventListener("change", (event) => {
          this.currentFilters.agency = event.target.value;
          this.applyFilters();
        });
      }

      const searchFilter = root.querySelector("#search-filter");
      if (searchFilter) {
        searchFilter.addEventListener("input", (event) => {
          this.currentFilters.search = event.target.value.toLowerCase();
          this.applyFilters();
        });
      }

      const resetBtn = root.querySelector(".reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.resetFilters();
          this.applyFilters();
        });
      }

      root.querySelectorAll(".view-btn").forEach((button) => {
        button.addEventListener("click", () => {
          this.viewMode = button.getAttribute("data-view") || "table";
          root
            .querySelectorAll(".view-btn")
            .forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          this.renderProjectList();
        });
      });

      const exportCSV = root.querySelector("#export-csv");
      if (exportCSV) {
        exportCSV.addEventListener("click", () => this.exportToCSV());
      }

      const exportPDF = root.querySelector("#export-pdf");
      if (exportPDF) {
        exportPDF.addEventListener("click", () => this.exportToPDF());
      }
    }

    resetFilters() {
      this.currentFilters = { year: null, category: "all", agency: "all", search: "" };

      const root = this.getContainer();
      root
        .querySelectorAll(".year-pill")
        .forEach((pill) => pill.classList.remove("active"));

      const categoryFilter = root.querySelector("#category-filter");
      if (categoryFilter) {
        categoryFilter.value = "all";
      }

      const agencyFilter = root.querySelector("#agency-filter");
      if (agencyFilter) {
        agencyFilter.value = "all";
      }

      const searchFilter = root.querySelector("#search-filter");
      if (searchFilter) {
        searchFilter.value = "";
      }
    }

    applyFilters() {
      this.filteredProjects = this.data.projects.filter((project) => {
        if (
          this.currentFilters.year &&
          String(project.year) !== this.currentFilters.year
        ) {
          return false;
        }

        if (
          this.currentFilters.category !== "all" &&
          project.category !== this.currentFilters.category
        ) {
          return false;
        }

        if (
          this.currentFilters.agency !== "all" &&
          project.agency !== this.currentFilters.agency
        ) {
          return false;
        }

        if (this.currentFilters.search) {
          const haystack = [
            project.name,
            project.details || "",
            project.agency || "",
            project.software || "",
            project.practiceArea || "",
            project.challenges || "",
            project.notes || "",
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(this.currentFilters.search)) {
            return false;
          }
        }

        return true;
      });

      this.updateFilterUI();
      this.renderProjectList();
      this.updateCategoryChart();
    }

    updateFilterUI() {
      const root = this.getContainer();

      root.querySelectorAll(".year-pill").forEach((pill) => {
        const year = pill.getAttribute("data-year");
        pill.classList.toggle(
          "active",
          (this.currentFilters.year || "") === year,
        );
      });

      const downloadLink = root.querySelector("#year-download-link");
      if (downloadLink) {
        const agencyDownloads =
          this.currentFilters.agency !== "all" &&
          this.data.agencyYearDownloads &&
          this.data.agencyYearDownloads[this.currentFilters.agency]
            ? this.data.agencyYearDownloads[this.currentFilters.agency]
            : null;
        const downloads = agencyDownloads || this.data.yearDownloads || {};
        const selectedYear = this.currentFilters.year;
        if (selectedYear && downloads[selectedYear]) {
          downloadLink.href = encodeURI(downloads[selectedYear]);
          downloadLink.textContent = `Download ${selectedYear} Contribution (PDF)`;
          downloadLink.classList.remove("hidden");
        } else {
          downloadLink.href = "#";
          downloadLink.classList.add("hidden");
        }
      }

      const visibleSummary = root.querySelector("#visible-projects-summary");
      if (visibleSummary) {
        visibleSummary.textContent = this.getVisibleProjectsSummary();
      }

      const projectsHeadingSummary = root.querySelector(
        "#projects-heading-summary",
      );
      if (projectsHeadingSummary) {
        projectsHeadingSummary.textContent = this.getVisibleProjectsSummary();
      }

      const countrySubtitle = root.querySelector(".country-subtitle");
      if (countrySubtitle) {
        countrySubtitle.textContent = this.getVisibleProjectsSummary();
      }
    }

    getVisibleProjectsSummary() {
      const count = this.filteredProjects.length;
      const noun = count === 1 ? "project" : "projects";
      const filters = [];

      if (this.currentFilters.year) {
        filters.push(`from ${this.currentFilters.year}`);
      }

      if (this.currentFilters.category !== "all") {
        filters.push(`in ${this.currentFilters.category}`);
      }

      if (this.currentFilters.agency !== "all") {
        filters.push(`by ${this.currentFilters.agency}`);
      }

      if (this.currentFilters.search) {
        filters.push(`matching "${this.currentFilters.search}"`);
      }

      return filters.length
        ? `Showing ${count} ${noun} ${filters.join(" ")}`
        : `Showing all ${count} ${noun}`;
    }

    sortProjects(key) {
      if (this.sortConfig.key === key) {
        this.sortConfig.direction =
          this.sortConfig.direction === "asc" ? "desc" : "asc";
      } else {
        this.sortConfig.key = key;
        this.sortConfig.direction = "asc";
      }

      const direction = this.sortConfig.direction === "asc" ? 1 : -1;

      this.filteredProjects.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];

        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal > bVal) return direction;
        if (aVal < bVal) return -direction;
        return 0;
      });

      this.renderProjectList();
    }

    renderWarnings() {
      if (!this.warnings.length) {
        return "";
      }

      return `
                <div class="no-data" style="margin-bottom: 20px; padding: 20px;">
                    ${this.warnings.map((message) => `<p>${escapeHtml(message)}</p>`).join("")}
                </div>
            `;
    }

    renderDashboardView() {
      const years = [
        ...new Set(this.data.projects.map((p) => String(p.year))),
      ].sort();
      const categories = [
        ...new Set(this.data.projects.map((p) => p.category)),
      ];
      const agencies = [
        ...new Set(this.data.projects.map((p) => p.agency).filter(Boolean)),
      ];
      const chartMarkup = this.chartAvailable
        ? '<canvas id="categoryChart"></canvas>'
        : '<div class="no-data" style="padding: 20px; box-shadow: none; background: #f8f9fa;">Category chart unavailable.</div>';

      return `
                <div class="dashboard-container" data-testid="dashboard-root">
                    ${this.renderWarnings()}

                    <div class="country-hero">
                        <div class="breadcrumb">
                            <a href="${escapeHtml(this.data.breadcrumbHomeHref)}" class="back-link" data-dashboard-back="true">${escapeHtml(this.data.breadcrumbHomeLabel)}</a>
                            <span>→</span>
                            <span>Computational Antitrust</span>
                            <span>→</span>
                            <span>${escapeHtml(this.data.country)}</span>
                        </div>

                        <div class="country-header">
                            <div class="country-title-row">
                                ${this.data.flagUrl ? `<img src="${escapeHtml(this.data.flagUrl)}" alt="${escapeHtml(this.data.country)} flag" class="country-flag">` : ""}
                                <div>
                                    <h1 class="country-name">${escapeHtml(this.data.country)}</h1>
                                    <p class="country-subtitle">${escapeHtml(this.getVisibleProjectsSummary())}</p>
                                </div>
                            </div>
                            <a href="${escapeHtml(this.data.backLinkHref)}" class="back-link country-hero-back" data-dashboard-back="true">${escapeHtml(this.data.backLinkLabel)}</a>
                        </div>
                    </div>

                    <div class="at-a-glance">
                        <div class="stat-card">
                            <h3>Years of Contribution</h3>
                            <div class="year-pills">
                                <button type="button" class="year-pill" data-year="">All years</button>
                                ${years.map((year) => `<button type="button" class="year-pill" data-year="${escapeHtml(year)}">${escapeHtml(year)}</button>`).join("")}
                            </div>
                            <a id="year-download-link" class="year-download-link hidden" href="#" target="_blank" rel="noopener">Download this year's contribution (PDF)</a>
                        </div>

                        <div class="stat-card">
                            <h3>Total Projects</h3>
                            <div class="total-projects">${this.data.projects.length}</div>
                            <div class="project-label">${this.data.projects.length === 1 ? "Total project" : "Total projects"}</div>
                            <div id="visible-projects-summary" class="visible-projects-summary" data-testid="visible-projects-summary">Showing all ${this.data.projects.length} ${this.data.projects.length === 1 ? "project" : "projects"}</div>
                        </div>

                        <div class="stat-card">
                            <h3>Category Breakdown</h3>
                            <div class="chart-container">
                                ${chartMarkup}
                            </div>
                        </div>
                    </div>

                    <div class="filters-bar">
                        <div class="filter-group">
                            <label for="category-filter">Category</label>
                            <select id="category-filter" class="filter-select">
                                <option value="all">All Categories</option>
                                ${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}
                            </select>
                        </div>

                        ${agencies.length > 1 ? `
                        <div class="filter-group">
                            <label for="agency-filter">Agency</label>
                            <select id="agency-filter" class="filter-select">
                                <option value="all">All Agencies</option>
                                ${agencies.map((a) => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join("")}
                            </select>
                        </div>
                        ` : ""}

                        <div class="filter-group">
                            <label for="search-filter">Search</label>
                            <input type="text" id="search-filter" class="filter-input" placeholder="Search projects...">
                        </div>

                        <button class="reset-filters">Reset Filters</button>
                    </div>

                    <div class="projects-header">
                        <div>
                            <h2>Projects</h2>
                            <p id="projects-heading-summary">${escapeHtml(this.getVisibleProjectsSummary())}</p>
                        </div>
                        <div class="view-toggle" aria-label="Project display mode">
                            <button class="view-btn ${this.viewMode === "cards" ? "active" : ""}" data-view="cards">Cards</button>
                            <button class="view-btn ${this.viewMode === "table" ? "active" : ""}" data-view="table">Compact table</button>
                        </div>
                    </div>

                    <div id="project-list" data-testid="project-list">
                        ${this.renderProjectList()}
                    </div>

                    <div class="export-controls">
                        <button id="export-csv" class="export-btn">
                            <span>📊</span> Download CSV
                        </button>
                        <button id="export-pdf" class="export-btn">
                            <span>📄</span> Print / Save as PDF
                        </button>
                    </div>

                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${escapeHtml(this.data.backLinkHref)}" class="back-link" data-dashboard-back="true">${escapeHtml(this.data.backLinkLabel)}</a>
                    </div>
                </div>
            `;
    }

    renderProjectList() {
      const root = this.getContainer();
      const container = root.querySelector("#project-list");
      const markup =
        this.viewMode === "table"
          ? this.renderTableView()
          : this.renderCardView();

      if (!container) {
        return markup;
      }

      container.innerHTML = markup;

      container
        .querySelectorAll(".details-link, .details-btn")
        .forEach((link) => {
          link.addEventListener("click", (event) => {
            event.preventDefault();
            const projectIndex = Number(link.getAttribute("data-project"));
            this.showProjectModal(this.filteredProjects[projectIndex]);
          });
        });

      container
        .querySelectorAll("[data-description-toggle]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            const projectId = button.getAttribute("data-description-toggle");
            if (!projectId) {
              return;
            }

            if (this.expandedDescriptions.has(projectId)) {
              this.expandedDescriptions.delete(projectId);
            } else {
              this.expandedDescriptions.add(projectId);
            }

            this.renderProjectList();
          });
        });

      container
        .querySelectorAll("[data-additional-toggle]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            const projectId = button.getAttribute("data-additional-toggle");
            if (!projectId) {
              return;
            }

            if (this.expandedAdditionalDetails.has(projectId)) {
              this.expandedAdditionalDetails.delete(projectId);
            } else {
              this.expandedAdditionalDetails.add(projectId);
            }

            this.renderProjectList();
          });
        });

      if (this.viewMode === "table") {
        container
          .querySelectorAll(".project-table th.sortable")
          .forEach((header) => {
            header.addEventListener("click", () => {
              const key = header.getAttribute("data-sort");
              if (key) {
                this.sortProjects(key);
              }
            });
          });
      }

      return markup;
    }

    renderTableView() {
      if (this.filteredProjects.length === 0) {
        if (this.data.projects.length === 0) {
          return `
                    <div class="no-data">
                        <h3>${escapeHtml(this.data.emptyStateTitle)}</h3>
                        <p>${escapeHtml(this.data.emptyStateMessage)}</p>
                    </div>
                `;
        }

        return `
                    <div class="no-data">
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                `;
      }

      return `
                <div class="project-table" aria-label="Compact project comparison table">
                    <table>
                        <thead>
                            <tr>
                                <th class="sortable project-table-project-col ${this.sortConfig.key === "name" ? `sort-${this.sortConfig.direction}` : ""}" data-sort="name">Project</th>
                                <th class="sortable ${this.sortConfig.key === "category" ? `sort-${this.sortConfig.direction}` : ""}" data-sort="category">Focus</th>
                                <th class="sortable ${this.sortConfig.key === "report" ? `sort-${this.sortConfig.direction}` : ""}" data-sort="report">Source</th>
                                <th class="sortable ${this.sortConfig.key === "year" ? `sort-${this.sortConfig.direction}` : ""}" data-sort="year">Year</th>
                                <th class="project-table-action-col">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.filteredProjects
                              .map(
                                (project, index) => `
                                <tr>
                                    <td data-label="Project">
                                        <div class="project-table-primary">
                                            <strong>${escapeHtml(this.getProjectTitle(project))}</strong>
                                            ${project.agency ? `<span>${escapeHtml(project.agency)}</span>` : ""}
                                            ${project.details ? `<p>${escapeHtml(this.getProjectPreview(project.details))}</p>` : ""}
                                        </div>
                                    </td>
                                    <td data-label="Focus">
                                        <div class="project-table-tags">
                                            ${this.renderMetadataChip("Category", project.category, "primary")}
                                            ${this.renderMetadataChip("Area", project.practiceArea, "neutral")}
                                        </div>
                                    </td>
                                    <td data-label="Source">
                                        <span class="project-table-source">${escapeHtml(project.report)}</span>
                                    </td>
                                    <td data-label="Year">
                                        <span class="project-year-badge">${escapeHtml(project.year)}</span>
                                    </td>
                                    <td class="project-table-actions-cell" data-label="Details">
                                        <a href="#" class="details-link" data-project="${index}">Open</a>
                                    </td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `;
    }

    renderCardView() {
      if (this.filteredProjects.length === 0) {
        if (this.data.projects.length === 0) {
          return `
                    <div class="no-data">
                        <h3>${escapeHtml(this.data.emptyStateTitle)}</h3>
                        <p>${escapeHtml(this.data.emptyStateMessage)}</p>
                    </div>
                `;
        }

        return `
                    <div class="no-data">
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                `;
      }

      return `
                <div class="project-list-cards">
                    ${this.filteredProjects
                      .map(
                        (project, index) => `
                        ${this.renderProjectCard(project, {
                          projectIndex: index,
                          showAction: false,
                          context: "list",
                        })}
                    `,
                      )
                      .join("")}
                </div>
            `;
    }

    getProjectTitle(project) {
      if (project.name) {
        return project.name;
      }

      const words = String(project.details || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 10);

      return words.length ? `${words.join(" ")}…` : "Untitled project";
    }

    getProjectPreview(value) {
      const text = String(value || "")
        .replace(/\s+/g, " ")
        .trim();

      if (text.length <= 150) {
        return text;
      }

      return `${text.slice(0, 147).trim()}...`;
    }

    getAdditionalDetailItems(project) {
      return [
        ["Software", project.software],
        ["Challenges", project.challenges],
        ["Notes", project.notes],
        ["Ownership model", project.ownershipModel],
      ].filter(([, value]) => value);
    }

    renderMetadataChip(label, value, variant) {
      if (!value) {
        return "";
      }

      return `<span class="project-chip project-chip-${escapeHtml(variant)}"><span class="project-chip-label">${escapeHtml(label)}:</span> ${escapeHtml(value)}</span>`;
    }

    renderProjectCard(project, options) {
      const safeOptions = options || {};
      const projectId =
        project.id ||
        `${this.country.toLowerCase().replace(/\s+/g, "-")}-${project.year}-${this.getProjectTitle(
          project,
        )
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`;
      const descriptionExpanded = this.expandedDescriptions.has(projectId);
      const additionalExpanded = this.expandedAdditionalDetails.has(projectId);
      const additionalItems = this.getAdditionalDetailItems(project);
      const projectTitle = this.getProjectTitle(project);
      const metadataRow = [
        this.renderMetadataChip("Category", project.category, "primary"),
        this.renderMetadataChip(
          "Area of practice",
          project.practiceArea,
          "neutral",
        ),
        this.renderMetadataChip("Report", project.report, "outline"),
      ]
        .filter(Boolean)
        .join("");
      const hasLongDescription = String(project.details || "").length > 180;

      const descriptionMarkup = project.details
        ? `
                        <div class="project-card-description">
                            <span class="project-card-section-label">Summary</span>
                            <p class="project-description-copy ${hasLongDescription && !descriptionExpanded ? "clamped" : "expanded"}">${escapeHtml(project.details)}</p>
                            ${
                              hasLongDescription
                                ? `<button type="button" class="project-card-toggle" data-description-toggle="${escapeHtml(projectId)}">
                                    ${descriptionExpanded ? "Show less" : "Show more"}
                                </button>`
                                : ""
                            }
                        </div>
                    `
        : "";

      const additionalMarkup = additionalItems.length
        ? `
                        <div class="project-card-additional">
                            <button type="button" class="project-card-additional-toggle" data-additional-toggle="${escapeHtml(projectId)}">
                                ${additionalExpanded ? "Hide details" : "View details"}
                                <span>${additionalExpanded ? "−" : "+"}</span>
                            </button>
                            ${
                              additionalExpanded
                                ? `
                                <div class="project-card-additional-panel">
                                    ${additionalItems
                                      .map(
                                        ([label, value]) => `
                                        <div class="project-card-detail-row">
                                            <span class="project-card-detail-label">${escapeHtml(label)}</span>
                                            <span class="project-card-detail-value">${escapeHtml(value)}</span>
                                        </div>
                                    `,
                                      )
                                      .join("")}
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `
        : "";

      const actionMarkup = safeOptions.showAction
        ? `
                        <div class="project-card-actions">
                            <a href="#" class="details-btn" data-project="${safeOptions.projectIndex}">Project Details</a>
                        </div>
                    `
        : "";

      return `
                <article class="project-card ${safeOptions.context === "modal" ? "project-card-modal" : ""}" data-project-card="${escapeHtml(projectId)}">
                    <div class="project-card-header">
                        <div class="project-card-heading">
                            <h3 class="project-card-title">${escapeHtml(projectTitle)}</h3>
                            ${
                              project.agency
                                ? `<p class="project-card-agency">${escapeHtml(project.agency)}</p>`
                                : ""
                            }
                        </div>
                        ${
                          project.year
                            ? `<span class="project-year-badge">${escapeHtml(project.year)}</span>`
                            : ""
                        }
                    </div>
                    ${
                      metadataRow
                        ? `<div class="project-card-metadata">${metadataRow}</div>`
                        : ""
                    }
                    ${descriptionMarkup}
                    ${additionalMarkup}
                    ${actionMarkup}
                </article>
            `;
    }

    showProjectModal(project) {
      if (!project) {
        return;
      }

      const modal = document.createElement("div");
      modal.className = "modal active";
      modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Project Details</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${this.renderProjectCard(project, {
                          showAction: false,
                          context: "modal",
                        })}
                    </div>
                </div>
            `;

      document.body.appendChild(modal);

      modal.querySelector(".modal-close").addEventListener("click", () => {
        modal.remove();
      });

      modal.querySelectorAll("[data-description-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          const projectId = button.getAttribute("data-description-toggle");
          if (!projectId) {
            return;
          }

          if (this.expandedDescriptions.has(projectId)) {
            this.expandedDescriptions.delete(projectId);
          } else {
            this.expandedDescriptions.add(projectId);
          }

          modal.remove();
          this.showProjectModal(project);
        });
      });

      modal.querySelectorAll("[data-additional-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          const projectId = button.getAttribute("data-additional-toggle");
          if (!projectId) {
            return;
          }

          if (this.expandedAdditionalDetails.has(projectId)) {
            this.expandedAdditionalDetails.delete(projectId);
          } else {
            this.expandedAdditionalDetails.add(projectId);
          }

          modal.remove();
          this.showProjectModal(project);
        });
      });

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.remove();
        }
      });
    }

    exportToCSV() {
      try {
        const csv = buildProjectsCSV(this.filteredProjects);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${this.country.toLowerCase().replace(/\s+/g, "-")}-projects.csv`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.warn("CSV export failed.", error);
      }
    }

    exportToPDF() {
      window.print();
    }

    initializeCategoryChart() {
      const canvas = this.getContainer().querySelector("#categoryChart");
      if (!canvas || typeof window.Chart === "undefined") {
        return;
      }

      const categoryData = this.getCategoryBreakdown();
      this.categoryChart = new window.Chart(canvas, {
        type: "doughnut",
        data: {
          labels: Object.keys(categoryData),
          datasets: [
            {
              data: Object.values(categoryData),
              backgroundColor: [
                "#3498db",
                "#2ecc71",
                "#f39c12",
                "#e74c3c",
                "#9b59b6",
                "#1abc9c",
                "#34495e",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: window.matchMedia("(max-width: 640px)").matches
                ? "bottom"
                : "right",
              labels: {
                padding: 15,
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }

    updateCategoryChart() {
      if (!this.categoryChart) {
        return;
      }

      const categoryData = this.getCategoryBreakdown();
      this.categoryChart.data.labels = Object.keys(categoryData);
      this.categoryChart.data.datasets[0].data = Object.values(categoryData);
      this.categoryChart.update();
    }

    getCategoryBreakdown() {
      const breakdown = {};
      this.filteredProjects.forEach((project) => {
        breakdown[project.category] = (breakdown[project.category] || 0) + 1;
      });
      return breakdown;
    }
  }

  CountryDashboard.escapeCsvCell = escapeCsvCell;
  CountryDashboard.buildProjectsCSV = buildProjectsCSV;
  window.CountryDashboard = CountryDashboard;
  window.generateDefaultProjectsForCountry =
    function generateDefaultProjectsForCountry() {
      return [];
    };
})(window);
