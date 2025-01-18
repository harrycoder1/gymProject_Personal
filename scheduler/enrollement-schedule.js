import cron from 'node-cron';
import mongoose from 'mongoose';
import { Enrollment } from '../models/EnrollmentsSchema.js';
// import { Enrollment } from './models/enrollment'; // Adjust path as needed

// Daily Job to Update Expired Enrollments
// *    *    *    *    *  
// |    |    |    |    |
// |    |    |    |    +-- Day of the Week (0 - 7) (Sunday is both 0 and 7)
// |    |    |    +------- Month (1 - 12)
// |    |    +------------ Day of the Month (1 - 31)
// |    +----------------- Hour (0 - 23)
// +---------------------- Minute (0 - 59)

cron.schedule('20 11 * * *', async () => {
  console.log("Running daily enrollment check...");
  console.log("Im RUnning by Schduler")

  const currentDate = new Date();

  try {
    // Update all enrollments where `enrollmentExpireDate` is in the past
    // and `isActive` is still true
    const result = await Enrollment.updateMany(
      { enrollmentExpireDate: { $lt: currentDate }, isActive: true },
      { $set: { isActive: false } }
    );

    console.log(`Updated ${result.modifiedCount} expired enrollments.`);
  } catch (error) {
    console.error("Error updating enrollments:", error);
  }
});
