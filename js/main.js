
var tileSpace = tileSpace || {};

$(document).ready(function(){

    tileSpace.tileWidth = 36;

    //init stuff - this should only run once
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    var render = function () {
        requestAnimationFrame(render);

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;

        renderer.render(scene, camera);
    };

    render();





//    tileSpace.mainCanvas = Raphael(document.getElementById("svgContainer"), 900, 500);//main canvas
//
//    tileSpace.tiles = [];
//    for (var i=0;i<12;i++){
//        for (var j=0;j<12;j++){
//            tileSpace.tiles.push(new Tile(i*(tileSpace.tileWidth+5), j*(tileSpace.tileWidth+5), [true, false], [false, true]))
//        }
//    }
});