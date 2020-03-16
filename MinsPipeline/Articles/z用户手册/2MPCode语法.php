<?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleTemplate_before.php' ?>
<?php $mpData=array('MPCode语法0','MPCode语法1'); ?>

<h2>概述</h2>
<p>MPCode (Mins Pipeline Code) 是 Mins Pipeline 中的代码编辑器使用的脚本语言。
它是JavaScript的一种变体，基本语法和 JavaScript 非常相似。
但它比 JavaScript 更简单，尤其是获取管线数据时非常方便。</p>
<p>创造 MPCode 的初衷是为了更方便地编写管线功能代码。</p>

<h2>MPCode 编辑器</h2>
<p>MPCode 编辑器，和管线数据控件一样，可以作为页面的一部分进行管线代码的编辑。编辑的内容会实时影响管线的其它部分。但是其数据会在浏览器刷新后丢失。</p>
<p>编辑器右上角的小图标为操作盘，可以通过它查看该代码的可用API。</p>
<p>编辑器使用 <a href="https://CodeMirror.net" target='view_window'>CodeMirror</a> 作为基础框架。</p>

<h2>MPCode 函数入口</h2>
<p>MPCode 有和C语言等类似的入口函数 main()</p>
<mpWidget>
    <div class='mpCode' node='-1'></div>
    <div class='mpBuffer' section='-1' node='0'></div>
</mpWidget>
<p>main 函数不能有任何参数，但是它可以调用该管线中所有的变量和方法。</p>
<p>需要注意的是，每次代码编辑器中的内容发生改变，或者任何控件被编辑后，代码都会从入口函数重新执行一遍。</p>

<h2>MPCode 数据操作</h2>
<p>MPCode 的主要功能就是操作和计算管线中的数据。</p>
<p>每一个代码项所能调用的变量和方法的范围都是不同的，具体的规则见 管线编辑器手册。通过编辑器右上角的操作盘可以查看该代码项所能调用的变量和方法。</p>
<p>在代码框中输入对应的 变量名/方法名 即可。</p>
<mpWidget>
    <div class='mpCode' data='1' node='-1'></div>
    <div class='mpCode' data='1' section='-1' node='0'></div>
    <div class='mpBuffer' data='1' section='-1' node='0'></div>
    <div class='mpBuffer' data='1' section='-1' node='1'></div>
    <div class='mpBuffer' data='1' section='-1' node='2'></div>
    <div class='mpBuffer' data='1' section='-1' node='3'></div>
</mpWidget>
<h2>MPCode 语法</h2>
<p>...</p>

<h2>原理</h2>
<p>Mins Pipeline 内部使用 JavaScript 作为执行语言。
用户代码在运行前，会由 MPCode 的编译模块编译成 JavaScript 脚本，再由浏览器动态执行。
这个过程中获取到的管线上下文数据，还可以用于代码编辑器的变量名高亮和自动补全功能（待实现）。
</p>


<?php include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/articleTemplate_after.php' ?>
<!-- -->