import { differenceInTime } from "@/lib/common/date-functions";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "react-native";

type TUseTimer = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};
const formatNumber = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`;
};

const DAYS_IN_MS = 1000 * 60 * 60 * 24;
const HOURS_IN_MS = 1000 * 60 * 60;
const MIN_IN_MS = 1000 * 60;
const SEC_IN_MS = 1000;

const getTimeDiff = (diffInMSec: number): TUseTimer => {
  let diff = diffInMSec;
  const days = Math.floor(diff / DAYS_IN_MS); // Give the remaining days
  diff -= days * DAYS_IN_MS; // Subtract passed days
  const hours = Math.floor(diff / HOURS_IN_MS); // Give remaining hours
  diff -= hours * HOURS_IN_MS; // Subtract hours
  const minutes = Math.floor(diff / MIN_IN_MS); // Give remaining minutes
  diff -= minutes * MIN_IN_MS; // Subtract minutes
  const seconds = Math.floor(diff / SEC_IN_MS); // Give remaining seconds
  return {
    days: formatNumber(days), // Format everything into the return type
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
};
interface Props {
  secondsToCountDown: number;
  onEnd?: () => void;
}
const useCountdownTimer = (props: Props) => {
  const [timerCount, setTimer] = useState(props.secondsToCountDown);
  const currentInternalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    currentInternalRef.current = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount == 0) {
          return 0;
        } else {
          lastTimerCount <= 1 && clearInterval(currentInternalRef.current!);
          return lastTimerCount - 1;
        }
      });
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(currentInternalRef.current!);
    setTimer(props.secondsToCountDown);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (!currentInternalRef.current) return;
      clearInterval(currentInternalRef.current!);
    };
  }, []);

  return {
    formattedTime: getTimeDiff(timerCount * 1000),
    resetTimer,
    timerCount,
  };
};

export default useCountdownTimer;
