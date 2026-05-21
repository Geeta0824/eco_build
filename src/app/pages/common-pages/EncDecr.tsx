import cryptojs from 'crypto-js'
const ENCRYPT_KEY = process.env.REACT_LOGIN_ENCRYPT_KEY
const ENCRYPT_IV = process.env.REACT_LOGIN_ENCRYPT_IV

export const encryptusingaes256 = (jsonObjData: any) => {
  console.log('first')
  console.log(ENCRYPT_IV)
  console.log(CryptoJS.enc.Hex.parse(`${ENCRYPT_IV}`))
  var encrypted = cryptojs.AES.encrypt(
    cryptojs.enc.Utf8.parse(JSON.stringify(jsonObjData)),
    `${ENCRYPT_KEY}`,
    {
      keysize: 128 / 8,
      iv: CryptoJS.enc.Hex.parse(`${ENCRYPT_IV}`),
      mode: cryptojs.mode.CBC,
      padding: cryptojs.pad.Pkcs7,
    }
  )
  console.log('encrypted :' + encrypted)
  decryptusingaes256(encrypted)
  return encrypted
}

export const decryptusingaes256 = (decstring: any) => {
  var decrypted = cryptojs.AES.decrypt(decstring, `${ENCRYPT_KEY}`, {
    keysize: 128 / 8,
    iv: CryptoJS.enc.Hex.parse(`${ENCRYPT_IV}`),
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7,
  })
  console.log('decrypted : ' + decrypted)
  console.log('utf8 = ' + decrypted.toString(cryptojs.enc.Utf8))
}
// function hello()
// {

// }
// export {hello}
