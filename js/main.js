
var tileSpace = tileSpace || {};

$(document).ready(function(){

    tileSpace.tileWidth = 26;

    //init stuff - this should only run once
    tileSpace.mainCanvas = Raphael(document.getElementById("svgContainer"), 900, 500);//main canvas

    tileSpace.tiles = [];
    for (var i=0;i<15;i++){
        for (var j=0;j<15;j++){
            tileSpace.tiles.push(new Tile(i*30, j*30, [true, false, false, true]))
        }
    }
});