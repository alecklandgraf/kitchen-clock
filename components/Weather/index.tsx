import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faMeteor,
  faCloudMoon,
  faCloudSun,
  faBolt,
  faCloudShowersHeavy,
  faWind,
  faSnowflake,
  faSun,
  faMoon,
  faSmog,
  faCloudSunRain,
  faCloudMoonRain,
} from "@fortawesome/free-solid-svg-icons";
import useClock from "../../hooks/useClock";

const iconMap = {
  "clear-day": faSun,
  "clear-night": faMoon,
  rain: faCloudShowersHeavy,
  rainMoon: faCloudMoonRain,
  rainSun: faCloudSunRain,
  snow: faSnowflake,
  sleet: faCloudShowersHeavy, // todo: get sleet icon
  wind: faWind,
  fog: faSmog,
  cloudy: faCloud,
  "partly-cloudy-day": faCloudSun,
  "partly-cloudy-night": faCloudMoon,
  tornado: faBolt,
  thunderstorm: faCloudShowersHeavy,
  hail: faCloudShowersHeavy,
};

export type Conditions = keyof typeof iconMap;

export type WeatherProps = {
  conditions: Conditions;
};

export default function Weather({ conditions }: WeatherProps) {
  const isDark = new Date().getHours() >= 20 || new Date().getHours() <= 5;
  let icon = iconMap[conditions] || faMeteor;
  if (conditions === "rain") {
    icon = isDark ? iconMap.rainMoon : iconMap.rainSun;
  }

  return <FontAwesomeIcon icon={icon} size="3x" />;
}
