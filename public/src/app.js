var name = "Richard"

var sigalg = "SHA1withRSA";

var sMsg = "abc";
var ident = Identity.hasCurrentIdentity()?Identity.getCurrentIdentity():Identity.generateCurrentIdentity();
var signature = ident.createSignature(sMsg)
var isValid = ident.verifySignature(sMsg,signature)
var finalMsg = ident.decrypt(ident.encrypt("hey"))

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

  var room = "default"
  $.get("/token", function(token) {
      webrtc.joinRoom(room,token);
  })
  .error(function(xhr) {
      console.error(xhr);
  })

  webrtc.on('createdPeer', function (peer) {

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

var camera, scene, renderer;
var mesh;

init();
animate();

function init() {
var screen_width = 600;
var screen_height = 400;
camera = new THREE.PerspectiveCamera( 70, screen_width / screen_height, 1, 1000 );
camera.position.z = 400;

scene = new THREE.Scene();

THREE.ImageUtils.crossOrigin = '';
var texture = THREE.ImageUtils.loadTexture('http://i.imgur.com/3tU4Vig.jpg');

var geometry = new THREE.BoxGeometry( 200, 200, 200 );
var material = new THREE.MeshBasicMaterial( { map: texture } );

mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( screen_width, screen_height );
document.body.appendChild( renderer.domElement );

}

function animate() {
if(Key.isDown(Key.RIGHT_ARROW)){
distributeMessage("chat", "1,0,0");
}
if(Key.isDown(Key.LEFT_ARROW)){
distributeMessage("chat", "-1,0,0");
}
requestAnimationFrame( animate );

mesh.rotation.x += 0.005;
mesh.rotation.y += 0.01;

renderer.render( scene, camera );

}
