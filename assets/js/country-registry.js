(function (window) {
  const COUNTRY_REGISTRY = Object.freeze({
    Argentina: {
      canonicalName: "Argentina",
      isoCode: "AR",
      pagePath: "Countries/Argentina.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AR"],
      yearDownloads: { 2022: "Reports/Argentina - 1st. Report.pdf" },
    },
    Armenia: {
      canonicalName: "Armenia",
      isoCode: "AM",
      pagePath: "Countries/Armenia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AM"],
    },
    Australia: {
      canonicalName: "Australia",
      isoCode: "AU",
      pagePath: "Countries/Australia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AU"],
    },
    Austria: {
      canonicalName: "Austria",
      isoCode: "AT",
      pagePath: "Countries/Austria.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AT"],
    },
    Brazil: {
      canonicalName: "Brazil",
      isoCode: "BR",
      pagePath: "Countries/Brazil.html",
      pageAvailable: true,
      supported: true,
      aliases: ["BR"],
      yearDownloads: { 2024: "Reports/Brazil - 4th Report.pdf" },
    },
    Bulgaria: {
      canonicalName: "Bulgaria",
      isoCode: "BG",
      pagePath: "Countries/Bulgaria.html",
      pageAvailable: true,
      supported: true,
      aliases: ["BG"],
    },
    Canada: {
      canonicalName: "Canada",
      isoCode: "CA",
      pagePath: "Countries/Canada.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CA"],
    },
    "Caribbean Community": {
      canonicalName: "Caribbean Community",
      isoCode: "UN",
      pagePath: "Countries/Caribbean-Community.html",
      pageAvailable: true,
      supported: true,
      aliases: [
        "CARICOM",
        "Antigua and Barbuda",
        "Bahamas",
        "Barbados",
        "Belize",
        "Dominica",
        "Grenada",
        "Guyana",
        "Haiti",
        "Jamaica",
        "Montserrat",
        "St. Kitts and Nevis",
        "Saint Kitts and Nevis",
        "St. Lucia",
        "Saint Lucia",
        "St. Vincent and the Grenadines",
        "Saint Vincent and the Grenadines",
        "Suriname",
        "Trinidad and Tobago",
      ],
    },
    Catalonia: {
      canonicalName: "Catalonia",
      isoCode: "UN",
      pagePath: "Countries/Catalonia.html",
      pageAvailable: true,
      supported: true,
      aliases: [],
      mapCountries: ["Spain"],
    },
    Chile: {
      canonicalName: "Chile",
      isoCode: "CL",
      pagePath: "Countries/Chile.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CL"],
    },
    Colombia: {
      canonicalName: "Colombia",
      isoCode: "CO",
      pagePath: "Countries/Colombia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CO"],
    },
    Cyprus: {
      canonicalName: "Cyprus",
      isoCode: "CY",
      pagePath: "Countries/Cyprus.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CY"],
    },
    Czechia: {
      canonicalName: "Czechia",
      isoCode: "CZ",
      pagePath: "Countries/Czechia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CZ", "Czech Republic"],
    },
    Denmark: {
      canonicalName: "Denmark",
      isoCode: "DK",
      pagePath: "Countries/Denmark.html",
      pageAvailable: true,
      supported: true,
      aliases: ["DK"],
    },
    "El Salvador": {
      canonicalName: "El Salvador",
      isoCode: "SV",
      pagePath: "Countries/El-Salvador.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SV"],
    },
    "European Union": {
      canonicalName: "European Union",
      isoCode: "EU",
      pagePath: "Countries/European-Union.html",
      pageAvailable: true,
      supported: true,
      aliases: ["EU"],
    },
    Finland: {
      canonicalName: "Finland",
      isoCode: "FI",
      pagePath: "Countries/Finland.html",
      pageAvailable: true,
      supported: true,
      aliases: ["FI"],
    },
    France: {
      canonicalName: "France",
      isoCode: "FR",
      pagePath: "Countries/France.html",
      pageAvailable: true,
      supported: true,
      aliases: ["FR"],
    },
    Germany: {
      canonicalName: "Germany",
      isoCode: "DE",
      pagePath: "Countries/Germany.html",
      pageAvailable: true,
      supported: true,
      aliases: ["DE"],
    },
    Greece: {
      canonicalName: "Greece",
      isoCode: "GR",
      pagePath: "Countries/Greece.html",
      pageAvailable: true,
      supported: true,
      aliases: ["GR"],
    },
    Hungary: {
      canonicalName: "Hungary",
      isoCode: "HU",
      pagePath: "Countries/Hungary.html",
      pageAvailable: true,
      supported: true,
      aliases: ["HU"],
    },
    India: {
      canonicalName: "India",
      isoCode: "IN",
      pagePath: "Countries/India.html",
      pageAvailable: true,
      supported: true,
      aliases: ["IN"],
    },
    Ireland: {
      canonicalName: "Ireland",
      isoCode: "IE",
      pagePath: "Countries/Ireland.html",
      pageAvailable: true,
      supported: true,
      aliases: ["IE"],
    },
    Israel: {
      canonicalName: "Israel",
      isoCode: "IL",
      pagePath: "Countries/Israel.html",
      pageAvailable: true,
      supported: true,
      aliases: ["IL"],
    },
    Italy: {
      canonicalName: "Italy",
      isoCode: "IT",
      pagePath: "Countries/Italy.html",
      pageAvailable: true,
      supported: true,
      aliases: ["IT"],
    },
    Japan: {
      canonicalName: "Japan",
      isoCode: "JP",
      pagePath: "Countries/Japan.html",
      pageAvailable: true,
      supported: true,
      aliases: ["JP"],
    },
    Kenya: {
      canonicalName: "Kenya",
      isoCode: "KE",
      pagePath: "Countries/Kenya.html",
      pageAvailable: true,
      supported: true,
      aliases: ["KE"],
    },
    Lithuania: {
      canonicalName: "Lithuania",
      isoCode: "LT",
      pagePath: "Countries/Lithuania.html",
      pageAvailable: true,
      supported: true,
      aliases: ["LT"],
    },
    Luxembourg: {
      canonicalName: "Luxembourg",
      isoCode: "LU",
      pagePath: "Countries/Luxembourg.html",
      pageAvailable: true,
      supported: true,
      aliases: ["LU"],
    },
    Malawi: {
      canonicalName: "Malawi",
      isoCode: "MW",
      pagePath: "Countries/Malawi.html",
      pageAvailable: true,
      supported: true,
      aliases: ["MW"],
    },
    Malaysia: {
      canonicalName: "Malaysia",
      isoCode: "MY",
      pagePath: "Countries/Malaysia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["MY"],
    },
    Mexico: {
      canonicalName: "Mexico",
      isoCode: "MX",
      pagePath: "Countries/Mexico.html",
      pageAvailable: true,
      supported: true,
      aliases: ["MX"],
    },
    Netherlands: {
      canonicalName: "Netherlands",
      isoCode: "NL",
      pagePath: "Countries/Netherlands.html",
      pageAvailable: true,
      supported: true,
      aliases: ["NL"],
    },
    "New Zealand": {
      canonicalName: "New Zealand",
      isoCode: "NZ",
      pagePath: "Countries/New-Zealand.html",
      pageAvailable: true,
      supported: true,
      aliases: ["NZ", "New-Zealand"],
    },
    Norway: {
      canonicalName: "Norway",
      isoCode: "NO",
      pagePath: "Countries/Norway.html",
      pageAvailable: true,
      supported: true,
      aliases: ["NO"],
    },
    Pakistan: {
      canonicalName: "Pakistan",
      isoCode: "PK",
      pagePath: "Countries/Pakistan.html",
      pageAvailable: true,
      supported: true,
      aliases: ["PK"],
    },
    Peru: {
      canonicalName: "Peru",
      isoCode: "PE",
      pagePath: "Countries/Peru.html",
      pageAvailable: true,
      supported: true,
      aliases: ["PE"],
    },
    Poland: {
      canonicalName: "Poland",
      isoCode: "PL",
      pagePath: "Countries/Poland.html",
      pageAvailable: true,
      supported: true,
      aliases: ["PL"],
    },
    Portugal: {
      canonicalName: "Portugal",
      isoCode: "PT",
      pagePath: "Countries/Portugal.html",
      pageAvailable: true,
      supported: true,
      aliases: ["PT"],
    },
    Romania: {
      canonicalName: "Romania",
      isoCode: "RO",
      pagePath: "Countries/Romania.html",
      pageAvailable: true,
      supported: true,
      aliases: ["RO"],
    },
    "Saudi Arabia": {
      canonicalName: "Saudi Arabia",
      isoCode: "SA",
      pagePath: "Countries/Saudi-Arabia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SA"],
    },
    Serbia: {
      canonicalName: "Serbia",
      isoCode: "RS",
      pagePath: "Countries/Serbia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["RS"],
    },
    Singapore: {
      canonicalName: "Singapore",
      isoCode: "SG",
      pagePath: "Countries/Singapore.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SG"],
    },
    Slovakia: {
      canonicalName: "Slovakia",
      isoCode: "SK",
      pagePath: "Countries/Slovakia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SK"],
    },
    Slovenia: {
      canonicalName: "Slovenia",
      isoCode: "SI",
      pagePath: "Countries/Slovenia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SI"],
    },
    "South Africa": {
      canonicalName: "South Africa",
      isoCode: "ZA",
      pagePath: "Countries/South-Africa.html",
      pageAvailable: true,
      supported: true,
      aliases: ["ZA", "South-Africa"],
    },
    "South Korea": {
      canonicalName: "South Korea",
      isoCode: "KR",
      pagePath: "Countries/South-Korea.html",
      pageAvailable: true,
      supported: true,
      aliases: ["KR", "South-Korea"],
    },
    Spain: {
      canonicalName: "Spain",
      isoCode: "ES",
      pagePath: "Countries/Spain.html",
      pageAvailable: true,
      supported: true,
      aliases: ["ES"],
    },
    Sweden: {
      canonicalName: "Sweden",
      isoCode: "SE",
      pagePath: "Countries/Sweden.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SE"],
    },
    Taiwan: {
      canonicalName: "Taiwan",
      isoCode: "TW",
      pagePath: "Countries/Taiwan.html",
      pageAvailable: true,
      supported: true,
      aliases: ["TW"],
    },
    Turkey: {
      canonicalName: "Turkey",
      isoCode: "TR",
      pagePath: "Countries/Turkey.html",
      pageAvailable: true,
      supported: true,
      aliases: ["TR", "T\u00fcrkiye"],
    },
    UK: {
      canonicalName: "UK",
      isoCode: "GB",
      pagePath: "Countries/UK.html",
      pageAvailable: true,
      supported: true,
      aliases: ["GB", "United Kingdom"],
    },
    USA: {
      canonicalName: "USA",
      isoCode: "US",
      pagePath: "Countries/USA.html",
      pageAvailable: true,
      supported: true,
      aliases: ["US", "United States", "United States of America", "Alaska"],
    },
  });

  function normalizeKey(value) {
    return String(value || "")
      .trim()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  const aliasEntries = Object.values(COUNTRY_REGISTRY).flatMap((country) => {
    const aliases = [
      country.canonicalName,
      country.isoCode,
      ...(country.aliases || []),
    ];
    return aliases.map((alias) => [normalizeKey(alias), country.canonicalName]);
  });

  const COUNTRY_NAME_BY_ALIAS = Object.freeze(Object.fromEntries(aliasEntries));

  function normalizeCountryName(value) {
    const normalized = COUNTRY_NAME_BY_ALIAS[normalizeKey(value)];
    return normalized || null;
  }

  function getCountryRecord(countryName) {
    const canonicalName = normalizeCountryName(countryName);
    return canonicalName ? COUNTRY_REGISTRY[canonicalName] || null : null;
  }

  function getSupportedCountryNames() {
    return Object.values(COUNTRY_REGISTRY)
      .filter((country) => country.supported)
      .map((country) => country.canonicalName);
  }

  function getCountryPageMap() {
    const entries = Object.values(COUNTRY_REGISTRY)
      .filter((country) => country.pageAvailable && country.pagePath)
      .map((country) => [country.canonicalName, country.pagePath]);
    return Object.fromEntries(entries);
  }

  function getCountryIsoCode(countryName) {
    const record = getCountryRecord(countryName);
    return record ? record.isoCode : null;
  }

  function getCountryYearDownloads(countryName) {
    const record = getCountryRecord(countryName);
    return record && record.yearDownloads ? { ...record.yearDownloads } : {};
  }

  function getCountryMapTargets(countryName) {
    const record = getCountryRecord(countryName);
    if (!record) {
      return [];
    }
    return record.mapCountries
      ? [...record.mapCountries]
      : [record.canonicalName];
  }

  function buildCountryPageConfig(countryName, overrides) {
    const record = getCountryRecord(countryName);
    const baseConfig = record
      ? {
          country: record.canonicalName,
          isoCode: record.isoCode,
          yearDownloads: getCountryYearDownloads(record.canonicalName),
        }
      : { country: countryName };

    const overrideConfig = overrides || {};
    return {
      ...baseConfig,
      ...overrideConfig,
      yearDownloads:
        overrideConfig.yearDownloads || baseConfig.yearDownloads || {},
    };
  }

  window.CountryRegistry = Object.freeze({
    countries: COUNTRY_REGISTRY,
    normalizeCountryName,
    getCountryRecord,
    getCountryIsoCode,
    getCountryPageMap,
    getCountryYearDownloads,
    getCountryMapTargets,
    getSupportedCountryNames,
    buildCountryPageConfig,
  });

  window.normalizeCountryName = normalizeCountryName;
  window.getCountryRecord = getCountryRecord;
  window.getCountryIsoCode = getCountryIsoCode;
  window.getCountryYearDownloads = getCountryYearDownloads;
  window.getCountryMapTargets = getCountryMapTargets;
  window.getSupportedCountryNames = getSupportedCountryNames;
  window.getCountryPageMap = getCountryPageMap;
  window.buildCountryPageConfig = buildCountryPageConfig;
})(window);
