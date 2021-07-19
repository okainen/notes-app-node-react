import {CurrentUser} from '@/entities/valueObjects';
import {UnauthorizedError} from '@/errors';

export default (currentUser: CurrentUser | null) => {
  if (!currentUser) {
    throw new UnauthorizedError();
  }
};
