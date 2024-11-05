'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createUserHandler = createUserHandler;
exports.verifyUserHandler = verifyUserHandler;
exports.forgotpasswordHandler = forgotpasswordHandler;
exports.resetPasswordHandler = resetPasswordHandler;
exports.getUserHandler = getUserHandler;
const nanoid_1 = require('nanoid');
const logStatus_1 = __importDefault(require('../utils/logStatus'));
const user_service_1 = require('../service/user.service');
const mailer_1 = __importDefault(require('../utils/mailer'));
function createUserHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const body = req.body;
      const user = yield (0, user_service_1.createUserService)(body);
      yield (0, mailer_1.default)({
        to: user.email,
        subject: 'Please Verify your account',
        text: `verfication code ${user.verificationCode}. Id: ${user.id}`,
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
      });
      return res.send('User Successfylly Created');
    } catch (e) {
      if (e.code === 11000) {
        logStatus_1.default.error('Account exists error');
        return res.status(409).send('Account already exists');
      }
      logStatus_1.default.error('Account exists error', e);
      return res.status(500).send(e);
    }
  });
}
function verifyUserHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const id = req.params.id;
      const verificationCode = req.params.verificationCode;
      const user = yield (0, user_service_1.findUserById)(id);
      if (!user) {
        return res.status(401).send('Could not verify user');
      }
      if (user.verified) {
        return res.status(401).send('User Already Verified');
      }
      if (user.verificationCode === verificationCode) {
        user.verified = true;
        yield user.save();
        return res.status(401).send('User Successfully verified');
      }
      return res.status(401).send('Could not verifiy user');
    } catch (error) {
      console.log('verifyUserHandler', error);
    }
  });
}
function forgotpasswordHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const { email } = req.body;
      const user = yield (0, user_service_1.findUserByEmail)(email);
      if (!user) {
        logStatus_1.default.debug(`User with email ${email} doesnot exists`);
        return res
          .status(401)
          .send(
            'If a user with that email is registered you will receive a password reset email',
          );
      }
      if (!user.verified) {
        return res.status(401).send('User is not verified');
      }
      const passwordResetCode = (0, nanoid_1.nanoid)();
      user.passwordResetCode = passwordResetCode;
      yield user.save();
      yield (0, mailer_1.default)({
        to: user.email,
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
        subject: 'Reset Your Password',
        text: `Password reset code ${user.passwordResetCode}. Id: ${user.id}`,
      });
      logStatus_1.default.debug(`Password reset email sent to ${email}`);
      return res.send(
        'If a user with that email is registered you will receive a password reset email',
      );
    } catch (error) {
      logStatus_1.default.error(`forgtoHandler ::: >>> ${error}`);
    }
  });
}
function resetPasswordHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const { id, passwordResetCode } = req.params;
      const { password } = req.body;
      const user = yield (0, user_service_1.findUserById)(id);
      if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode
      ) {
        logStatus_1.default.debug(`User with email ${id} doesnot exists`);
        return res.status(401).send('Could not reset user password');
      }
      user.passwordResetCode = null;
      user.password = password;
      yield user.save();
      return res.send('Successfully updated password');
    } catch (error) {
      logStatus_1.default.error(`User with email doesnot exists`, error);
    }
  });
}
function getUserHandler(_, res) {
  return __awaiter(this, void 0, void 0, function* () {
    return res.send(res.locals.user);
  });
}
