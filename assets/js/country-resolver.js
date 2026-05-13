(function (window) {
  function getRegistry() {
    const registry = window.CountryRegistry;
    if (!registry) {
      throw new Error(
        "Country registry must load before the country resolver.",
      );
    }
    return registry;
  }

  function normalizeCountryInput(value) {
    if (!value) {
      return null;
    }

    const registry = getRegistry();
    const canonicalName = registry.normalizeCountryName(value);
    if (!canonicalName) {
      return null;
    }

    const record = registry.getCountryRecord(canonicalName);
    return record && record.supported ? record.canonicalName : null;
  }

  function resolveCountryFromSvgInput(input) {
    if (!input) {
      return null;
    }

    const candidates = [
      input.dataCountry,
      input.name,
      input.id,
      input.className,
      typeof input.className === "string"
        ? input.className.trim().split(/\s+/).join(" ")
        : null,
    ];

    for (const candidate of candidates) {
      const canonicalName = normalizeCountryInput(candidate);
      if (canonicalName) {
        return canonicalName;
      }
    }

    return null;
  }

  window.CountryResolver = Object.freeze({
    normalizeCountryInput,
    resolveCountryFromSvgInput,
  });

  window.normalizeCountryInput = normalizeCountryInput;
  window.resolveCountryFromSvgInput = resolveCountryFromSvgInput;
})(window);
