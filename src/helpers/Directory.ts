import path from 'path'
import { fetch } from 'fs-recursive'

export const root = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'build')
  : process.cwd()

export const appRoot = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'build', 'src')
  : path.join(process.cwd(), 'src')

export async function files (path: string) {
  return await fetch(path,
    [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
    'utf-8',
    ['node_modules'])
}