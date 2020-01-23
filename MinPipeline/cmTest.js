// var myCodeMirror = CodeMirror($("#codeBody")[0],{
//     value: "function myScript(){return 100;}\n",
//     mode:  "javascript"
//   });

var cm = CodeMirror($("#codeBody")[0], {
    mode: "javascript",
    lineNumbers: true,
});

$("button").click(function () {
    cm.setOption("theme", $("#theme").text());
});