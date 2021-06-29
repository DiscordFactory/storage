import { fetch } from 'fs-recursive'

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
}

export async function environment () {
  return await fetch(process.cwd(),
    ['env', 'json', 'yaml', 'yml'],
    'utf-8',
    ['node_modules'])
}