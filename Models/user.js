import mongoose from 'mongoose';

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
  assets:[{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Asset'
  }]
},
{
    timestamps:true
});

export default mongoose.model('User', userSchema);