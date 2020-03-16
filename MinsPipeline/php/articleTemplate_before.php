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
                    echo "<div class='sectionLink".($parent==$sections[$x]?" current'":"' onclick=\"window.location.href = '/MinsPipeline/Articles/$sections[$x]/'\"").">".noPre($sections[$x])."</div>";
                }
            ?>
        </div>
    </div>
    <div id='mainDiv'>
        <div id='artDiv'>
            <h1 id="introSec"><?php echo getPure($self); ?>
            </h1>