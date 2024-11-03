import heathCheckHandler from '../controllers/healthcheck.controller';
import { createUserHandler, forgotpasswordHandler, resetPasswordHandler, verifyUserHandler } from '../controllers/user.controller';
import validateResource from '../middleware/validate.middleware';
import { createUserSchema, verifyUserShema, forgotPasswordShema, resetPasswordSchema } from '../schema/user.schema';

function appRouter(appRouter: any) {
    appRouter.get('/healthcheck', heathCheckHandler);

    appRouter.post('/api/users', validateResource(createUserSchema), createUserHandler);

    appRouter.post('/api/users/verify/:id/:verificationCode', validateResource(verifyUserShema), verifyUserHandler);

    appRouter.post('/api/users/forgotpassword', validateResource(forgotPasswordShema), forgotpasswordHandler);

    appRouter.post('/api/users/resetpassword/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHandler);

}

export default appRouter;
