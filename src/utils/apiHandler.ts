import { ApiResponse } from "../types/api";
import { apiClient } from "../api/client";

export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    console.error(`[API ERROR] ${response.errorCode}: ${response.message}`);
    throw new Error(response.message || "API 요청 실패");
  }
  return response.data as T;
}

// GET 요청 처리
export async function get<T>(url: string, config?: { params?: any }): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error(`[GET ERROR] ${url}:`, error);
    throw error;
  }
}

// POST 요청 처리
export async function post<T, R>(url: string, data: T): Promise<R> {
  try {
    const response = await apiClient.post<ApiResponse<R>>(url, data);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error(`[POST ERROR] ${url}:`, error);
    throw error;
  }
}

// PUT 요청 처리
export async function put<T, R>(url: string, data: T): Promise<R> {
  try {
    const response = await apiClient.put<ApiResponse<R>>(url, data);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error(`[PUT ERROR] ${url}:`, error);
    throw error;
  }
}

// DELETE 요청 처리
export async function del<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error(`[DELETE ERROR] ${url}:`, error);
    throw error;
  }
}