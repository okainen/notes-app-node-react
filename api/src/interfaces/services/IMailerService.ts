export default interface IMailer {
  send: (to: string, subject: string, text: string) => Promise<void>;
}
