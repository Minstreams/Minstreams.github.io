/**总数据 */
var mpData = new MPData();
mpData.bufferSections.push(
    new BufferSection("输出", "最终输出", [
        new BufferDataTexture("OutColor", "最终输出的颜色", 512, 512)
    ])
);
mpData.bufferSections.push(new BufferSection("Asdasdasd2", "asdasd", [new BufferDataTexture("Real")]));
mpData.bufferSections.push(new BufferSection("Asdaasd3"));



/**函数入口 */
$(document).ready(function () {
    mpData.bufferSections.forEach(bs => {
        $("#topDiv").append(
            $("<div class='bufferButton' ></div>").click(function () {
                $(this).addClass("bbSelected").siblings().removeClass('bbSelected');
                bs.LoadUI($("#bufferDiv").empty());
            }),
            $("<div class='operatorButton'></div>").click(function () {
                $(this).addClass("obSelected").siblings().removeClass('obSelected');
            })
        );
    });

    mpData.bufferSections[0].LoadUI($("#bufferDiv"));


});




//#region Code标签相关
var tabs = $("#codeContentDiv").tabs();
var targetScrollLeft = 0;   //辅助计算横向滚动位置
var tabCounter = 0;     //辅助变量，防止标签id重复

/**新增一个Code标签
 * @param {CodeDataPrototype} codeDataObject 对应的code数据项
 */
function AddCodeTab(codeDataObject) {
    // 检查标签是否重复
    if (!$("#codeContentDiv>ul>li").every(function () { return $(this).data("codeDataObject") !== codeDataObject; })) return;

    var newTabId = codeDataObject.name + tabCounter++;

    // 标签页
    var tabLi = $("<li></li>").append(
        $("<a href='#code" + newTabId + "'></a>").append(
            // Tab标题
            $("<tabTitle></tabTitle>").BindProperty(codeDataObject, "name", "name"),
            // Tab描述
            $("<tabDescription></tabDescription>").BindProperty(codeDataObject, "description")
        ))
        .appendTo("#codeContentDiv>ul").data("codeDataObject", codeDataObject);
    // 标签内容
    var codeTextDiv = $("<div class='codeTextDiv' id='code" + newTabId + "'></div>").appendTo("#codeContentDiv");

    let codeTitle = $("<span></tabTitle>").BindProperty(codeDataObject, "name").appendTo(codeTextDiv);

    //**以下是对代码块的配置
    var codeTextArea = $("<div contenteditable='plaintext-only' spellcheck = 'false'></div>").BindProperty(codeDataObject, "codeText", "code").appendTo(codeTextDiv);

    // 标签关闭按钮
    tabLi.append($("<div></div>").addClass("ui-tabs-close").click(function () {
        // 点击时删除此标签
        tabLi.remove();
        codeTextDiv.remove();

        tabs.tabs("refresh");
    }));

    // 刷新并选中新项
    tabs.tabs("refresh");
    tabs.tabs("option", "active", tabLi.index());
}

// Code标签排序功能
tabs.find(".ui-tabs-nav").sortable({
    axis: "x",
    stop: function (e, ui) {
        tabs.tabs("refresh");
        // 排序后自动选择最新标签
        tabs.tabs("option", "active", ui.item.index());
    }
});
// Code标签横向滚动
$("#codeContentDiv>.ui-tabs-nav").mousewheel(function (event) {
    /**左右滚动系数 */
    const myDeltaFactor = 0.25;
    targetScrollLeft -= event.deltaFactor * event.deltaY * myDeltaFactor;
    var max = $(this)[0].scrollWidth - $(this)[0].clientWidth;
    targetScrollLeft = targetScrollLeft < 0 ? 0 : targetScrollLeft > max ? max : targetScrollLeft;

    $(this).stop().animate({ scrollLeft: targetScrollLeft }, "fast", "easeOutCubic");
});



//#endregion





var c1 = new CodeDataJavaScript("Funtion1", "用于把视角空间转换为某某空间");
var c2 = new CodeDataJavaScript("Funtion2", "用于把视角空间转换为某某空间C2D");
var c3 = new CodeDataJavaScript("Funtion3", "用于把视角空间转换为某某空间C2D");
var c4 = new CodeDataJavaScript("Funtion4", "用于把视角空间转换为某某空间C2D");

var codes = [c1, c2, c3, c4];

function Run() {
    //Save All
    $("[contenteditable = plaintext-only]").UpdateProperty();

    var script = "console.log('Run!');";
    codes.forEach(code => script += "\n//----\n" + code.codeJS);
    script += "$('canvas').RespondProperty();"
    $("pipeline").empty().append($("<script>< /script>").html(script));
}

$("#rB").click(Run);


AddCodeTab(c1);
AddCodeTab(c2);

$("#tB").click(function () {
    codes.forEach(code => AddCodeTab(code));
})
