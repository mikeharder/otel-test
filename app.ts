import { Span, trace } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";

async function main() {
  const name = "example";
  const version = "0.1.0";
  const tracer = trace.getTracer(name, version);
  const logger = logs.getLogger(name, version);

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

      // ctx only needed when using BasicTracerProvider
      await tracer.startActiveSpan("sleep", /*{}, ctx,*/ async (span: Span) => {
        await new Promise((r) => setTimeout(r, 2000));
        span.end();
      });

      parentSpan.end();
    });
  }
}

await main();

export {};
