
var tileSpace = tileSpace || {};

var tileGridNum = 10;
var tileGridDim = 1;
var tileSpacing = tileGridDim/20;

var tileOpacity = 0.5;

var connectionStorage = [];

tileSpace.render3DStructure = function(){
    for (var z=0;z<tileGridNum;z++){
        for (var y=0;y<tileGridNum;y++){
            for (var x=0;x<tileGridNum;x++){

                if (z%2 == 0){//even layers
                    if (x==0 && y==0){
                        drawCorner3D(z);//add corner piece
                        continue;
                    }
                    if (x%2 == 1){
                        if (z == 0){
                            drawEdge3D(x, y, z, 'y', false);
                        } else {
                            drawTile3D(x, y, z, 'y');
                        }
                    } else {
                        if (y == 0){
                            drawEdge3D(x, y, z, 'z', false);
                        } else {
                            drawTile3D(x, y, z, 'z');
                        }
                    }
                    if (y%2 == 1){
                        if (z == 0){
                            drawEdge3D(x, y, z, 'x', false);
                        } else {
                            drawTile3D(x, y, z, 'x');
                        }
                    } else {
                        if (x == 0){
                            drawEdge3D(x, y, z, 'z', false);
                        }
                    }
                } else {//odd layers
                    if (x%2 == 1){
                        if (y==0){
                            drawEdge3D(x, y, z, 'x', true);
                        }
                    } else {
                        if (y == 0){
                            drawEdge3D(x, y, z, 'y', true);
                        }
                    }
                    if (y%2 == 1){
                        if (z == 0){
                        } else {
                            drawTile3D(x, y, z, 'z');
                        }
                    }
                }
            }
        }
    }
};


var drawCorner3D = function(z){
    var geometry = new THREE.BoxGeometry(tileGridDim/2-tileSpacing,tileGridDim/2-tileSpacing,0.05);
    var material = new THREE.MeshBasicMaterial({color: getRandomColor(), transparent:true, opacity:tileOpacity});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set((tileGridDim/2-tileSpacing)/2, (tileGridDim/2-tileSpacing)/2, tileGridDim*z/2);
    tileSpace.scene.add(cube);
};

var drawEdge3D = function(x, y, z, normal, vertical){
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

var drawTile3D = function(x, y, z, normal){
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