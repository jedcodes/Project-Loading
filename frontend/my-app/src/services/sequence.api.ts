import axios from "axios";
import { getToken } from '@/services/authService';
import { Sequence } from "@/interface/Sequence";

const BASE_URL = "http://localhost:3000/sequence";

export const getSequence = async (sequenceId: string): Promise<Sequence> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/${sequenceId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting sequence:', error);
    throw error;
  }
};

// Add the create and update functions as necessary
export const createSequence = async (sequence: Sequence): Promise<Sequence> => {
  try {
    const token = getToken();
    const response = await axios.post(BASE_URL, sequence, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating sequence:', error);
    throw error;
  }
};

export const updateSequence = async (sequenceId: string, sequence: Partial<Sequence>): Promise<Sequence> => {
  try {
    const token = getToken();
    const response = await axios.put(`${BASE_URL}/${sequenceId}`, sequence, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating sequence:', error);
    throw error;
  }
};
