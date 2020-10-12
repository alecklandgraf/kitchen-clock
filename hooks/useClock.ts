import { useState, useEffect } from "react";

export type ClockOptions = {
  display24Hour?: boolean;
};

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
    const id = setInterval(() => setDate(new Date()), 1000);

    return () => clearInterval(id);
  }, []);

  return {
    hours,
    isAm,
    minutes,
    timeString: `${hoursString}:${minutesString}`,
  };
}
