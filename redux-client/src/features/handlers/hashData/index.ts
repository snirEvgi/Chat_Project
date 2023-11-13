import CryptoJS from "crypto-js"

const SECRET_KEY = "yourSecretKey"

export function encryptData(data: any) {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY)
  return encryptedData.toString()
}

export function decryptData(encryptedData: any) {
  return new Promise((resolve, reject) => {
    if (!encryptedData) reject("No encrypted data")

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      resolve(decryptedData)
    } catch (error) {
      reject("Error decrypting data")
    }
  })
}

export async function myDecryptedData() {
  try {
    const storedEncryptedData = localStorage.getItem("hashedData")
    const decryptedData = await decryptData(storedEncryptedData)
    return decryptedData || null
  } catch (error) {
    return null
  }
}

export let userData: any = null

;(async () => {
  userData = await myDecryptedData()

  if (userData && userData.id) {
    const { id } = userData
  }
})()
