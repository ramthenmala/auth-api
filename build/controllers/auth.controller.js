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
exports.createSessionHandler = createSessionHandler;
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
const jwt_1 = require('../utils/jwt');
const user_service_1 = require('../service/user.service');
const auth_service_1 = require('../service/auth.service');
const lodash_1 = require('lodash');
const logStatus_1 = __importDefault(require('../utils/logStatus'));
function createSessionHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      const message = 'Invalid email or password';
      const user = yield (0, user_service_1.findUserByEmail)(email);
      if (!user) {
        return res.status(401).json({ message: message }).end();
      }
      if (!user.verified) {
        return res
          .status(401)
          .json({ message: 'Please verify your email' })
          .end();
      }
      const isValid = yield user.validatePassword(password);
      if (!isValid) {
        return res.status(401).json({ message: message }).end();
      }
      const accessToken = (0, auth_service_1.signAccessToken)(user);
      const refreshToken = yield (0, auth_service_1.signRefreshToken)({
        userId: user._id.toString(),
      });
      return res.send({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logStatus_1.default.error('Error in createSessionHandler:', error);
      return res
        .status(500)
        .json({ message: 'createSessionHandler errored' })
        .end();
    }
  });
}
function refreshAccessTokenHandler(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const refreshToken = (0, lodash_1.get)(req, 'headers.x-refresh');
      if (!refreshToken) {
        return res.status(401).send('Something went wrong');
      }
      const decoded = (0, jwt_1.verifyJwt)(
        refreshToken,
        'refreshTokenPublicKey',
      );
      if (!decoded) {
        return res.status(401).send('Could not refresh access token');
      }
      const session = yield (0, auth_service_1.findSessionById)(
        decoded.session,
      );
      if (!session || !session.valid) {
        return res.status(401).send('Could not refresh access token');
      }
      const user = yield (0, user_service_1.findUserById)(String(session.user));
      if (!user) {
        return res.status(401).send('Could not refresh access token');
      }
      const accessToken = (0, auth_service_1.signAccessToken)(user);
      return res.send({ accessToken });
    } catch (error) {
      logStatus_1.default.error('Error refreshing access token:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
}
