
var tileSpace = tileSpace || {};

$(document).ready(function(){

    tileSpace.tileWidth2D = 150;

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


    tileSpace.mainCanvas = Raphael(document.getElementById("2dDesigner"), 900, 500);//main canvas

    var spacing = 35;
    tileSpace.tiles = [];
    for (var i=0;i<2;i++){
        var input1 = false;
        if (i>0) input1 = true;
        for (var j=0;j<2;j++){
            var input2 = false;
            if (j>0) input2 = true;
            tileSpace.tiles.push(new Tile(i*(tileSpace.tileWidth2D+spacing), j*(tileSpace.tileWidth2D+spacing), [input1, input2], [input1^input2, input1&input2]));
        }
    }

    for (i=0;i<2;i++){
        input1 = false;
        if (i>0) input1 = true;
        for (j=0;j<1;j++){
            tileSpace.tiles.push(new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+2*tileSpace.tileWidth2D, j*(tileSpace.tileWidth2D+spacing), [input1], [input1^1, input1&1], true))
        }
        for (j=1;j<2;j++){
            tileSpace.tiles.push(new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+2*tileSpace.tileWidth2D, j*(tileSpace.tileWidth2D+spacing), [input1], [input1^1, input1&1], false))
        }
    }

    tileSpace.tiles.push(new CornerTile(tileSpace.tileWidth2D*4+spacing*5, 0, [true, true]));

    tileSpace.downloadSVG = function(){
        //72 px per inch
        var svg = tileSpace.mainCanvas.toSVG();
        var link = document.createElement('a');
        link.download = 'PressFitConstruction.svg';
        link.type = 'image/svg+xml';
        blob = new Blob([svg], {"type": "image/svg+xml"});
        link.href = (window.URL || webkitURL).createObjectURL(blob);
        link.click();
    };
});