export interface Schedule {
  id: number;
  title: string;
  contents?: string | null;  
  use_yn: string;
  tag_ids?: string | null; 
  status: string;
  start_time: string;
  end_time: string;
  relation_types?: string | null; 
  location?: string | null;       
}


export interface CalendarResponse {
  connect_type: string;    
  is_connected: boolean;   
  schedules: Schedule[];
}

export interface OAuthUrlResponse {
  url: string; 
}
