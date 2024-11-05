"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logStatus_1 = __importDefault(require("../utils/logStatus"));
const heathCheckHandler = (_, res) => {
    try {
        return res.status(200).json({ message: 'Ok' }).end();
    }
    catch (error) {
        logStatus_1.default.error('Health check errored');
        return res
            .status(500)
            .json({ message: 'Healthcheck Internal Server error' })
            .end();
    }
};
exports.default = heathCheckHandler;
