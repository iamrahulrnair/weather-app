import mongoose from "mongoose";

const ForcastSchema = new mongoose.Schema({
  daily: {
    time: [String],
    weather_code: [Number],
    temperature_2m_max: [Number],
    temperature_2m_min: [Number],
  },
});
const LocationScehema = new mongoose.Schema({
  location: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  forcast: {
    type: ForcastSchema,
    default: {},
  },
});

export const Location = mongoose.model("Location", LocationScehema);


