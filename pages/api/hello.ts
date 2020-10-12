// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  temp: number;
  aqi: number;
  weather: string;
};

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  res.status(200).json({ temp: 60, aqi: 9, weather: "cloudy" });
};
