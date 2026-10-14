const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  enrollCourses,
  getStudentCourses
} = require("../controllers/studentController");

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

router.post("/:id/courses", enrollCourses);
router.get("/:id/courses", getStudentCourses);

module.exports = router;