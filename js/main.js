
var tileSpace = tileSpace || {};

$(document).ready(function(){

    tileSpace.tileWidth2D = 150;

    tileSpace.render3d = function(){
        requestAnimationFrame(tileSpace.render3d);
        tileSpace.renderer.render(tileSpace.scene, tileSpace.camera);
    };

    var init3dStuff = function(width, height){
        tileSpace.scene = new THREE.Scene();
        tileSpace.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

        tileSpace.renderer = new THREE.WebGLRenderer();
        tileSpace.renderer.setSize(width, height);
        $("#3dRenderer").append(tileSpace.renderer.domElement);

        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        tileSpace.scene.add(cube);

        tileSpace.camera.position.z = 5;
        tileSpace.render3d();
    };

    var draw2DTiles = function(){
        var spacing = 32;
        var tiles = [];
        for (var i=0;i<2;i++){
            var input1 = (i>0);
            for (var j=0;j<2;j++){
                var input2 = (j>0);
                tiles.push(new Tile(i*(tileSpace.tileWidth2D+spacing), j*(tileSpace.tileWidth2D+spacing), [input1, input2], [input1^input2, input1&input2]));
            }
        }
        for (i=0;i<2;i++){
            input1 = i>0;
            for (j=0;j<1;j++){
                tiles.push(new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+43*tileSpace.tileWidth2D/20, j*(tileSpace.tileWidth2D+spacing), [input1], [input1^1, input1&1], true))
            }
            for (j=1;j<2;j++){
                tiles.push(new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+2*tileSpace.tileWidth2D, j*(tileSpace.tileWidth2D+spacing)+3*tileSpace.tileWidth2D/10, [input1], [input1^1, input1&1], false))
            }
        }
        tiles.push(new CornerTile(tileSpace.tileWidth2D*4+spacing*6, 13*tileSpace.tileWidth2D/10+spacing, [true, true]));
        tileSpace.mainCanvas.text(165, tileSpace.tileWidth2D*2+spacing+20, "regular tiles have 2 inputs").attr({"font-size":15});
        tileSpace.mainCanvas.text(560, tileSpace.tileWidth2D*2+spacing+20, "edge tiles have 1 input").attr({"font-size":15});
        tileSpace.mainCanvas.text(845, tileSpace.tileWidth2D+spacing+20, "corner tiles\nhave 0 inputs").attr({"font-size":15});
        return tiles;
    };

    //init stuff - this should only run once
    tileSpace.mainCanvas = Raphael(document.getElementById("2dDesigner"), 900, 370);//interactive 2d designer
    tileSpace.tiles = draw2DTiles();
    tileSpace.renderParts();
    init3dStuff(900.0, 700.0);

});

