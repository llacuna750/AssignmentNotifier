import UserService from "./user.service.js";

const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.showAll();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "User ID must be a positive integer.",
    });
  }

  if (req.user.role !== "admin" && id !== Number(req.user.id)) {
    return res.status(403).json({
      success: false,
      message: "You can only access your own account.",
    });
  }

  try {
    const user = await UserService.findUserbyID(id);

    return res.status(200).json({
      success: true,
      message: "User is found🔥",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = (req, res) =>
  res.status(200).json({
    success: true,
    data: req.user,
  });

export { getUsers, getUser, getMe };
