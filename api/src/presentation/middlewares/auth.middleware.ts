import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import logger from "../../shared/logger/logger";
import { JwtService } from "../../interfaceAdapters/services/jwt.service";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants/constant";

const tokenService = new JwtService();

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface CustomRequest extends Request {
  user: CustomJwtPayload;
}

const extractToken = (
  req: Request
): { access_token: string; refresh_token: string } | null => {
  const pathSegments = req.path.split("/");
  const privateRouteIndex = pathSegments.indexOf("");

  if (privateRouteIndex !== -1 && pathSegments[privateRouteIndex + 1]) {
    const userType = pathSegments[privateRouteIndex + 1];
    return {
      access_token: req.cookies[`${userType}_access_token`] || null,
      refresh_token: req.cookies[`${userType}_refresh_token`] || null,
    };
  }

  return null;
};

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (!token) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
      return;
    }

    const user = tokenService.verifyAccessToken(
      token.access_token
    ) as CustomJwtPayload;

    if (!user || !user._id) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
      return;
    }

    (req as CustomRequest).user = {
      ...user,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.TOKEN_EXPIRED });
      return;
    }

    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    return;
  }
};

export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info('access token expire triggered')
    const token = extractToken(req);
    console.log('extracted token for decoding : ',token);
    
    if (!token) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
      return;
    }

    try {
      // verify refresh token to create new access with it
      const user = tokenService.verifyRefreshToken(token?.refresh_token);
      console.log('user from access token decode : ',user);

      if (!user) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
        return;
      }

      (req as CustomRequest).user = {
        _id: user?._id,
        email: user?.email,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };
      next();
    } catch (tokenError) {
      // Access token is expired/invalid, try to refresh
      console.log('Access token invalid, attempting refresh...',tokenError);
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.TOKEN_EXPIRED });
      return;
    }
  } catch (error) {
    console.error('Token decode error:', error);
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as CustomRequest).user;
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.NOT_ALLOWED,
        userRole: user ? user.role : "None",
      });
      return;
    }
    next();
  };
};
