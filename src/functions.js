'use strict'

var crypto = require('crypto');
var ecc = require('eccrypto');
var secp256k1 = require('secp256k1');

module.exports = {
	random(size)
	{
		return crypto.randomBytes(size);
	},
	hash(data)
	{
		return sha256(sha256(this.serialize(data)));
		function sha256(data)
		{
			return crypto.createHash('sha256').update(data).digest();
		}
	},
	hmac(key, data)
	{
		return sha256(key, sha256(key, this.serialize(data)));
		function sha256(key, data)
		{
			return crypto.createHmac('sha256', key).update(data).digest();
		}
	},
	encrypt(key, data)
	{
		var cipher = crypto.createCipher('aes-256-cbc', key);
		return Buffer.concat([cipher.update(this.serialize(data)), cipher.final()]);
	},
	decrypt(key, data)
	{
		data = this.serialize(data);
		var cipher = crypto.createDecipher('aes-256-cbc', key);
		return Buffer.concat([cipher.update(this.serialize(data)), cipher.final()]);
	},
	sign(priv, data)
	{
		return secp256k1.sign(this.hash(data), priv).signature;
	},
	verify(pub, data, sig)
	{
		data = this.serialize(data);
		return secp256k1.verify(pub, sig, this.hash(data));
	},
	privateKey()
	{
		return this.random(32);
	},
	publicKey(priv)
	{
		return ecc.getPublic(priv);
	},
	sharedKey(pub, priv)
	{
		return secp256k1.ecdh(pub, priv);
	},
	serialize(data)
	{
		return Buffer.from(JSON.stringify(data));
	},
	deserialize(data)
	{
		return JSON.parse(data);
	},
};