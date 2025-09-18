/**
 * 공통 response 타입 정의
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  path?: string;
  timestamp: string;
}