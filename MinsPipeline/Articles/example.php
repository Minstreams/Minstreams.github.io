<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <title>Example</title>
    <script src="/JQuery/jquery-3.4.1.min.js"></script>
    <script src="/JQuery/jquery-ui.min.js"></script>

    <script src="/codemirror/lib/codemirror.js"></script>
    <script src="/codemirror/mode/javascript/javascript.js"></script>
    <script src="/codemirror/addon/selection/active-line.js"></script>

    <link rel="modulepreload" href="/MinsPipeline/js/modules/mpModule.js">
    <script src="/js/myLibrary.js"></script>
    <script src="/MinsPipeline/js/mpRuntimeLibrary.js"></script>
    <script src="/MinsPipeline/js/mpArticleLoader.js"></script>

    <link rel="stylesheet" href="/JQuery/jquery-ui.css">
    <link rel="stylesheet" href="/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="/css/general.css">

    <link rel="stylesheet" href="/MinsPipeline/css/mp_theme.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mp_general.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mp_widget.css">
    <link rel="stylesheet" href="/MinsPipeline/css/mpArticle.css">
    
</head>

<body onload="_onload();">
    <div>
        <h1>这是文章标题</h1>
        <div class='mpBuffer'></div>
    </div>
    <mpData>
        <div><?php echo file_get_contents("/MinsPipleine/mpData/getMPData?table='test'&name='test'"); ?></div>
    </mpData>
    <noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
</body>

</html>