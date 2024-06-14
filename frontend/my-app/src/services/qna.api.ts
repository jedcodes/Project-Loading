import axiosInstance from './axiosInstance';

export const fetchCurrentQuestion = async (questionText: string) => {
  try {
    const response = await axiosInstance.get('/qna/current-question', {
      params: { questionText },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current question:', error);
    throw error;
  }
};
