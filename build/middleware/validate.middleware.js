'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const logStatus_1 = __importDefault(require('../utils/logStatus'));
const validateResource = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    logStatus_1.default.error('middleware validation failed');
    return res.status(400).send(e.errors);
  }
};
exports.default = validateResource;
