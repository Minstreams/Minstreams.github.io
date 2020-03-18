<?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/dirSearch.php' ?>
<?php
    function newArticleGroup($name, $description)
    {
        echo "<div class='articleGroup'>
            <div class='articleGroupTitle'>
                <h2>".noPre($name)."</h2>
                <p>$description</p>
                <span>〉</span>
            </div>
            <div class='articleGroupInfo'>";
        $dirs = getSubDir("./Articles/$name");
        $dirsCount = count($dirs);
        for ($x = 0;$x<$dirsCount;$x++) {
            echo "<div onclick=\"window.location.href='./Articles/".$name."/".noExt($dirs[$x])."'\">".getPure($dirs[$x])."</div>";
        }
        echo "</div></div>";
    }
?>


<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <title>MinsPipeline-岷溪的软渲染管线</title>
    <link rel="stylesheet" type="text/css" href="css/mp_theme.css">
    <link rel="stylesheet" type="text/css" href="css/mp_general.css">
    <link rel="stylesheet" type="text/css" href="css/mpIndex.css">
</head>

<body>
    <div id='welcomeSec'>
        <h1>Mins Pipeline</h1>
        <p>岷 溪 的 软 渲 染 管 线</p>
    </div>
    <div id='mainDiv'>
        <div id='introSec'>
            <p>Hi!你好，欢迎使用管线编辑器！</p>
            <p>这是一些介绍文字</p>
        </div>
        <?php
            newArticleGroup("0光栅化", "这是光栅化的一些说明");
            newArticleGroup("2变换矩阵", "这是变换矩阵的一些说明");
            newArticleGroup("z用户手册", "来学习怎么使用管线编辑器吧！");
         ?>
        <div id='editorSec'>
            <a href="mpEditor">编辑器</a>
        </div>
    </div>
    <div id='tailSec'>
        <br />
        <br />
        这里是一些额外的尾部信息
        <br />
        This is some Infomation.
    </div>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>