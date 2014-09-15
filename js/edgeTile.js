
var tileSpace = tileSpace || {};

function EdgeTile(xPos, yPos, inputs, outputs, isVert){
    //corner tile has only 1 input
    if (inputs.length > 1) console.log("there is a problem here");

    this.isVert = isVert;
    if (isVert){
        inputs.push(false);
        Tile.apply(this, [xPos, yPos, inputs, outputs]);
        return;
    }
    inputs.unshift(false);
    Tile.apply(this, [xPos, yPos, inputs, outputs]);
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

EdgeTile.prototype.drawSide = function(width, exporter, notchWidth, chamferLength, state, num){
    switch (num){
        case 0:
            if (!this.isVert) break;
            else {
                return this.drawIncompleteSide(width, exporter, notchWidth, chamferLength, state, true);
            }
            break;
        case 1:
            if (this.isVert) break;
            else {
                return this.drawIncompleteSide(width, exporter, notchWidth, chamferLength, state, false);
            }
            break;
        case 2:
            if (this.isVert){
                return this.drawIncompleteSide(width, exporter, notchWidth, chamferLength, state, false);
            } else {
                return this.drawStraightEdge(width, exporter, notchWidth);
            }
            break;
        case 3:
            if (this.isVert){
                return this.drawStraightEdge(width, exporter, notchWidth);
            } else {
                return this.drawIncompleteSide(width, exporter, notchWidth, chamferLength, state, true);
            }
            break;
    }
    //default is to draw normally
    return this.drawRegularNotch(width, exporter, notchWidth, chamferLength, state);
};

EdgeTile.prototype.drawStraightEdge = function(width, exporter, notchWidth){
    var offset = (width-notchWidth)/4;
    path = 'M 0 ' + offset;//start at 0, offset
    path += ' H ' + width;//move horizontally
    return exporter.path(path);
};

