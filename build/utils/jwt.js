"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const logStatus_1 = __importDefault(require("./logStatus"));
function signJwt(object, keyName, options) {
    const privateKeyEnvVar = keyName === 'accessTokenPrivateKey'
        ? process.env.ACCESS_TOKEN_PRIVATE_KEY
        : process.env.REFRESH_PRIVATE_KEY;
    if (!privateKeyEnvVar) {
        throw new Error(`Environment variable ${keyName} is not set`);
    }
    const privateKey = crypto_1.default.createPrivateKey({
        key: privateKeyEnvVar,
        format: 'pem',
    });
    const jwtKey = jsonwebtoken_1.default.sign(object, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: 'RS256' }));
    return jwtKey;
}
function verifyJwt(token, keyName) {
    const publicKeyEnvVar = keyName === 'accessTokenPublicKey'
        ? process.env.ACCESS_TOKEN_PUBLIC_KEY
        : process.env.REFRESH_PUBLIC_KEY;
    if (!publicKeyEnvVar) {
        throw new Error(`Environment variable ${keyName} is not set`);
    }
    const publicKey = crypto_1.default.createPublicKey({
        key: publicKeyEnvVar,
        format: 'pem',
    });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return decoded;
    }
    catch (error) {
        logStatus_1.default.error('JWT Verification Error:', error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            logStatus_1.default.error('Token expired:', error);
            return null;
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            logStatus_1.default.error('Invalid token');
            return null;
        }
        else {
            throw error;
        }
    }
}
