import {CurrentUser} from '@/entities/valueObjects';

export interface HashingHelper {
  hash: (s: string) => Promise<string>;
  compare: (
    hashedStringWithSalt: string,
    suppliedString: string
  ) => Promise<boolean>;
}

export interface authorizeUser {
  (currentUser: CurrentUser | null): void;
}

export interface validateId {
  (id: string): boolean;
}

export interface getFieldsQuery {
  (queryParams: any): string[] | null;
}
