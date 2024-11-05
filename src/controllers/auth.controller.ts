import { Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { findUserByEmail, findUserById } from '../service/user.service';
import { CreateSessionInput } from '../schema/auth.schema';
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from '../service/auth.service';
import { get } from 'lodash';
import logStatus from '../utils/logStatus';

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response,
) {
  try {
    const { email, password } = req.body;

    const message = 'Invalid email or password';

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: message }).end();
    }

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: 'Please verify your email' })
        .end();
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return res.status(401).json({ message: message }).end();
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken({
      userId: user._id.toString(),
    });

    return res.send({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logStatus.error('Error in createSessionHandler:', error);
    return res
      .status(500)
      .json({ message: 'createSessionHandler errored' })
      .end();
  }
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  try {
    const refreshToken = get(req, 'headers.x-refresh');

    if (!refreshToken) {
      return res.status(401).send('Something went wrong');
    }

    const decoded = verifyJwt<{ session: string }>(
      refreshToken as string,
      'refreshTokenPublicKey',
    );

    if (!decoded) {
      return res.status(401).send('Could not refresh access token');
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
      return res.status(401).send('Could not refresh access token');
    }

    const user = await findUserById(String(session.user));

    if (!user) {
      return res.status(401).send('Could not refresh access token');
    }

    const accessToken = signAccessToken(user);

    return res.send({ accessToken });
  } catch (error) {
    logStatus.error('Error refreshing access token:', error);
    return res.status(500).send('Internal Server Error');
  }
}
