const welcomeTemplate = (name, role) => {
  return {
    subject: `Welcome to TSI E-Learning Platform!`,
    text: `Dear ${name},

Welcome to TSI E-Learning Platform! We're excited to have you join us as a ${role}.

${
  role === "student"
    ? "You can now browse and enroll in our available courses."
    : "You can now start creating and managing your courses."
}

Happy Learning,
TSI E-Learning`,
  };
};

const courseEnrollmentTemplate = (studentName, courseName) => {
  return {
    subject: `Enrollment Confirmation: ${courseName}`,
    text: `Dear ${studentName},

Thank you for enrolling in "${courseName}". We're excited to have you start your learning journey!

You can access your course materials through your student dashboard.

Best regards,
TSI E-Learning Team`,
  };
};
const forgetPasswordTemplate = (name, resetLink) => {
  return {
    subject: `Password Reset Request - TSI E-Learning Platform`,
    text: `Dear ${name},

You have requested to reset your password for the TSI E-Learning Platform.

Please click on the following link to reset your password:
${resetLink}

If you did not request this password reset, please ignore this email.

Best regards,
TSI E-Learning Team`,
  };
};

module.exports = {
  welcomeTemplate,
  courseEnrollmentTemplate,
  forgetPasswordTemplate,
};
