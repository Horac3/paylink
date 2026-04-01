import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * @description Service for sending FCM push notifications.
 * Used by the Notification context for payment and subscription events.
 */
@Injectable()
export class FirebaseMessagingService {
  private readonly logger = new Logger(FirebaseMessagingService.name);

  /**
   * @description Send a push notification to a specific device by FCM token.
   * @param fcmToken The device FCM registration token
   * @param payload Notification title, body and optional data payload
   * @returns void — failures are logged, not thrown, to avoid breaking payment flows
   */
  async sendToDevice(
    fcmToken: string,
    payload: NotificationPayload,
  ): Promise<void> {
    try {
      const message: admin.messaging.Message = {
        token: fcmToken,
        notification: { title: payload.title, body: payload.body },
        data: payload.data ?? {},
      };
      const result = await admin.messaging().send(message);
      this.logger.debug(`FCM sent to device: ${result}`);
    } catch (err) {
      this.logger.error(`FCM sendToDevice failed: ${(err as Error).message}`);
    }
  }

  /**
   * @description Send a push notification to all devices subscribed to a topic.
   * @param topic FCM topic name e.g. 'merchant-alerts'
   * @param payload Notification payload
   */
  async sendToTopic(
    topic: string,
    payload: NotificationPayload,
  ): Promise<void> {
    try {
      const message: admin.messaging.Message = {
        topic,
        notification: { title: payload.title, body: payload.body },
        data: payload.data ?? {},
      };
      const result = await admin.messaging().send(message);
      this.logger.debug(`FCM sent to topic ${topic}: ${result}`);
    } catch (err) {
      this.logger.error(`FCM sendToTopic failed: ${(err as Error).message}`);
    }
  }
}
