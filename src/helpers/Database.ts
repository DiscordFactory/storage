import Connect from '../Connect'

export function getDatabase () {
  return Connect.getInstance()
}

export function getConnexion () {
  return getDatabase().connexion
}