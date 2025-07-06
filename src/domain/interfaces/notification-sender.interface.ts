export interface NotificationSender {
  send(phone: string, payload: any): Promise<void>;
}
