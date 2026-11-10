/*
 *
 *
 *  Responsibility: Handle business logic and validation.
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
function isPureTextString(t, i) {
  return [t, i].every((e) => typeof e === "string" && isNaN(Number(e)));
}

// Validate subject input
async function validateInput(user_Id, title, instructor) {
  title = title.trim();
  instructor = instructor.trim();

  if (!title || !instructor) {
    throw createError("Title and instructor are required.", 400);
  }

  if (!isPureTextString(title, instructor)) {
    throw createError("input from title and instructor must be string!", 400);
  }

  const isDuplicatedEntry = (await getAllSubjects()).some(
    (item) => item.title === title && item.instructor === instructor,
  );

  if ((await userRepository.findById(user_Id)) === undefined) {
    throw createError("user_id not found!", 404);
  }

  if (isDuplicatedEntry) {
    throw createError(
      "The values you insert is already exists on database!",
      400,
    );
  }

  return {
    user_Id: user_Id,
    title: title,
    instructor: instructor,
  };
}

// Create subject
async function createAssignment(user_Id, title, instructor) {
  const data = await validateInput(user_Id, title, instructor);

  try {
    return subjectRepository.create(
      data.user_Id,
      data.title,
      data.instructor,
    );
  } catch (error) {
    throw error;
  }
}

console.log(
  await createAssignment(2, "IAS ", "Isabelle   "),
);

// Retrieve all subjects
async function getAllSubjects() {
  return await subjectRepository.getAll();
}

// Retrieve subject by ID
async function getSubjectById(id) {
  const [subjectSelected] = await subjectRepository.findById(id);
  return subjectSelected;
}

// console.log(await validateInput("Haynako", "123123"));
// console.log(await validateInput("", ""));
