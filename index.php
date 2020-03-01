<!DOCTYPE html>
<html>

<body>
<pre>
<?php
class Test {
    function _print() {
        echo '类名为：'  . __CLASS__ . "<br>";
        echo  '函数名为：' . __FUNCTION__ ;
    }
}
$t = new Test();
$t->_print();
#ssdasd
/*dsfs*/
?>
</pre>
</body>

</html>