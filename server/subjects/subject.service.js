/*
 *
 *
 *  Responsibility: Handle business logic and validation.
 *
 *
 */
import subjectRepository from "./subject.repository.js";

// throw custom message new Error()
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.errorStatus = statusCode;

  return error;
};

// Validate subject input
async function validateInput(title, instructor) {
  if (typeof title !== "string" || typeof instructor !== "string") {
    throw createError("input must be string!", 400);
  }

  if (!title.trim() || !instructor.trim()) {
    throw createError("Title and instructor are required.", 400);
  }

}

// Create subject
async function createAssignment(user_Id, title, instructor) {
  const addSubject = await subjectRepository.create(
    user_Id,
    title,
    instructor,
  );

  validateInput(title, instructor)

  return assignmentCreate;
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

// console.log(await getSubjectById(1100));
console.log(await getAllSubjects())
