import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerPrediccionVentas = async () => {
  const response = await axios.get(`${API_URL}/prediccion`);
  return response.data;
};
