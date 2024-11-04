import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import SessionModel from "../model/session.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";


const crypto = require('crypto');
const fs = require('fs');

// Define the options for RSA key generation
const keyOptions = {
    modulusLength: 2048, // Key size in bits, 2048 is standard for RSA
    publicKeyEncoding: {
        type: 'spki', // Public key format
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8', // Private key format
        format: 'pem'
    }
};

// Generate Access Token Key Pair
const { publicKey: ACCESS_TOKEN_PUBLIC_KEY, privateKey: ACCESS_TOKEN_PRIVATE_KEY } = crypto.generateKeyPairSync('rsa', keyOptions);

// Generate Refresh Token Key Pair
const { publicKey: REFRESH_PUBLIC_KEY, privateKey: REFRESH_PRIVATE_KEY } = crypto.generateKeyPairSync('rsa', keyOptions);

// Output the keys to the console
console.log('ACCESS_TOKEN_PUBLIC_KEY:\n', ACCESS_TOKEN_PUBLIC_KEY);
console.log('ACCESS_TOKEN_PRIVATE_KEY:\n', ACCESS_TOKEN_PRIVATE_KEY);
console.log('REFRESH_PUBLIC_KEY:\n', REFRESH_PUBLIC_KEY);
console.log('REFRESH_PRIVATE_KEY:\n', REFRESH_PRIVATE_KEY);


// Creates a new session for the user and returns it
export async function createSession({ userId }: { userId: string }) {
    return SessionModel.create({ user: userId });
}

// Finds a session by its ID
export async function findSessionById(id: string) {
    return SessionModel.findById(id);
}

// Generates a refresh token by creating a session and signing a JWT with a 1-year expiration
export async function signRefreshToken({ userId }: { userId: string }) {
    const session = await createSession({ userId });

    const refreshToken = signJwt(
        { session: session._id },
        "refreshTokenPrivateKey",
        { expiresIn: "1y" } // Sets refresh token expiration to 1 year
    );

    return refreshToken;
}

// Generates an access token for the user, omitting private fields and setting a token expiration
export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateFields); // Exclude private fields from payload

    const accessToken = signJwt(
        payload,
        "accessTokenPrivateKey",
        { expiresIn: "15m" } // Sets access token expiration to 15 minutes
    );

    return accessToken;
}
