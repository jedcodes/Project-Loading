import axios from "axios";

const BASE_URL = "https://665654029f970b3b36c50619.mockapi.io/";

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(BASE_URL + "users");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
