import cron from 'node-cron';

import { sendEmail } from '../utils/emailSender.js';
import { Enrollment } from '../models/EnrollmentsSchema.js';


// Scheduler to check for expiring enrollments
cron.schedule('0 9 * * *', async () => {
  console.log('Running enrollment expiration check...');

  const today = new Date();
  const reminderDate = new Date(today);
  reminderDate.setDate(today.getDate() + 5); // 5 days from today

  try {
    // Fetch enrollments expiring in 5 days
    const expiringEnrollments = await Enrollment.find({
      enrollmentExpireDate: { $lte: reminderDate, $gte: today },
      isActive: true,
    }).populate('member_id');

    for (const enrollment of expiringEnrollments) {
      const member = enrollment.member_id;
      if (!member) continue;

      const email = member.email;
      const name = member.name;

      // Send reminder email
      const subject = 'Enrollment Expiration Reminder';
      const text = `Hi ${name},\n\nYour enrollment will expire on ${enrollment.enrollmentExpireDate.toDateString()}.\nPlease renew your enrollment to continue enjoying our services.\n\nThank you!`;

      await sendEmail(email, subject, text);
    }
  } catch (error) {
    console.error('Error fetching or sending emails for expiring enrollments:', error.message);
  }
});
