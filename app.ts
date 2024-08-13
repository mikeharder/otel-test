import { context, Span, trace } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";

async function main() {
  const name = "example";
  const version = "0.1.0";
  const tracer = trace.getTracer(name, version);
  const logger = logs.getLogger(name, version);

  while (true) {
    const span = await tracer.startActiveSpan("main loop", async (span: Span) => {
      // emit a log record
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: "INFO",
        body: "this is a log record body",
        attributes: { "log.type": "custom" }
      });

      await new Promise((r) => setTimeout(r, 2000));

      span.end();
    });
  }
}

await main();

export {};
