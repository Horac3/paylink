# Analytics Context

Event-sourced link analytics with snapshot projection.

## Architecture

- `LinkEvent` rows are appended on every payment event (fire-and-forget)
- `AnalyticsSnapshot` is rebuilt via upsert after each event
- Queries read from snapshot only — never raw events

## Tracked Events

| Event             | LinkEvent type |
|-------------------|----------------|
| payment.initiated | PAY_STARTED    |
| payment.settled   | CONVERTED      |
| payment.failed    | PAY_FAILED     |
| refund.completed  | REFUNDED       |
