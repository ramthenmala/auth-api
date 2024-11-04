import { Request, Response } from 'express';
import logStatus from '../utils/logStatus';
import { findUserByEmail } from '../service/user.service';
import { CreateSessionInput } from '../schema/auth.schema';
import { signAccessToken, signRefreshToken } from '../service/auth.service';

export async function createSessionHandler(req: Request<{}, {}, CreateSessionInput>, res: Response) {
    try {
        const { email, password } = req.body;

        const message = 'Invalid email or password';

        const user = await findUserByEmail(email);

        if (!user) {
            return res
                .status(401)
                .json({ message: message })
                .end();
        }

        if (!user.verified) {
            return res
                .status(401)
                .json({ message: "Please verify your email" })
                .end();
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
            return res
                .status(401)
                .json({ message: message })
                .end();
        }

        const accessToken = signAccessToken(user);
        const refreshToken = await signRefreshToken({ userId: user._id });

        return res.send({
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error('Error in createSessionHandler:', error); // Log the actual error
        return res
            .status(500)
            .json({ message: 'createSessionHandler errored' })
            .end();
    }
}
