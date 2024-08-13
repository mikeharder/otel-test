// Optional and only needed to see the internal diagnostic logging (during development)
// import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Trace
import { trace } from "@opentelemetry/api";
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";

const tracerProvider = new BasicTracerProvider();

console.log("Adding ConsoleSpanExporter");
tracerProvider.addSpanProcessor(
  new SimpleSpanProcessor(new ConsoleSpanExporter())
);

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
console.log("Adding OTLPTraceExporter");
tracerProvider.addSpanProcessor(
  new SimpleSpanProcessor(new OTLPTraceExporter())
);

import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";
try {
  console.log("Adding AzureMonitorTraceExporter")
  tracerProvider.addSpanProcessor(
    new SimpleSpanProcessor(new AzureMonitorTraceExporter())
  )
}
catch (error) {
  console.log(error);
}

trace.setGlobalTracerProvider(tracerProvider);


// Logs
import { logs } from "@opentelemetry/api-logs";
import {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

const loggerProvider = new LoggerProvider();

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new OTLPLogExporter())
);

logs.setGlobalLoggerProvider(loggerProvider);
