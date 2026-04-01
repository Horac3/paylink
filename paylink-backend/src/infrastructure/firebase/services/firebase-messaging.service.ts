import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

/**
 * @description Firebase Cloud Messaging (FCM) service for push notifications
 */
export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class FirebaseMessagingService {
  private readonly logger = new Logger(FirebaseMessagingService.name);
  private messaging = admin.messaging();

  /**
   * @description Send push notification to a single device
   * @param fcmToken FCM registration token
   * @param payload Notification payload with title, body, optional data
   * @throws Error if sending fails
   */
  async sendToDevice(
    fcmToken: string,
    payload: NotificationPayload,
  ): Promise<void> {
    try {
      await this.messaging.send({
        token: fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      });
      this.logger.debug(`Push sent to device ${fcmToken}`);
    } catch (error) {
      this.logger.error(`Failed to send push to device: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * @description Send push notification to all devices subscribed to a topic
   * @param topic Topic name e.g. 'payment.updates'
   * @param payload Notification payload
   * @throws Error if sending fails
   */
  async sendToTopic(
    topic: string,
    payload: NotificationPayload,
  ): Promise<void> {
    try {
      await this.messaging.send({
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      });
      this.logger.debug(`Push sent to topic ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to send push to topic: ${(error as Error).message}`);
      throw error;
    }
  }
}
