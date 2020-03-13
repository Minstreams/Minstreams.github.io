<!DOCTYPE html>
<html lang='zh-CN'>

<head>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleHeader.php' ?>
</head>

<body onload='_onload();'>
    <div id='topDiv'>
        <div>
            <div id='indexLink' onclick="window.location.href = '/MinsPipeline';">
                <h3>Mins Pipeline</h3>
                <p>岷 溪 的 软 渲 染 管 线</p>
            </div>
            <div style='flex-grow:1;'></div>
            <?php
                $sections = getSubDir('../');
                $secCount = count($sections);
                for ($x=0;$x<$secCount;$x++) {
                    echo "<div class='sectionLink'".($parent==$sections[$x]?"":"onclick=\"window.location.href = '/MinsPipeline/Articles/$sections[$x]'\"").">".noPre($sections[$x])."</div>";
                }
            ?>
        </div>
    </div>
    <div id='mainDiv'>
        <div id='artDiv'>
            <h1 id="introSec"><?php echo getPure($self); ?>
            </h1>
            <!-- 这里是正文 -->
            <div id='linkSec'>
                <?php
                $articles = getSubDir('./');
                $artCount = count($articles);
                $selfIndex;
                for ($x=0;$x<$artCount;$x++) {
                    if ($self == $articles[$x]) {
                        $selfIndex = $x;
                    }
                }
                echo "<div".($selfIndex>0?" onclick=\"window.location.href='./".noExt($articles[$selfIndex-1])."'\">".getPure($articles[$selfIndex-1]):" class='.hide'>")."</div>";
                echo "<div".($selfIndex<$artCount-1?" onclick=\"window.location.href='./".noExt($articles[$selfIndex+1])."'\">".getPure($articles[$selfIndex+1]):" class='.hide'>")."</div>";
                ?>
            </div>
        </div>
        <div id='sideDiv'>
            <?php
            echo "<div class='sideTitle'>".noPre($parent)."</div>";
            for ($x=0;$x<$artCount;$x++) {
                if ($articles[$x]!="index.html") {
                    echo "<div class='articleLink'".($x==$selfIndex?"":" onclick=\"window.location.href='./".noExt($articles[$x])."'\"").">".getPure($articles[$x])."</div>";
                }
            }
            ?>
        </div>
    </div>
    <div id='bottomDiv'>这是底栏,还不知道写啥。abcdefg</div>
    <mpData>
        <?php
        $mpCount=count($mpData);
        for ($i = 0;$i<$mpCount;$i++) {
            echo "<pre>".getMPData('test', $mpData[$i])."</pre>";
        }
        ?>
    </mpData>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>