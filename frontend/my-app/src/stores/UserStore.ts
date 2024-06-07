// import { create } from "zustand";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import {  signupNewUser } from "@/services/user.api"; 
// import { User } from "@/interface/User";
// import { queryClient } from "@/config";
// import { useEffect } from "react";

// interface UserStoreState {
//   currentUsers?: User[] | null; // Use the optional chaining operator here
// }

// interface UserStoreActions {
//   setUser: (user: User[] | null) => void;
//   refetchUser: () => void;
// }

// // Combine the state and actions into a single interface
// type UserStore = UserStoreState & UserStoreActions;

// // Create the store with initial state and actions
// export const useUserStore = create<UserStore>((set) => ({
//   currentUsers: [], 
//   setUser: (user) => set(() => ({ currentUsers: user })),
//   refetchUser: () => {
//     queryClient.invalidateQueries({ queryKey: ["user"] });
//   },
// }));

// // Custom hook for fetching current users 
// export const useFetchCurrentUser = () => {
//   const setUser = useUserStore((state) => state.setUser);

//   const { isLoading, error, data, refetch } = useQuery({
//     queryKey: ["user"],
//     queryFn: fetchUsers,
  
//   });

//   useEffect(() => {
//     if (data) {
//       setUser(data);
//     }
//     if (error) {
//       setUser(null);
//     }
//   }, [data, error, setUser]);

//   return { isLoading, error, data, refetch };
// };

// // Custom hook for signing up a new user
// export const useSignupNewUser = (onSuccessCallback?: () => void) => {
//   const { refetchUser } = useUserStore();

//   return useMutation({
//     mutationFn: signupNewUser, 
//     onSuccess: () => {
//       // Refetch user data after successful signup
//       refetchUser();
//       if (onSuccessCallback) {
//         onSuccessCallback();
//       }
//     },
//   });
// };
 

