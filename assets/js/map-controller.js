(function (window) {
  function createMapController(options) {
    const {
      countryRegistry,
      countryResolver,
      getCountryData,
      loadDashboardData,
      openDashboard,
      onSelectionError,
    } = options || {};

    if (!countryRegistry) {
      throw new Error("Map controller requires CountryRegistry.");
    }

    if (!countryResolver) {
      throw new Error("Map controller requires CountryResolver.");
    }

    if (typeof getCountryData !== "function") {
      throw new Error("Map controller requires getCountryData().");
    }

    if (typeof loadDashboardData !== "function") {
      throw new Error("Map controller requires loadDashboardData().");
    }

    if (typeof openDashboard !== "function") {
      throw new Error("Map controller requires openDashboard().");
    }

    const clickableCountries = countryRegistry.getSupportedCountryNames();
    const countryPageMap = countryRegistry.getCountryPageMap();

    function isClickableCountry(countryName) {
      return !!countryName && clickableCountries.includes(countryName);
    }

    function getCountryCode(countryName) {
      return countryRegistry.getCountryIsoCode(countryName) || "UN";
    }

    function renderCountryTags() {
      const countryData = getCountryData() || {};
      return clickableCountries
        .map((country) => {
          const details = countryData[country] || {};
          const visited = details.visited;
          const hasProjects = details.hasProjects !== false;
          const classes = [
            "country-tag",
            visited ? "visited" : "",
            hasProjects ? "" : "no-project-data",
          ]
            .filter(Boolean)
            .join(" ");
          const note = hasProjects
            ? ""
            : '<span class="country-tag-note">No recorded data yet</span>';
          return `<span class="${classes}" data-country="${country}">${country}${note}</span>`;
        })
        .join("");
    }

    function resolveCountryFromPath(path) {
      if (!path) {
        return null;
      }

      return countryResolver.resolveCountryFromSvgInput({
        dataCountry: path.getAttribute("data-country"),
        name: path.getAttribute("name"),
        id: path.getAttribute("id"),
        className: path.getAttribute("class"),
      });
    }

    function getCountryFromPath(path) {
      if (!path) {
        return null;
      }

      return path.getAttribute("data-country") || resolveCountryFromPath(path);
    }

    function getMapTargets(countryName) {
      const targets =
        typeof countryRegistry.getCountryMapTargets === "function"
          ? countryRegistry.getCountryMapTargets(countryName)
          : [countryName];
      return Array.isArray(targets) && targets.length ? targets : [countryName];
    }

    function applyGroupHover(countryNames) {
      const svg = document.querySelector("#world-map");
      if (!svg) {
        return;
      }

      const targets = Array.isArray(countryNames)
        ? countryNames.filter(Boolean)
        : [countryNames].filter(Boolean);
      svg.querySelectorAll("path.clickable").forEach((path) => {
        const pathCountry = path.getAttribute("data-country");
        path.classList.toggle("group-hover", targets.includes(pathCountry));
      });
    }

    function clearGroupHover() {
      const svg = document.querySelector("#world-map");
      if (!svg) {
        return;
      }

      svg.querySelectorAll("path.group-hover").forEach((path) => {
        path.classList.remove("group-hover");
      });
    }

    function showTooltip(event, countryName) {
      let tooltip = document.querySelector(".tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        document.body.appendChild(tooltip);
      }

      tooltip.textContent = countryName;
      tooltip.style.opacity = "1";

      const rect = event.target.getBoundingClientRect();
      tooltip.style.left =
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px";
    }

    function hideTooltip() {
      clearGroupHover();
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) {
        tooltip.style.opacity = "0";
      }
    }

    async function selectCountry(countryName) {
      if (!isClickableCountry(countryName)) {
        return;
      }

      try {
        if (countryPageMap[countryName]) {
          window.location.href = countryPageMap[countryName];
          return;
        }

        const dashboardData = await loadDashboardData(countryName);
        openDashboard(countryName, dashboardData);
      } catch (error) {
        console.warn(`Failed to open dashboard for ${countryName}.`, error);
        if (typeof onSelectionError === "function") {
          onSelectionError(
            `Unable to open the ${countryName} dashboard right now.`,
          );
        }
      }
    }

    async function onMapClick(event) {
      const path = event.target.closest("path");
      if (!path) {
        return;
      }

      const countryName = getCountryFromPath(path);
      if (!isClickableCountry(countryName)) {
        return;
      }

      await selectCountry(countryName);
    }

    function onMapMouseMove(event) {
      const path = event.target.closest("path");
      if (!path) {
        hideTooltip();
        return;
      }

      const countryName = getCountryFromPath(path);
      if (!isClickableCountry(countryName)) {
        hideTooltip();
        return;
      }

      applyGroupHover(getMapTargets(countryName));
      showTooltip(event, countryName);
    }

    function attachEventListeners() {
      const svg = document.querySelector("#world-map");
      if (!svg) {
        return;
      }

      const countryData = getCountryData() || {};

      svg.querySelectorAll("path").forEach((path) => {
        const presetCountry = path.getAttribute("data-country");
        const countryName = presetCountry || resolveCountryFromPath(path);
        path.classList.remove("clickable");
        path.classList.remove("group-hover");
        path.classList.remove("no-project-data");
        path.classList.remove("visited");
        path.style.pointerEvents = "none";
        path.style.cursor = "default";

        if (!isClickableCountry(countryName)) {
          return;
        }

        path.setAttribute("data-country", countryName);
        path.classList.add("clickable");
        path.style.pointerEvents = "auto";
        path.style.cursor = "pointer";

        if (countryData[countryName] && countryData[countryName].visited) {
          path.classList.add("visited");
        }

        if (
          countryData[countryName] &&
          countryData[countryName].hasProjects === false
        ) {
          path.classList.add("no-project-data");
        }
      });

      svg.addEventListener("click", onMapClick);
      svg.addEventListener("mousemove", onMapMouseMove);
      svg.addEventListener("mouseleave", hideTooltip);

      document.querySelectorAll(".country-tag").forEach((tag) => {
        tag.addEventListener("mouseenter", () => {
          const countryName = tag.getAttribute("data-country");
          applyGroupHover(getMapTargets(countryName));
        });

        tag.addEventListener("mouseleave", () => {
          clearGroupHover();
        });

        tag.addEventListener("click", async () => {
          const countryName = tag.getAttribute("data-country");
          await selectCountry(countryName);
        });
      });
    }

    return Object.freeze({
      attachEventListeners,
      getCountryCode,
      renderCountryTags,
    });
  }

  window.MapController = Object.freeze({
    createMapController,
  });

  window.createMapController = createMapController;
})(window);
