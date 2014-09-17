
var tileSpace = tileSpace || {};

var tileGridNum = 10;
var tileGridDim = 1;
var tileSpacing = tileGridDim/20;

var tileOpacity = 0.5;

var currentLayer = new Array(tileGridNum);
for (var i = 0; i < tileGridNum; i++) {
    currentLayer[i] = new Array(tileGridNum);
}

var lastLayer = new Array(tileGridNum);
for (i = 0; i < tileGridNum; i++) {
    lastLayer[i] = new Array(tileGridNum);
}


tileSpace.render3DStructure = function(){

    for (var z=0;z<tileGridNum;z++){
        for (var y=0;y<tileGridNum;y++){
            for (var x=0;x<tileGridNum;x++){
                currentLayer[x][y] = new Tile3d(x, y, z).outputs;
            }
        }
        lastLayer = currentLayer;
    }
};

function Tile3d(x, y, z){
    this.outputs = null;
    this.makeGeometry(x, y, z);
    console.log(this.outputs);
}

Tile3d.prototype.getTileForInputs = function(input1, input2){
    if (input1){
        if (input2){
            return 'tile4';
        } else {
            return 'tile3';
        }
    } else {
        if (input2){
            return 'tile2';
        } else {
            return 'tile1';
        }
    }
    return null;
};

Tile3d.prototype.getOutputsForType = function(type){
    console.log(tileSpace.tiles[type].outputs);
    return tileSpace.tiles[type].outputs;
};

Tile3d.prototype.makeGeometry = function(x, y, z){
    if (z%2 == 0){//even layers
        if (x==0 && y==0){
            this.drawCorner3D(z);//add corner piece
            this.outputs = this.getOutputsForType('corner');
            return;
        }
        if (x%2 == 1){
            if (z == 0){
                this.drawEdge3D(x, y, z, 'y', false);
                //edgeTile1 or 3
                if (currentLayer[x-1][y][0]){
                    this.outputs = this.getOutputsForType('edgeTile3');
                } else {
                    this.outputs = this.getOutputsForType('edgeTile1');
                }
            } else {
                this.drawTile3D(x, y, z, 'y');
                this.outputs = this.getOutputsForType(this.getTileForInputs(currentLayer[x-1][y][0], lastLayer[x][y][1]));
            }
        } else {
            if (y == 0){
                this.drawEdge3D(x, y, z, 'z', false);
                //edgeTile1 or 3
                if (currentLayer[x-1][y][0]){
                    this.outputs = this.getOutputsForType('edgeTile3');
                } else {
                    this.outputs = this.getOutputsForType('edgeTile1');
                }
            } else {
                this.drawTile3D(x, y, z, 'z');
                console.log(x);
                this.outputs = this.getOutputsForType(this.getTileForInputs(currentLayer[x-1][y][0], currentLayer[x][y-1][1]));
            }
        }
        if (y%2 == 1){
            if (z == 0){
                this.drawEdge3D(x, y, z, 'x', false);
                //edgeTile2 or 4
                if (currentLayer[x][y-1][1]){
                    this.outputs = this.getOutputsForType('edgeTile4');
                } else {
                    this.outputs = this.getOutputsForType('edgeTile2');
                }
            } else {
                this.drawTile3D(x, y, z, 'x');
                this.outputs = this.getOutputsForType(this.getTileForInputs(currentLayer[x][y-1][0], lastLayer[x][y][1]));
            }
        } else {
            if (x == 0){
                this.drawEdge3D(x, y, z, 'z', false);
                //edgeTile2 or 4
                if (currentLayer[x][y-1][1]){
                    this.outputs = this.getOutputsForType('edgeTile4');
                } else {
                    this.outputs = this.getOutputsForType('edgeTile2');
                }
            }
        }

    } else {//odd layers
        if (x%2 == 1){
            if (y==0){
                this.drawEdge3D(x, y, z, 'x', true);
                //edgeTile1 or 3
                if (lastLayer[x][y][1]){
                    this.outputs = this.getOutputsForType('edgeTile3');
                } else {
                    this.outputs = this.getOutputsForType('edgeTile1');
                }
            }
        } else {
            if (y == 0){
                this.drawEdge3D(x, y, z, 'y', true);
                //edgeTile2 or 4
                if (lastLayer[x][y][1]){
                    this.outputs = this.getOutputsForType('edgeTile4');
                } else {
                    this.outputs = this.getOutputsForType('edgeTile2');
                }
            }
        }
        if (y%2 == 1){
            if (z == 0){
            } else {
                this.drawTile3D(x, y, z, 'z');
                this.outputs = this.getOutputsForType(this.getTileForInputs(currentLayer[x-1][y][0], currentLayer[x][y-1][1]));
            }
        }
    }
};

Tile3d.prototype.drawCorner3D = function(z){
    var geometry = new THREE.BoxGeometry(tileGridDim/2-tileSpacing,tileGridDim/2-tileSpacing,0.05);
    var material = new THREE.MeshBasicMaterial({color: getRandomColor(), transparent:true, opacity:tileOpacity});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set((tileGridDim/2-tileSpacing)/2, (tileGridDim/2-tileSpacing)/2, tileGridDim*z/2);
    tileSpace.scene.add(cube);
};

