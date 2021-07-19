import {
  EMAIL_RESET_STARTED,
  INACTIVE_USER_SIGNED_IN,
  PASSWORD_RESET,
  PASSWORD_RESET_STARTED,
  USER_ACTIVATED,
  USER_CREATED
} from '@/constants/events';
import {IMailerService} from '@/interfaces/services';
import {EventEmitter} from 'events';
import config from '@/config';

const {
  app: {HOST, port}
} = config;

export default (emitter: EventEmitter, mailerService: IMailerService) => {
  const sendActivationMessage = async (
    email: string,
    activationToken: string
  ) =>
    mailerService.send(
      email,
      'Account activation',
      'Click the link to activate the account:\n' +
        `${HOST}:${port}/api/users/activate/${activationToken}`
    );

  emitter.on(
    USER_CREATED,
    async ({
      email,
      activationToken
    }: {
      email: string;
      activationToken: string;
    }) => {
      await sendActivationMessage(email, activationToken);
    }
  );

  emitter.on(
    INACTIVE_USER_SIGNED_IN,
    async ({
      email,
      activationToken
    }: {
      email: string;
      activationToken: string;
    }) => {
      await sendActivationMessage(email, activationToken);
    }
  );

  emitter.on(USER_ACTIVATED, async (email: string) => {
    await mailerService.send(
      email,
      'Account activation',
      'Your account has been activated!'
    );
  });

  emitter.on(
    EMAIL_RESET_STARTED,
    async ({
      email,
      emailResetToken
    }: {
      email: string;
      emailResetToken: string;
    }) => {
      await mailerService.send(
        email,
        'Email verification',
        'Click the link to verify the email:\n' +
          `${HOST}:${port}/api/users/reset-email/${emailResetToken}`
      );
    }
  );

  emitter.on(PASSWORD_RESET, async (email: string) => {
    await mailerService.send(
      email,
      'Password Reset',
      'Password successfully reset!'
    );
  });

  emitter.on(
    PASSWORD_RESET_STARTED,
    async ({
      email,
      passwordResetToken
    }: {
      email: string;
      passwordResetToken: string;
    }) => {
      await mailerService.send(
        email,
        'Password reset',
        'Click the link to reset the password:\n' +
          `${HOST}:${port}/api/users/reset-forgotten-password/${passwordResetToken}`
      );
    }
  );
};
