import * as assignmentRepository from "./assignment.repository.js";

async function getAllAssignments() {
  const assignment = await assignmentRepository.findAll();
  return assignment;
}

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
