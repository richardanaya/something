var Network = function(worldURL){
  this.worldURL = worldURL;
  this.owner = null;
  this.peers = [];
}

Network.prototype.join = function(){
  var _this = this;
  $.getJSON(this.worldURL, function(world) {
    _this.owner = KEYUTIL.getKey(world.owner);
    var webrtc = new $xirsys.simplewebrtc(); //add secure server stuff here?
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

    webrtc.on('createdPeer', function (peer) {
      _this.peers.push(peer);
    });

    webrtc.on("channelMessage", function(peer, channel, data) {
        processMessage(data.type, data.payload)
    });

    function distributeMessage(type,message){
     processMessage(type,message)
     webrtc.ref.sendDirectlyToAll("",type,message)
    }

    function processMessage(type,message){
     mesh.position.x += parseFloat(message.split(",")[0]);
    }
  })
}
