import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import prisma from '../config/prisma';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & { role: string };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Token is missing.',
      });
      return;
    }

    try {
      const decoded = verifyToken(token);
      
      // Check if user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, isActive: true, role: true },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found. Please login again.',
        });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact admin.',
        });
        return;
      }

      // ✅ Set user with role
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: user.role,  // ← YAHAN SE ROLE AAYEGA
      };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
    return;
  }
};

// ========== AUTHORIZE MIDDLEWARE ==========
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Please login first.',
      });
      return;
    }

    // ✅ Check if user role is in allowed roles
    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Only ${allowedRoles.join(', ')} can access this resource.`,
      });
      return;
    }

    next();
  };
};