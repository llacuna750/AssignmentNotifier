/**
 *
 *
 * * Responsibility: Receive HTTP requests,
 * * communicate with the service, and return HTTP responses.
 *
 *
 *
 */

import * as SubjectServices from "./subject.service.js";

async function getSubjects(req, res, next) {
  const user = req.user;
  try {
    const data = await SubjectServices.getUserSubjects(req.user.id);
    return res
      .status(200)
      .json({ success: true, message: "Current subjects is fetched", data });
  } catch (error) {
    return next(error);
  }
}

async function createSubjects(req, res, next) {
  try {
    const result = await SubjectServices.addAssignment({
      user: req.user.id,
      ...req.body,
    });

    return res.status(201).json({ Success: true, message: result });
  } catch (error) {
    return next(error);
  }
}

export { getSubjects, createSubjects };
