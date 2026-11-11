/*
 *
 *
 *  Responsibility: Handle business logic and validation.
 *
 *
 *
 */

import subjectRepository from "./subject.repository.js";
import userRepository from "../users/user.repository.js";

// throw custom message new Error()
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.errorStatus = statusCode;

  return error;
};

/*
 *  Returns true only if it's a string AND not a valid number
 *  isNaN(Number('dwada'))  is Not a number?  true
 *  isNaN(Number('12312'))  is Not a number?  false
 */
function isPureTextString(...values) {
  return values.every(
    (value) => typeof value === "string" && Number.isNaN(Number(value.trim())),
  );
}

// Validate subject input
async function validateInput(userId, title, instructor) {
  // 1. Validate data types
  if (typeof title !== "string" || typeof instructor !== "string") {
    throw createError("Title and instructor must be strings.", 400);
  }

  // 2. Remove unnecessary whitespace
  title = title.trim();
  instructor = instructor.trim();

  // 3. Validate required fields
  if (!title || !instructor) {
    throw createError("Title and instructor are required.", 400);
  }

  // 4. Reject numeric-only strings
  if (!isPureTextString(title, instructor)) {
    throw createError("Title and instructor must contain text.", 400);
  }

  // 5. Validate user existence
  const user = await userRepository.findById(userId);

  if (user == null) {
    throw createError("User ID not found.", 404);
  }

  // 6. Check for duplicate subjects
  const isDuplicatedEntry = (await getAllSubjects()).some(
    (item) => item.title === title && item.instructor === instructor,
  );

  if (isDuplicatedEntry) {
    throw createError("This subject already exists.", 409);
  }

  // 6. Return validated data
  return {
    userId,
    title,
    instructor,
  };
}

// Create subject
async function createAssignment(user_Id, title, instructor) {
  const data = await validateInput(user_Id, title, instructor);
  try {
    return subjectRepository.create(data.userId, data.title, data.instructor);
  } catch (error) {
    throw error;
  }
}

// Retrieve all subjects
async function getAllSubjects() {
  return await subjectRepository.getAll();
}

// Retrieve subject by ID
async function getSubjectById(id) {
  const [subjectSelected] = await subjectRepository.findById(id);
  return subjectSelected;
}
