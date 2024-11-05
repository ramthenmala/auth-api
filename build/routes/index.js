'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const auth_controller_1 = require('../controllers/auth.controller');
const healthcheck_controller_1 = __importDefault(
  require('../controllers/healthcheck.controller'),
);
const user_controller_1 = require('../controllers/user.controller');
const requireUser_1 = __importDefault(require('../middleware/requireUser'));
const validate_middleware_1 = __importDefault(
  require('../middleware/validate.middleware'),
);
const auth_schema_1 = require('../schema/auth.schema');
const user_schema_1 = require('../schema/user.schema');
function appRouter(appRouter) {
  appRouter.get('/healthcheck', healthcheck_controller_1.default);
  appRouter.post(
    '/api/users',
    (0, validate_middleware_1.default)(user_schema_1.createUserSchema),
    user_controller_1.createUserHandler,
  );
  appRouter.post(
    '/api/users/verify/:id/:verificationCode',
    (0, validate_middleware_1.default)(user_schema_1.verifyUserShema),
    user_controller_1.verifyUserHandler,
  );
  appRouter.post(
    '/api/users/forgotpassword',
    (0, validate_middleware_1.default)(user_schema_1.forgotPasswordShema),
    user_controller_1.forgotpasswordHandler,
  );
  appRouter.post(
    '/api/users/resetpassword/:id/:passwordResetCode',
    (0, validate_middleware_1.default)(user_schema_1.resetPasswordSchema),
    user_controller_1.resetPasswordHandler,
  );
  appRouter.post(
    '/api/sessions',
    (0, validate_middleware_1.default)(auth_schema_1.createSessionSchema),
    auth_controller_1.createSessionHandler,
  );
  appRouter.get('/api/users/me', user_controller_1.getUserHandler);
  appRouter.post(
    '/api/sessions/refresh',
    requireUser_1.default,
    auth_controller_1.refreshAccessTokenHandler,
  );
}
exports.default = appRouter;
