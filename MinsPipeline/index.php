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
            echo "<a class='adiv' href='./Articles/".$name."/".noExt($dirs[$x])."'>".getPure($dirs[$x])."</a>";
        }
        echo "</div></div>";
    }
?>


<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/mpHeader.php' ?>
    <title>MinsPipeline-岷溪的软渲染管线</title>
    <link rel="stylesheet" type="text/css" href="css/mpIndex.css">
</head>

<body>
    <div id='welcomeSec'>
        <h1>Mins Pipeline</h1>
        <p>岷 溪 的 软 渲 染 管 线</p>
    </div>
    <div id='mainDiv'>
        <div>
            <div id='introSec'>
                <p>Hi!你好，欢迎来到MinsPipeline！</p>
                <p>MinsPipeline 是一个在浏览器中学习渲染管线知识的工具。
                    你可以通过我们的教学文章，交互式地学习渲染流程中的各种算法；
                    也可以通过在线的管线编辑器，自由探究渲染管线中的各个阶段，甚至创造出自己独特的软渲染管线。</p>
                <p>（管线编辑器仍在开发中，暂不开放）</p>
            </div>
            <?php
                newArticleGroup("0光栅化", "光栅化是渲染管线中很重要的组成部分");
                newArticleGroup("z用户手册", "来学习怎么使用管线编辑器吧！");
            ?>
            <!-- <div id='editorSec'>
                <a href="mpEditor">编辑器</a>
            </div> -->
        </div>
    </div>
    <popup>
        <popupBox>
            <h2>管理员登陆</h2>
            <form action="adminLogin.php">
                账户: <input name='id'><br />
                密码: <input type='password' name='password'><br />
                <button type='submit'>提交</button>
            </form>
        </popupBox>
    </popup>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/mpFooter.php' ?>

    <script>
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 120) { // 按 F9 
                //弹出登陆界面
                alert("弹出登陆界面!");
                document.location.href = "terminal";
            }
        }; 
    </script>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>