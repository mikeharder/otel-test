import { logs, SeverityNumber } from "@opentelemetry/api-logs";

const logger = logs.getLogger("example", "1.0.0");

while (true) {
  // emit a log record
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "INFO",
    body: "this is a log record body",
    attributes: { "log.type": "custom" },
  });

  await new Promise((r) => setTimeout(r, 2000));
}

export {};
