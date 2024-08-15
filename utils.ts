import { Span, SpanStatusCode, Tracer } from "@opentelemetry/api";

export async function withSpan<T>(
  tracer: Tracer,
  name: string,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  return await tracer.startActiveSpan(name, async (span: Span) => {
    try {
      let result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as any);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
