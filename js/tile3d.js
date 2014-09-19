
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
};

Tile3d.prototype.getOutputsForType = function(type){
    return tileSpace.tiles[type].outputs;
};

Tile3d.prototype.getColorForType = function(type){
    if (tileSpace.tiles[type].color){
        return parseInt('0xff0000');
    }
    return parseInt('0x0000ff');
};

Tile3d.prototype.getOpacityForColor = function(color){
    if (color == parseInt('0x0000ff')){
        return 0.5;
    }
    return 0.5;
};

Tile3d.prototype.makeGeometry = function(x, y, z){
    var type;
    if (z%2 == 0){//even layers
        if (x==0 && y==0){
            type = 'corner';
            this.drawCorner3D(z, this.getColorForType(type));//add corner piece
        } else if (x==0 && y%2 == 0){//y axis
            type = 'edgeTile';
            //edgeTile2 or 4
            if (currentLayer[x][y-1][1]){
                type += '4';
            } else {
                type += '2';
            }
            this.drawEdge3D(x, y, z, this.getColorForType(type), 'z', false);
        } else if (y==0 && x%2 == 0){
            type = 'edgeTile';
            //edgeTile1 or 3
            if (currentLayer[x-1][y][0]){
                type += '3';
            } else {
                type += '1';
            }
            this.drawEdge3D(x, y, z, this.getColorForType(type), 'z', false);
        } else if (y%2==1 && z==0){
            type = 'edgeTile';
            //edgeTile2 or 4
            if (currentLayer[x][y-1][1]){
                type += '4';
            } else {
                type += '2';
            }
            this.drawEdge3D(x, y, z, this.getColorForType(type), 'x', false);
        } else if (x%2==1 && z==0){
            type = 'edgeTile';
            //edgeTile1 or 3
            if (currentLayer[x-1][y][0]){
                type += '3';
            } else {
                type += '1';
            }
            this.drawEdge3D(x, y, z, this.getColorForType(type), 'y', false);
        } else if (x%2==0 && y%2==0){
            type  = this.getTileForInputs(currentLayer[x-1][y][0], currentLayer[x][y-1][1]);
            this.drawTile3D(x, y, z, this.getColorForType(type), 'z');
        } else if (x%2==1){
            type = this.getTileForInputs(currentLayer[x-1][y][0], lastLayer[x][y][1]);
            this.drawTile3D(x, y, z, this.getColorForType(type), 'y');
        } else if (y%2==1){
            type = this.getTileForInputs(currentLayer[x][y-1][0], lastLayer[x][y][1]);
            this.drawTile3D(x, y, z, this.getColorForType(type), 'x');
        } else {
            return;
        }
    } else {//odd layers
        if (x%2 == 1 && y%2 == 0){
            if (y == 0){
                type = 'edgeTile';
//                edgeTile1 or 3
                if (lastLayer[x][y][1]){
                    type += '3';
                } else {
                    type += '1';
                }
                this.drawEdge3D(x, y, z, this.getColorForType(type), 'x', true);
            } else {
                type = this.getTileForInputs(currentLayer[x][y-1][0], lastLayer[x][y][1]);
                this.drawTile3D(x, y, z, this.getColorForType(type), 'x');
            }
        } else if (x%2 == 0 && y%2 == 1) {
            if (x == 0){
                type = 'edgeTile';
                //edgeTile2 or 4
                if (lastLayer[x][y][1]){
                    type += '4';
                } else {
                    type += '2';
                }
                this.drawEdge3D(x, y, z, this.getColorForType(type), 'y', true);
            } else {
                type = this.getTileForInputs(currentLayer[x-1][y][0], lastLayer[x][y][1]);
                this.drawTile3D(x, y, z, this.getColorForType(type), 'y');
            }
        } else if (y%2 == 1 && x%2 == 1){
            type = this.getTileForInputs(currentLayer[x-1][y][0], currentLayer[x][y-1][1]);
            this.drawTile3D(x, y, z, this.getColorForType(type), 'z');
        } else {
            return;
        }
    }
    this.outputs = this.getOutputsForType(type);
};

Tile3d.prototype.drawCorner3D = function(z, tileColor){
    var geometry = new THREE.BoxGeometry(tileGridDim/2-tileSpacing,tileGridDim/2-tileSpacing,0.05);
    var tileOpacity = this.getOpacityForColor(tileColor);
    var material = new THREE.MeshBasicMaterial({color: tileColor, transparent:true, opacity:tileOpacity});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set((tileGridDim/2-tileSpacing)/2, (tileGridDim/2-tileSpacing)/2, tileGridDim*z/2);
    tileSpace.scene.add(cube);
};

Tile3d.prototype.drawEdge3D = function(x, y, z, tileColor, normal, vertical){
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
    var tileOpacity = this.getOpacityForColor(tileColor);
    var material = new THREE.MeshBasicMaterial({color: tileColor, transparent:true, opacity:tileOpacity});
    var cube = new THREE.Mesh(geometry, material);
    if (vertical){
        if (normal == 'x'){
            cube.position.set((parseInt(x/2))*tileGridDim+tileGridDim/2, (tileGridDim/2-tileSpacing)/2, tileGridDim*z/2);
        } else if (normal == 'y'){
            cube.position.set((tileGridDim/2-tileSpacing)/2, (parseInt(y/2))*tileGridDim+tileGridDim/2, tileGridDim*z/2);
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

Tile3d.prototype.drawTile3D = function(x, y, z, tileColor, normal){
    var geometry;
    if (normal == 'z'){
        geometry = new THREE.BoxGeometry(tileGridDim-2*tileSpacing,tileGridDim-2*tileSpacing,0.05);
    } else if (normal == 'y'){
        geometry = new THREE.BoxGeometry(tileGridDim-2*tileSpacing, 0.05, tileGridDim-2*tileSpacing);
    } else {
        geometry = new THREE.BoxGeometry(0.05, tileGridDim-2*tileSpacing, tileGridDim-2*tileSpacing);
    }
    var tileOpacity = this.getOpacityForColor(tileColor);
    var material = new THREE.MeshBasicMaterial({color: tileColor, transparent:true, opacity:tileOpacity});
    var cube = new THREE.Mesh(geometry, material);
    if (normal == 'z'){
        if (z%2 == 0){
            cube.position.set((parseInt(x/2)-0.5)*tileGridDim+tileGridDim/2, (parseInt(y/2)-0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        } else {
            cube.position.set((parseInt(x/2))*tileGridDim+tileGridDim/2, (parseInt(y/2))*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        }
    } else if (normal == 'y'){
        if (z%2 == 0){
            cube.position.set(parseInt(x/2)*tileGridDim+tileGridDim/2, (parseInt(y/2)-0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        } else {
            cube.position.set((parseInt(x/2)-0.5)*tileGridDim+tileGridDim/2, (parseInt(y/2))*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        }
    } else {
        if (z%2==0){
            cube.position.set((parseInt(x/2)-0.5)*tileGridDim+tileGridDim/2, parseInt(y/2)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        } else {
            cube.position.set((parseInt(x/2))*tileGridDim+tileGridDim/2, (parseInt(y/2)-0.5)*tileGridDim+tileGridDim/2, tileGridDim*z/2);
        }
    }
    tileSpace.scene.add(cube);
};

var getRandomColor = function(){
    var color = "0x" + parseInt(255*Math.random()).toString(16) + parseInt(255*Math.random()).toString(16) + parseInt(255*Math.random()).toString(16);
    return parseInt(color);
};