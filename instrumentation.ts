// Optional and only needed to see the internal diagnostic logging (during development)
// import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Trace
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const tracerProvider = new NodeTracerProvider();

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
  console.log("Adding AzureMonitorTraceExporter");
  tracerProvider.addSpanProcessor(
    new SimpleSpanProcessor(new AzureMonitorTraceExporter())
  );
} catch (error) {
  console.log(error);
}

tracerProvider.register();

// Logs
import { logs } from "@opentelemetry/api-logs";
import {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

const loggerProvider = new LoggerProvider();

console.log("Adding ConsoleLogRecordExporter");
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
console.log("Adding OTLPLogExporter");
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new OTLPLogExporter())
);

import { AzureMonitorLogExporter } from "@azure/monitor-opentelemetry-exporter";
try {
  console.log("Adding AzureMonitorLogExporter");
  loggerProvider.addLogRecordProcessor(
    new SimpleLogRecordProcessor(new AzureMonitorLogExporter())
  );
} catch (error) {
  console.log(error);
}

logs.setGlobalLoggerProvider(loggerProvider);

// Instrumentations
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { BunyanInstrumentation } from "@opentelemetry/instrumentation-bunyan";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
registerInstrumentations({
  instrumentations: [new BunyanInstrumentation(), new WinstonInstrumentation()],
});

// Required for ESM packages
import { register } from "module";
register("@opentelemetry/instrumentation/hook.mjs", import.meta.url);
