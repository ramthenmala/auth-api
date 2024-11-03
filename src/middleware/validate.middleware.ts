import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import logStatus from '../utils/logStatus';

const validateResource =
    (schema: AnyZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {

                console.log(req.body)
                schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
                next();
            } catch (e: any) {
                logStatus.error('middleware validation failed')
                return res.status(400).send(e.errors);
            }
        };


export default validateResource;