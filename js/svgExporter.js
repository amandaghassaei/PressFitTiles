
var tileSpace = tileSpace || {};

$(document).ready(function(){

    var exporter = Raphael(document.getElementById("svgExporter"), 900, 350);//exporter (set to display:none)

    $("#exportSvg").click(function(){
        //draw things to invisible paper
        $.each(tileSpace.tiles, function(i, tile){
            exporter
        });

        downloadSVG();//download file
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