/*
*
* 
* Responsibility: Handle business logic and validation.
*
* 
*/

import * as assignmentRepository from "./assignment.repository.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  
  return error;
};


// Retrieve all assignments
async function getAllAssignments(userId) {
  return await assignmentRepository.findAll(userId);
}


// Retrieve assignment by ID
async function getAssignmentById(id, userId) {
  const assignment = await assignmentRepository.findByIdForUser(id, userId);
  return assignment;
}


async function createAssignment(title, dueDate, subjectId, userId) {
  const assignmentCreate = await assignmentRepository.createForUser(
    title,
    dueDate,
    subjectId,
    userId,
  );

  if (!assignmentCreate) {
    throw createError("Subject not found for this account.", 404);
  }

  return assignmentCreate;
}


async function deleteAssignmentById(id, userId) {
  const assignmentDelete = await assignmentRepository.deleteByIdForUser(id, userId);
  return assignmentDelete;
}


export {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  deleteAssignmentById,
};
