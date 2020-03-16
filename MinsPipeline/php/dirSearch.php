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

// 遍历获取一个文件夹下的所有子文件（夹）
function getSubDir($dir)
{
    $files = [];
    if (@$handle = opendir($dir)) {
        while (($file = readdir($handle)) !== false) {
            if ($file != ".." && $file != "." && $file!="index.php") {
                $files[] = $file;
            }
        }
        closedir($handle);
    }
    return $files;
}
?>