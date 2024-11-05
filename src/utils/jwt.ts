import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import logStatus from './logStatus';

export function signJwt(
    object: Object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options?: jwt.SignOptions
): string {
    const privateKeyEnvVar = keyName === 'accessTokenPrivateKey'
        ? process.env.ACCESS_TOKEN_PRIVATE_KEY
        : process.env.REFRESH_PRIVATE_KEY;

    if (!privateKeyEnvVar) {
        throw new Error(`Environment variable ${keyName} is not set`);
    }

    const privateKey = crypto.createPrivateKey({
        key: privateKeyEnvVar,
        format: 'pem'
    });

    const jwtKey = jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    });

    return jwtKey;
}

export function verifyJwt<T>(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
    const publicKeyEnvVar = keyName === "accessTokenPublicKey"
        ? process.env.ACCESS_TOKEN_PUBLIC_KEY
        : process.env.REFRESH_PUBLIC_KEY;

    if (!publicKeyEnvVar) {
        throw new Error(`Environment variable ${keyName} is not set`);
    }

    const publicKey = crypto.createPublicKey({
        key: publicKeyEnvVar,
        format: 'pem'
    });

    try {
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    } catch (error) {
        logStatus.error('JWT Verification Error:', error);
        if (error instanceof jwt.TokenExpiredError) {
            logStatus.error('Token expired:', error);
            return null;
        } else if (error instanceof jwt.JsonWebTokenError) {
            logStatus.error('Invalid token');
            return null;
        } else {
            throw error;
        }
    }
}