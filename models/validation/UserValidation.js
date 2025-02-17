const UserSchemaValidation = require("joi");

const userSchema = UserSchemaValidation.object({
  name: UserSchemaValidation.string().min(3).max(30).required(),
  email: UserSchemaValidation.string().email().required(),
  password: UserSchemaValidation.string().min(6).max(30).required(),
});
module.exports = userSchema;
