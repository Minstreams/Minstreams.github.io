<!DOCTYPE html>
<html lang='zh-CN'>

<head>
    <title>Example</title>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleHeader.php' ?>
</head>

<body onload='_onload();'>
    <div>
        <h1>这是文章标题</h1>
        <div class='mpBuffer' section='0' node='1'></div>
        <div class='mpBuffer' section='0' node='2'></div>
        <div class='mpBuffer' section='0' node='3'></div>
        <div class='mpBuffer' section='0' node='4'></div>
        <div class='mpBuffer' section='0' node='5'></div>
        <div class='mpBuffer' section='0' node='6'></div>
        <div class='mpBuffer' section='0' node='7'></div>
        <div class='mpCode' section='0' node='0'></div>
    </div>
    <mpData>
        <pre>
            <?php getMPData('test', 'Forward'); ?>
        </pre>
    </mpData>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>