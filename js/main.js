
var tileSpace = tileSpace || {};

$(document).ready(function(){

    tileSpace.tileWidth = 36;

    //init stuff - this should only run once
    tileSpace.mainCanvas = Raphael(document.getElementById("svgContainer"), 900, 500);//main canvas

    tileSpace.tiles = [];
    for (var i=0;i<12;i++){
        for (var j=0;j<12;j++){
            tileSpace.tiles.push(new Tile(i*(tileSpace.tileWidth+5), j*(tileSpace.tileWidth+5), [true, false], [false, true]))
        }
    }
});