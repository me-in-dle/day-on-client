import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, RefreshCw, Settings } from "lucide-react";
import { getCalendarByDate, getOAuthUrl } from "@/services/calendarService";
import { CalendarResponse, Schedule } from "@/types/calendar";
import styles from "@/styles/calendar.module.css";

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
      console.log("fetchSchedules 응답:", res);
      
      setIsConnected(res.is_connected);
      setConnectType(res.connect_type);
      
      const validSchedules = res.schedules.filter((s) => s.use_yn === "Y");
      console.log("유효한 스케줄:", validSchedules);
      setSchedules(validSchedules);
    } catch (err) {
      console.error("캘린더 조회 실패:", err);
      setIsConnected(false);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dateStr = formatDateForAPI(selectedDate);
    fetchSchedules(dateStr);
  }, [selectedDate]);

  // 타임라인 생성
  const timeline = useMemo(() => {
    const timeSlots: { time: string; events: Array<Schedule & { isStart: boolean; isMiddle: boolean; isEnd: boolean }> }[] = [];
    
    for (let hour = 0; hour <= 23; hour++) {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;
      
      const eventsAtTime = schedules.map(schedule => {
        const startHour = parseInt(schedule.start_time.substring(0, 2));
        const startMinute = parseInt(schedule.start_time.substring(3, 5));
        const endHour = parseInt(schedule.end_time.substring(0, 2));
        const endMinute = parseInt(schedule.end_time.substring(3, 5));
        
        const eventStart = startHour * 60 + startMinute;
        const eventEnd = endHour * 60 + endMinute;
        const currentTime = hour * 60;
        const nextTime = (hour + 1) * 60;
        
        if (currentTime < eventEnd && nextTime > eventStart) {
          return {
            ...schedule,
            isStart: startHour === hour,
            isMiddle: startHour < hour && endHour > hour,
            isEnd: endHour === hour && endMinute > 0
          };
        }
        return null;
      }).filter(Boolean) as Array<Schedule & { isStart: boolean; isMiddle: boolean; isEnd: boolean }>;

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

  // 새로고침
  const handleRefresh = () => {
    const dateStr = formatDateForAPI(selectedDate);
    fetchSchedules(dateStr);
  };

  // 통계 계산
  const totalSchedules = schedules.length;
  const morningSchedules = schedules.filter(s => parseInt(s.start_time.substring(0, 2)) < 12).length;
  const afternoonSchedules = schedules.filter(s => parseInt(s.start_time.substring(0, 2)) >= 12).length;

  return (
    <div className={styles.calendarRoot}>
      <div className={`${styles.scheduleContainer} card`}>
        {/* 헤더 */}
        <div className={styles.scheduleHeader}>
          <div className={styles.scheduleHeaderLeft}>
            <div className={styles.scheduleDate}>
              {formatDate(selectedDate)} 일정
              {isToday(selectedDate) && <span className={styles.badgeToday}>오늘</span>}
            </div>
            <div className={styles.scheduleSummary}>
              총 {totalSchedules}개 일정 · 오전 {morningSchedules}개, 오후 {afternoonSchedules}개
            </div>
          </div>
          
          <div className={styles.scheduleHeaderRight}>
            {isConnected && connectType && (
              <div 
                className={styles.connectionBadge}
                style={{ 
                  backgroundColor: getConnectionBadgeColor(connectType),
                  color: connectType.toLowerCase() === 'kakao' ? '#3c1e1e' : 'white'
                }}
              >
                ✓ {connectType.toUpperCase()} 연동됨
              </div>
            )}
            
            <button className={styles.iconButton} aria-label="설정" type="button">
              <Settings size={20} />
            </button>
            
            <button 
              className={styles.iconButton} 
              aria-label="새로고침"
              onClick={handleRefresh}
              disabled={loading}
              type="button"
            >
              <RefreshCw size={20} className={loading ? styles.loadingSpinner : ''} />
            </button>
            
            <button
              className={styles.iconButton}
              aria-label="날짜 선택"
              onClick={openDatePicker}
              type="button"
            >
              <CalendarIcon size={20} />
            </button>
          </div>
        </div>

        {/* 연동 배너 */}
        {!isConnected && (
          <div className={styles.connectBanner}>
            <div className={styles.connectBannerContent}>
              <p>외부 캘린더를 연동하면 더 많은 일정을 볼 수 있어요.</p>
              <select 
                onChange={(e) => handleConnect(e.target.value)} 
                defaultValue=""
                className={styles.connectDropdown}
              >
                <option value="" disabled>연동할 계정을 선택하세요</option>
                <option value="google">Google 캘린더 연동</option>
                <option value="kakao">Kakao 캘린더 연동</option>
              </select>
            </div>
          </div>
        )}

        {/* 타임라인 */}
        <div className={styles.scheduleTimeline}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>불러오는 중...</p>
            </div>
          ) : (
            timeline.map((slot, index) => {
              const hour = index;
              
              return (
                <div key={index} className={styles.scheduleHourCompact}>
                  <div className={styles.scheduleTimeCompact}>{slot.time}</div>
                  <div className={styles.scheduleContentOverlay}>
                    {slot.events.map((event) => {
                      const startHour = parseInt(event.start_time.substring(0, 2));
                      const startMinute = parseInt(event.start_time.substring(3, 5));
                      const endHour = parseInt(event.end_time.substring(0, 2));
                      const endMinute = parseInt(event.end_time.substring(3, 5));
                      
                      let eventContent = null;
                      let eventClass = styles.scheduleEventOverlay;
                      
                      if (event.isStart) {
                        eventClass += ` ${styles.eventStart}`;
                        eventContent = (
                          <>
                            <div className={styles.eventOverlayHeader}>
                              <strong className={styles.eventTitleCompact}>{event.title}</strong>
                              <div className={styles.eventTimeCompact}>
                                {formatTimeRange(event.start_time, event.end_time)}
                              </div>
                            </div>
                            
                            <div className={styles.eventBadgesCompact}>
                              {event.relation_types && (
                                <span 
                                  className={styles.eventBadgeMini}
                                  style={{ 
                                    backgroundColor: getConnectionBadgeColor(event.relation_types),
                                    color: event.relation_types.toLowerCase() === 'kakao' ? '#3c1e1e' : 'white'
                                  }}
                                >
                                  {event.relation_types.toUpperCase()}
                                </span>
                              )}
                              
                              <span className={`${styles.eventBadgeMini} ${styles['status' + event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase()]}`}>
                                {event.status}
                              </span>
                            </div>
                            
                            {event.contents && (
                              <p className={styles.eventDescriptionCompact}>{event.contents}</p>
                            )}
                            {event.location && (
                              <div className={styles.eventLocationCompact}>
                                📍 {event.location}
                              </div>
                            )}
                          </>
                        );
                      } else if (event.isMiddle) {
                        eventClass += ` ${styles.eventMiddle}`;
                        eventContent = (
                          <div className={styles.eventContinue}>
                            <span className={styles.eventTitleContinue}>{event.title} (계속)</span>
                          </div>
                        );
                      } else if (event.isEnd) {
                        eventClass += ` ${styles.eventEnd}`;
                        eventContent = (
                          <div className={styles.eventContinue}>
                            <span className={styles.eventTitleContinue}>{event.title} (종료)</span>
                          </div>
                        );
                      }
                      
                      return (
                        <div
                          key={`${event.id}-${hour}`}
                          className={eventClass}
                        >
                          {eventContent}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 숨겨진 날짜 입력 */}
      <input
        ref={dateInputRef}
        type="date"
        value={dateValue}
        onChange={onDateChange}
        className={styles.visuallyHiddenDate}
      />
    </div>
  );
};

export default Calendar;