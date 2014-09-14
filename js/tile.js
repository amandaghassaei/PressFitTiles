
var tileSpace = tileSpace || {};

function Tile(xPos, yPos, inputs, outputs){
    this.position = [xPos, yPos];
    this.inputs = inputs;
    this.outputs = outputs;
    this.color = true;

    this.render2D();
}

Tile.prototype.render2D = function(){
    if (this.shape2D){
        this.shape2D.remove();
        console.log("something is going wrong here");
    }

    var rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth2D, tileSpace.tileWidth2D);
    rect.attr({"stroke":"#000", "opacity":"0.6"});
    this.setTileColor(this.color, rect);

    //states
    this.stateIndicatorText = [];
    for (var i=0;i<4;i++){
        var state;
        if (i<2) state = this.outputs[i];
        else state = this.inputs[i-2];
        this.addInputsOutputs(state, i);
    }

    var self = this;
    rect.click(function(){
        self.color = !self.color;
        self.setTileColor(self.color, rect);
    });

    this.shape2D = rect;
};

Tile.prototype.addArrow = function(){

};

Tile.prototype.addInputsOutputs = function(state, num){

    var spacer = 40;
    var indicator = this.drawTriangle([this.position[0]+spacer, this.position[1]],
        [this.position[0]+tileSpace.tileWidth2D/2 ,this.position[1]+tileSpace.tileWidth2D/5],
        [this.position[0]+tileSpace.tileWidth2D-spacer, this.position[1]]);
    indicator.transform('r ' + (-90*num) + ", " + (this.position[0]+tileSpace.tileWidth2D/2) + ' , ' + (this.position[1]+tileSpace.tileWidth2D/2));
    indicator.attr({"opacity":"0.9"});

    var bBox = indicator.getBBox();

    var text = "0";
    if (state) text = "1";

    var indicatorText = tileSpace.mainCanvas.text(bBox['x']+bBox['width']/2,bBox['y']+bBox['height']/2, text).attr({'font-size':12});
    this.set2DAppearanceForState(state, indicator, indicatorText);

//    bind events to indicators
    var self = this;
    if (num<2){
        indicator.click(function(){
            self.changeOutputState(indicator, indicatorText, num);
        });
    }
};

Tile.prototype.changeOutputState = function(indicator, indicatorText, num){
    var currentState = this.outputs[num];
    this.set2DAppearanceForState(!currentState, indicator, indicatorText);
    this.outputs[num] = !currentState;
};

Tile.prototype.setTileColor = function(state, el){
    if (state){
        el.attr({"fill":"#00f"});
    } else {
        el.attr({"fill":"#f00"});
    }
};

Tile.prototype.set2DAppearanceForState = function(state, indicator, indicatorText){
    if (state){
        indicatorText.attr({"stroke":"#000", "text":"1"});
        indicator.attr({"fill":"#fff", "stroke":"#fff"});
    } else {
        indicatorText.attr({"stroke":"#fff", "text":"0"});
        indicator.attr({"fill":"#000", "stroke":"#000"});
    }
};

Tile.prototype.drawTriangle = function(vert1, vert2, vert3) {
    return tileSpace.mainCanvas.path('M '+vert1[0] + ' ' + vert1[1] + ' L ' + vert2[0] + ' ' + vert2[1] + ' L ' + vert3[0] + ' ' + vert3[1] + ' Z');
};

Tile.prototype.changeColor = function(color){
    this.color = color;
    this.shape2D.attr("fill", this.color);
};