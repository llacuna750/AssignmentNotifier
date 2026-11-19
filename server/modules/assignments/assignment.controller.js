/* 
*
* 
* Responsibility: Receive HTTP requests, 
* communicate with the service, and return HTTP responses.
* 
* 
* 
*/

import * as assignmentService from "./assignment.service.js";
async function getAll(req, res, next) {
  try {
    const result = await assignmentService.getAllAssignments(req.user.id);
    return res.status(200).json(result); // Sends the data back to the client
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const selectedItem = await assignmentService.getAssignmentById(
      req.params.id,
      req.user.id,
    );

    if (!selectedItem) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment found",
      data: selectedItem,
    });
  } catch (error) {
    return next(error);
  }
}

export { getAll, getById };
