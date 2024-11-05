"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logStatus_1 = __importDefault(require("./logStatus"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Connect to the MongoDB database using Mongoose.
 * Throws an error if the database connection fails.
 */
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbUri = process.env.MONGOOSE_DB_URI;
        if (!dbUri) {
            logStatus_1.default.error('Database URI is not defined in environment variables.');
            process.exit(1);
        }
        try {
            yield mongoose_1.default.connect(dbUri);
            logStatus_1.default.info('DB Connected Successfully');
        }
        catch (error) {
            logStatus_1.default.error('Could not connect to the database', error);
            process.exit(1);
        }
    });
}
exports.default = connect;
