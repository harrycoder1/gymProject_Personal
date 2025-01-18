import mongoose from "mongoose";

  const classScheduleSchema =new mongoose.Schema( {
      day: { 
        type: String, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
        required: true 
      }, // Day of the week (e.g., Monday, Tuesday)
      
      startTime: { type: String, required: true }, // Class start time (e.g., '07:30 AM')
      endTime: { type: String, required: true },   // Class end time (e.g., '09:00 AM')
      
      isRecurring: { 
        type: Boolean, 
        default: true 
      }, // Indicates if the class repeats weekly on the given day
      
      customDates: [
        {
          date: { type: Date },      // A specific date for a custom schedule
          startTime: { type: String }, // Custom start time for this date (optional)
          endTime: { type: String },   // Custom end time for this date (optional)

          isClosed:{type:Boolean , default:false}  //for make the GymClose
        },
      ], // Overrides the usual day and time for special occasions
    })

export const ClassSchedule = mongoose.models.classSchedule || mongoose.model('classSchedule', classScheduleSchema);