import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, RefreshCw, Settings, MapPin, Tag } from "lucide-react";
import { getCalendarByDate, getOAuthUrl } from "@/services/calendarService";
import { CalendarResponse, Schedule } from "@/types/calendar";
import styles from "../styles/Calendar.module.css";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectType, setConnectType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  const fetchSchedules = async (date: string) => {
    setLoading(true);
    try {
      const res: CalendarResponse = await getCalendarByDate(date);
      setIsConnected(res.is_connected);
      setConnectType(res.connect_type);

      // Y인 일정만
      const validSchedules = res.schedules.filter((s) => s.use_yn === "Y");
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

  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
  }, []);

  const openDatePicker = () => dateInputRef.current?.click();

  const onDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split("-").map(Number);
    setSelectedDate(new Date(y, (m ?? 1) - 1, d ?? 1));
  };

  const dateValue = useMemo(() => {
    return formatDateForAPI(selectedDate);
  }, [selectedDate]);

  const handleConnect = async (provider: string) => {
    if (!provider) return;
    try {
      const { url } = await getOAuthUrl(provider);
      window.location.href = url;
    } catch (err) {
      console.error("OAuth URL 요청 실패:", err);
    }
  };

  const handleRefresh = () => {
    const dateStr = formatDateForAPI(selectedDate);
    fetchSchedules(dateStr);
  };

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
              총 {schedules.length}개 일정
            </div>
          </div>
          <div className={styles.scheduleHeaderRight}>
            {isConnected && connectType && (
              <div className={styles.connectionBadge}>✓ {connectType.toUpperCase()} 연동됨</div>
            )}
            <button onClick={handleRefresh} disabled={loading} className={styles.iconButton}>
              <RefreshCw size={18} />
            </button>
            <button onClick={openDatePicker} className={styles.iconButton}>
              <CalendarIcon size={18} />
            </button>
            <button className={styles.iconButton}>
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* 연동 배너 */}
        {!isConnected && (
          <div className={styles.connectBanner}>
            <p>외부 캘린더를 연동하면 더 많은 일정을 볼 수 있어요.</p>
            <select onChange={(e) => handleConnect(e.target.value)} defaultValue="">
              <option value="" disabled>연동할 계정 선택</option>
              <option value="google">Google</option>
              <option value="kakao">Kakao</option>
            </select>
          </div>
        )}

        {/* 타임라인 */}
        <div className={styles.scheduleTimeline}>
          {hours.map((hour, index) => {
            const eventsAtHour = schedules.filter(
              (s) => parseInt(s.start_time.substring(0, 2)) === index
            );

            return (
              <div key={hour} className={styles.scheduleRow}>
                <div className={styles.scheduleTime}>{hour}</div>
                <div className={styles.scheduleContent}>
                  {eventsAtHour.length === 0 ? (
                    <div className={styles.freeTime}>여유 시간</div>
                  ) : (
                    eventsAtHour.map((event) => (
                      <div key={event.id} className={styles.eventCard}>
                        <div className={styles.eventTitle}>
                          <strong>{event.title}</strong>
                          {event.relation_types && (
                            <span className={`${styles.badge} ${styles[event.relation_types.toLowerCase()]}`}>
                              {event.relation_types}
                            </span>
                          )}
                          <span className={`${styles.badge} ${styles[event.status.toLowerCase()]}`}>
                            {event.status}
                          </span>
                        </div>
                        {event.contents && (
                          <div className={styles.eventDescription}>{event.contents}</div>
                        )}
                        {event.location && (
                          <div className={styles.eventLocation}>
                            <MapPin size={12} /> {event.location}
                          </div>
                        )}
                        {event.tag_ids && (
                          <div className={styles.eventTags}>
                            <Tag size={10} />
                            {event.tag_ids.split(",").map((tag, idx) => (
                              <span key={idx} className={styles.tagItem}>
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className={styles.eventTimeRange}>
                          {event.start_time} - {event.end_time}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
