(function (window) {
    const COUNTRY_CODE_MAP = {
        'Argentina': 'AR',
        'Armenia': 'AM',
        'Australia': 'AU',
        'Austria': 'AT',
        'Brazil': 'BR',
        'Canada': 'CA',
        'Chile': 'CL',
        'Colombia': 'CO',
        'France': 'FR',
        'Germany': 'DE',
        'Greece': 'GR',
        'Hungary': 'HU',
        'India': 'IN',
        'Ireland': 'IE',
        'Israel': 'IL',
        'Italy': 'IT',
        'Japan': 'JP',
        'Kenya': 'KE',
        'Lithuania': 'LT',
        'Mexico': 'MX',
        'Netherlands': 'NL',
        'New Zealand': 'NZ',
        'Norway': 'NO',
        'Peru': 'PE',
        'Poland': 'PL',
        'Portugal': 'PT',
        'Romania': 'RO',
        'Singapore': 'SG',
        'South Africa': 'ZA',
        'South Korea': 'KR',
        'Spain': 'ES',
        'Sweden': 'SE',
        'Turkey': 'TR',
        'UK': 'GB',
        'USA': 'US'
    };

    function sanitizeCode(value, fallback) {
        if (!value) return fallback;
        return value.toString().replace(/[^A-Z]/gi, '').toUpperCase() || fallback;
    }

    function generateDefaultProjects(countryName, isoCode) {
        const normalizedCode = sanitizeCode(isoCode, countryName.substring(0, 3));
        return [
            {
                name: `${countryName} Digital Markets Watch`,
                category: 'Market Intelligence',
                report: '2025 Strategic Overview',
                year: 2025,
                details: `Data platform that helps ${countryName}'s competition authority monitor dominant digital platforms and marketplace behavior.`
            },
            {
                name: `${countryName} Collusion Analytics Lab`,
                category: 'Case Analysis',
                report: '2024 Enforcement Review',
                year: 2024,
                details: `Applied analytics environment that screens procurement and pricing data to surface potential collusion risks in ${countryName}.`
            },
            {
                name: `${countryName} Algorithmic Accountability Toolkit`,
                category: 'Policy Support',
                report: '2023 Policy Brief',
                year: 2023,
                details: `Guidance and tooling that assists teams in assessing algorithmic conduct for competition policy compliance within ${countryName}.`
            },
            {
                name: `${countryName} Competition Data Commons`,
                category: 'Open Data',
                report: '2022 Transparency Report',
                year: 2022,
                details: `Open data collaboration that curates historic procurement, pricing, and conduct indicators to support policy analysis across ${countryName}.`
            }
        ];
    }

    class CountryDashboard {
        constructor(config) {
            this.viewMode = 'table';
            this.sortConfig = { key: null, direction: 'asc' };
            this.currentFilters = { year: null, category: 'all', search: '' };
            this.categoryChart = null;

            this.data = this.normalizeConfig(config);
            this.country = this.data.country;
            const years = this.data.projects.map(project => project.year);
            if (years.length) {
                this.currentFilters.year = String(Math.max(...years));
            }
            this.filteredProjects = [...this.data.projects];

            this.render();
        }

        normalizeConfig(config) {
            if (!config || !config.country) {
                throw new Error('CountryDashboard requires a configuration object with a "country" property.');
            }

            const isoCode = sanitizeCode(config.isoCode || COUNTRY_CODE_MAP[config.country], 'UN');
            const flagUrl = config.flagUrl || `https://flagcdn.com/w80/${isoCode.toLowerCase()}.png`;
            const projects = (config.projects && config.projects.length)
                ? config.projects.map(project => ({
                    ...project,
                    year: typeof project.year === 'number' ? project.year : Number(project.year) || new Date().getFullYear(),
                    details: project.details ?? project.description ?? ''
                }))
                : generateDefaultProjects(config.country, isoCode);

            return {
                ...config,
                isoCode,
                flagUrl,
                projects,
                yearDownloads: config.yearDownloads || {}
            };
        }

        render() {
            const app = document.getElementById('app');
            if (!app) {
                throw new Error('Country dashboard requires a container with id="app".');
            }

            app.innerHTML = this.renderDashboardView();
            this.attachDashboardListeners();
            this.initializeCategoryChart();
            this.applyFilters();
        }

        attachDashboardListeners() {
            const yearPills = document.querySelectorAll('.year-pill');
            yearPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const year = pill.getAttribute('data-year');
                    this.currentFilters.year = this.currentFilters.year === year ? null : year;
                    this.applyFilters();
                });
            });

            const categoryFilter = document.querySelector('#category-filter');
            if (categoryFilter) {
                categoryFilter.addEventListener('change', (event) => {
                    this.currentFilters.category = event.target.value;
                    this.applyFilters();
                });
            }

            const searchFilter = document.querySelector('#search-filter');
            if (searchFilter) {
                searchFilter.addEventListener('input', (event) => {
                    this.currentFilters.search = event.target.value.toLowerCase();
                    this.applyFilters();
                });
            }

            const resetBtn = document.querySelector('.reset-filters');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.resetFilters();
                    this.applyFilters();
                });
            }

            const viewButtons = document.querySelectorAll('.view-btn');
            viewButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.viewMode = button.getAttribute('data-view') || 'table';
                    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.renderProjectList();
                });
            });

            const exportCSV = document.querySelector('#export-csv');
            if (exportCSV) {
                exportCSV.addEventListener('click', () => this.exportToCSV());
            }

            const exportPDF = document.querySelector('#export-pdf');
            if (exportPDF) {
                exportPDF.addEventListener('click', () => this.exportToPDF());
            }
        }

        resetFilters() {
            this.currentFilters = { year: null, category: 'all', search: '' };

            document.querySelectorAll('.year-pill').forEach(pill => pill.classList.remove('active'));

            const categoryFilter = document.querySelector('#category-filter');
            if (categoryFilter) {
                categoryFilter.value = 'all';
            }

            const searchFilter = document.querySelector('#search-filter');
            if (searchFilter) {
                searchFilter.value = '';
            }
        }

        applyFilters() {
            this.filteredProjects = this.data.projects.filter(project => {
                if (this.currentFilters.year && String(project.year) !== this.currentFilters.year) {
                    return false;
                }

                if (this.currentFilters.category !== 'all' && project.category !== this.currentFilters.category) {
                    return false;
                }

                if (this.currentFilters.search) {
                    const haystack = `${project.name} ${project.details || ''}`.toLowerCase();
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
            const yearPills = document.querySelectorAll('.year-pill');
            yearPills.forEach(pill => {
                const year = pill.getAttribute('data-year');
                pill.classList.toggle('active', this.currentFilters.year === year);
            });

            const downloadLink = document.querySelector('#year-download-link');
            if (downloadLink) {
                const downloads = this.data.yearDownloads || {};
                const selectedYear = this.currentFilters.year;
                if (selectedYear && downloads[selectedYear]) {
                    downloadLink.href = encodeURI(downloads[selectedYear]);
                    downloadLink.textContent = `Download ${selectedYear} Contribution (PDF)`;
                    downloadLink.classList.remove('hidden');
                } else {
                    downloadLink.href = '#';
                    downloadLink.classList.add('hidden');
                }
            }
        }

        sortProjects(key) {
            if (this.sortConfig.key === key) {
                this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortConfig.key = key;
                this.sortConfig.direction = 'asc';
            }

            const direction = this.sortConfig.direction === 'asc' ? 1 : -1;

            this.filteredProjects.sort((a, b) => {
                let aVal = a[key];
                let bVal = b[key];

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (aVal > bVal) return direction;
                if (aVal < bVal) return -direction;
                return 0;
            });

            this.renderProjectList();
        }

        renderDashboardView() {
            const years = [...new Set(this.data.projects.map(p => String(p.year)))].sort();
            const categories = [...new Set(this.data.projects.map(p => p.category))];

            return `
                <div class="dashboard-container">
                    <div class="breadcrumb">
                        <a href="../CAPMap.html" class="back-link">Home</a>
                        <span>→</span>
                        <span>Computational Antitrust</span>
                        <span>→</span>
                        <span>${this.data.country}</span>
                    </div>

                    <div class="country-header">
                        <img src="${this.data.flagUrl}" alt="${this.data.country} flag" class="country-flag">
                        <h1 class="country-name">${this.data.country}</h1>
                    </div>

                    <div class="at-a-glance">
                        <div class="stat-card">
                            <h3>Years of Contribution</h3>
                            <div class="year-pills">
                                ${years.map(year => `<span class="year-pill" data-year="${year}">${year}</span>`).join('')}
                            </div>
                            <a id="year-download-link" class="year-download-link hidden" href="#" target="_blank" rel="noopener">Download this year's contribution (PDF)</a>
                        </div>

                        <div class="stat-card">
                            <h3>Total Projects</h3>
                            <div class="total-projects">${this.data.projects.length}</div>
                            <div class="project-label">Projects</div>
                        </div>

                        <div class="stat-card">
                            <h3>Category Breakdown</h3>
                            <div class="chart-container">
                                <canvas id="categoryChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="filters-bar">
                        <div class="filter-group">
                            <label for="category-filter">Category</label>
                            <select id="category-filter" class="filter-select">
                                <option value="all">All Categories</option>
                                ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
                            </select>
                        </div>

                        <div class="filter-group">
                            <label for="search-filter">Search</label>
                            <input type="text" id="search-filter" class="filter-input" placeholder="Search projects...">
                        </div>

                        <button class="reset-filters">Reset Filters</button>
                    </div>

                    <div class="view-toggle">
                        <button class="view-btn ${this.viewMode === 'table' ? 'active' : ''}" data-view="table">Table View</button>
                        <button class="view-btn ${this.viewMode === 'cards' ? 'active' : ''}" data-view="cards">Card View</button>
                    </div>

                    <div id="project-list">
                        ${this.renderProjectList()}
                    </div>

                    <div class="export-controls">
                        <button id="export-csv" class="export-btn">
                            <span>📊</span> Download CSV
                        </button>
                        <button id="export-pdf" class="export-btn">
                            <span>📄</span> Export PDF
                        </button>
                    </div>

                    <div style="margin-top: 30px; text-align: center;">
                        <a href="../CAPMap.html" class="back-link">← Back to map</a>
                    </div>
                </div>
            `;
        }

        renderProjectList() {
            const container = document.getElementById('project-list');
            if (!container) {
                return this.viewMode === 'table' ? this.renderTableView() : this.renderCardView();
            }

            container.innerHTML = this.viewMode === 'table' ? this.renderTableView() : this.renderCardView();

            const detailsLinks = container.querySelectorAll('.details-link, .details-btn');
            detailsLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const projectIndex = Number(link.getAttribute('data-project'));
                    this.showProjectModal(this.filteredProjects[projectIndex]);
                });
            });

            if (this.viewMode === 'table') {
                const sortableHeaders = container.querySelectorAll('.project-table th.sortable');
                sortableHeaders.forEach(header => {
                    header.addEventListener('click', () => {
                        const key = header.getAttribute('data-sort');
                        if (key) {
                            this.sortProjects(key);
                        }
                    });
                });
            }
        }

        renderTableView() {
            if (this.filteredProjects.length === 0) {
                return `
                    <div class="no-data">
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                `;
            }

            return `
                <div class="project-table">
                    <table>
                        <thead>
                            <tr>
                                <th class="sortable ${this.sortConfig.key === 'name' ? `sort-${this.sortConfig.direction}` : ''}" data-sort="name">Name</th>
                                <th class="sortable ${this.sortConfig.key === 'category' ? `sort-${this.sortConfig.direction}` : ''}" data-sort="category">Category</th>
                                <th class="sortable ${this.sortConfig.key === 'report' ? `sort-${this.sortConfig.direction}` : ''}" data-sort="report">Report</th>
                                <th class="sortable ${this.sortConfig.key === 'year' ? `sort-${this.sortConfig.direction}` : ''}" data-sort="year">Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.filteredProjects.map((project, index) => `
                                <tr>
                                    <td><strong>${project.name}</strong></td>
                                    <td>${project.category}</td>
                                    <td>${project.report}</td>
                                    <td>${project.year}</td>
                                    <td>
                                        <a href="#" class="details-link" data-project="${index}">Details →</a>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        renderCardView() {
            if (this.filteredProjects.length === 0) {
                return `
                    <div class="no-data">
                        <h3>No projects found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                `;
            }

            return `
                <div class="project-grid">
                    ${this.filteredProjects.map((project, index) => `
                        <div class="project-card">
                            <h3>${project.name}</h3>
                            <p>${project.details}</p>
                            <ul class="project-meta">
                                <li><strong>Category:</strong> ${project.category}</li>
                                <li><strong>Report:</strong> ${project.report}</li>
                                <li><strong>Year:</strong> ${project.year}</li>
                            </ul>
                            <a href="#" class="details-btn" data-project="${index}">More →</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        showProjectModal(project) {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${project.name}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${project.details}</p>
                        <div class="project-details">
                            <h3>Project Details</h3>
                            <ul class="project-meta">
                                <li><strong>Category:</strong> ${project.category}</li>
                                <li><strong>Report:</strong> ${project.report}</li>
                                <li><strong>Year:</strong> ${project.year}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            });
        }

        exportToCSV() {
            const headers = ['Name', 'Category', 'Report', 'Year', 'Details'];
            const rows = this.filteredProjects.map(project => [
                project.name,
                project.category,
                project.report,
                project.year,
                project.details
            ]);

            let csv = `${headers.join(',')}\n`;
            rows.forEach(row => {
                csv += row.map(cell => `"${cell}"`).join(',') + '\n';
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${this.country.toLowerCase().replace(/\s+/g, '-')}-projects.csv`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        }

        exportToPDF() {
            window.print();
        }

        initializeCategoryChart() {
            const canvas = document.getElementById('categoryChart');
            if (!canvas || typeof Chart === 'undefined') {
                return;
            }

            const categoryData = this.getCategoryBreakdown();
            this.categoryChart = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: [
                            '#3498db',
                            '#2ecc71',
                            '#f39c12',
                            '#e74c3c',
                            '#9b59b6',
                            '#1abc9c',
                            '#34495e'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
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
            this.filteredProjects.forEach(project => {
                breakdown[project.category] = (breakdown[project.category] || 0) + 1;
            });
            return breakdown;
        }
    }

    window.CountryDashboard = CountryDashboard;
    window.generateDefaultProjectsForCountry = generateDefaultProjects;
})(window);
