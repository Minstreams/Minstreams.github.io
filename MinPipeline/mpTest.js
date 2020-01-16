function MPData() {
    this.bufferSections = new Array();
}

function BufferSection(name) {
    this.sectionName = name;
    this.dataNode = new Array();
}

var mpData = new MPData();
mpData.bufferSections.push(new BufferSection("Asdasdasd"));

/** @type {HTMLIFrameElement} */
var f = document.getElementById("bufferFrame");
f.contentWindow.document.write("<h1>" + mpData.bufferSections[0].sectionName + "</h1>");

$(document).ready(function () {
    $(".bufferButton").click(function () {
        $(this).addClass("bbSelected").siblings().removeClass('bbSelected');
        alert($(this).index(".bufferButton") + " selected!");
    });
    $(".operatorButton").click(function () {
        $(this).addClass("obSelected").siblings().removeClass('obSelected');
        alert($(this).index() + " selected!");
    });
});
