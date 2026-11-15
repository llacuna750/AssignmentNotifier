import authService from "./auth.service.js";

const signUp = async (req, res, next) => {
  try {
    const result = await authService.signUp(req.body);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const result = await authService.signIn(req.body);

    return res.status(201).json({
      success: true,
      message: "Signed in successfully!!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {};

export { signUp, signIn, signOut };
  