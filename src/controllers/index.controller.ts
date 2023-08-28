import { NextFunction, Request, Response } from 'express';

export const home = (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Hello World!',
    });
  } catch (error) {
    next(error);
  }
};
