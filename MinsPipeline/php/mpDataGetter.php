<?php
//用于从服务器获取mpData
//参数{
//  table
//  name
//}
// $servername = "localhost:3308";
// $username = "root";
// $password = "";
// $dbname = "mpdb";
$servername = "111.229.94.88:3306";
// $servername = "localhost:3306";
$username = "pipelineUser";
$password = "MinsPipeline0";
$dbname = "mpdb";

global $servername,$username,$password,$dbname;
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("数据库连接失败: " . $conn->connect_error);
}

function getMPData($table, $name)
{
    global $conn;
    if (!(isset($table)&&isset($name))) {
        die("invalid arguments");
    }
    
    $result=mysqli_query($conn, "SELECT data from $table where name='$name'");
    $output=mysqli_fetch_array($result)[0];
    return $output;
}
?>
<!-- -->