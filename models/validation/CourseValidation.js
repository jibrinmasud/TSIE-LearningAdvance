const courseSchemaValidation = require("joi");
const courseSchema = courseSchemaValidation.object({
  title: courseSchemaValidation.string().required(),
  instructor: courseSchemaValidation.string().required(),
  price: courseSchemaValidation.string().required(),
  description: courseSchemaValidation.string().required(),
  category: courseSchemaValidation.string().required(),
  rating: courseSchemaValidation.number().min(0).max(5),
  price: courseSchemaValidation.number().min(0).required(),
});
module.exports = courseSchema;
