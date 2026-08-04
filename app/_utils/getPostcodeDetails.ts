export const getPostcodeDetails = async (postcode: string) => {
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${postcode}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching postcode details for ${postcode}:`, error);
    throw error;
  }
};