import axiosInstance from './axiosInstance';

export const fetchCurrentQuestion = async (description: string) => {
  try {
    const response = await axiosInstance.get('/qna/current-question', {
      params: { description },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current question:', error);
    throw error;
  }
};
