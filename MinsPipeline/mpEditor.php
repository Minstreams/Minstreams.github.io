<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <title>mpEditor-岷溪的管线编辑器</title>
    <script src="/JQuery/jquery-3.4.1.min.js"></script>
    <script src="/JQuery/jquery-ui.min.js"></script>

    <script src="/JQuery/jquery.mousewheel.min.js"></script>

    <script src="/codemirror/lib/codemirror.js"></script>
    <script src="/MinsPipeline/js/javascript.js"></script>
    <script src="/codemirror/addon/selection/active-line.js"></script>

    <link rel="stylesheet" href="/JQuery/jquery-ui.css">
    <link rel="stylesheet" href="/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="/css/general.css">
    
    <link rel="modulepreload" href="/MinsPipeline/js/modules/mpModule.js">
    <script src="/js/myLibrary.js"></script>
    <script src="/MinsPipeline/js/mpRuntimeLibrary.js"></script>
    <script src="/MinsPipeline/js/mpEditorLoader.js"></script>

    
    <link rel="stylesheet" href="/MinsPipeline/css/mp_theme.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mp_general.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mp_widget.css">
    
    <link rel="stylesheet" href="/MinsPipeline/css/mpEditor.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mpEditor_top.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mpEditor_top_extends.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mpEditor_code.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mpEditor_buffer.css">
    <!--temp-->
    <link rel="stylesheet" href="/MinsPipeline/css/codewarm.css">
</head>

<body onload="_onload();">
    <div class='tutorial'>
        <h1 style="margin-top: 72px;">Welcome to Minstreams' Pipeline Editor</h1>
        <h2 style="letter-spacing:12px;">欢迎使用管线编辑器</h2>
        <span style="left:49%;top: 12px;letter-spacing:36px;transform: translateX(-50%);">这是管线流程轴</span>
        <div style="top: 0;left: 0;right: 40px;height:62px;"></div>
        <span style="right: 46px;top:114px;letter-spacing:8px;">这是功能菜单➡</span>
        <div style="top: 0;width:24px;right: 0px;height:320px;"></div>
        <span style="left:16.5%;top:50%;letter-spacing:16px;transform: translateX(-50%);">这是代码编辑区域</span>
        <div style="top: 80px;width:33%;left:0;bottom:0;"></div>
        <span style="right:33.5%;top:50%;letter-spacing:36px;transform: translateX(50%);">这是数据编辑区域</span>
        <div style="top: 80px;left:34%;right:40px;bottom:0;"></div>
    </div>
    <div id="topDiv">
        <div id='toolDiv'>
            <div id='toolTouchArea'></div>
            <div id='toolBackground'></div>
            <div id='toolYClamper'>
                <div class='toolSection'>
                    <div id='toolUniformNav'>P
                        <tooltip>（当前显示管线数据）查看全局数据</tooltip>
                    </div>
                    <div id='toolPipelineNav'>U
                        <tooltip>（当前显示全局数据）查看管线数据</tooltip>
                    </div>
                </div>
                <div class='toolSection'>
                    <div id='toolRunCode'>R
                        <tooltip>运行代码</tooltip>
                    </div>
                </div>
                <div class='toolSection'>
                    <div id='toolEditSectionOff'>F
                        <tooltip>开启编辑节点模式</tooltip>
                    </div>
                    <div id='toolEditSectionOn'>O
                        <tooltip>关闭编辑节点模式</tooltip>
                    </div>
                </div>
                <div class='toolSection'>
                    <div id='toolAddCn'>F
                        <tooltip>添加一个方法</tooltip>
                    </div>
                </div>
                <div class='toolSection'>
                    <div id='toolAddDataF1'>A
                        <tooltip>添加一个F1</tooltip>
                    </div>
                    <div id='toolAddDataF2'>A
                        <tooltip>添加一个F2</tooltip>
                    </div>
                    <div id='toolAddDataF3'>A
                        <tooltip>添加一个F3</tooltip>
                    </div>
                    <div id='toolAddDataF4'>A
                        <tooltip>添加一个F4</tooltip>
                    </div>
                    <div id='toolAddDataTex'>T
                        <tooltip>添加一个Texture</tooltip>
                    </div>
                    <div id='toolAddDataMat'>T
                        <tooltip>添加一个Matrix</tooltip>
                    </div>
                </div>
                <div class='toolSection'>
                    <div id='toolsssss'>S
                        <tooltip>（需重启）切换皮肤</tooltip>
                    </div>
                </div>
                <div class='toolSection'>
                    <div id='toolSave'>S
                        <tooltip>保存数据</tooltip>
                    </div>
                </div>
                <div class='toolSection'>
                    <div id='toolShowTutorial' onclick="__showTutorial();">T
                        <tooltip>查看界面教程</tooltip>
                    </div>
                </div>
            </div>
        </div>
        <div id='sectionDiv'></div>
        <div id='uniformDiv'>
            <div id='mpInfo'>
                <h2>Title</h2>
                <p>这是关于管线的一些描述</p>
            </div>
        </div>
    </div>
    <div id='middleDiv'>
        <div id='leftDiv'>
            <div id='bsTitleDiv'>
                <div>这是缓存节标题</div>
                <span>这是缓存节描述</span>
            </div>
            <div id='codeDiv'>
                <ul></ul>
            </div>
            <div id='codeReferenceDiv'></div>
        </div>
        <div id='rightDiv'>
            <div id="bufferDiv"></div>
            <div id='errorLog'></div>
        </div>
    </div>
    <div id='bottomDiv'></div>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/systemTail.php' ?>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/php/recorder.php' ?>
</body>

</html>