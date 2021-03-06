<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <title>Minstreams' Planet</title>
    <link rel="stylesheet" type="text/css" href="css/MyStyle.css">
</head>

<body class="noBorder Background" onresize="onResize();">
    <div class="noBorder innerDiv">
        <canvas id="mainCanvas" class="mainCanvas"></canvas>
    </div>

    <div class="terminalPad Hide">
        <span id="fpsMark">FPS:1</span><br />
        <input type="checkbox" checked="true" oninput="OnCheck0(this.checked);">enableComplexAnimation<br />
    </div>

    <div class="UndergroundDiv">
        <div class="UndergroundWidth">
            <br />
            <br />
            <br />
            <h1>Minstreams' Planet</h1>
            <p>Hi, there! I'm Minstreams. Welcome to my homepage!</p>
            <p>Here are some of my works (updating):</p>
        </div>
        <!--<hr />-->

        <div class="noBorder SectionBox">
            <div class="SectionButton UndergroundWidth">
                <div class="ImgBorder">
                    <img class="SectionImg" src="details/src/Cover/GaterCover.png">
                </div>
                <span class="SectionButtonTitle">
                    ______________________________________________________________________________________________________________
                    My Game Works
                </span>
                <span class="SectionButtonText">
                    <a href="details/game" class="SectionLink">
                        →DETAILS
                    </a>
                </span>
            </div>
        </div>
        <div class="SectionBackground" style="background-image: url(details/src/Cover/GaterCover.png);"></div>

        <div class="noBorder SectionBox">
            <div class="SectionButton UndergroundWidth">
                <div class="ImgBorder">
                    <img class="SectionImg" src="details/src/Cover/鸟cuted.jpg">
                </div>
                <span class="SectionButtonTitle">
                    ______________________________________________________________________________________________________________
                    My Painting Works
                </span>
                <span class="SectionButtonText">
                    <a href="details/painting" class="SectionLink">
                        →DETAILS
                    </a>
                </span>
            </div>
        </div>
        <div class="SectionBackground" style="background-image: url(details/src/Cover/鸟cuted.jpg);"></div>

        <div class="noBorder SectionBox">
            <div class="SectionButton UndergroundWidth">
                <div class="ImgBorder">
                    <img class="SectionImg" src="details/src/Cover/logo.jpg">
                </div>
                <span class="SectionButtonTitle">
                    ______________________________________________________________________________________________________________
                    My Graphic Design Works
                </span>
                <span class="SectionButtonText">
                    <a href="details/graphicDesign" class="SectionLink">
                        →DETAILS
                    </a>
                </span>
            </div>
        </div>
        <div class="SectionBackground" style="background-image: url(details/src/Cover/logo.jpg);"></div>

        <div class="noBorder SectionBox">
            <div class="SectionButton UndergroundWidth">
                <div class="ImgBorder">
                    <img class="SectionImg" src="details/src/Cover/西瓜皮卡球.jpg">
                </div>
                <span class="SectionButtonTitle">
                    ______________________________________________________________________________________________________________
                    My Music Works
                </span>
                <span class="SectionButtonText">
                    <a href="https://music.163.com/#/artist?id=1209047" class="SectionLink">
                        →DETAILS
                    </a>
                </span>
            </div>
        </div>
        <div class="SectionBackground" style="background-image: url(details/src/Cover/西瓜皮卡球.jpg);"></div>

        <div class="CenterAligned">
            <br />
            <br />
            <br />
            <br />
            <a href="MinsPipeline/">Min Pipe line Test</a>
            <a href="minsBox/test.html">Mins Box Test</a>
            <p>Minstreams@qq.com Jan.2020</p>
            <br />
        </div>
    </div>

    <script src="js/IndexEffect.js"></script>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/php/recorder.php' ?>
</body>

</html>