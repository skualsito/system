import { gun, user } from "../gun"
import { decryptData } from "../utils/crypto-utils"


var currentUser = {
  uuid: "",
  nickname: "",
  photo: "",
};

const setCurrentUser = () => {
  gun.get(user.is.epub).once(async (_user) => {
    const user = await decryptData(_user.data)
    currentUser = user;
  })
}

export { currentUser, setCurrentUser }