import jwt from 'jsonwebtoken';

export function signJwt(
    object: Object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options?: jwt.SignOptions
): string {
    const privateKeyEnvVar = keyName === 'accessTokenPrivateKey'
        ? process.env.ACCESS_TOKEN_PRIVATE_KEY
        : process.env.REFRESH_TOKEN_PRIVATE_KEY;


    // const privateKeyEnvVar = process.env.ACCESS_TOKEN_PRIVATE_KEY;

    if (!privateKeyEnvVar) {
        throw new Error(`Environment variable ${keyName} is not set`);
    }

    const signingKey = Buffer.from(privateKeyEnvVar, 'base64').toString('ascii');

    let jwtKey: string;

    try {

        console.log('privateKeyEnvVarprivateKeyEnvVarprivateKeyEnvVarprivateKeyEnvVar', privateKeyEnvVar)

        jwtKey = jwt.sign(object, signingKey, {
            ...(options && options),
            algorithm: 'RS256',
        });
    } catch (error) {
        console.error('JWT Signing Error:', error);
        throw error; // Rethrow the error if you want it to propagate
    }

    return jwtKey;
}


export function verifyJwt<T>(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {

    const publicKeyEnvVar = keyName === "accessTokenPublicKey"
        ? process.env.ACCESS_TOKEN_PUBLIC_KEY
        : process.env.REFRESH_TOKEN_PUBLIC_KEY;

    if (!publicKeyEnvVar) {
        throw new Error(`Environment variable ${keyName} is not set`);
    }

    const publicKey = Buffer.from(publicKeyEnvVar, "base64").toString("ascii");

    try {
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    } catch (e) {
        return null;
    }
}