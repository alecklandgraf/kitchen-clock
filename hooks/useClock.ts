import { useState, useEffect } from "react";

export type ClockOptions = {
  display24Hour?: boolean;
};

/**
 * A React hook that provides the current time
 * @returns {
 *  {  timeString: "4:05",
 *     hours: 4,
 *     minutes: 5,
 *     isAm: false,
 * }
 */
export default function useClock({ display24Hour = false }: ClockOptions = {}) {
  const [date, setDate] = useState(new Date());
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isAm = hours < 12;
  let hoursString = `${hours}`;
  if (!display24Hour && !isAm) {
    hoursString = `${hours === 12 ? hours : hours - 12}`;
  }
  const minutesString = `${minutes}`.padStart(2, "0");

  useEffect(() => {
    const id = setInterval(() => {
      // only trigger a render when the minutes change
      if (new Date().getMinutes() !== date.getMinutes()) {
        setDate(new Date());
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return {
    hours,
    isAm,
    minutes,
    timeString: `${hoursString}:${minutesString}`,
  };
}
