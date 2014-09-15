
var tileSpace = tileSpace || {};

function CornerTile(xPos, yPos, outputs){//corner tile has no inputs
    Tile.apply(this, [xPos, yPos, [false, false], outputs]);
}
CornerTile.prototype = new Tile();//subclass of Tile

CornerTile.prototype.render2D = function(){
    var rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth2D-3*tileSpace.tileWidth2D/10, tileSpace.tileWidth2D-3*tileSpace.tileWidth2D/10);
    this.commonRender2D(rect);
};