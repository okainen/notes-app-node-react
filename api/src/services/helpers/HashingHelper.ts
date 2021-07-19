import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';
import {HashingHelper as IHashingHelper} from './interfaces';

const scryptAsync = promisify(scrypt);

export default class HashingHelper implements IHashingHelper {
  async hash(s: string) {
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(s, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  async compare(hashedStringWithSalt: string, suppliedString: string) {
    const [hashedString, salt] = hashedStringWithSalt.split('.');
    const buf = (await scryptAsync(suppliedString, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedString;
  }
}
