import jwt from "jsonwebtoken";
import UserRepository from "../modules/users/user.repository.js";

// ? someone is making a request get user details --> authorize middle --> verify --> if valid --> next --> get User details

const authorize = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : undefined;

    // Prefer the existing Bearer header when supplied; otherwise use the login cookie.
    const token = bearerToken || req.cookies?.accessToken;

    if (!token)
      return res.status(401).json({
        success: false,
        message: `User hasn't logged in. / Unauthorized 🙁`,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ? return sample { userId: 85, iat: 1795146369, exp: 1795232769 }
    
    const user = await UserRepository.findById(decoded.userId);

    if (!user)
      return res.status(401).json({
        success: false,
        message: `User hasn't logged in. / Unauthorized 🙁`,
      });

    req.user = user;

    next();
  } catch (error) {
    // Expired or malformed JWTs are authentication failures, not server errors.
    const isInvalidToken = [
      "TokenExpiredError",
      "JsonWebTokenError",
      "NotBeforeError",
    ].includes(error.name);

    if (isInvalidToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is invalid or expired.",
      });
    }

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
