import MapboxGL from "mapbox-gl";
export const getMapboxGL = (): typeof MapboxGL => {
  return MapboxGL || window.mapboxgl;
};

export const setAccessToken = (token: string) => {
  getMapboxGL().accessToken = token;
};
