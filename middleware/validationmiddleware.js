const { models } = require("mongoose");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      next(err);
    }
    next();
  };
};
module.exports = validateSchema;
