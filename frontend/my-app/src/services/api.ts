import { Scenario, User } from "@/types";
import axios from "axios";

const BASE_URL = "https://665654029f970b3b36c50619.mockapi.io";

export const fetchUser = async (): Promise<User> => {
  try {
    const response = await axios.get(BASE_URL + "/users", {
      headers: { "content-type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return {} as User;
  }
};

export const signupNewUser = async (username: string): Promise<User> => {
  try {
    const newUser = {
      username: username,
      score: 0,
      state: {},
    };
    const response = await axios({
      method: "POST",
      url: BASE_URL + "/users",
      headers: { "content-type": "application/json" },
      data: newUser,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return {} as User;
  }
};

export const fetchScenarios = async (): Promise<Scenario[] | null> => {
  try {
    const response = await axios.get(BASE_URL + "/scenarios", {
      headers: { "content-type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
