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
require('dotenv').config();
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const connect_1 = __importDefault(require('./utils/connect'));
const logStatus_1 = __importDefault(require('./utils/logStatus'));
const routes_1 = __importDefault(require('./routes'));
const deserialiseUser_1 = __importDefault(
  require('./middleware/deserialiseUser'),
);
dotenv_1.default.config();
const appPort = process.env.APP_PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(deserialiseUser_1.default);
app.listen(appPort, () =>
  __awaiter(void 0, void 0, void 0, function* () {
    logStatus_1.default.info(`App is running at http://localhost:${appPort}`);
    yield (0, connect_1.default)();
    (0, routes_1.default)(app);
  }),
);
