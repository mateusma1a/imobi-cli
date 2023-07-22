import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.mapbox.com/"
  });

// Search for address suggestions and geocoding
export const getAddressSuggestions = async (search_text) => {
  return api.get(
    `geocoding/v5/mapbox.places/${search_text}.json?language=pt-br&country=BR&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
  );
};
