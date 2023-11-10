import { JsonValue } from "@prisma/client/runtime/library";
import { Forcast, Location } from "@prisma/client";

export type LocationWithForcast = {
  forcast: {
    daily:{
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      time: string[];
    }
  };
} & {
  _id: string;
  location: string;
  latitude: string;
  longitude: string;
  createdAt: Date;
  updatedAt: Date;
  forcastId: string;
};
