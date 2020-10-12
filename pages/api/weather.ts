// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  aqi: number;
  weather: any;
};

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  fetch(
    "https://api.darksky.net/forecast/41e306817d377f0b24e696f138d4bcbf/45.5202,-122.6742"
  )
    .then((resp) => resp.json())
    .then((data) => {
      res.status(200).json({ weather: data?.currently, aqi: 9 });
    });

};
