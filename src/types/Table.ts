export type Table = {
  [fieldName in string]: {
    [property in string]: boolean
  }
}