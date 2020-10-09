import  {OrbitControls, MapControls} from './OrbitControls.js';
import * as THREE from './three.js'
import css from '../css/main.css'
import ObjectLoader from '../../src/loaders/ObjectLoader.js'
import {GLTFLoader} from '../../src/loaders/GLTFLoader.js'

var scene = new THREE.Scene();
// 1. 장면 생성
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 2. 카메라 생성

var renderer = new THREE.WebGLRenderer(); // 랜더링하는데 그래픽카드를 사용하도록 WebGLRender 생성
// 3. 랜더러 생성
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 설정한 랜더러 body 에 추가

// window size 바뀔 때마다 renderer size 재설정
window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})
var controls = new OrbitControls( camera, renderer.domElement);
// camera, renderer의 dom 요소로 control 추가

<<<<<<< HEAD
/***  create the shape  ***/
=======
var loader = new GLTFLoader();
loader.load(
    'statics/models/skull_downloadable/scene.gltf',
    function( gltf ){
        scene.add( gltf.scene );
    }

);

// create the shape
>>>>>>> 8d18da9ec861c66b235e2add357978a28b770493
var geometry = new THREE.BoxGeometry(2, 2, 2);
// 크기 설정
var cubeMaterials = [ 
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("statics/imgs/5.jpg"), side: THREE.DoubleSide}), // RIGHT SIDE
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('statics/imgs/7.jpg'), side: THREE.DoubleSide}), // LEFT SIDE
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('statics/imgs/8.jpg'), side: THREE.DoubleSide}), // TOP SIDE
    new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load('statics/imgs/5.jpg'), side: THREE.DoubleSide}), // BOTTOM SIDE
    new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load('statics/imgs/7.jpg'), side: THREE.DoubleSide}), // FRONT SIDE
    new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load('statics/imgs/8.jpg'), side: THREE.DoubleSide}), // BACK SIDE
]

// create a material, color or image texture
<<<<<<< HEAD
var cube = new THREE.Mesh(geometry, cubeMaterials);
scene.add(cube);
// 설정한 material 추가

// 이런식으로 랜더러, 카메라, 컨트롤을 추가한 장면에 cube 와 같은 객체를 만들어 추가해준다.

// floor
var floorGeometry = new THREE.CubeGeometry( 10, 1, 10 );
var floorMaterial = new THREE.MeshLambertMaterial( {
    map: new THREE.TextureLoader( ).load('statics/imgs/floor.jpg'),
    side: THREE.DoubleSide
});
var floorCube = new THREE.Mesh( floorGeometry, floorMaterial);
floorCube.position.y = -5;
scene.add(floorCube);

// ceil
var ceilGeometry = new THREE.CubeGeometry( 10, 1, 10 );
var ceilMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader( ).load('statics/imgs/ceil.jpg'),
    side: THREE.DoubleSide
});
var ceilCube = new THREE.Mesh( ceilGeometry, ceilMaterial );
ceilCube.position.y = 5;
scene.add(ceilCube);

// Left Wall
var leftWallGeometry = new THREE.CubeGeometry( 1, 10, 10);
var leftWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader( ).load('statics/imgs/wall.jpg'),
    side: THREE.DoubleSide
});
var leftWallCube = new THREE.Mesh( leftWallGeometry, leftWallMaterial );
leftWallCube.position.x = -5;
scene.add(leftWallCube);

// Right Wall
var rightWallGeometry = new THREE.CubeGeometry( 1, 10, 10 );
var rightWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('statics/imgs/wall.jpg'),
    side: THREE.DoubleSide
});
var rightWallCube = new THREE.Mesh( rightWallGeometry, rightWallMaterial );
rightWallCube.position.x = 5;
scene.add(rightWallCube);
=======
// var cube = new THREE.Mesh(geometry, cubeMaterials);
// scene.add(cube);
// // 설정한 material 추가


