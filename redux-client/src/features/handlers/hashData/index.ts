import CryptoJS from 'crypto-js';
const SECRET_KEY = 'yourSecretKey';
export function encryptData(data: any) {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);
  return encryptedData.toString();
}

export function decryptData(encryptedData: any) {
  if (!encryptedData) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    return null;
  }
}
export  function myDecryptedData() {
  
  const storedEncryptedData = localStorage.getItem("hashedData");
  const decryptedData =  decryptData(storedEncryptedData);
   let userData: any = false;
  if (decryptedData) {
    userData = decryptedData;
  }
  if (userData && userData.id) {
    const { id } = userData;
  } 
  return userData
  
}
const storedEncryptedData = localStorage.getItem("hashedData");
const decryptedData =  decryptData(storedEncryptedData);
 export let userData: any = false;
if (decryptedData) {
  userData = decryptedData;
}
if (userData && userData.id) {
  const { id } = userData;  
} 