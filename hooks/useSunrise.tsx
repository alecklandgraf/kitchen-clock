import { useEffect } from "react";

export default function useSunrise() {
  /* 
    h,v
    60,60 sunrise
    75,30 peak
    92,60 sunset
   */
  let v = 59;
  // let h = 89;
  let vStep = -1;
  // let hStep = .5;
  useEffect(() => {
    const root = document.documentElement;

    const id = setInterval(() => {
      if (v === 20 || v === 110) {
        vStep *= -1;
        // if (v === 60) {
        //   hStep *= -1
        // }
      }
      // h = h - hStep;
      v = v + vStep;
      root.style.setProperty("--vertical", `${v}%`);
      // root.style.setProperty("--horizontal", `${h}%`);
    }, 100);

    return () => clearInterval(id);
  }, []);
}
