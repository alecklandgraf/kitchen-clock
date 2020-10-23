import Head from "next/head";
import useSWR from "swr";
import WeatherIcon from "../components/Weather";
import useClock from "../hooks/useClock";
import styles from "../styles/Home.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  let aqiColor = styles.success;
  if (data.aqi.v1 > 50) aqiColor = styles.warning;
  if (data.aqi.v1 > 100) aqiColor = styles.warningAlt;
  if (data.aqi.v1 > 150) aqiColor = styles.error;

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
            <div className={styles.day_v2}>{day}</div>
            <div className={styles.date_v2}>
              {month} {date}
            </div>
          </div>
          <div className={styles.time_v2}>
            <div>{timeString}</div>
          </div>
          <div className={styles.temp_aqi_v2}>
            <div className={styles.temp_v2}>
              {Math.round(data.weather.temperature)} ºF
            </div>
            <div className={styles.aqi_v2}>
              <span className={aqiColor}>
                {data.aqi.v1} <span className={styles.aqi_label}>AQI</span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.right_v2}>
          <WeatherIcon conditions={data.weather.icon} />
          <div className={styles.weather_summary}>{data.weather.summary}</div>
        </div>
      </div>
    </div>
  );
}
