var Identity = function(ident){
  this.public = KEYUTIL.getKey(ident.public);
  this.private = KEYUTIL.getKey(ident.private);
}

Identity.hasCurrentIdentity = function(){
  return Identity.getCurrentIdentity() != null;
}

Identity.getCurrentIdentity = function(){
  return new Identity(Locstor.get("identity"));
}

Identity.generateCurrentIdentity = function(){
  var keyalg = "RSA";
  var keylen = 2048;
  var kp = KEYUTIL.generateKeypair(keyalg, keylen);
  var ident = {
    public: KEYUTIL.getPEM(kp.pubKeyObj),
    private: KEYUTIL.getPEM(kp.prvKeyObj,"PKCS1PRV")
  }
  Locstor.set('identity',ident)
  return new Identity(ident);
}

Identity.prototype.createSignature = function(message){
    var hashAlg = "sha1";
    return this.private.signString(message, hashAlg);
}

Identity.prototype.verifySignature = function(message,signature){
  return this.public.verifyString(message, signature);
}

Identity.prototype.encrypt = function(message){
  return this.public.encrypt(message);
}

Identity.prototype.decrypt = function(encryptedMessage){
  return this.private.decrypt(encryptedMessage);
}
