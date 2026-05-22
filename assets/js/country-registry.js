(function (window) {
  const COUNTRY_REGISTRY = Object.freeze({
    Argentina: {
      canonicalName: "Argentina",
      isoCode: "AR",
      pagePath: "Countries/Argentina.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AR"],
      yearDownloads: { 2022: "Reports/Argentina 1st Report.pdf", 2023: "Reports/Argentina 2nd Report.pdf" },
    },
    Armenia: {
      canonicalName: "Armenia",
      isoCode: "AM",
      pagePath: "Countries/Armenia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AM"],
      yearDownloads: { 2022: "Reports/Armenia 1st Report.pdf", 2023: "Reports/Armenia 2nd Report.pdf" },
    },
    Australia: {
      canonicalName: "Australia",
      isoCode: "AU",
      pagePath: "Countries/Australia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AU"],
      yearDownloads: { 2022: "Reports/Australia 1st Report.pdf", 2023: "Reports/Australia 2nd Report.pdf", 2025: "Reports/Australia 4th Report.pdf" },
    },
    Austria: {
      canonicalName: "Austria",
      isoCode: "AT",
      pagePath: "Countries/Austria.html",
      pageAvailable: true,
      supported: true,
      aliases: ["AT"],
      yearDownloads: { 2025: "Reports/Austria 4th Report.pdf" },
    },
    Brazil: {
      canonicalName: "Brazil",
      isoCode: "BR",
      pagePath: "Countries/Brazil.html",
      pageAvailable: true,
      supported: true,
      aliases: ["BR"],
      yearDownloads: { 2022: "Reports/Brazil 1st Report.pdf", 2023: "Reports/Brazil 2nd Report.pdf", 2024: "Reports/Brazil 3rd Report.pdf", 2025: "Reports/Brazil 4th Report.pdf" },
    },
    Bulgaria: {
      canonicalName: "Bulgaria",
      isoCode: "BG",
      pagePath: "Countries/Bulgaria.html",
      pageAvailable: true,
      supported: true,
      aliases: ["BG"],
      yearDownloads: { 2023: "Reports/Bulgaria 2nd Report.pdf", 2024: "Reports/Bulgaria 3rd Report.pdf" },
    },
    Canada: {
      canonicalName: "Canada",
      isoCode: "CA",
      pagePath: "Countries/Canada.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CA"],
      yearDownloads: { 2023: "Reports/Canada 2nd Report.pdf", 2024: "Reports/Canada 3rd Report.pdf", 2025: "Reports/Canada 4th Report.pdf" },
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
      yearDownloads: { 2024: "Reports/CARICOM 3rd Report.pdf" },
    },
    Catalonia: {
      canonicalName: "Catalonia",
      isoCode: "UN",
      pagePath: "Countries/Catalonia.html",
      pageAvailable: false,
      supported: false,
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
      yearDownloads: { 2023: "Reports/Chile 2nd Report.pdf", 2025: "Reports/Chile 4th Report.pdf" },
    },
    Colombia: {
      canonicalName: "Colombia",
      isoCode: "CO",
      pagePath: "Countries/Colombia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CO"],
      yearDownloads: { 2022: "Reports/Colombia 1st Report.pdf", 2023: "Reports/Colombia 2nd Report.pdf", 2024: "Reports/Colombia 3rd Report.pdf", 2025: "Reports/Colombia 4th Report.pdf" },
    },
    Cyprus: {
      canonicalName: "Cyprus",
      isoCode: "CY",
      pagePath: "Countries/Cyprus.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CY"],
      yearDownloads: { 2023: "Reports/Cyprus 2nd Report.pdf" },
    },
    Czechia: {
      canonicalName: "Czechia",
      isoCode: "CZ",
      pagePath: "Countries/Czechia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["CZ", "Czech Republic"],
      yearDownloads: { 2022: "Reports/Czechia 1st Report.pdf", 2023: "Reports/Czechia 2nd Report.pdf", 2024: "Reports/Czechia 3rd Report.pdf", 2025: "Reports/Czechia 4th Report.pdf" },
    },
    Denmark: {
      canonicalName: "Denmark",
      isoCode: "DK",
      pagePath: "Countries/Denmark.html",
      pageAvailable: true,
      supported: true,
      aliases: ["DK"],
      yearDownloads: { 2024: "Reports/Denmark 3rd Report.pdf" },
    },
    "El Salvador": {
      canonicalName: "El Salvador",
      isoCode: "SV",
      pagePath: "Countries/El-Salvador.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SV"],
      yearDownloads: { 2022: "Reports/El Salvador 1st Report.pdf" },
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
      yearDownloads: { 2023: "Reports/Finland 2nd Report.pdf", 2024: "Reports/Finland 3rd Report.pdf" },
    },
    France: {
      canonicalName: "France",
      isoCode: "FR",
      pagePath: "Countries/France.html",
      pageAvailable: true,
      supported: true,
      aliases: ["FR"],
      yearDownloads: { 2022: "Reports/France 1st Report.pdf", 2023: "Reports/France 2nd Report.pdf", 2024: "Reports/France 3rd Report.pdf", 2025: "Reports/France 4th Report.pdf" },
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
      yearDownloads: { 2022: "Reports/Greece 1st Report.pdf", 2023: "Reports/Greece 2nd Report.pdf", 2025: "Reports/Greece 4th Report.pdf" },
    },
    Hungary: {
      canonicalName: "Hungary",
      isoCode: "HU",
      pagePath: "Countries/Hungary.html",
      pageAvailable: true,
      supported: true,
      aliases: ["HU"],
      yearDownloads: { 2025: "Reports/Hungary 4th Report.pdf" },
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
      yearDownloads: { 2025: "Reports/Italy 4th Report.pdf" },
    },
    Japan: {
      canonicalName: "Japan",
      isoCode: "JP",
      pagePath: "Countries/Japan.html",
      pageAvailable: true,
      supported: true,
      aliases: ["JP"],
      yearDownloads: { 2025: "Reports/Japan 4th Report.pdf" },
    },
    Kenya: {
      canonicalName: "Kenya",
      isoCode: "KE",
      pagePath: "Countries/Kenya.html",
      pageAvailable: true,
      supported: true,
      aliases: ["KE"],
      yearDownloads: { 2023: "Reports/Kenya 2nd Report.pdf" },
    },
    Lithuania: {
      canonicalName: "Lithuania",
      isoCode: "LT",
      pagePath: "Countries/Lithuania.html",
      pageAvailable: true,
      supported: true,
      aliases: ["LT"],
      yearDownloads: { 2025: "Reports/Lithuania 4th Report.pdf" },
    },
    Luxembourg: {
      canonicalName: "Luxembourg",
      isoCode: "LU",
      pagePath: "Countries/Luxembourg.html",
      pageAvailable: true,
      supported: true,
      aliases: ["LU"],
      yearDownloads: { 2023: "Reports/Luxembourg 2nd Report.pdf", 2025: "Reports/Luxembourg 4th Report.pdf" },
    },
    Malawi: {
      canonicalName: "Malawi",
      isoCode: "MW",
      pagePath: "Countries/Malawi.html",
      pageAvailable: true,
      supported: true,
      aliases: ["MW"],
      yearDownloads: { 2025: "Reports/Malawi 4th Report.pdf" },
    },
    Malaysia: {
      canonicalName: "Malaysia",
      isoCode: "MY",
      pagePath: "Countries/Malaysia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["MY"],
      yearDownloads: { 2025: "Reports/Malaysia 4th Report.pdf" },
    },
    Mexico: {
      canonicalName: "Mexico",
      isoCode: "MX",
      pagePath: "Countries/Mexico.html",
      pageAvailable: true,
      supported: true,
      aliases: ["MX"],
      yearDownloads: { 2022: "Reports/Mexico 1st Report.pdf", 2023: "Reports/Mexico 2nd Report.pdf" },
    },
    Netherlands: {
      canonicalName: "Netherlands",
      isoCode: "NL",
      pagePath: "Countries/Netherlands.html",
      pageAvailable: true,
      supported: true,
      aliases: ["NL"],
      yearDownloads: { 2024: "Reports/Netherlands 3rd Report.pdf" },
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
      yearDownloads: { 2025: "Reports/Pakistan 4th Report.pdf" },
    },
    Peru: {
      canonicalName: "Peru",
      isoCode: "PE",
      pagePath: "Countries/Peru.html",
      pageAvailable: true,
      supported: true,
      aliases: ["PE"],
      yearDownloads: { 2025: "Reports/Peru 4th Report.pdf" },
    },
    Poland: {
      canonicalName: "Poland",
      isoCode: "PL",
      pagePath: "Countries/Poland.html",
      pageAvailable: true,
      supported: true,
      aliases: ["PL"],
      yearDownloads: { 2023: "Reports/Poland 2nd Report.pdf", 2024: "Reports/Poland 3rd Report.pdf", 2025: "Reports/Poland 4th Report.pdf" },
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
      yearDownloads: { 2023: "Reports/Romania 2nd Report.pdf" },
    },
    "Saudi Arabia": {
      canonicalName: "Saudi Arabia",
      isoCode: "SA",
      pagePath: "Countries/Saudi-Arabia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SA"],
      yearDownloads: { 2024: "Reports/Saudi Arabia 3rd Report.pdf" },
    },
    Serbia: {
      canonicalName: "Serbia",
      isoCode: "RS",
      pagePath: "Countries/Serbia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["RS"],
      yearDownloads: { 2025: "Reports/Serbia 4th Report.pdf" },
    },
    Singapore: {
      canonicalName: "Singapore",
      isoCode: "SG",
      pagePath: "Countries/Singapore.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SG"],
      yearDownloads: { 2022: "Reports/Singapore 1st Report.pdf", 2023: "Reports/Singapore 2nd Report.pdf", 2024: "Reports/Singapore 3rd Report.pdf", 2025: "Reports/Singapore 4th Report.pdf" },
    },
    Slovakia: {
      canonicalName: "Slovakia",
      isoCode: "SK",
      pagePath: "Countries/Slovakia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SK"],
      yearDownloads: { 2023: "Reports/Slovakia 2nd Report.pdf", 2024: "Reports/Slovakia 3rd Report.pdf" },
    },
    Slovenia: {
      canonicalName: "Slovenia",
      isoCode: "SI",
      pagePath: "Countries/Slovenia.html",
      pageAvailable: true,
      supported: true,
      aliases: ["SI"],
      yearDownloads: { 2023: "Reports/Slovenia 2nd Report.pdf", 2025: "Reports/Slovenia 4th Report.pdf" },
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
      yearDownloads: { 2023: "Reports/Spain 2nd Report.pdf", 2024: "Reports/Spain 3rd Report.pdf", 2025: "Reports/Spain 4th Report.pdf" },
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
      yearDownloads: { 2023: "Reports/Taiwan 2nd Report.pdf", 2025: "Reports/Taiwan 4th Report.pdf" },
    },
    Turkey: {
      canonicalName: "Turkey",
      isoCode: "TR",
      pagePath: "Countries/Turkey.html",
      pageAvailable: true,
      supported: true,
      aliases: ["TR", "T\u00fcrkiye"],
      yearDownloads: { 2023: "Reports/Türkiye 2nd Report.pdf" },
    },
    UK: {
      canonicalName: "UK",
      isoCode: "GB",
      pagePath: "Countries/UK.html",
      pageAvailable: true,
      supported: true,
      aliases: ["GB", "United Kingdom"],
      yearDownloads: { 2022: "Reports/United Kingdom 1st Report.pdf", 2023: "Reports/United Kingdom 2nd Report.pdf" },
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
