import Gun from "gun"
import "gun/sea"
import "gun/axe"

const gun = Gun()
const user = gun.user().recall({ sessionStorage: true })
export { gun, user }