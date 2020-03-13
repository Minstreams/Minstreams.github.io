<?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleTemplate_before.php' ?>
<?php $mpData=array('Forward'); ?>

<p>这里是各种正文</p>
<p>和传统的图文文章一样</p>
<p>下面是交互管线控件</p>
控件可以放在
<div class='mpBuffer' section='0' node='3'></div>
正文
<div class='mpBuffer' section='0' node='4'></div>
中
<p>也可以放在单独的一行</p>
<mpWidget>
    <div class='mpCode' node='-1'></div>
    <div class='mpBuffer' section='0' node='6'></div>
</mpWidget>
<p>控件拥有权限等级，可以设置为只读</p>
<mpWidget>
    <div class='mpBuffer' section='0' node='0' authority='readonly'></div>
    <div class='mpBuffer' section='0' node='1' authority='readonly'></div>
</mpWidget>
<p>当编辑任意数据或代码时，所有数据都会响应式更新</p>

<?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleTemplate_after.php' ?>
<!-- -->