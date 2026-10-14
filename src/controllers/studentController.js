const { Student, Course } = require("../models");
const { UniqueConstraintError, ValidationError } = require("sequelize");

// Create student
const createStudent = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;

    const student = await Student.create({ name, email, age });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Get all students with sorting and pagination
const getStudents = async (req, res, next) => {
  try {
    const parsedPage = Number.parseInt(req.query.page, 10);
    const parsedLimit = Number.parseInt(req.query.limit, 10);

    const page = Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

    const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, 100)
      : 10;

    const offset = (page - 1) * limit;

    const allowedFields = [
      "id",
      "name",
      "email",
      "age",
      "createdAt"
    ];

    const sortBy = allowedFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : "id";

    const order = req.query.order?.toUpperCase() === "DESC"
      ? "DESC"
      : "ASC";

    const result = await Student.findAndCountAll({
      include: [{ model: Course }],
      distinct: true,
      limit,
      offset,
      order: [[sortBy, order]]
    });

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.count,
        page,
        limit,
        totalPages: Math.ceil(result.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get student by ID
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Course }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Update student
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const allowedFields = ["name", "email", "age"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update"
      });
    }

    await student.update(updates);

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Delete student
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    await student.destroy();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Enroll student in courses
const enrollCourses = async (req, res, next) => {
  try {
    const { courseIds } = req.body;

    if (
      !Array.isArray(courseIds) ||
      courseIds.length === 0 ||
      !courseIds.every(
        id => Number.isSafeInteger(id) && id > 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "courseIds must be a non-empty array of positive integers"
      });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const uniqueCourseIds = [...new Set(courseIds)];

    const courses = await Course.findAll({
      where: {
        id: uniqueCourseIds
      }
    });

    if (courses.length !== uniqueCourseIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more courses were not found"
      });
    }

    await student.addCourses(courses);

    const updatedStudent = await Student.findByPk(student.id, {
      include: [{ model: Course }]
    });

    res.status(200).json({
      success: true,
      message: "Courses enrolled successfully",
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

// Get courses for a student
const getStudentCourses = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Course }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: student.Courses || []
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  enrollCourses,
  getStudentCourses
};
