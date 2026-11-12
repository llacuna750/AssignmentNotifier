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
import express from "express";

async function getAll(req, res) {
  try {
    const result = await assignmentService.getAllAssignments();
    return res.status(200).json(result); // Sends the data back to the client
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Handles errors gracefully
  }
}

async function getById(req, res) {
  try {
    const selectedItem = await assignmentService.getAssignmentById(
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message: '',
      data: selectedItem
    });
  } catch (error) {
    return res.assignmentService.status(500).json({ error: error.message });
  }
}

export { getAll };
