// Optional and only needed to see the internal diagnostic logging (during development)
// import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Trace
// import { trace } from "@opentelemetry/api";
// import { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor }  from "@opentelemetry/sdk-trace-base";
// const tracerProvider = new BasicTracerProvider();


// Logs
import { logs } from "@opentelemetry/api-logs";
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
// loggerProvider.addLogRecordProcessor(
//   new SimpleLogRecordProcessor(new OTLPLogExporter())
// );

logs.setGlobalLoggerProvider(loggerProvider);
