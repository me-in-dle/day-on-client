// src/components/Calendar.tsx
import React, { useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
    id: string;
    title: string;
    time: string;
    duration: number; // 시간 단위
}

const Calendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 오늘/어제/내일 샘플은 유지하되, UI는 아이콘으로만 노출
    const today = new Date();

    // 샘플 이벤트
    const sampleEvents: CalendarEvent[] = [
        { id: '1', title: '아침 운동', time: '07:00', duration: 1 },
        { id: '2', title: '회의', time: '10:00', duration: 2 },
        { id: '3', title: '점심식사', time: '12:00', duration: 1 },
        { id: '4', title: '프로젝트 작업', time: '14:00', duration: 3 },
        { id: '5', title: '저녁 약속', time: '18:00', duration: 2 },
    ];

    const formatDate = (date: Date) =>
        date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

    const isToday = (date: Date) => date.toDateString() === today.toDateString();

    // 7~22시 타임라인
    const schedule = useMemo(() => {
        const list: { time: string; event: CalendarEvent | null }[] = [];
        for (let hour = 7; hour <= 24; hour++) {
            const t = `${hour.toString().padStart(2, '0')}:00`;
            list.push({ time: t, event: sampleEvents.find(e => e.time === t) || null });
        }
        return list;
    }, [sampleEvents]);

    // 달력 아이콘이 클릭하면 input[type=date]를 클릭
    const dateInputRef = useRef<HTMLInputElement>(null);
    const openDatePicker = () => dateInputRef.current?.click();

    // input[type=date] 값으로 Date 생성
    const onDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value; // 'YYYY-MM-DD'
        if (!value) return;
        const [y, m, d] = value.split('-').map(Number);
        // 로컬 타임 존 기준으로 설정
        const next = new Date(y, (m ?? 1) - 1, d ?? 1, selectedDate.getHours(), selectedDate.getMinutes());
        setSelectedDate(next);
    };

    // input[type=date] 초기값을 selectedDate에 맞춰서
    const dateValue = useMemo(() => {
        const y = selectedDate.getFullYear();
        const m = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
        const d = `${selectedDate.getDate()}`.padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, [selectedDate]);

    return (
        <div className="calendar-root">
            {/* 스케줄 헤더 */}
            <div className="schedule-container card">
                <div className="schedule-header">
                    <div className="schedule-date">
                        {formatDate(selectedDate)} 일정 {isToday(selectedDate) && <span className="badge-today">오늘</span>}
                    </div>

                    {/* 달력 아이콘 버튼 + 숨겨진 date input */}
                    <button className="icon-button" aria-label="날짜 선택" onClick={openDatePicker}>
                        <CalendarIcon size={20} />
                    </button>
                    <input
                        ref={dateInputRef}
                        type="date"
                        value={dateValue}
                        onChange={onDateChange}
                        className="visually-hidden-date"
                    />
                </div>

                {/* 타임라인 */}
                <div className="schedule-timeline">
                    {schedule.map((slot, i) => (
                        <div key={i} className="schedule-hour">
                            <div className="schedule-time">{slot.time}</div>
                            <div className="schedule-content">
                                {slot.event ? (
                                    <div className="schedule-event">{slot.event.title}</div>
                                ) : (
                                    <div className="schedule-empty">여유 시간</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
