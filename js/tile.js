
var tileSpace = tileSpace || {};

function Tile(xPos, yPos, inputs, outputs){
    this.position = [xPos, yPos];
    this.inputs = inputs;
    this.outputs = outputs;
    this.color = "#00f";

    this.render2D();
}

Tile.prototype.render2D = function(){
    if (this.shape2D){
        this.shape2D.remove();
        console.log("something is going wrong here");
    }
    var rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth2D, tileSpace.tileWidth2D);
    rect.attr({"stroke":"#000", "fill":this.color, "opacity":"0.6"});

    //states
    this.stateIndicators = [];
    for (var i=0;i<4;i++){
        var state;
        if (i<2) state = this.outputs[i];
        else state = this.inputs[i-2];
        this.stateIndicators.push(this.addConnectionType(state, i));
    }

    this.shape2D = rect;
};

Tile.prototype.addArrow = function(){

}

Tile.prototype.addConnectionType = function(state, num){
    var color = "#000";
    var text = "0";
    var textColor = "#fff";
    if (state) {
        color = "#fff";
        text = "1";
        textColor = "#000";
    }

    var spacer = 40;
    var indicator = this.drawTriangle([this.position[0]+spacer, this.position[1]],
        [this.position[0]+tileSpace.tileWidth2D/2 ,this.position[1]+tileSpace.tileWidth2D/5],
        [this.position[0]+tileSpace.tileWidth2D-spacer, this.position[1]], color);

    indicator.transform('r ' + (-90*num) + ", " + (this.position[0]+tileSpace.tileWidth2D/2) + ' , ' + (this.position[1]+tileSpace.tileWidth2D/2));
    indicator.attr({"stroke":color, "fill":color, "opacity":"0.9"});

    var bBox = indicator.getBBox();
    console.log(bBox);
    tileSpace.mainCanvas.text(bBox['x']+bBox['width']/2,bBox['y']+bBox['height']/2, text).attr({'stroke':textColor, 'font-size':12});
//    bind events to indicators

    return indicator;
};

Tile.prototype.drawTriangle = function(vert1, vert2, vert3) {
    return tileSpace.mainCanvas.path('M '+vert1[0] + ' ' + vert1[1] + ' L ' + vert2[0] + ' ' + vert2[1] + ' L ' + vert3[0] + ' ' + vert3[1] + ' Z');
};

Tile.prototype.changeColor = function(color){
    this.color = color;
    this.shape2D.attr("fill", this.color);
};