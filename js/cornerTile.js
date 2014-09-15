
var tileSpace = tileSpace || {};

function CornerTile(xPos, yPos, outputs){//corner tile has no inputs
    Tile.apply(this, [xPos, yPos, [false, false], outputs]);
}
CornerTile.prototype = new Tile();//subclass of Tile

CornerTile.prototype.render2D = function(){
    var rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth2D-3*tileSpace.tileWidth2D/10, tileSpace.tileWidth2D-3*tileSpace.tileWidth2D/10);
    this.commonRender2D(rect);
};

CornerTile.prototype.drawSide = function(width, exporter, notchWidth, chamferLength, state, num){
    switch (num){
        case 0:
            return this.drawIncompleteSide(width, exporter, notchWidth, chamferLength, state, true);
        case 1:
            return this.drawIncompleteSide(width, exporter, notchWidth, chamferLength, state, false);
        case 2:
            return this.drawStraightEdge(width, exporter, notchWidth, false);
        case 3:
            return this.drawStraightEdge(width, exporter, notchWidth, true);
    }
    return null;
};

CornerTile.prototype.drawStraightEdge = function(width, exporter, notchWidth, side){
    var offset = (width-notchWidth)/4;
    var path;
    if (side) path = 'M 0 ' + offset;//start at 0, offset
    else path = 'M ' + offset + ' ' + offset;//start at 0, offset
    if (side) path += ' H ' + (width-offset);//move horizontally
    else path += ' H ' + width;//move horizontally
    return exporter.path(path);
};

