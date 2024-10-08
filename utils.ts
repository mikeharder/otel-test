import { Span, SpanOptions, SpanStatusCode, Tracer } from "@opentelemetry/api";

export async function withSpan<T>(
  tracer: Tracer,
  name: string,
  fn: (span: Span) => Promise<T>,
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

export async function withSpanOptions<T>(
  tracer: Tracer,
  name: string,
  options: SpanOptions,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return await tracer.startActiveSpan(name, options, async (span: Span) => {
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

export function withSpanSync<T>(tracer: Tracer, name: string, fn: (span: Span) => T): T {
  return tracer.startActiveSpan(name, (span: Span) => {
    try {
      let result = fn(span);
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

export function withSpanOptionsSync<T>(tracer: Tracer, name: string, options: SpanOptions, fn: (span: Span) => T): T {
  return tracer.startActiveSpan(name, options, (span: Span) => {
    try {
      let result = fn(span);
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
