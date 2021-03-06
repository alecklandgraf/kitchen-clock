import Head from "next/head";
import useSWR from "swr";
import { DateTime, Interval } from "luxon";
import WeatherIcon from "../components/Weather";
import useClock from "../hooks/useClock";
import styles from "../styles/Home.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function timeDiff(dt: DateTime) {
  const now = DateTime.local();
  const dur = Interval.fromDateTimes(now, dt)
    .toDuration(["hours", "minutes", "seconds"])
    .toObject();

  if (dur.hours < 1) {
    return `${dur.minutes} minutes`;
  }

  let fraction = "";
  if (dur.minutes > 8 && dur.minutes <= 22) fraction = "¼";
  if (dur.minutes > 22 && dur.minutes <= 38) fraction = "½";
  if (dur.minutes > 38 && dur.minutes <= 51) fraction = "¾";

  return `${dur.hours}${fraction} hours`;
}

function isStaleData(timeInMillis: number): boolean {
  return (Date.now() - timeInMillis) / 1000 / 60 > 25;
}

function sunriseSunsetText(sunriseTime: number, sunsetTime: number): string {
  if (Date.now() < sunsetTime * 1000) {
    const dt = DateTime.fromSeconds(sunsetTime);

    return `Sunset in ${timeDiff(dt)} (${dt.toLocaleString(
      DateTime.TIME_SIMPLE
    )})`;
  }

  const dt = DateTime.fromSeconds(sunriseTime);
  return `Sunrise in ${timeDiff(dt)} (${dt.toLocaleString(
    DateTime.TIME_SIMPLE
  )})`;
}

export default function Home() {
  const { data, error } = useSWR("/api/weather", fetcher, {
    refreshInterval: 60000 * 5, // every  5 minutes
  });
  const { timeString, date, day, month } = useClock();

  if (error) {
    return (
      <div className={styles.error_container}>
        <div className={styles.error_content}>
          There was an error loading the data
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loading_content}>Loading...</div>
      </div>
    );
  }

  const maxAqi = Math.max(...data.aqis.map(x => x.v1));
  let aqiColor = styles.success;
  if (maxAqi > 50) aqiColor = styles.warning;
  if (maxAqi > 100) aqiColor = styles.warningAlt;
  if (maxAqi > 150) aqiColor = styles.error;

  const sunriseSunset = sunriseSunsetText(
    data.weatherAll.daily.data[1].sunriseTime,
    data.weatherAll.daily.data[0].sunsetTime
  );

  return (
    <div>
      <Head>
        <title>kitchen clock</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <div className={styles.container_v2}>
        <div className={styles.left_v2}>
          <div className={styles.day_date_v2}>
            <span>{day}</span> <span>{month}</span> <span>{date}</span>
          </div>
          <div className={styles.time_v2}>
            <div>{timeString}</div>
          </div>
          <div className={styles.temp_aqi_v2}>
            <div className={styles.temp_v2}>
              <span className={isStaleData(data.weather.time * 1000) && styles.strikethrough}>{Math.round(data.weather.apparentTemperature)} ºF</span>
            </div>
            <div className={styles.aqi_v2}>
              <span className={aqiColor}>
                {maxAqi} <span className={styles.aqi_label}>AQI</span>
              </span>
            </div>

          </div>
        </div>
        <div className={styles.right_v2}>
          <WeatherIcon conditions={data.weather.icon} />
          {/* <div className={styles.weather_summary}>{data.weather.summary}</div> */}
          <div className={styles.sunrise_sunset_v2}>{sunriseSunset}</div>
        </div>
      </div>
    </div>
  );
}
