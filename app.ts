// Optional and only needed to see the internal diagnostic logging (during development)
// import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";

const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new OTLPLogExporter())
);

logs.setGlobalLoggerProvider(loggerProvider);

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
