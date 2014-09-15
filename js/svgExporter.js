
var tileSpace = tileSpace || {};

$(document).ready(function(){

    var exporter = Raphael(document.getElementById("svgExporter"), 900, 380);//exporter (set to display:none)

    //laser/material settings (in inches)
    var chamferLength = 0.0;
    var notchWidth = 0.15;
    var tileWidth = 3.0;

    var notchWidthInput = $("#notchWidth");
    notchWidthInput.keyup(function(e){
        var val = parseFloat($(this).val());
        if (val){
            notchWidth = val;
            tileSpace.renderParts();
        }
    });
    notchWidthInput.val(notchWidth);

    var tileWidthInput = $("#tileWidth");
    tileWidthInput.keyup(function(e){
        var val = parseFloat($(this).val());
        if (val){
            tileWidth = val;
            chamferLength = $("#chamfer").slider("value")*tileWidth/500.0;
            tileSpace.renderParts();
        }
    });
    tileWidthInput.val(tileWidth);

    $(".slider").slider();
    var chamferSlider = $("#chamfer");
    chamferSlider.on("slide", function(event, ui){
        chamferLength = ui.value*tileWidth/500.0;
        tileSpace.renderParts();
    });
    chamferSlider.slider('value',30);//set initial val
    chamferLength = chamferSlider.slider("value")*tileWidth/500.0;

    $("#exportSvg").click(function(){
        tileSpace.renderParts();
        downloadSVG();//download file
    });

    tileSpace.renderParts = function(){
        exporter.clear();
        //draw things to invisible paper
        var scalingFactor = 72.0;
        if (tileWidth*scalingFactor > 185) scalingFactor = 185/tileWidth;
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

});