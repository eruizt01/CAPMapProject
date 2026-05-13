(function (window, document) {
  function resolveCountryName() {
    const explicitCountry = document.body.dataset.countryName;
    if (explicitCountry) {
      return explicitCountry;
    }

    const filename = window.location.pathname.split("/").pop();
    const pageMap = window.CountryRegistry.getCountryPageMap();
    return (
      Object.keys(pageMap).find(
        (countryName) => pageMap[countryName].split("/").pop() === filename,
      ) || null
    );
  }

  function buildFallbackConfig() {
    return {
      projects: [],
      emptyStateTitle: "No workbook contributions available",
      emptyStateMessage:
        "No contribution rows were available for this jurisdiction in the provided workbook.",
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    const countryName = resolveCountryName();
    const dashboardContent = window.CountryDashboardData || {};

    if (!countryName) {
      new window.CountryDashboard({
        country: "Unknown Jurisdiction",
        projects: [],
        emptyStateTitle: "Unknown jurisdiction",
        emptyStateMessage:
          "This page is not associated with a configured jurisdiction.",
      });
      return;
    }

    const config = dashboardContent[countryName] || buildFallbackConfig();
    new window.CountryDashboard(
      window.buildCountryPageConfig(countryName, config),
    );
  });
})(window, document);
