import mongoose from 'mongoose';


const dataSchema = new mongoose.Schema({
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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name :{
    type: String ,
    required: true
  },
  asset:[dataSchema]
},
{
    timestamps:true
});



export default mongoose.model('User', userSchema);