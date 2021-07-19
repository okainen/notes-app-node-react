export default class DataIntegrityError extends Error {
  constructor(message?: string) {
    super(`Error: ${message}`);
  }
}
