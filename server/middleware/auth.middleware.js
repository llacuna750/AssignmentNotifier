import jwt from "jsonwebtoken";
import UserRepository from "../modules/users/user.repository.js";

// ? someone is making a request get user details --> authorize middle --> verify --> if valid --> next --> get User details

const authorize = async (req, res, next) => {
  try {
    let token;
    const isHeadersAuth = req.headers.authorization;
    const isHeaderAuthStartWith = isHeadersAuth?.startsWith("Bearer ");

    if (isHeadersAuth && isHeaderAuthStartWith) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res.status(401).json({
        success: false,
        message: `User hasn't logged in. / Unauthorized 🙁`,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("Authorize decoded: ",decoded)
    const user = await UserRepository.findById(decoded.userId);

    if (!user)
      return res.status(401).json({
        success: false,
        message: `User hasn't logged in. / Unauthorized 🙁`,
      });

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

export { requireAdmin };
export default authorize;
