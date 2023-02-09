const crypto = require('crypto');
const key = "12345678901234567890123456789012"

const encrypt = (string) => {
   const iv = Buffer.from(crypto.randomBytes(16));
   const cipher = crypto.createCipheriv("aes-256-ctr",
   Buffer.from(key), iv);
   
const encrypted = Buffer.concat([
    cipher.update(string), 
    cipher.final()]);

    return {iv : iv.toString('hex') ,password : encrypted.toString('hex')}
    // return encrypted.toString('hex')
}

const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv("aes-256-ctr",
    Buffer.from(key), 
    Buffer.from(encryption.iv, 'hex'));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryption.password, 'hex')),
        decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };
