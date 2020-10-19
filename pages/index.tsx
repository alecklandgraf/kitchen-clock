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
  const { timeString } = useClock();

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
            <div className={styles.day_v2}>Monday</div>
            <div className={styles.date_v2}>Oct 13</div>
          </div>
          <div className={styles.time_v2}>
            3:50 <span>PM</span>
          </div>
          <div className={styles.temp_aqi_v2}>
            <div className={styles.temp_v2}>60ºF</div>
            <div className={styles.aqi_v2}>38</div>
          </div>
        </div>
        <div className={styles.right_v2}>bob</div>
        {/* <div className={styles.clock}>{timeString}</div>
        <div className={styles.aqi}>
          <span className={aqiColor}>AQI: {data.aqi.v1}</span>
        </div>
        <div className={styles.weather}>
          <WeatherIcon conditions={data.weather.icon} />
          <div className={styles.weatherText}>
            {Math.round(data.weather.temperature)}ºF - {data.weather.summary}
          </div>
        </div> */}
      </div>
    </div>
  );
}


