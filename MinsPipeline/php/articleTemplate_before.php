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