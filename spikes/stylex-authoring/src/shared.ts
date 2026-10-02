export function mergeClassNames(
  generated: string | undefined,
  external: string | undefined,
): string | undefined {
  if (generated && external) {
    return `${generated} ${external}`;
  }

  return generated ?? external;
}
