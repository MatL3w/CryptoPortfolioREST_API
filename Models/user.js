import mongoose from 'mongoose';
import {dataSchema} from './data.js'

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
  assets:[dataSchema]
},
{
    timestamps:true
});

export default mongoose.model('User', userSchema);