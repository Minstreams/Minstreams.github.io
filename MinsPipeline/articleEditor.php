<!DOCTYPE html>
<html lang='zh-CN'>

<head>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleHeader.php' ?>
</head>

<body onload='_onload();'>
    <div id='topDiv'>
        <div>
            <a class='adiv' id='indexLink' href='/MinsPipeline'>
                <h3>Mins Pipeline</h3>
                <p>岷 溪 的 软 渲 染 管 线</p>
            </a>
            <div style='flex-grow:1;position:relative;height:100%;'>
                <div id='logoMid'></div>
            </div>
            <?php
                $sections = getSubDir('../');
                $secCount = count($sections);
                for ($x=0;$x<$secCount;$x++) {
                    echo "<a class='adiv sectionLink".($parent==$sections[$x]?" current'":"' href='/MinsPipeline/Articles/$sections[$x]/'").">".noPre($sections[$x])."</a>";
                }
            ?>
        </div>
    </div>
    <div id='mainDiv'>
        <div id='artDiv'>
            <h1 id="introSec"><?php echo getPure($self); ?>
            </h1>
            <?php $mpData=array(); ?>

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
                echo "<a class='adiv'".($selfIndex>0?" href='./".noExt($articles[$selfIndex-1])."'>".getPure($articles[$selfIndex-1]):" class='.hide'>")."</a>";
                echo "<a class='adiv'".($selfIndex<$artCount-1?" href='./".noExt($articles[$selfIndex+1])."'>".getPure($articles[$selfIndex+1]):" class='.hide'>")."</a>";
                ?>
            </div>
        </div>
        <div id='sideDiv'>
            <?php
            echo "<div class='sideTitle'>".noPre($parent)."</div>";
            for ($x=0;$x<$artCount;$x++) {
                echo "<a class='adiv articleLink".($x==$selfIndex?" current'>":"' href='./".noExt($articles[$x])."'>").getPure($articles[$x])."</a>";
            }
            ?>
        </div>
    </div>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/mpFooter.php' ?>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/mpDataGetter.php' ?>
    <mpData>
        <?php
        $mpCount=count($mpData);
        for ($i = 0;$i<$mpCount;$i++) {
            echo "<pre>".getMPData('test', $mpData[$i])."</pre>";
        }
        $conn->close();
        ?>
    </mpData>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/systemTail.php' ?>
    <script>
        let tDiv = $('.articleLink.current');
        $('#artDiv>h2').each(function() {
            let el = $(this);
            let ttDiv = $('<div></div>').addClass('articleHeaderLink').text(el.text()).click(function() {
                $("html,body").animate({
                    scrollTop: el.offset().top
                }, 500 /*scroll实现定位滚动*/ );
            });
            tDiv.after(ttDiv);
            tDiv = ttDiv;
        });
    </script>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>