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
$servername = "localhost:3306";
$username = "pipelineUser";
$password = "MinsPipeline0";
$dbname = "mpdb";
 
$table = $_GET['table'];
$name = $_GET['name'];

if (!(isset($table)&&isset($name))) {
    die("invalid arguments");
}

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("数据库连接失败: " . $conn->connect_error);
}

$result=mysqli_query($conn, "SELECT data from $table where name='$name'");
echo mysqli_fetch_array($result)[0];
 
$conn->close();
