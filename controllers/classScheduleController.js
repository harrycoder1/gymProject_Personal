// import { ClassSchedule } from "../models/classSchedule.js";

// import { schedule } from "node-cron";
import { ClassSchedule } from "../models/classSchedule.js";
import { Class } from "../models/ClassSchema.js";
import { responseSender } from "../utils/index.js";

export const addClassSchedule = async (req, res) => {
  const { day, startTime, endTime, isRecurring } = req.body;

  try {
    const {gymId} = req.body
    const {classId} = req.params //add express validator for make the validate it 

    // if(classId)
    // Check if the class exists
    const existingClass = await Class.findOne({ _id: classId, gymId: gymId });
    if (!existingClass) {
      return responseSender('Class not found', false, 404, res);
    }

    
    const isScheduleOfDayAlreadyAddedForClass = existingClass.schedule.some(
      (schedule) => schedule.day == day
    );
    // check the schedule of the already present in the class or not 
    if(isScheduleOfDayAlreadyAddedForClass){
      return responseSender(`You have already of ${day} for class ${existingClass.name} , So you can't make more than One Schedule for One Day`, false, 400, res);
    
    }

    const newSchedule = new ClassSchedule({
      day,
      startTime,
      endTime,
      isRecurring,
      // customDates,
    });

    await newSchedule.save();

    existingClass.schedule.push({id:newSchedule._id , day:newSchedule.day})

    await existingClass.save()
  
    // const findIndex 
    // classGym.schedule.push()
    return responseSender(
      "Class schedule added successfully",
      true,
      201,
      res,
      {schedule:newSchedule , class:existingClass}
    );
  } catch (error) {
    return responseSender(error.message, false, 500, res);
  }
};

// Update the Schedule 
export const updateClassSchedule = async (req, res) => {
    const { scheduleId , classId } = req.params;
    const {gymId} = req.body
    const {  startTime, endTime, isRecurring, customDates } = req.body;

  
    try {

      const isExists = await Class.findOne({_id:classId , gymId:gymId})
      // console.log(gymId)
      // console.log(isExists)
      if(!isExists) {
        return responseSender("Class Not found !" , false , 404 , res)
      }

      const findSchedule = isExists.schedule.findIndex(schedule=> schedule.id == scheduleId)
      // check schedlue available in class or not 
      if(findSchedule ===-1){
        return responseSender("Schedule not Available on Your Class " , false , 404 , res)
      }
       
      
      const updatedSchedule = await ClassSchedule.findByIdAndUpdate(
        scheduleId,
        {  startTime, endTime, isRecurring, customDates },
        { new: true }
      );
  
      if (!updatedSchedule) {
        return responseSender("Class schedule not found", false, 404, res);
      }
  
      return responseSender(
        "Class schedule updated successfully",
        true,
        200,
        res,
        {data:updatedSchedule}
      );
    } catch (error) {
      return responseSender(error.message, false, 500, res);
    }
  };
  

  // Remove Schedule Controller
  export const deleteClassSchedule = async (req, res) => {
    const { scheduleId ,classId } = req.params;
  
    try {
      const {gymId} = req.body
      // const { , scheduleId}  =   =req.body

      const scheduleExists = await ClassSchedule.findById(scheduleId)
      if(!scheduleExists){
        return responseSender("Schedule Not Found !" , false , 404 , res)
      }
      const isVerifyDelete = await Class.findOne({  _id:classId , gymId:gymId})

      if(!isVerifyDelete){
        return responseSender("You  unable to Verify for this Operation ", false, 404, res);
      }

     const  schduleDelete = isVerifyDelete.schedule.filter((schedule)=> schedule.id.toString() !== scheduleId)
      // console.log("Vverify delt" , schduleDelete)
      isVerifyDelete.schedule = schduleDelete
      await isVerifyDelete.save()

      const deletedSchedule = await ClassSchedule.deleteOne({_id:scheduleId});
  
      if (!deletedSchedule) {
        return responseSender("Class schedule not found", false, 404, res);
      }
  
      return responseSender(
        " schedule has Removed !",
        true,
        200,
        res,
        deletedSchedule
      );
    } catch (error) {
      return responseSender(error.message, false, 500, res);
    }
  };
    

