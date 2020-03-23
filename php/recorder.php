<?php
namespace Mins{
    use mysqli;

    include $_SERVER['DOCUMENT_ROOT'].'/php/ipGetter.php';
    //用于统计浏览量
    if ($_SERVER['SERVER_NAME'] == "minstreams.com") {
        $ipIgnoreArray = array('117.150.202.201');

        $site = $_SERVER['PHP_SELF'];
        $siteType = mb_detect_encoding($site, array('UTF-8','GBK','LATIN1','BIG5')) ;
        if ($siteType != 'UTF-8') {
            $site = mb_convert_encoding($site, 'utf-8', $siteType);
        }
        $site = mb_substr($site, mb_strpos($site, '/')+1);
        $ip = getip();
        // if (!in_array($ip, $ipIgnoreArray)) 
        {
            $conn = new mysqli("localhost:3306", "statistician", "MinsStatistician", "statistic");
            if (!$conn->connect_error) {
                mysqli_query($conn, "INSERT into record(site,ip) value('$site','$ip')");
                $conn->close();
            }
        }
    }
}
