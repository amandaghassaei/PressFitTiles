
var tileSpace = tileSpace || {};

function Tile(xPos, yPos, inputs, outputs){
    this.position = [xPos, yPos];
    this.inputs = inputs;
    this.outputs = outputs;
    this.color = !(outputs && outputs[0]);//default is lsb state

    if (xPos != null) this.render2D();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//interaction

Tile.prototype.changeOutputState = function(indicator, indicatorText, num){
    var currentState = this.outputs[num];
    this.setIndicatorColor(!currentState, indicator, indicatorText);
    this.outputs[num] = !currentState;
    tileSpace.renderParts();
};

Tile.prototype.changeTileColor = function(rect){
    this.color = !this.color;
    this.setTileColor(this.color, rect);
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//render2D

Tile.prototype.commonRender2D = function(rect){
    if (this.shape2D){
        this.shape2D.remove();
        console.log("something is going wrong here");
    }

    rect.attr({"stroke":"#000", "opacity":"0.6"});
    this.setTileColor(this.color, rect);

    //inputs/outputs
    for (var i=0;i<4;i++){
        var state;
        if (i<2) state = this.outputs[i];
        else state = this.inputs[i-2];
        if (i == 2){
            if (rect.getBBox()["height"] < tileSpace.tileWidth2D) continue;
        } else if (i == 3){
            if (rect.getBBox()["width"] < tileSpace.tileWidth2D) continue;
        }
        this.addInputsOutputs(state, i);
    }

    //add arrow
    this.addArrow([this.position[0]+3*tileSpace.tileWidth2D/5, this.position[1]+3*tileSpace.tileWidth2D/5],
        [this.position[0]+tileSpace.tileWidth2D/3, this.position[1]+tileSpace.tileWidth2D/3], tileSpace.mainCanvas);

    //add event handler for tile color change
    var self = this;
    rect.click(function(){
        self.changeTileColor(rect);
    });

    this.shape2D = rect;
};

Tile.prototype.render2D = function(){
    var rect = tileSpace.mainCanvas.rect(this.position[0], this.position[1], tileSpace.tileWidth2D, tileSpace.tileWidth2D);
    this.commonRender2D(rect);
};

Tile.prototype.addArrow = function(vert1, vert2, paper, color){
    if (!color) color = "black";
    paper.path('M '+vert1[0] + ' ' + vert1[1] + ' L ' + vert2[0] + ' ' + vert2[1]).attr({"stroke-width": 2, "stroke": color});
    paper.path('M ' + vert2[0] + ' ' + vert2[1] + 'L' + vert2[0] + ' ' + (vert2[1]+15)).attr({"stroke-width": 2, "stroke": color});
    paper.path('M ' + vert2[0] + ' ' + vert2[1] + 'L' + (vert2[0]+15) + ' ' + vert2[1]).attr({"stroke-width": 2, "stroke": color});
};

Tile.prototype.addInputsOutputs = function(state, num){

    var spacer = 3*tileSpace.tileWidth2D/10;
    var indicator = this.drawTriangle([this.position[0]+spacer, this.position[1]],
        [this.position[0]+tileSpace.tileWidth2D/2 ,this.position[1]+tileSpace.tileWidth2D/5],
        [this.position[0]+tileSpace.tileWidth2D-spacer, this.position[1]]);
    indicator.transform('r ' + (-90*num) + ", " + (this.position[0]+tileSpace.tileWidth2D/2) + ' , ' + (this.position[1]+tileSpace.tileWidth2D/2));
    indicator.attr({"opacity":"0.9"});

    var bBox = indicator.getBBox();

    var text = "0";
    if (state) text = "1";

    var indicatorText = tileSpace.mainCanvas.text(bBox['x']+bBox['width']/2,bBox['y']+bBox['height']/2, text).attr({'font-size':12});
    this.setIndicatorColor(state, indicator, indicatorText);

//    bind events to indicators
    var self = this;
    if (num<2){
        indicator.click(function(){
            self.changeOutputState(indicator, indicatorText, num);
        });
        indicatorText.click(function(){
            self.changeOutputState(indicator, indicatorText, num);
        });
    } else {//add highlight stroke around inputs
        var highlight = this.drawTriangle([this.position[0]+spacer, this.position[1]],
        [this.position[0]+tileSpace.tileWidth2D/2 ,this.position[1]+tileSpace.tileWidth2D/5],
        [this.position[0]+tileSpace.tileWidth2D-spacer, this.position[1]]);
        highlight.transform('r ' + (-90*num) + ", " + (this.position[0]+tileSpace.tileWidth2D/2) + ' , ' + (this.position[1]+tileSpace.tileWidth2D/2));
        highlight.attr({"stroke":"#ff0", "stroke-width":3});
    }
};

Tile.prototype.setTileColor = function(state, el){
    if (state){
        el.attr({"fill":"#00f"});
    } else {
        el.attr({"fill":"#f00"});
    }
};

Tile.prototype.setIndicatorColor = function(state, indicator, indicatorText){
    if (state){
        indicatorText.attr({"stroke":"#000", "text":"1"});
        indicator.attr({"fill":"#fff", "stroke":"#fff"});
    } else {
        indicatorText.attr({"stroke":"#fff", "text":"0"});
        indicator.attr({"fill":"#000", "stroke":"#000"});
    }
};

Tile.prototype.drawTriangle = function(vert1, vert2, vert3, shouldClose) {
    if (shouldClose) return tileSpace.mainCanvas.path('M '+vert1[0] + ' ' + vert1[1] + ' L ' + vert2[0] + ' ' + vert2[1] + ' L ' + vert3[0] + ' ' + vert3[1] + ' Z');
    return tileSpace.mainCanvas.path('M '+vert1[0] + ' ' + vert1[1] + ' L ' + vert2[0] + ' ' + vert2[1] + ' L ' + vert3[0] + ' ' + vert3[1])
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//draw paths for export

Tile.prototype.drawToExporter = function(exporter, offset, notchWidth, chamferLength, tileWidth, scalingFactor){
    for (var i=0;i<4;i++){
        var state;
        if (i<2) state = this.outputs[i];
        else state = !this.inputs[i-2];
        var notch = this.drawSide(scalingFactor*tileWidth, exporter, scalingFactor*notchWidth, scalingFactor*chamferLength, state,  i);
        notch.transform('r ' + -90*i + ', ' + scalingFactor*tileWidth/2.0 + ', ' + scalingFactor*tileWidth/2.0 + ' T ' + offset[0]*scalingFactor + ', ' + offset[1]*scalingFactor);
    }
    this.addArrow([offset[0]*scalingFactor + scalingFactor*tileWidth/2, offset[1]*scalingFactor + scalingFactor*tileWidth/2],
        [offset[0]*scalingFactor + scalingFactor*tileWidth/3, offset[1]*scalingFactor + scalingFactor*tileWidth/3], exporter, "red");
};

Tile.prototype.drawSide = function(width, exporter, notchWidth, chamferLength, state){//override this
    return this.drawRegularNotch(width, exporter, notchWidth, chamferLength, state);
};

Tile.prototype.drawRegularNotch = function(width, exporter, notchWidth, chamferLength, state){
    var path = 'M 0 0';//start at 0, 0
    path += ' H ' + ((width-notchWidth)/2.0 - chamferLength);//move horizontally
    path += this.sharedNotchPath(width, exporter, notchWidth, chamferLength, state);
    path += ' H ' + width;//move horizontally
    return exporter.path(path);
};

Tile.prototype.drawIncompleteSide = function(width, exporter, notchWidth, chamferLength, state, side){
    var offset = tileSpace.overhangDim;
    var path = '';
    if (side) path += 'M 0 0';//start at 0, 0
    else path += 'M ' + offset + ' 0';//start at offset, 0
    path += ' H ' + ((width-notchWidth)/2.0 - chamferLength);//move horizontally
    path += this.sharedNotchPath(width, exporter, notchWidth, chamferLength, state);
    if (side) path += ' H ' + (width-offset);//move horizontally
    else path += ' H ' + width;//move horizontally
    return exporter.path(path);
};

Tile.prototype.sharedNotchPath = function(width, exporter, notchWidth, chamferLength, state){
    var path = ' L ' + (width-notchWidth)/2.0 + ' ' + (chamferLength);//move across chamfer
    if (state) path += ' V ' + ((width-notchWidth)/6.0);//short notch
    else path += ' V ' + ((width-notchWidth)/3.0);//deep notch
    path += ' H ' + (width+notchWidth)/2.0;//move horizontally
    path += ' V ' + chamferLength;//move vertically
    path += ' L ' + ((width+notchWidth)/2.0 + chamferLength) + ' ' + 0;//move across chamfer
    return path;
};

