import AuthService from "./auth.service.js";
import jwt from "jsonwebtoken";

const authCookieName = "accessToken";

function setAuthCookie(res, token) {
  // Keep the browser cookie's lifetime aligned with the JWT's exp claim.
  const expiresAt = jwt.decode(token)?.exp;
  const cookieOptions = {
    httpOnly: true, // Browser JavaScript cannot read the authentication token.
    secure: process.env.NODE_ENV === "production", // HTTPS only in production.
    sameSite: "lax", // Send on same-site requests and reduce cross-site request risk.
    path: "/", // Make the cookie available to all API routes.
  };

  if (expiresAt) {
    cookieOptions.maxAge = Math.max(0, expiresAt * 1000 - Date.now());
  }

  res.cookie(authCookieName, token, cookieOptions);
}

function clearAuthCookie(res) {
  // Cookie path and security attributes should match the ones used when setting it.
  res.clearCookie(authCookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

const signUp = async (req, res, next) => {
  try {
    const result = await AuthService.signUp(req.body);
    setAuthCookie(res, result.token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      // Return the user profile only; the HttpOnly cookie holds the JWT.
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const result = await AuthService.signIn(req.body);
    setAuthCookie(res, result.token);

    return res.status(200).json({
      success: true,
      message: "Signed in successfully!!",
      // Return the user profile only; the HttpOnly cookie holds the JWT.
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    clearAuthCookie(res);
    return res.status(200).json({
      success: true,
      message: "Signed out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, signOut };
