var Network = function(worldURL){
  this.worldURL = worldURL;
  this.owner = null;
  this.peers = [];
}

Network.prototype.sendMessageToAll = function(type,message){
   this.processMessage(null,type,message)
   this.webrtc.ref.sendDirectlyToAll("",type,message)
}

Network.prototype.processMessage = function(peer,type,message){
  mesh.position.x += parseFloat(message.split(",")[0]);
}

Network.prototype.onConnected = function(peer){

}

Network.prototype.onPeerAdded = function(peer){
  this.peers.push(peer);
}

Network.prototype.join = function(){
  var _this = this;
  $.getJSON(this.worldURL, function(world) {
    _this.owner = KEYUTIL.getKey(world.owner);
    var webrtc = new $xirsys.simplewebrtc(); //add secure server stuff here?
    _this.webrtc = webrtc;
    webrtc.connect({},
        {
            // we don't do video
            localVideoEl: '',
            remoteVideosEl: '',
            // dont ask for camera access
            autoRequestMedia: false,
            // dont negotiate media
            receiveMedia: {
                mandatory: {
                    OfferToReceiveAudio: false,
                    OfferToReceiveVideo: false
                }
            }
        }
    );

    var room = world.room
    $.get(world.tokenURL, function(token) {
        webrtc.joinRoom(room,token);
    })
    .error(function(xhr) {
        console.error(xhr);
    })

    webrtc.on('joinedRoom', _this.onConnected.bind(_this));

    webrtc.on('createdPeer', _this.onPeerAdded.bind(_this));

    webrtc.on("channelMessage", _this.processMessage.bind(_this) );
  })
}
