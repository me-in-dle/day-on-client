export interface Schedule {
  id: string;
  title: string;
  contents: string | null;
  useYn: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  // tagIds: string | null; 
  startTime: string;
  endTime: string;
  relationTypes: string | null; 
  location: string | null; 
}

export interface CalendarResponse {
  is_connected: boolean;     
  connect_type: string | null; // google | kakao | null
  schedules: Schedule[];
}

export interface OAuthUrlResponse {
  url: string; 
}
