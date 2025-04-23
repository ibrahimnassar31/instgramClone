import axios, { AxiosError } from "axios";
import * as Sentry from "@sentry/react";

const BASE_URL = "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true, // Enable credentials

  },
});


export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await apiClient.get<T>(endpoint);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const postData = async <T>(
  endpoint: string,
  data: unknown,
  options?: {
    headers?: Record<string, string>;
    skipJsonStringify?: boolean;
  }
) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(!options?.skipJsonStringify && {
        "Content-Type": "application/json",
      }),
      ...options?.headers,
    },
    credentials: "include",
    body: options?.skipJsonStringify ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json() as Promise<T>;
};

export const updateData = async <T>(endpoint: string, payload: unknown): Promise<T> => {
  try {
    const response = await apiClient.put<T>(endpoint, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};


export const deleteData = async (endpoint: string): Promise<void> => {
  try {
    await apiClient.delete(endpoint);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};


const handleApiError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    Sentry.captureException(axiosError);
    console.error("API Error:", axiosError.response?.data || axiosError.message);
  } else {
    Sentry.captureException(error);
    console.error("An unexpected error occurred:", error);
  }
};