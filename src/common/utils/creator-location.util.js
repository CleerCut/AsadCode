function cleanLocationPart(value) {
  if (value == null) return "";
  const part = String(value).trim();
  if (!part || part === "undefined" || part === "null") return "";
  return part;
}

export function formatCreatorLocation({ city, country, state, stateShort } = {}) {
  const cityPart = cleanLocationPart(city);
  const countryPart = cleanLocationPart(country);
  const statePart = cleanLocationPart(state);
  const shortPart = cleanLocationPart(stateShort);
  const regionPart = shortPart || statePart;

  if (cityPart && regionPart && countryPart) {
    return `${cityPart}, ${regionPart}, ${countryPart}`;
  }
  if (cityPart && countryPart) {
    return `${cityPart}, ${countryPart}`;
  }
  if (cityPart && regionPart) {
    return `${cityPart}, ${regionPart}`;
  }
  if (regionPart && countryPart) {
    return `${regionPart}, ${countryPart}`;
  }
  return cityPart || regionPart || countryPart || "";
}
