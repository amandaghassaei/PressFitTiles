
var tileSpace = tileSpace || {};

function Tile(xPos, yPos, inputs, outputs){
    this.position = [xPos, yPos];
    this.inputs = inputs;
    this.outputs = outputs;
    this.color = "#00f";

    this.render();
}

Tile.prototype.render = function(){
    if (this.rect){
        this.rect.remove();
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

    this.rect = rect;
};

Tile.prototype.addIndicator = function(state, num){
    var color = "#000";
    if (state) color = "#fff";
    var space = 4;
    var indicator;
    switch (num){
        case 0:
            indicator = tileSpace.mainCanvas.rect(this.position[0], this.position[1]+space, 5, tileSpace.tileWidth-2*space);
            break;
        case 1:
            indicator = tileSpace.mainCanvas.rect(this.position[0]+space, this.position[1]+tileSpace.tileWidth-5, tileSpace.tileWidth-2*space, 5);
            break;
        case 2:
            indicator = tileSpace.mainCanvas.rect(this.position[0]+tileSpace.tileWidth-5, this.position[1]+space, 5, tileSpace.tileWidth-2*space);
            break;
        case 3:
            indicator = tileSpace.mainCanvas.rect(this.position[0]+4, this.position[1], tileSpace.tileWidth-8, 5);
            break;
    }

    indicator.attr({"stroke":"#00f", "fill":color, "opacity":"0.9"});
    return indicator;
};

Tile.prototype.changeColor = function(color){
    this.color = color;
    this.renderedRect.attr("fill", this.color);
};