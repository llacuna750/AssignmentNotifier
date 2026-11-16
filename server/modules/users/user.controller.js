import UserService from './user.service.js'

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
  const id = req.params.id;
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

export { getUsers, getUser };
