import { Request, Response } from 'express';
import logStatus from '../utils/logStatus';

const heathCheckHandler = (_: Request, res: Response) => {
  try {
    return res.status(200).json({ message: 'Ok' }).end();
  } catch (error) {
    logStatus.error('Health check errored');
    return res
      .status(500)
      .json({ message: 'Healthcheck Internal Server error' })
      .end();
  }
};

export default heathCheckHandler;
