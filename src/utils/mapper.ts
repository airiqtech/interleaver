/**
 * Utility to conditionally map values while keeping strict typing.
 */
export const mapIfPresent = <TInput, TOutput>(
  value: TInput | undefined | null,
  mapper: (v: TInput) => TOutput,
): TOutput | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return mapper(value);
};
