
var tileSpace = tileSpace || {};

$(document).ready(function(){

    var exporter = Raphael(document.getElementById("svgExporter"), 900, 380);//exporter (set to display:none)

    //laser/material settings (in inches)
    var chamferLength = 0.0;
    var notchWidth = 0.15;
    var tileWidth = 3.0;
    tileSpace.overhangDim = 0.0;

    var notchWidthInput = $("#notchWidth");
    notchWidthInput.keyup(function(e){
        var val = parseFloat($(this).val());
        if (val){
            notchWidth = val;
            tileSpace.overhangDim = 72*egdeSlider.slider("value")*((tileWidth-notchWidth)/2 - chamferLength)/100.0;
            tileSpace.renderParts();
        }
    });
    notchWidthInput.val(notchWidth);

    var tileWidthInput = $("#tileWidth");
    tileWidthInput.keyup(function(e){
        var val = parseFloat($(this).val());
        if (val){
            tileWidth = val;
            chamferLength = $("#chamfer").slider("value")*(tileWidth/3-notchWidth)/200.0;
            tileSpace.overhangDim = 72*egdeSlider.slider("value")*((tileWidth-notchWidth)/2 - chamferLength)/100.0;
            tileSpace.renderParts();
        }
    });
    tileWidthInput.val(tileWidth);

    $(".slider").slider();

    var chamferSlider = $("#chamfer");
    chamferSlider.on("slide", function(event, ui){
        chamferLength = ui.value*(tileWidth-notchWidth)/600.0;
        tileSpace.overhangDim = 72*egdeSlider.slider("value")*((tileWidth-notchWidth)/2 - chamferLength)/100.0;
        tileSpace.renderParts();
    });
    chamferSlider.slider('value',30);//set initial val
    chamferLength = chamferSlider.slider("value")*(tileWidth/3-notchWidth)/200.0;

    var egdeSlider = $("#extraEdge");
    egdeSlider.on("slide", function(event, ui){
        tileSpace.overhangDim = 72*ui.value*((tileWidth-notchWidth)/2 - chamferLength)/100.0;
        tileSpace.renderParts();
    });
    egdeSlider.slider('value',80);//set initial val
    tileSpace.overhangDim = 72*egdeSlider.slider("value")*((tileWidth-notchWidth)/2 - chamferLength)/100.0;

    $("#exportSvg").click(function(){
        tileSpace.renderParts();
        downloadSVG();//download file
    });

    tileSpace.renderParts = function(){
        exporter.clear();
        var scalingFactor = 72.0;
        exporter.setViewBox(0, 0, scalingFactor*(5*(tileWidth+0.1)-0.1), scalingFactor*(2*(tileWidth+0.1)-0.1), false);
        //draw things to invisible paper
        tileSpace.tiles[0].drawToExporter(exporter, [0, 0], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[1].drawToExporter(exporter, [0, tileWidth+0.1], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[2].drawToExporter(exporter, [tileWidth+0.1, 0], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[3].drawToExporter(exporter, [tileWidth+0.1, tileWidth+0.1], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[4].drawToExporter(exporter, [2*(tileWidth+0.1), 0], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[5].drawToExporter(exporter, [2*(tileWidth+0.1), tileWidth+0.1], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[6].drawToExporter(exporter, [3*(tileWidth+0.1), 0], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[7].drawToExporter(exporter, [3*(tileWidth+0.1), tileWidth+0.1], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[8].drawToExporter(exporter, [4*(tileWidth+0.1), 0], notchWidth, chamferLength, tileWidth, scalingFactor);
    };

    var downloadSVG = function(){//working in chrome, not sure about others
        //72 px per inch
        var svg = exporter.toSVG();
        var link = document.createElement('a');
        link.download = 'PressFitConstruction.svg';
        link.type = 'image/svg+xml';
        blob = new Blob([svg], {"type": "image/svg+xml"});
        link.href = (window.URL || webkitURL).createObjectURL(blob);
        link.click();
    };

    var draw2DTiles = function(){
        var spacing = 32;
        var tiles = [];
        for (var i=0;i<2;i++){
            var input1 = (i>0);
            for (var j=0;j<2;j++){
                var input2 = (j>0);
                tiles.push(new Tile(i*(tileSpace.tileWidth2D+spacing), j*(tileSpace.tileWidth2D+spacing), [input1, input2], [input1^input2, input1&input2]));
            }
        }
        for (i=0;i<2;i++){
            input1 = i>0;
            for (j=0;j<1;j++){
                tiles.push(new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+43*tileSpace.tileWidth2D/20, j*(tileSpace.tileWidth2D+spacing), [input1], [input1^1, input1&1], true))
            }
            for (j=1;j<2;j++){
                tiles.push(new EdgeTile(i*(tileSpace.tileWidth2D+spacing)+3*spacing+2*tileSpace.tileWidth2D, j*(tileSpace.tileWidth2D+spacing)+3*tileSpace.tileWidth2D/10, [input1], [input1^1, input1&1], false))
            }
        }
        tiles.push(new CornerTile(tileSpace.tileWidth2D*4+spacing*6, 13*tileSpace.tileWidth2D/10+spacing, [true, true]));
        tileSpace.mainCanvas.text(165, tileSpace.tileWidth2D*2+spacing+20, "regular tiles have 2 inputs").attr({"font-size":15});
        tileSpace.mainCanvas.text(560, tileSpace.tileWidth2D*2+spacing+20, "edge tiles have 1 input").attr({"font-size":15});
        tileSpace.mainCanvas.text(845, tileSpace.tileWidth2D+spacing+20, "corner tiles\nhave 0 inputs").attr({"font-size":15});
        return tiles;
    };

});