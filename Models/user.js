import mongoose from 'mongoose';
import * as dataSchema from './data.js'

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