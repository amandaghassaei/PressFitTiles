
var tileSpace = tileSpace || {};

$(document).ready(function(){

    var exporter = Raphael(document.getElementById("svgExporter"), 900, 420);//exporter (set to display:none)

    //laser/material settings (in inches)
    var chamferLength = 0.1;
    var notchWidth = 0.15;
    var tileWidth = 4.0;

    $("#exportSvg").click(function(){
        tileSpace.renderParts();
        downloadSVG();//download file
    });

    tileSpace.renderParts = function(){
        exporter.clear();
        //draw things to invisible paper
        var scalingFactor = 72;
        if (tileWidth*scalingFactor > 185) scalingFactor = 185/tileWidth;
        tileSpace.tiles[0].drawToExporter(exporter, [0, 0], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[1].drawToExporter(exporter, [tileWidth+0.1, 0], notchWidth, chamferLength, tileWidth, scalingFactor);
        tileSpace.tiles[2].drawToExporter(exporter, [0, tileWidth+0.1], notchWidth, chamferLength, tileWidth, scalingFactor);
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