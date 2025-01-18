import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },

  schedule: [
  {id:{type:mongoose.Schema.Types.ObjectId , ref:'classSchedule'} , 
  day:{type:String  , 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    required: true 

  }

}

    

  ]
  
,


  duration: { type: Number, required: true }, //in hour
  capacity: { type: Number, required: true },
  currentCount:{type:Number , default:0} ,
  trainers_id: [{id: {type: mongoose.Schema.Types.ObjectId, ref: 'trainer'} , isAccept:{type:Boolean , default:false} }],
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'gym', required: true },

  isActive:{type:Boolean , default:true} , 

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Middleware to update `updated_at` automatically
ClassSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

export const Class = mongoose.models.class || mongoose.model('class', ClassSchema);
