import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';

// Optional and only needed to see the internal diagnostic logging (during development)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// const loggerExporter = new ConsoleLogRecordExporter();
const loggerExporter = new OTLPLogExporter();
const loggerProvider = new LoggerProvider();

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(loggerExporter)
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
