import { apiClient } from "../api/client";
import { ApiResponse } from "@/types/api";
import { CalendarResponse, OAuthUrlResponse } from "@/types/calendar";

// 캘린더 연결 시작 → 구글 OAuth URL 받기
export async function getOAuthUrl(): Promise<OAuthUrlResponse> {
  const res = await apiClient.get<ApiResponse<string>>("/v1/calendar/oauth-url");

  if (!res.data || !res.data.data) {
    throw new Error("OAuth URL이 비어 있습니다");
  }

  return { url: res.data.data }; 
}

// 특정 날짜 일정 조회
export async function getCalendarByDate(date: string) {
  const res = await apiClient.get<ApiResponse<CalendarResponse>>(`/v1/calendar/${date}`);
  const data = res.data.data;
  if (!data) {
    throw new Error("날짜 응답이 비어 있습니다");
  }

  // snake_case → camelCase 변환
  return data;
}
