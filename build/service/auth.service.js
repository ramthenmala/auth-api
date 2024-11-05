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
exports.createSession = createSession;
exports.findSessionById = findSessionById;
exports.signRefreshToken = signRefreshToken;
exports.signAccessToken = signAccessToken;
const lodash_1 = require('lodash');
const session_model_1 = __importDefault(require('../model/session.model'));
const user_model_1 = require('../model/user.model');
const jwt_1 = require('../utils/jwt');
function createSession(_a) {
  return __awaiter(this, arguments, void 0, function* ({ userId }) {
    return session_model_1.default.create({ user: userId });
  });
}
function findSessionById(id) {
  return __awaiter(this, void 0, void 0, function* () {
    return session_model_1.default.findById(id);
  });
}
function signRefreshToken(_a) {
  return __awaiter(this, arguments, void 0, function* ({ userId }) {
    const session = yield createSession({ userId });
    const refreshToken = (0, jwt_1.signJwt)(
      { session: session._id },
      'refreshTokenPrivateKey',
      { expiresIn: '1y' },
    );
    return refreshToken;
  });
}
function signAccessToken(user) {
  const payload = (0, lodash_1.omit)(user.toJSON(), user_model_1.privateFields);
  const accessToken = (0, jwt_1.signJwt)(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });
  return accessToken;
}
