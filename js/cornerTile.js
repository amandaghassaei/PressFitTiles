
var tileSpace = tileSpace || {};

function CornerTile(xPos, yPos, outputs){
    //corner tile has no inputs
    Tile.apply(this, [xPos, yPos, null, outputs]);
}
CornerTile.prototype = new Tile();//subclass of Tile

CornerTile.prototype.render2D = function(){
    if (this.shape2D){
        this.shape2D.remove();
        console.log("something is going wrong here");
    }
    var rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth, tileSpace.tileWidth);
    rect.attr({"stroke":"#000", "fill":this.color, "opacity":"0.6"});

    //states
    this.stateIndicators = [];
    for (var i=0;i<4;i++){
        var state;
        if (i<2) state = this.inputs[i];
        else state = this.outputs[3-i];
        this.stateIndicators.push(this.addIndicator(state, i));
    }

    //bind events to rect

    this.shape2D = rect;
};