// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

// click on sensors to get the ID https://www.purpleair.com/map?opt=1/mAQI/a10/cC0&select=38591#14.5/45.50914/-122.62105
// these are all valid, could fall back as needed
const SENSOR_ID = [70879,38591, 76631][0]; 
type ResponseData = {
  aqi: Partial<PAStats>;
  weather: any;
};

async function fetchWeather() {
  const response = await fetch(
    "https://api.darksky.net/forecast/41e306817d377f0b24e696f138d4bcbf/45.5202,-122.6742"
  );
  const data = await response.json();

  return data;
}

function n(pmReading: number, e: number, i: number, r: number, o: number) {
  const na = e - i;
  const a = r - o;
  const s = pmReading - o;
  return Math.round((na / a) * s + i);
}

/**
 * https://aqicn.org/calculator https://aqicn.org/faq/2015-03-15/air-quality-nowcast-a-beginners-guide/
 * @param pmReading µg/m3
 * @returns aqi
 */
function aqiFromPM(pmReading: number) {
  return pmReading < 0
    ? pmReading
    : 350.5 < pmReading
    ? n(pmReading, 500, 401, 500, 350.5)
    : 250.5 < pmReading
    ? n(pmReading, 400, 301, 350.4, 250.5)
    : 150.5 < pmReading
    ? n(pmReading, 300, 201, 250.4, 150.5)
    : 55.5 < pmReading
    ? n(pmReading, 200, 151, 150.4, 55.5)
    : 35.5 < pmReading
    ? n(pmReading, 150, 101, 55.4, 35.5)
    : 12.1 < pmReading
    ? n(pmReading, 100, 51, 35.4, 12.1)
    : 0 <= pmReading
    ? n(pmReading, 50, 0, 12, 0)
    : -1;
}

type AverageByKeyObj = {
  [key: string]: any;
};

type PAStats = {
  /** Real time or current PM2.5 Value */
  v: number;
  /** Short term (10 minute average) */
  v1: number;
  /** 30 minute average */
  v2: number;
  /** 1 hour average */
  v3: number;
  /** 6 hour average */
  v4: number;
  /** 24 hour average */
  v5: number;
  /** One week average */
  v6: number;
  /**  Real time or current PM2.5 Value */
  pm: number;
  /**  Last modified time stamp for calculated average statistics */
  lastModified: number;
  /**  Time between last two readings in milliseconds */
  timeSinceModified: number;
};

type PAResult = {
  Stats: string;
};

type PAResp = {
  results: PAResult[];
};

/**
 * Average (mean) values among objects
 *
 * ex: averageByKey([{v1: 2}, {v1: 4}], 'v1') // 3
 */
function averageByKey(objs: AverageByKeyObj[], key: string) {
  let sum = 0;
  let count = 0;
  objs.forEach((obj) => {
    if (typeof obj[key] === "number" && !Number.isNaN(obj[key])) {
      sum += obj[key];
      count += 1;
    }
  });
  if (count) {
    return sum / count;
  }

  return 0;
}

async function fetchAQI() {
  const response = await fetch(
    `https://www.purpleair.com/json?show=${SENSOR_ID}`
  );
  const data = await response.json();

  const stats = data.results.map(({ Stats }) => JSON.parse(Stats)) as PAStats[];
  const aqi: Partial<PAStats> = {};
  const keys = ["v", "v1", "v2", "v3", "v4", "v5", "v6"] as const;
  keys.forEach((key) => {
    aqi[key] = aqiFromPM(averageByKey(stats, key));
  });

  return aqi;
}

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  Promise.all([fetchWeather(), fetchAQI()]).then(([weatherData, aqiData]) => {
    res.status(200).json({ 
      weather: weatherData?.currently, 
      aqi: aqiData, 
     });
  });
};