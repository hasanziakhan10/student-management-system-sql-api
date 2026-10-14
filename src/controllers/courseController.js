const { Course, Student } = require("../models");

// Create course
const createCourse = async (req, res, next) => {
  try {
    const { title, code, credits } = req.body;

    const course = await Course.create({
      title,
      code,
      credits
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Get all courses
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: Student }]
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// Get course by ID
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: Student }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Update course
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const allowedFields = ["title", "code", "credits"];
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

    await course.update(updates);

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Delete course
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    await course.destroy();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {createCourse,getCourses,getCourseById,updateCourse,deleteCourse};
