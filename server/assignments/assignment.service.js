/*
*
* 
* Responsibility: Handle business logic and validation.
*
* 
*/

import * as assignmentRepository from "./assignment.repository.js";

// throw new Error() 
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.errorStatus = statusCode;
  
  return error;
};


// Retrieve all assignments
async function getAllAssignments() {
  return await assignmentRepository.findAll();
}


// Retrieve assignment by ID
async function getAssignmentById(id) {
  const assignment = await assignmentRepository.findById(id);
  return assignment;
}


async function createAssignment(title, subject) {
  const assignmentCreate = await assignmentRepository.create(title, subject);
  return assignmentCreate;
}


async function deleteAssignmentById(id) {
  const assignmentDelete = await assignmentRepository.deleteById(id);
  return assignmentDelete;
}


export {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  deleteAssignmentById,
};
