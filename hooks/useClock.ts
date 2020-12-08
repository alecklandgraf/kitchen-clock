import { useState, useEffect } from "react";

export type ClockOptions = {
  display24Hour?: boolean;
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * A React hook that provides the current time
 * @returns {
 *  {  
 *     date: 13,
 *     day: 'Monday',
 *     hours: 4,
 *     isAm: false,
 *     minutes: 5,
 *     month: 'Oct',
 *     timeString: "4:05",
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
  } else if (!display24Hour && hours === 0) {
    hoursString = '12';
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
    date: date.getDate(),
    day: days[date.getDay()],
    hours,
    isAm,
    minutes,
    month: months[date.getMonth()],
    timeString: `${hoursString}:${minutesString}`,
  };
}
