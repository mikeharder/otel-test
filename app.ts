import { Span, SpanStatusCode, trace } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import bunyan from "bunyan";
import winston from "winston";

const name = "example";
const version = "0.1.0";

const tracer = trace.getTracer(name, version);
const logger = logs.getLogger(name, version);

const bunyanLogger = bunyan.createLogger({ name: name });
const winstonLogger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

async function throwCatch() {
  await tracer.startActiveSpan("throwCatch", async (span: Span) => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      throw new Error("should be caught");
    } catch (error) {
      span.recordException(error as any);
      span.setStatus({ code: SpanStatusCode.ERROR });
    } finally {
      span.end();
    }
  });
}

async function throwCatchRethrow() {
  await tracer.startActiveSpan("throwCatchRethrow", async (span: Span) => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      throw new Error("should be re-thrown");
    } catch (error) {
      span.recordException(error as any);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}

async function main() {
  while (true) {
    await tracer.startActiveSpan("main loop", async (span: Span) => {
      try {
        // Only needed when using BasicTracerProvider
        // const ctx = trace.setSpan(context.active(), parentSpan);

        // emit a log record
        logger.emit({
          severityNumber: SeverityNumber.INFO,
          severityText: "INFO",
          body: "this is a log record body",
          attributes: { "log.type": "custom" },
          // Only needed when using BasicTracerProvider
          // context: ctx
        });

        bunyanLogger.info("bunyan-info");
        winstonLogger.info("winston-info");

        await tracer.startActiveSpan(
          "sleep",
          // only needed when using BasicTracerProvider
          /*{}, ctx,*/
          async (span: Span) => {
            await new Promise((r) => setTimeout(r, 500));
            span.end();
          }
        );

        await throwCatch();
        await throwCatchRethrow();
      } catch (error) {
        span.recordException(error as any);
        span.setStatus({ code: SpanStatusCode.ERROR });
      } finally {
        span.end();
      }
    });
  }
}

await main();

export {};
