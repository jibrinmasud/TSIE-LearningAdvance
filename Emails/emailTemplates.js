const welcomeTemplate = (name, role) => {
  return {
    subject: `Welcome to TSI E-Learning Platform!`,
    text: `Dear ${name},

Welcome to TSI E-Learning Platform! We're excited to have you join us as a ${role}.

${role === 'student' 
  ? 'You can now browse and enroll in our available courses.' 
  : 'You can now start creating and managing your courses.'}

Best regards,
TSI E-Learning Team`
  };
};

const courseEnrollmentTemplate = (studentName, courseName) => {
  return {
    subject: `Enrollment Confirmation: ${courseName}`,
    text: `Dear ${studentName},

Thank you for enrolling in "${courseName}". We're excited to have you start your learning journey!

You can access your course materials through your student dashboard.

Best regards,
TSI E-Learning Team`
  };
};

module.exports = {
  welcomeTemplate,
  courseEnrollmentTemplate
};