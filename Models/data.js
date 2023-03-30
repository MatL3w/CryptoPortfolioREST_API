import mongoose from "mongoose";

export const dataSchema = new mongoose.Schema({
  nameTag: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  tvl: {
    type: Number,
  },
  category: {
    type: String,
  },
  symbol: {
    type: String,
  },
  logo: {
    type: String,
  },
  url: {
    type: String,
  },
  mcap: {
    type: Number,
  },
  price: {
    type: Number,
  },
  totalValue: {
    type: Number,
  },
});
