export function filterEnvironment (identifier: string) {
  return Object.entries(process.env)
    .map(([key, value]) => key.toUpperCase().startsWith(identifier) ? { [key.replace(`${identifier.toUpperCase()}_`, '')]: value } : null)
    .filter(rule => rule).reduce((acc, t) => ({ ...acc, ...t }))
}
