import { Request, Response } from 'express';
import logStatus from '../utils/logStatus';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import { createUserService, findUserByEmail, findUserById } from '../service/user.service';
import sendEmail from '../utils/mailer';
import { nanoid } from 'nanoid';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    try {
        const body = req.body;
        const user = await createUserService(body);

        await sendEmail({
            to: user.email,
            subject: 'Please Verify your account',
            text: `verfication code ${user.verificationCode}. Id: ${user.id}`,
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
        });

        return res.send('User Successfylly Created')
    } catch (e: any) {
        if (e.code === 11000) {
            logStatus.error('Account exists error')
            return res.status(409).send("Account already exists");
        }

        logStatus.error('Account exists error', e)
        return res.status(500).send(e);
    }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    try {
        const id = req.params.id;
        const verificationCode = req.params.verificationCode;

        const user = await findUserById(id);

        if (!user) {
            return res.status(401).send('Could not verify user');
        }

        if (user.verified) {
            return res.status(401).send('User Already Verified');
        }

        if (user.verificationCode === verificationCode) {
            user.verified = true

            await user.save();

            return res.status(401).send('User Successfully verified');
        }

        return res.status(401).send('Could not verifiy user');
    } catch (error) {
        console.log('verifyUserHandler', error)
    }
}

export async function forgotpasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
    try {
        const { email } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            logStatus.debug(`User with email ${email} doesnot exists`)
            return res.status(401).send('If a user with that email is registered you will receive a password reset email');
        }

        if (!user.verified) {
            return res.status(401).send('User is not verified');
        }

        const passwordResetCode = nanoid();

        user.passwordResetCode = passwordResetCode;

        await user.save();

        await sendEmail({
            to: user.email,
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
            subject: 'Reset Your Password',
            text: `Password reset code ${user.passwordResetCode}. Id: ${user.id}`,
        });

        logStatus.debug(`Password reset email sent to ${email}`)
        return res.send('If a user with that email is registered you will receive a password reset email')
    } catch (error) {
        logStatus.error(`forgtoHandler ::: >>> ${error}`)
    }
}

export async function resetPasswordHandler(req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput['body']>, res: Response) {
    try {
        const { id, passwordResetCode } = req.params;
        const { password } = req.body;
        const user = await findUserById(id);

        if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
            logStatus.debug(`User with email ${id} doesnot exists`)
            return res.status(401).send('Could not reset user password');
        }

        user.passwordResetCode = null;

        user.password = password;

        await user.save();

        return res.send('Successfully updated password')
    } catch (error) {
        logStatus.error(`User with email doesnot exists`, error)
    }
}