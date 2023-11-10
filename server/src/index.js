import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
import { Location } from "./models.js";
import configData from "../../src/config.json" assert { type: "json" };
import axios from "axios";

env.config();

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/v1/location/", async (req, res) => {
  const URI = process.env.WEATHER_URI;
  try {
    const { lat, lng, location } = req.body;
    const response = await axios.get(
      `${URI}?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=${configData.forecast_days}`,
    );
    const data = await Location.findOneAndUpdate(
      {
        latitude: lat,
        longitude: lng,
      },
      {
        location: location,
        latitude: lat,
        longitude: lng,
        forcast: response.data,
      },
      {
        upsert: true,
        new: true,
      },
    );
    return res.status(200).json(data);
  } catch (error) {
    throw error;
  }
});

app.get("/api/v1/location/", async (req, res) => {
  try {
    const data = await Location.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      data: data,
      meta: {
        config: {
          maximum_threshold: configData.maximum_threshold,
          minimum_threshold: configData.minimum_threshold,
        },
      },
    });
  } catch (err) {
    throw err;
  }
});
app.delete("/api/v1/location/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Location.findByIdAndDelete(id);
    return res.status(200).json(data);
  } catch (err) {
    throw err;
  }
});

app.get('/api/v1/safeconfig', async (req, res) => {
  try {
    const data={
      maximum_threshold: configData.maximum_threshold,
      minimum_threshold: configData.minimum_threshold,
    }
    return res.status(200).json(data);
  } catch (err) {
    throw err;
  }
});

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.listen(5000, () => console.log("App listening on port 5000!"));
