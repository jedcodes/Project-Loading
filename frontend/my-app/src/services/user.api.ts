// services/user.api.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from './axiosInstance';

export const useSignUserIn = () => {
  const queryClient = useQueryClient();
  const { mutate, isError } = useMutation({
    mutationFn: async ({ username, pinCode }: { username: string; pinCode: string }) => {
      const body = JSON.stringify({ username, pinCode });

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameboard'] });
    },
  });

  return { mutate, isError };
};

export const useVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, questionId, optionIndex }: { userId: string, questionId: string, optionIndex: number }) => {
      const response = await axiosInstance.post(`/user/${userId}/vote`, { questionId, optionIndex });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentQuestion'] });
    },
  });
};
