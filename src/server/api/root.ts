import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import configData from "~/config.json";

export const appRouter = createTRPCRouter({
  addUserGeoLocation: publicProcedure
    .input(
      z.object({
        lat: z.string().optional(),
        lng: z.string().optional(),
        location: z.string(),
      }),
    )
    .mutation(async ({ input: { lat, lng, location }, ctx: { db } }) => {
      if (!(lng && lat && location)) {
        lat = configData.default.latitude;
        lng = configData.default.longitude;
        location = configData.default.location;
      }
      const response = await fetch("http://localhost:5000/api/v1/location", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat,
          lng,
          location,
        }),
      });
      const data = await response.json();
      return data;
    }),
  getUserGeoLocations: publicProcedure.query(async ({ ctx: { db } }) => {
    const response = await fetch("http://localhost:5000/api/v1/location", {
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data
  }),
  removeUserGeoEntry: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input: { id }, ctx: { db } }) => {
      const response = await fetch(`http://localhost:5000/api/v1/location/${id}`, {
        cache: "no-store",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json();
      return data;
    }),

  getAppConfig: publicProcedure.query(async () => {
    const response = await fetch("http://localhost:5000/api/v1/safeconfig", {
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json();
    return data
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
