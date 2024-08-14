import { Span, trace } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import bunyan from "bunyan";
import winston from "winston";

async function main() {
  const name = "example";
  const version = "0.1.0";

  const tracer = trace.getTracer(name, version);
  const logger = logs.getLogger(name, version);

  const bunyanLogger = bunyan.createLogger({ name: name });
  const winstonLogger = winston.createLogger({
    transports: [new winston.transports.Console()],
  });

  while (true) {
    await tracer.startActiveSpan("main loop", async (parentSpan: Span) => {
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
          await new Promise((r) => setTimeout(r, 2000));
          span.end();
        }
      );

      parentSpan.end();
    });
  }
}

await main();

export {};
