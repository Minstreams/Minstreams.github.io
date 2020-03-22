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
    <div id='bottomDiv'>
        <div id='bottomFlex'>
            <div class='bottomFlexContent'>
                <a href='https://minstreams.com' target='view_window' >作者主页</a>
                <span class='noselect'>　▏</span>
                <a href='https://github.com/Minstreams' target='view_window' >Github</a>
                <span class='noselect'>　▏</span>
                <a href='https://music.163.com/#/artist?id=1209047' target='view_window' >网易云音乐</a>
                <span class='noselect'>　▏</span>
                <a href='https://www.icourse163.org/u/mooc71358385601503610?userId=1151263615&_trace_c_p_k2_=59ef2cdb389c479482884312cc317a18' target='view_window' >万琳老师</a>
                <hr />
                你好。我是岷溪，大四学生，图形学爱好者，游戏开发程序/系统策划/美术/技术美术/音乐/音效，差不多啥都会一些。
                <br />
                Mins Pipeline 是我还在开发中的毕业设计作品。
            </div>
            <div class='bottomFlexContent'>
                <a href='https://www.icourse163.org/course/preview/HUST-1003636001' target='view_window' class='adiv bottomLogo' id='moocLogoBottom'></a>
                <div class='bottomTitle'>MOOC主页</div>
            </div>
            <div class='bottomFlexContent'>
                <a href='https://www.icourse163.org/university/HUST' target='view_window' class='adiv bottomLogo' id='hustLogoBottom'></a>
                <div class='bottomTitle'>华中科技大学</div>
            </div>
            <div class='bottomFlexContent'>
                <a href='http://sse.hust.edu.cn/' target='view_window' class='adiv bottomLogo' id='ssLogoBottom'></a>
                <div class='bottomTitle'>软件学院</div>
            </div>
        </div>
        <div id='rights'>Copyright © 2020 岷溪 Minstreams, All Rights Reserved. 鄂ICP备20002811号-1</div>
    </div>
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