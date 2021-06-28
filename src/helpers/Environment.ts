export function filterEnvironment (identifier: string) {
  return Object.entries(process.env)
    .map(([key, value]) => key.toUpperCase().startsWith(identifier) ? { [key.replace(`${identifier.toUpperCase()}_`, '')]: value } : null)
    .filter(rule => rule).reduce((acc, t) => ({ ...acc, ...t }))
}

export function validateEnvironment (database) {
  if (database.DRIVER !== 'SQLite'
    && database.DRIVER !== 'MySQL'
    && database.DRIVER !== 'PostgreSQL') {
    throw new Error('Your database driver is not defined or isn\'t valid in your environment file.')
  }

  if (database.DRIVER === 'SQLite' && !database.PATH) {
    throw new Error('The path to your SQLite database is missing from your environment file.')
  }

  if (database.DRIVER === 'MySQL'
    && !database.HOST
    && !database.POST
    && !database.USERNAME
    && !database.NAME) {
    throw new Error('Your database configuration is incomplete or invalid.')
  }

  if (database.DRIVER === 'PostgreSQL'
    && !database?.HOST
    && !database?.USERNAME
    && !database?.POST
    && !database?.NAME) {
    throw new Error('Your database configuration is incomplete or invalid.')
  }
}