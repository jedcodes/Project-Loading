import { User } from "@/interface/User";
import axios from "axios";

import { BASE_URL } from "@/config";

export const signupNewUser = async (username: string, pinCode: string): Promise<User> => {
  const response = await axios.post(BASE_URL + "/auth/register", { username, pinCode });
  if (response.status !== 200) {
    throw new Error('Error signing up new user');
  }
  return response.data;
};

export const userSignIn = async (username: string, pinCode: string): Promise<User> => {
  const response = await axios.post(BASE_URL + "/auth/login", { username, pinCode });
  if (response.status !== 200) {
    throw new Error('Error signing in user');
  }
  return response.data;

}



// headers: {'content-type':'application/json'}
