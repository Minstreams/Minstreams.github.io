<meta charset="utf-8" />
<script src="/JQuery/jquery-3.4.1.min.js"></script>
<script src="/JQuery/jquery-ui.min.js"></script>

<script src="/codemirror/lib/codemirror.js"></script>
<script src="/codemirror/mode/javascript/javascript.js"></script>
<script src="/codemirror/addon/selection/active-line.js"></script>

<link rel="stylesheet" href="/JQuery/jquery-ui.css" />
<link rel="stylesheet" href="/codemirror/lib/codemirror.css" />
<link rel="stylesheet" href="/css/general.css" />

<link rel="modulepreload" href="/MinsPipeline/js/modules/mpModule.js" />
<script src="/js/myLibrary.js"></script>
<script src="/MinsPipeline/js/mpRuntimeLibrary.js"></script>
<script src="/MinsPipeline/js/mpArticleLoader.js"></script>

<link rel="stylesheet" href="/MinsPipeline/css/mp_theme.css" />
<link rel="stylesheet" href="/MinsPipeline/css/mp_general.css" />
<link rel="stylesheet" href="/MinsPipeline/css/mp_widget.css" />
<link rel="stylesheet" href="/MinsPipeline/css/mpArticle.css" />
<link rel="stylesheet" href="/MinsPipeline/css/mpArticle_top.css" />
<link rel="stylesheet" href="/MinsPipeline/css/mpArticle_side.css" />

<!--temp-->
<link rel="stylesheet" href="/MinsPipeline/css/codewarm.css" />

<?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/mpDataGetter.php' ?>


<?php

function noPre($str)
{
    return mb_substr($str, 1);
}

function noExt($str)
{
    return mb_substr($str, 0, mb_strrpos($str, '.'));
}

function getPure($str)
{
    return mb_substr($str, 1, mb_strrpos($str, '.')-1);
}

// 获取文件自身名字
function getSelf()
{
    $php_self = $_SERVER['PHP_SELF'];
    $fileType = mb_detect_encoding($php_self, array('UTF-8','GBK','LATIN1','BIG5')) ;
    if ($fileType != 'UTF-8') {
        $php_self = mb_convert_encoding($php_self, 'utf-8', $fileType);
    }
    $php_self = mb_substr($php_self, mb_strrpos($php_self, '/')+1);
    return $php_self;
}
$self = getSelf();

// 获取文件夹的名字
function getParent()
{
    $php_self = $_SERVER['PHP_SELF'];
    $fileType = mb_detect_encoding($php_self, array('UTF-8','GBK','LATIN1','BIG5')) ;
    if ($fileType != 'UTF-8') {
        $php_self = mb_convert_encoding($php_self, 'utf-8', $fileType);
    }
    $php_self = mb_substr($php_self, 0, mb_strrpos($php_self, '/'));
    $php_self = mb_substr($php_self, mb_strrpos($php_self, '/')+1);
    return $php_self;
}
$parent = getParent();

// 遍历获取一个文件夹下的所有子文件（夹）
function getSubDir($dir)
{
    $files = [];
    if (@$handle = opendir($dir)) {
        while (($file = readdir($handle)) !== false) {
            if ($file != ".." && $file != "." && $file!="index.html") {
                $files[] = $file;
            }
        }
        closedir($handle);
    }
    return $files;
}
?>
<title><?php echo getPure($self)."-".noPre($parent)."-Mins Pipeline 岷溪的软渲染管线"; ?>
</title>