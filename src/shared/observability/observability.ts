export interface Observability {
  info(event: string, context?: Readonly<Record<string, unknown>>): void;
  error(
    event: string,
    error: unknown,
    context?: Readonly<Record<string, unknown>>,
  ): void;
}

export const noOpObservability: Observability = {
  info: () => undefined,
  error: () => undefined,
};
