import { getDatabase } from '../helpers/Database'

export function useDatabase () {
  return {
    initialize: () => getDatabase().initialize(),
  }
}