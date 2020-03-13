<?php

function my_dir($dir) {
    $files = [];
    if(@$handle = opendir($dir)) {
        while(($file = readdir($handle)) !== false) {
            if($file != ".." && $file != ".") {
                if(is_dir($dir . "/" . $file)) { //如果是子文件夹，进行递归
                    $files[$file] = my_dir($dir . "/" . $file);
                } else {
                    $files[] = $file;
                }
            }
        }
        closedir($handle);
    }
    return $files;
}

echo "<pre>";
print_r(my_dir("../"));
echo "</pre>";