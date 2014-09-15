
var tileSpace = tileSpace || {};

$(document).ready(function(){

    var exporter = Raphael(document.getElementById("svgExporter"), 900, 350);//exporter (set to display:none)

    //laser/material settings (in inches)
    var chamferLength = 0.1;
    var notchWidth = 0.15;
    var tileWidth = 3.0;

    $("#exportSvg").click(function(){
        //draw things to invisible paper
        var xOffset = 5;
        $.each(tileSpace.tiles, function(i, tile){//draw all objects in a row on the exporter
            xOffset += tile.drawToExporter(exporter, xOffset, notchWidth, chamferLength, tileWidth) + 5;
        });

//        downloadSVG();//download file
    });

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