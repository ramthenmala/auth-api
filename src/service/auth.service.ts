import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import SessionModel from "../model/session.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";

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
        { expiresIn: "1y" }
    );

    return refreshToken;
}

// Generates an access token for the user, omitting private fields and setting a token expiration
export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateFields);

    const accessToken = signJwt(
        payload,
        "accessTokenPrivateKey",
        { expiresIn: "15m" }
    );

    return accessToken;
}
