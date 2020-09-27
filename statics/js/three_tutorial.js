import  {OrbitControls, MapControls} from './OrbitControls.js';
import * as THREE from './three.js'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// window size 바뀔 때마다 renderer size 재설정
window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})
var controls = new OrbitControls( camera, renderer.domElement);
// camera, renderer의 dom 요소로 control 생성

// create the shape
var geometry = new THREE.BoxGeometry(2, 2, 2);
var cubeMaterials = [
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("statics/imgs/5.jpg"), side: THREE.DoubleSide}), // RIGHT SIDE
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('statics/imgs/7.jpg'), side: THREE.DoubleSide}), // LEFT SIDE
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('statics/imgs/8.jpg'), side: THREE.DoubleSide}), // TOP SIDE
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('statics/imgs/5.jpg'), side: THREE.DoubleSide}), // BOTTOM SIDE
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('statics/imgs/7.jpg'), side: THREE.DoubleSide}), // FRONT SIDE
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('statics/imgs/8.jpg'), side: THREE.DoubleSide}), // BACK SIDE
]

// create a material, color or image texture
var material = new THREE.MeshFaceMaterial(cubeMaterials);
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 3;
// game logic
var update = function () {

}

// draw Scene
var render = function () {
    renderer.render(scene, camera);
}

// run game loop (update, render, repeat)
var GameLoop = function () {
    requestAnimationFrame(GameLoop);
    update();
    render();
};

GameLoop();