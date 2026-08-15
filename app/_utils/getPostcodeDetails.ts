type Coordinates = { latitude: number; longitude: number };

function fromPostcodeResult(data: {
  status?: number;
  result?: { latitude?: number; longitude?: number } | Array<{ latitude?: number; longitude?: number }>;
}): Coordinates | null {
  const result = Array.isArray(data.result) ? data.result[0] : data.result;
  if (
    data.status === 200 &&
    result &&
    typeof result.latitude === "number" &&
    typeof result.longitude === "number"
  ) {
    return { latitude: result.latitude, longitude: result.longitude };
  }
  return null;
}

export const getPostcodeDetails = async (query: string) => {
  const encoded = encodeURIComponent(query.trim());

  const direct = await fetch(`https://api.postcodes.io/postcodes/${encoded}`);
  const directData = await direct.json();
  const fromDirect = fromPostcodeResult(directData);
  if (fromDirect) return { result: fromDirect };

  const search = await fetch(
    `https://api.postcodes.io/postcodes?q=${encoded}&limit=1`,
  );
  const searchData = await search.json();
  const fromSearch = fromPostcodeResult(searchData);
  if (fromSearch) return { result: fromSearch };

  throw new Error(`Could not find a location for "${query}"`);
};