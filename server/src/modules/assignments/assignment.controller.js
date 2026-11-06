import * as assignmentService from "./assignment.service.js";

async function getAll(req, res) {
  try {
    const result = await assignmentService.getAllAssignments();
    return res.status(200).json(result); // Sends the data back to the client
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Handles errors gracefully
  }
}

export { getAll };
