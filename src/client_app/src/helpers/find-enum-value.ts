export function getEnumValue(
  enumType: object,
  key: string
): string | undefined {
  const values = Object.entries(enumType);
  const value = values.find(([k, _]) => {
    return k === key;
  });

  return value?.[1];
}
