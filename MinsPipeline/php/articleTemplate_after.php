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
                echo "<div class='articleLink'".($x==$selfIndex?"":" onclick=\"window.location.href='./".noExt($articles[$x])."'\"").">".getPure($articles[$x])."</div>";
            }
            ?>
        </div>
    </div>
    <div id='bottomDiv'>如果你的屏幕够大，推荐将页面缩放到125%</div>
    <mpData>
        <?php
        $mpCount=count($mpData);
        for ($i = 0;$i<$mpCount;$i++) {
            echo "<pre>".getMPData('test', $mpData[$i])."</pre>";
        }
        ?>
    </mpData>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/systemTail.php' ?>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>