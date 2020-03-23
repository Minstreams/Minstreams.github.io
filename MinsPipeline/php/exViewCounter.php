<?php
namespace mpExtention{
    use mysqli;

    include $_SERVER['DOCUMENT_ROOT'].'/MinsPipeline/php/exIpGetter.php';
    //用于统计浏览量
    if ($_SERVER['SERVER_NAME'] == "minstreams.com") {
        $servername = "localhost:3306";
        $username = "pipelineUser";
        $password = "MinsPipeline0";
        $dbname = "mpStatistic";
        $ipIgnoreArray = array('117.150.202.201');
        
        $date = date("Y-m-d");
        $site = $_SERVER['PHP_SELF'];
        $siteType = mb_detect_encoding($site, array('UTF-8','GBK','LATIN1','BIG5')) ;
        if ($siteType != 'UTF-8') {
            $site = mb_convert_encoding($site, 'utf-8', $siteType);
        }
        $site = mb_substr($site, mb_strpos($site, '/')+1);
        $site = mb_substr($site, mb_strpos($site, '/')+1);
        $ip = getip();
        if (!in_array($ip, $ipIgnoreArray)) {
            $conn = new mysqli($servername, $username, $password, $dbname);
            if (!$conn->connect_error) {
                mysqli_query($conn, "INSERT into record value('$date','$site','$ip')");
                $result=mysqli_query($conn, "SELECT count from view where date='$date' and site='$site'");
                if ($result->num_rows>0) {
                    $newCount=intval(mysqli_fetch_array($result)[0])+1;
                    mysqli_query($conn, "UPDATE view SET count=$newCount,ip='$ip' where date='$date' and site='$site'");
                } else {
                    mysqli_query($conn, "INSERT into view value('$date','$site',1,'$ip')");
                }
                $conn.close();
            }
        }
    }
}
