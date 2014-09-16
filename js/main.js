
var tileSpace = tileSpace || {};

$(document).ready(function(){

    tileSpace.tileWidth2D = 150;
    tileSpace.tileGridSize = 20;

    function render() {
        tileSpace.renderer.render(tileSpace.scene, tileSpace.camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        tileSpace.controls.update();
    }

    var init3dStuff = function(width, height){

        tileSpace.scene = new THREE.Scene();
        tileSpace.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

        tileSpace.scene.fog = new THREE.Fog(0xffffff, 10, 60);
        tileSpace.scene.fog.color.setHSL( 0.51, 0.6, 0.6 );

        tileSpace.renderer = new THREE.WebGLRenderer();
        tileSpace.renderer.setSize(width, height);
        tileSpace.renderer.setClearColor(0xeeeeee, 1);
        $("#3dRenderer").append(tileSpace.renderer.domElement);

        tileSpace.render3DStructure();

        tileSpace.camera.position.z = 10;
        tileSpace.camera.position.x = 10;

        var controls = new THREE.TrackballControls(tileSpace.camera, tileSpace.renderer.domElement);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.addEventListener('change', render);

        tileSpace.controls = controls;

        render();
        animate();
    };

    var draw2DTiles = function(){
        var spacing = 32;
        var tiles = {};
        for (var i=0;i<2;i++){
            var input1 = (i>0);
            for (var j=0;j<2;j++){
                var input2 = (j>0);
                var string = "tile" + (2*i+j+1);
                tiles[string] = (new Tile(i*(tileSpace.tileWidth2D+spacing), j*(tileSpace.tileWidth2D+spacing), [input1, input2], [input1^input2, input1&input2]));
            }
        }
        for (i=0;i<2;i++){
            input1 = i>0;
            for (j=0;j<1;j++){
                string = "edgeTile" + (2*i+j+1);
                tiles[string] = (new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+43*tileSpace.tileWidth2D/20, j*(tileSpace.tileWidth2D+spacing), [input1], [input1^1, input1&1], true))
            }
            for (j=1;j<2;j++){
                string = "edgeTile" + (2*i+j+1);
                tiles[string] = (new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+2*tileSpace.tileWidth2D, j*(tileSpace.tileWidth2D+spacing)+3*tileSpace.tileWidth2D/10, [input1], [input1^1, input1&1], false))
            }
        }
        tiles["corner"] = (new CornerTile(tileSpace.tileWidth2D*4+spacing*6, 13*tileSpace.tileWidth2D/10+spacing, [false, true]));
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

