'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createUserService = createUserService;
exports.findUserById = findUserById;
exports.findUserByEmail = findUserByEmail;
const user_model_1 = __importDefault(require('../model/user.model'));
function createUserService(input) {
  return user_model_1.default.create(input);
}
function findUserById(id) {
  return user_model_1.default.findById(id);
}
function findUserByEmail(email) {
  return user_model_1.default.findOne({ email });
}
