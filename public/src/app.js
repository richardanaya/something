var network = new Network("http://shvdow.herokuapp.com/world.json");
network.join();

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
  network.sendMessageToAll("chat", "1,0,0");
}
if(Key.isDown(Key.LEFT_ARROW)){
  network.sendMessageToAll("chat", "-1,0,0");
}
requestAnimationFrame( animate );

mesh.rotation.x += 0.005;
mesh.rotation.y += 0.01;

renderer.render( scene, camera );

}
