
var tileSpace = tileSpace || {};

var tileGridNum = 20;
var tileGridDim = 1;

var connectionStorage = [];

tileSpace.render3DStructure = function(){
    for (var z=0;z<tileGridNum;z++){
        for (var y=0;y<tileGridNum;y++){
            for (var x=0;x<tileGridNum;x++){

                if (z%2 == 0){
                    if (x==0 && y==0){
                        drawCorner3D(z);//add corner piece
                        continue;
                    }
                    if (x%2 == 1){
                        if (y == 0){
                            drawEdge3D(x, y, z, 'y');
                        }
                    }


                }


            }
        }
    }
};


var drawCorner3D = function(z){
    var geometry = new THREE.BoxGeometry(tileGridDim/2,tileGridDim/2,0.05);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent:true, opacity:0.3});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, tileGridDim*z);
    tileSpace.scene.add(cube);
};

var drawEdge3D = function(x, y, z, normal){
    var geometry;
    if (normal == 'x'){
        geometry = new THREE.BoxGeometry(0.05, tileGridDim/2,tileGridDim);
    } else if (normal == 'y'){
        geometry = new THREE.BoxGeometry(tileGridDim, tileGridDim/2, 0.05);
    } else {
        geometry = new THREE.BoxGeometry(tileGridDim/2,tileGridDim/2,0.05);
    }
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent:true, opacity:0.3});
    var cube = new THREE.Mesh(geometry, material);
    if (normal == 'x'){
        cube.position.set(tileGridDim/2, tileGridDim/2, tileGridDim*z);
    } else if (normal == 'y'){
        cube.position.set((y%2)*tileGridDim, 0, tileGridDim*z);
    } else {
        cube.position.set(tileGridDim/2, tileGridDim/2, tileGridDim*z);
    }
    tileSpace.scene.add(cube);
};

var drawTile3D = function(){

};