import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>kitchen clock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
