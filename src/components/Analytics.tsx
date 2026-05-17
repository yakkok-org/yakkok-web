import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-VXBVZQ8GN1";

declare global {
  interface Window {
    gtag?: (
      command: string,
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * React Router의 라우트 변경을 GA4 page_view 이벤트로 전송한다.
 * index.html에서 `send_page_view: false`로 자동 전송을 끄고 이 컴포넌트가 책임진다.
 */
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    // Helmet의 title 갱신이 head에 반영될 한 tick 기다린 뒤 전송 (정확한 page_title 확보)
    const id = window.setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
        send_to: GA_ID,
      });
    }, 0);

    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

  return null;
}
