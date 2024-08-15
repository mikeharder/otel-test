import { Span, SpanStatusCode, trace } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import bunyan from "bunyan";
import winston from "winston";
import { withSpan, withSpanSync } from "./utils.js";

const name = "example";
const version = "0.1.0";

const tracer = trace.getTracer(name, version);
const logger = logs.getLogger(name, version);

const bunyanLogger = bunyan.createLogger({ name: name });
const winstonLogger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

async function throwCatch() {
  try {
    await withSpan(tracer, "throwCatch", async (span: Span) => {
      await new Promise((r) => setTimeout(r, 500));
      throw new Error("should be caught");
    });
  }
  catch {
  }
}

function throwCatchSync() {
  try {
    withSpanSync(tracer, "throwCatchSync", (span: Span) => {
      throw new Error ("should be caught");
    });
  }
  catch {
  }
}

async function throwCatchRethrow() {
  await withSpan(tracer, "throwCatchRethrow", async (span: Span) => {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error("should be re-thrown");
  });
}

async function main() {
  while (true) {
    await withSpan(tracer, "main loop", async (span: Span) => {
      // emit a log record
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: "INFO",
        body: "this is a log record body",
        attributes: { "log.type": "custom" },
      });

      bunyanLogger.info("bunyan-info");
      winstonLogger.info("winston-info");

      await withSpan(
        tracer,
        "sleep",
        async (span: Span) => {
          await new Promise((r) => setTimeout(r, 500));
          span.end();
        }
      );

      throwCatchSync();

      await throwCatch();
      await throwCatchRethrow();
    });
  }
}

await main();

export {};
