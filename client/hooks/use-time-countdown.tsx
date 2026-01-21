import { useCallback, useEffect, useRef, useState } from "react";

export const useTimeCountdown = () => {
  const [countdownTimeLeft, setCountdownTimeLeft] = useState(60);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | number>(null);

  const updateTimerRef = () => {
    let min = 0;
    setCountdownTimeLeft((prev) => (prev <= min ? prev : prev - 1));
  };

  const startCountdown = useCallback(() => {
    if (!timerRef.current) {
      timerRef.current = setInterval(updateTimerRef, 1000);
      setIsCountingDown(true);
    }
    setIsCountingDown(true);
  }, []);

  useEffect(() => {
    startCountdown();
  }, []);

  useEffect(() => {
    if (countdownTimeLeft <= 0) {
      clearInterval(timerRef.current!);
      setCountdownTimeLeft(60);
      timerRef.current = null;
      setIsCountingDown(false);
    }
  }, [countdownTimeLeft]);

  return { startCountdown, countdownTimeLeft, isCountingDown };
};
