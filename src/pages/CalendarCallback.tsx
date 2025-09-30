import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 최초 연동 이후 콜백 처리 페이지
const CalendarCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");

    if (connected === "true") {
      alert("캘린더 연동이 완료되었습니다!");
      navigate("/"); // 메인 캘린더 페이지로 이동
    } else {
      alert("캘린더 연동에 실패했습니다. 다시 시도해주세요.");
      navigate("/");
    }
  }, [navigate]);

  return <div>캘린더 연동 처리 중...</div>;
};

export default CalendarCallback;
