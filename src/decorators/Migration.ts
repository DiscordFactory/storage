export default function Migration () {
  return (target: Function) => {
    target.prototype.type = 'migration'
  }
}