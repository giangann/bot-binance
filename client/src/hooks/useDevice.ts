import { useEffect, useState } from "react";

const MOBILE_THRESHOLD = 768; // Adjust the threshold as needed

export const useDevice = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_THRESHOLD
  );

  const handleResize = () => {
    if (window.innerWidth < MOBILE_THRESHOLD) setIsMobile(true);
    else setIsMobile(false);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isMobile,
  };
};
