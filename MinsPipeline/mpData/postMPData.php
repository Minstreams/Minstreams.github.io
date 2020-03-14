<?php
//用于存储mpData
//参数{
//  table
//  name
//  description
//  data
//}
// $servername = "localhost:3308";
// $username = "root";
// $password = "";
// $dbname = "mpdb";
$servername = "localhost:3306";
$username = "pipelineUser";
$password = "MinsPipeline0";
$dbname = "mpdb";
 
$table = $_POST['table'];
$name = $_POST['name'];
$description = $_POST['description'];
$data = $_POST['data'];

if (!(isset($table)&&isset($name)&&isset($description)&&isset($data))) {
    die("invalid arguments");
}

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("数据库连接失败: " . $conn->connect_error);
}

if (mysqli_query($conn, "INSERT into $table value('$name','$description',\"$data\")")) {
    echo 'insert success!';
} elseif (mysqli_query($conn, "UPDATE $table SET description='$description',data=\"$data\" WHERE name='$name'")) {
    echo 'update success!';
} else {
    echo $conn->error;
}
// echo mysqli_fetch_array($result)[0];
 
$conn->close();
