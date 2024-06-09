export function cs(...args: Array<string | boolean | undefined | null>) {
  if (args.length === 0) {
    return "";
  }
  return args
    .filter((arg) => arg !== undefined && arg !== null && arg)
    .join(" ");
}
