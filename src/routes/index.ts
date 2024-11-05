import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from '../controllers/auth.controller';
import heathCheckHandler from '../controllers/healthcheck.controller';
import {
  createUserHandler,
  forgotpasswordHandler,
  getUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controllers/user.controller';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validate.middleware';
import { createSessionSchema } from '../schema/auth.schema';
import {
  createUserSchema,
  verifyUserShema,
  forgotPasswordShema,
  resetPasswordSchema,
} from '../schema/user.schema';

function appRouter(appRouter: any) {
  appRouter.get('/healthcheck', heathCheckHandler);

  appRouter.post(
    '/api/users',
    validateResource(createUserSchema),
    createUserHandler,
  );

  appRouter.post(
    '/api/users/verify/:id/:verificationCode',
    validateResource(verifyUserShema),
    verifyUserHandler,
  );

  appRouter.post(
    '/api/users/forgotpassword',
    validateResource(forgotPasswordShema),
    forgotpasswordHandler,
  );

  appRouter.post(
    '/api/users/resetpassword/:id/:passwordResetCode',
    validateResource(resetPasswordSchema),
    resetPasswordHandler,
  );

  appRouter.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createSessionHandler,
  );

  appRouter.get('/api/users/me', getUserHandler);

  appRouter.post(
    '/api/sessions/refresh',
    requireUser,
    refreshAccessTokenHandler,
  );
}

export default appRouter;
