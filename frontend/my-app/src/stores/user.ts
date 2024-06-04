import { fetchUser, signupNewUser } from "../services/api"; 
import { User } from "../types"; 
import { create } from "zustand";

interface UserStore {
  user?: User | null;
  fetchCurrentUser: () => Promise<void>;
  signupNewUser: (username: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,

  fetchCurrentUser: async () => {
    try {
      const currentUser = await fetchUser();
      set({ user: currentUser });
    } catch (error) {
      console.error(error);
    }
  },
  signupNewUser: async (username: string) => {
    try {
      const response = await signupNewUser(username);
      set({ user: response });
    } catch (error) {
      console.error(error);
    }
  },
}));
