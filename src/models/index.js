const Student = require("./Student");
const Course = require("./Course");

Student.belongsToMany(Course, {
  through: "StudentCourses"
});

Course.belongsToMany(Student, {
  through: "StudentCourses"
});

module.exports = { Student, Course };