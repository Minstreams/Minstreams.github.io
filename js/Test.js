// 随便输出点东西
var hitCount = localStorage.getItem("hitCount") || 0;
hitCount++;
localStorage.setItem("hitCount", hitCount);
document.write("<p>这是用JS的write方法输出的一段文字</p>")
document.write("您已经浏览了此页面" + hitCount + "次!");


// 随便定义点函数
function OverrideContent(target) {
    target.innerHTML = 1001;
}

