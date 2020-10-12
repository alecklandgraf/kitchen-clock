import Head from "next/head";
import useSWR from "swr";
import useClock from "../hooks/useClock";
import styles from "../styles/Home.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/hello", fetcher, {
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
  return (
    <div>
      <Head>
        <title>kitchen clock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container_grid}>
        <div className={styles.clock}>{timeString}</div>
        <div className={styles.aqi}>AQI {data.aqi}</div>
        <div className={styles.weather}>
          {Math.round(data.weather.temperature)}º {data.weather.summary}
        </div>
      </div>
    </div>
  );
}


