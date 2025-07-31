import { useEffect } from "react";
import { useLocation } from "react-router-dom";

(window as any).gtag = (window as any).gtag || function() {};

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("config", "G-H2FSP77HC2", {
        page_path: location.pathname,
      });
    }
  }, [location]);
};

export default usePageTracking;
