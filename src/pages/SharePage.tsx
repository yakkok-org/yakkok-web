import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function SharePage() {
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    if (code) {
      // 앱으로 리다이렉트
      window.location.href = `yakkok://share/${code}`;
    }
  }, [code]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        약꼭 앱으로 이동 중...
      </h1>
      <p style={{ color: "#666", marginBottom: "8px" }}>공유 코드: {code}</p>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        자동으로 이동되지 않으면 아래 버튼을 눌러주세요
      </p>
      <a
        href={`yakkok://share/${code}`}
        style={{
          padding: "12px 24px",
          backgroundColor: "#18C988",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        앱 열기
      </a>
    </div>
  );
}