// // floor
// var floorGeometry = new THREE.CubeGeometry( 10, 1, 10 );
// var floorMaterial = new THREE.MeshLambertMaterial( {
//     map: new THREE.TextureLoader( ).load('statics/imgs/floor.jpg'),
//     side: THREE.DoubleSide
// });
// var floorCube = new THREE.Mesh( floorGeometry, floorMaterial);
// floorCube.position.y = -5;
// scene.add(floorCube);

// // ceil
// var ceilGeometry = new THREE.CubeGeometry( 10, 1, 10 );
// var ceilMaterial = new THREE.MeshLambertMaterial({
//     map: new THREE.TextureLoader( ).load('statics/imgs/ceil.jpg'),
//     side: THREE.DoubleSide
// });
// var ceilCube = new THREE.Mesh( ceilGeometry, ceilMaterial );
// ceilCube.position.y = 5;
// scene.add(ceilCube);

// // Left Wall
// var leftWallGeometry = new THREE.CubeGeometry( 1, 10, 10);
// var leftWallMaterial = new THREE.MeshLambertMaterial({
//     map: new THREE.TextureLoader( ).load('statics/imgs/wall.jpg'),
//     side: THREE.DoubleSide
// });
// var leftWallCube = new THREE.Mesh( leftWallGeometry, leftWallMaterial );
// leftWallCube.position.x = -5;
// scene.add(leftWallCube);

// // Right Wall
// var rightWallGeometry = new THREE.CubeGeometry( 1, 10, 10 );
// var rightWallMaterial = new THREE.MeshLambertMaterial({
//     map: new THREE.TextureLoader().load('statics/imgs/wall.jpg'),
//     side: THREE.DoubleSide
// });
// var rightWallCube = new THREE.Mesh( rightWallGeometry, rightWallMaterial );
// rightWallCube.position.x = 5;
// scene.add(rightWallCube);
>>>>>>> 8d18da9ec861c66b235e2add357978a28b770493





camera.position.z = 3;

var ambientLight = new THREE.AmbientLight( 0xffffff, 2.0 );
scene.add(ambientLight);
// light 추가

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
directionalLight.position.set( 0, 1, 0 );
scene.add(directionalLight);
// 이런식으로 광원의 위치를 설정해줄 수도 있다.

var spotLight = new THREE.SpotLight( 0xff45f6, 25 );
spotLight.position.set( 0, 3, 0);
scene.add( spotLight );

var light1 = new THREE.PointLight( 0xFF0040, 1.2, 50 );// 색, 강도, 거리
scene.add(light1); 

var light2 = new THREE.PointLight( 0x0040FF, 1.1, 50 );// 색, 강도, 거리
scene.add(light2); 

var light3 = new THREE.PointLight( 0x80FF80, 1.5, 50 );// 색, 강도, 거리
scene.add(light3); 


// game logic
var update = function () {
    var time = Date.now() * 0.0005;
    light1.position.x = Math.sin( time * 0.7) * 30;
    light1.position.y = Math.cos( time * 0.5) * 40;
    light1.position.z = Math.cos( time * 0.3) * 30;

    light2.position.x = Math.sin( time * 0.3) * 30;
    light2.position.y = Math.cos( time * 0.5) * 40;
    light2.position.z = Math.cos( time * 0.7) * 30;

    light3.position.x = Math.sin( time * 0.7) * 30;
    light3.position.y = Math.cos( time * 0.5) * 40;
    light3.position.z = Math.cos( time * 0.3) * 30;
    // 시간의 흐름에 따라 빛이 달라짐
}

// draw Scene
var render = function () {
    renderer.render(scene, camera);
}

// run game loop (update, render, repeat)
var GameLoop = function () {
    requestAnimationFrame(GameLoop);
    // 원래는 setInterval로 간격정해서 해주어야 하는데 이는 CPU 사용량과 나쁜 성능을 초래할 수 있기 떄문에 
    // 브라우저에서 지원하는 requestAnimationFrame 함수를 사용한다.
    update(); // 애니메이션 추가
    render(); // 랜더러에게 랜더링 요청  
};

GameLoop();