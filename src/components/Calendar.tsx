import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, RefreshCw, Settings } from "lucide-react";
import { getCalendarByDate, getOAuthUrl } from "@/services/calendarService";
import { CalendarResponse, Schedule } from "@/types/calendar";

// 연결 타입별 배지 색상
const getConnectionBadgeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'google':
      return '#4285f4';
    case 'kakao':
      return '#fee500';
    default:
      return '#10b981';
  }
};

// 태그 ID를 색상으로 매핑
const getTagColor = (tagId: string) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const index = parseInt(tagId) % colors.length;
  return colors[index];
};

// 시간 범위 표시 함수
const formatTimeRange = (startTime: string, endTime: string) => {
  const start = startTime.substring(0, 5); // HH:MM
  const end = endTime.substring(0, 5);     // HH:MM
  return `${start} - ${end}`;
};

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectType, setConnectType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date();

  // 오늘 날짜를 YYYY-MM-DD 형식으로 포맷팅
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 날짜 포맷
  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  // 캘린더 데이터 가져오기
  const fetchSchedules = async (date: string) => {
    setLoading(true);
    try {
      const res: CalendarResponse = await getCalendarByDate(date);
      console.log("fetchSchedules 응답:", res); // 디버깅용
      
      // snake_case로 온 데이터 처리
      setIsConnected(res.is_connected);
      setConnectType(res.connect_type);
      
      // schedules 배열 처리 - use_yn 필드명 주의
      const validSchedules = res.schedules.filter((s) => s.use_yn === "Y");
      console.log("유효한 스케줄:", validSchedules); // 디버깅용
      setSchedules(validSchedules);
    } catch (err) {
      console.error("캘린더 조회 실패:", err);
      setIsConnected(false);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시와 날짜 변경 시 호출
  useEffect(() => {
    const dateStr = formatDateForAPI(selectedDate);
    fetchSchedules(dateStr);
  }, [selectedDate]);

  // 7~24시 타임라인 생성
  const timeline = useMemo(() => {
    const timeSlots: { time: string; events: Schedule[] }[] = [];
    
    for (let hour = 7; hour <= 24; hour++) {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;
      
      // 해당 시간에 시작하는 이벤트들 찾기
      const eventsAtTime = schedules.filter(schedule => {
        const eventStartHour = parseInt(schedule.start_time.substring(0, 2));
        return eventStartHour === hour;
      });

      timeSlots.push({
        time: timeStr,
        events: eventsAtTime
      });
    }
    
    return timeSlots;
  }, [schedules]);

  // 날짜 선택기
  const dateInputRef = useRef<HTMLInputElement>(null);
  const openDatePicker = () => dateInputRef.current?.click();
  
  const onDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split("-").map(Number);
    setSelectedDate(new Date(y, (m ?? 1) - 1, d ?? 1));
  };

  const dateValue = useMemo(() => {
    return formatDateForAPI(selectedDate);
  }, [selectedDate]);

  // 캘린더 연동
  const handleConnect = async (provider: string) => {
    if (!provider) return;
    try {
      const { url } = await getOAuthUrl(provider);
      window.location.href = url;
    } catch (err) {
      console.error("OAuth URL 요청 실패:", err);
    }
  };

  // 새로고침 - 현재 선택된 날짜로 다시 조회
  const handleRefresh = () => {
    const dateStr = formatDateForAPI(selectedDate);
    fetchSchedules(dateStr);
  };

  // 총 일정 개수 계산
  const totalSchedules = schedules.length;
  const morningSchedules = schedules.filter(s => parseInt(s.start_time.substring(0, 2)) < 12).length;
  const afternoonSchedules = schedules.filter(s => parseInt(s.start_time.substring(0, 2)) >= 12).length;

  return (
    <div className="calendar-root">
      <div className="schedule-container card">
        {/* 헤더 */}
        <div className="schedule-header">
          <div className="schedule-header-left">
            <div className="schedule-date">
              {formatDate(selectedDate)} 일정
              {isToday(selectedDate) && <span className="badge-today">오늘</span>}
            </div>
            <div className="schedule-summary">
              총 {totalSchedules}개 일정 · 오전 {morningSchedules}개, 오후 {afternoonSchedules}개
            </div>
          </div>
          
          <div className="schedule-header-right">
            {/* 연동 상태 */}
            {isConnected && connectType && (
              <div 
                className="connection-badge"
                style={{ 
                  backgroundColor: getConnectionBadgeColor(connectType),
                  color: connectType.toLowerCase() === 'kakao' ? '#3c1e1e' : 'white'
                }}
              >
                ✓ {connectType.toUpperCase()} 연동됨
              </div>
            )}
            
            {/* 임시 테스트 버튼들 */}
            <button 
              className="icon-button" 
              aria-label="설정" 
              type="button"
              style={{ background: 'red', color: 'white' }}
            >
              ⚙️
            </button>
            
            <button 
              className="icon-button" 
              aria-label="새로고침"
              onClick={handleRefresh}
              disabled={loading}
              type="button"
              style={{ background: 'blue', color: 'white' }}
            >
              🔄
            </button>
            
            <button
              className="icon-button"
              aria-label="날짜 선택"
              onClick={openDatePicker}
              type="button"
              style={{ background: 'green', color: 'white' }}
            >
              📅
            </button>
            
            {/* 원래 아이콘 버튼들 (주석 처리) */}
            {/*
            <button className="icon-button" aria-label="설정" type="button">
              <Settings size={20} />
            </button>
            
            <button 
              className="icon-button" 
              aria-label="새로고침"
              onClick={handleRefresh}
              disabled={loading}
              type="button"
            >
              <RefreshCw size={20} className={loading ? 'loading-spinner' : ''} />
            </button>
            
            <button
              className="icon-button"
              aria-label="날짜 선택"
              onClick={openDatePicker}
              type="button"
            >
              <CalendarIcon size={20} />
            </button>
            */}
          </div>
        </div>

        {/* 연동 안내 배너 */}
        {!isConnected && (
          <div className="connect-banner">
            <div className="connect-banner-content">
              <p>외부 캘린더를 연동하면 더 많은 일정을 볼 수 있어요.</p>
              <select 
                onChange={(e) => handleConnect(e.target.value)} 
                defaultValue=""
                className="connect-dropdown"
              >
                <option value="" disabled>연동할 계정을 선택하세요</option>
                <option value="google">Google 캘린더 연동</option>
                <option value="kakao">Kakao 캘린더 연동</option>
              </select>
            </div>
          </div>
        )}

        {/* 타임라인 */}
        <div className="schedule-timeline">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>불러오는 중...</p>
            </div>
          ) : (
            timeline.map((slot, index) => (
              <div key={index} className="schedule-hour">
                <div className="schedule-time">{slot.time}</div>
                <div className="schedule-content">
                  {slot.events.length > 0 ? (
                    <div className="schedule-event-group">
                      {slot.events.map((event) => (
                        <div
                          key={event.id}
                          className="schedule-event"
                        >
                          <div className="event-header">
                            <div className="event-title-section">
                              <strong className="event-title">{event.title}</strong>
                              <div className="event-badges">
                                {/* 연결 타입 배지 */}
                                {event.relation_types && (
                                  <span 
                                    className="event-badge connection-badge-small"
                                    style={{ 
                                      backgroundColor: getConnectionBadgeColor(event.relation_types),
                                      color: event.relation_types.toLowerCase() === 'kakao' ? '#3c1e1e' : 'white'
                                    }}
                                  >
                                    {event.relation_types.toUpperCase()}
                                  </span>
                                )}
                                
                                {/* 태그 배지들 */}
                                {event.tag_ids && event.tag_ids.split(',').map((tagId, i) => (
                                  <span 
                                    key={i}
                                    className="event-badge tag-badge"
                                    style={{ backgroundColor: getTagColor(tagId.trim()) }}
                                  >
                                    태그: {tagId.trim()}
                                  </span>
                                ))}
                                
                                {/* 상태 배지 */}
                                <span className={`event-badge status-badge status-${event.status.toLowerCase()}`}>
                                  {event.status}
                                </span>
                              </div>
                            </div>
                            <div className="event-time-range">
                              {formatTimeRange(event.start_time, event.end_time)}
                            </div>
                          </div>
                          
                          {/* 이벤트 내용 */}
                          <div className="event-content">
                            {event.contents && (
                              <p className="event-description">{event.contents}</p>
                            )}
                            {event.location && (
                              <div className="event-location">
                                📍 {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="schedule-empty">여유 시간</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 숨겨진 날짜 입력 */}
      <input
        ref={dateInputRef}
        type="date"
        value={dateValue}
        onChange={onDateChange}
        className="visually-hidden-date"
      />
    </div>
  );
};

export default Calendar;