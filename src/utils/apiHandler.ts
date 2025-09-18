import { ApiResponse } from "../types/api";

export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    console.error(`[API ERROR] ${response.errorCode}: ${response.message}`);
    throw new Error(response.message || "API 요청 실패");
  }
  return response.data as T;
}