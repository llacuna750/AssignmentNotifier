import assignmentRepository from "./assignment.repository.js";

async function getAllAssignments() {
  const assignment = await assignmentRepository.findAll();
  return assignment;
}

async function getAssignmentById(id) {
  const assignment = await assignmentRepository.findById();
  return assignment;
}

async function createAssignment(title, subject) {
  const assignmentCreate = await assignmentRepository.create();
  return assignmentCreate;
}

async function deleteAssignmentById(id) {
  const assignmentDelete = await assignmentRepository.deleteById();
  return assignmentDelete;
}

export {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  deleteAssignmentById,
};
