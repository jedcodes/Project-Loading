import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isError } = useMutation({
    mutationFn: async ({ username, pinCode }: { username: string; pinCode: string }) => {
      const body = JSON.stringify({ username, pinCode });

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Store the JWT token
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameboard'] });
    },
  });

  return { mutate, isError };
};
