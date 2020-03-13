<!DOCTYPE html>
<html lang='zh-CN'>

<head>
    <title>Example</title>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleHeader.php' ?>
</head>

<body onload='_onload();'>
    <div id='topDiv'>
        <div>
            <div id='indexLink'>Mins Pipeline</div>
            这里是顶部导航栏
        </div>
    </div>
    <div id='mainDiv'>
        <div id='artDiv'>
            <h1 id="introSec">这是文章标题</h1>
            <p>这里是各种正文</p>
            <mpWidget>
                <div class='mpCode' section='0' node='0'></div>
                <div class='mpBuffer' section='0' node='6'></div>
            </mpWidget>
            <mpWidget>
                <div class='mpBuffer' section='0' node='2'></div>
                <div class='mpBuffer' section='0' node='3'></div>
            </mpWidget>
            <mpWidget>
                <div class='mpBuffer' section='0' node='5'></div>
                <div class='mpBuffer' section='0' node='7'></div>
            </mpWidget>
            <div id='linkSec'>这里是快速链接</div>
        </div>
        <div id='sideDiv'>这是侧面导航栏</div>
    </div>
    <div id='bottomDiv'>这是底栏kk</div>
    <mpData>
        <pre>
            <?php getMPData('test', 'Forward'); ?>
        </pre>
    </mpData>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>