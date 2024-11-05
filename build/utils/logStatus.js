'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const pino_1 = __importDefault(require('pino'));
const dayjs_1 = __importDefault(require('dayjs'));
/**
 * Configure the logger using pino
 */
const logStatus = (0, pino_1.default)({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `, "time":"${(0, dayjs_1.default)().format()}"`,
});
exports.default = logStatus;
