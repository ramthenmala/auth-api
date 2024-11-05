import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';

const deserialiseUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyJwt(token, 'accessTokenPublicKey');
    if (decoded) {
      res.locals.user = decoded;
      next();
    } else {
      console.error('Invalid token');
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error deserializing user:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default deserialiseUser;
