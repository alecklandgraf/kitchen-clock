import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/hello", fetcher, {
    refreshInterval: 60000, // every minute
  });
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
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <div className={styles.container}>
        <div className={styles.boxy}>
          <div className={styles.title}>Air Quality Index</div>
          <div className={styles.value}>8</div>
        </div>
        <div className={styles.boxy}>
          <div className={styles.title}>Weather</div>
          <div className={styles.value}>60º and rainy</div>
        </div>
      </div>
    </div>
  );
}