Tile3d.prototype.drawEdge3D = function(x, y, z, normal, vertical){
    var geometry;
    if (vertical){
        if (normal == 'x'){
            geometry = new THREE.BoxGeometry(0.05, tileGridDim/2-tileSpacing, tileGridDim-2*tileSpacing);
        } else if (normal == 'y'){
            geometry = new THREE.BoxGeometry(tileGridDim/2-tileSpacing, 0.05, tileGridDim-2*tileSpacing);
        } else {
            if (y==0){
                geometry = new THREE.BoxGeometry(tileGridDim-2*tileSpacing, tileGridDim/2-tileSpacing, 0.05);
            } else {
                geometry = new THREE.BoxGeometry(tileGridDim/2-tileSpacing, tileGridDim-2*tileSpacing, 0.05);
            }
        }
    } else {
        if (normal == 'x'){
            geometry = new THREE.BoxGeometry(0.05, tileGridDim-2*tileSpacing, tileGridDim/2-tileSpacing);
        } else if (normal == 'y'){
            geometry = new THREE.BoxGeometry(tileGridDim-2*tileSpacing, 0.05, tileGridDim/2-tileSpacing);
        } else {
            if (y==0){
                geometry = new THREE.BoxGeometry(tileGridDim-2*tileSpacing, tileGridDim/2-tileSpacing, 0.05);
            } else {
                geometry = new THREE.BoxGeometry(tileGridDim/2-tileSpacing, tileGridDim-2*tileSpacing, 0.05);
            }
        }
    }
    var material = new THREE.MeshBasicMaterial({color: getRandomColor(), transparent:true, opacity:tileOpacity});
    var cube = new THREE.Mesh(geometry, material);
    if (vertical){
        if (normal == 'x'){
            cube.position.set((parseInt(x/2))*tileGridDim+tileGridDim/2, (tileGridDim/2-tileSpacing)/2, tileGridDim*z/2);
        } else if (normal == 'y'){
            cube.position.set((tileGridDim/2-tileSpacing)/2, (parseInt(x/2))*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        } else {
            if (y==0){
                cube.position.set((parseInt(x/2)-0.5)*tileGridDim+tileGridDim/2, (tileGridDim/2-tileSpacing)/2, tileGridDim*z/2);
            } else {
                cube.position.set((tileGridDim/2-tileSpacing)/2, (parseInt(y/2)-0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
            }

        }
    } else {
        if (normal == 'x'){
            cube.position.set((parseInt(x/2)-0.5)*tileGridDim+tileGridDim/2, parseInt(y/2)*tileGridDim+tileGridDim/2, tileGridDim*z/2+tileGridDim/4-tileSpacing);
        } else if (normal == 'y'){
            cube.position.set(parseInt(x/2)*tileGridDim+tileGridDim/2, (parseInt(y/2)-0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2+tileGridDim/4-tileSpacing);
        } else {
            if (y==0){
                cube.position.set((parseInt(x/2)-0.5)*tileGridDim+tileGridDim/2, (tileGridDim/2-tileSpacing)/2, tileGridDim*z/2);
            } else {
                cube.position.set((tileGridDim/2-tileSpacing)/2, (parseInt(y/2)-0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
            }

        }
    }
    tileSpace.scene.add(cube);
};

Tile3d.prototype.drawTile3D = function(x, y, z, normal){
    var geometry;
    if (normal == 'z'){
        geometry = new THREE.BoxGeometry(tileGridDim-2*tileSpacing,tileGridDim-2*tileSpacing,0.05);
    } else if (normal == 'y'){
        geometry = new THREE.BoxGeometry(tileGridDim-2*tileSpacing, 0.05, tileGridDim-2*tileSpacing);
    } else {
        geometry = new THREE.BoxGeometry(0.05, tileGridDim-2*tileSpacing, tileGridDim-2*tileSpacing);
    }
    var material = new THREE.MeshBasicMaterial({color: getRandomColor(), transparent:true, opacity:tileOpacity});
    var cube = new THREE.Mesh(geometry, material);
    if (normal == 'z'){
        if (z%2 == 0) {
            cube.position.set((parseInt(x/2)+0.5)*tileGridDim+tileGridDim/2, (parseInt(y/2)+0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        } else {
            cube.position.set((parseInt(x/2))*tileGridDim+tileGridDim/2, (parseInt(y/2))*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        }
    } else if (normal == 'y'){
        cube.position.set(parseInt(x/2)*tileGridDim+tileGridDim/2, (parseInt(y/2)-0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
    } else {
        cube.position.set((parseInt(x/2)-0.5)*tileGridDim+tileGridDim/2, parseInt(y/2)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
    }
    tileSpace.scene.add(cube);
};

var getRandomColor = function(){
    var color = "0x" + parseInt(255*Math.random()).toString(16) + parseInt(255*Math.random()).toString(16) + parseInt(255*Math.random()).toString(16);
    return parseInt(color);
}