
var tileSpace = tileSpace || {};

function EdgeTile(xPos, yPos, inputs, outputs, isVert){
    //corner tile has only 1 input
    if (inputs.length > 1) console.log("there is a problem here");

    this.isVert = isVert;
    if (isVert){
        Tile.apply(this, [xPos, yPos, [inputs[0], false], outputs]);
        return;
    }
    Tile.apply(this, [xPos, yPos, [false, inputs[0]], outputs]);
}
EdgeTile.prototype = new Tile();//subclass of Tile

EdgeTile.prototype.render2D = function(){
    var rect;
    if (this.isVert){
        rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth2D-3*tileSpace.tileWidth2D/10, tileSpace.tileWidth2D);
    } else {
        rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth2D, tileSpace.tileWidth2D-3*tileSpace.tileWidth2D/10);
    }
    this.commonRender2D(rect);
};


