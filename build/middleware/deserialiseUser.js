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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const deserialiseUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return next();
    }
    try {
        const decoded = (0, jwt_1.verifyJwt)(token, 'accessTokenPublicKey');
        if (decoded) {
            res.locals.user = decoded;
            next();
        }
        else {
            console.error('Invalid token');
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
    catch (error) {
        console.error('Error deserializing user:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.default = deserialiseUser;
