# Notification Context

Event-driven notifications via FCM push, Nodemailer email, and merchant webhooks.

## Queue Architecture

All notifications are async via BullMQ — never inline in business logic.

| Queue            | Processor               | Purpose                         |
|------------------|-------------------------|---------------------------------|
| email            | EmailProcessor          | Nodemailer + Handlebars         |
| push             | PushProcessor           | FCM to payer device             |
| webhook-dispatch | WebhookDispatchProcessor| HMAC-signed merchant webhook    |

## Events → Actions

| Event              | Action                              |
|--------------------|-------------------------------------|
| payment.settled    | receipt email + push + webhook      |
| payment.failed     | push to payer                       |
| refund.initiated   | email + push                        |
| refund.completed   | email + push                        |
| refund.failed      | email to merchant                   |
