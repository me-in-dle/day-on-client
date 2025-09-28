export interface Schedule {
  id: number;
  title: string;
  contents?: string;
  use_yn: string;  // snake_case
  tag_ids?: string;  // snake_case
  status: string;
  start_time: string;  // snake_case
  end_time: string;    // snake_case
  relation_types?: string;  // snake_case
  location?: string;
}

export interface CalendarResponse {
  connect_type: string;    // snake_case
  is_connected: boolean;   // snake_case
  schedules: Schedule[];
}

export interface OAuthUrlResponse {
  url: string; 
}
