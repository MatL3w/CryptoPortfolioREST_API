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