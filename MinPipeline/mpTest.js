/**总数据 */
var mpData = new MPData();
mpData.bufferSections.push(
    new BufferSection("输出", "最终输出", [
        new BufferDataTexture("OutColor", "最终输出的颜色", 512, 512),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk"),
        new BufferDataF1("kkk")
    ])
);
mpData.bufferSections.push(new BufferSection("Asdasdasd2", "asdasd", [new BufferDataTexture("Real")]));
mpData.bufferSections.push(new BufferSection("Asdaasd3"));




/**函数入口 */
$(document).ready(function () {
    mpData.bufferSections.forEach(bs => {
        // 数据项Section按钮
        let bsDiv = $("<div></div>")
            .addClass("bufferSection")
            .append($("<point></point>"))
            .append($("<tooltip></tooltip>").BindProperty(bs, "name", "display"))
            .appendTo("#topDiv")
            .click(function () {
                $(this).addClass("bsSelected").siblings(".bsSelected").removeClass('bsSelected');
                bs.LoadUI($("#bufferDiv").empty());
            });
        // 环形排序
        let resortFunc = function (withoutHolder) {
            let els = bsDiv.find("li").not(".ui-sortable-helper");
            if (withoutHolder) els = els.not(".ui-sortable-placeholder");
            // console.log("resort!" + els.length);
            els.each(function (i, e) {
                let angle = ((i + 1) / (els.length + 1)) * 2 * Math.PI;
                let o = 17;
                let r = 18;
                $(this).css({
                    left: (o + r * Math.cos(angle)) + "px",
                    top: (o - r * Math.sin(angle)) + "px"
                });
            });
        }
        let bsul = $("<ul></ul>").appendTo(bsDiv).data("dataArray", bs._dataNodes).data("resortFunc", resortFunc).sortable({
            connectWith: ".bufferSection>ul",
            start: function (event, ui) {
                let hp = ui.item.position();
                ui.placeholder.css({
                    left: hp.left,
                    top: hp.top
                });
                ui.item.data("lastParent", ui.item.parent()[0]);
                // console.log("start");
            },
            change: function (event, ui) {
                if (ui.sender) return;
                // console.log("change" + (ui.sender ? "|sender:" + ui.sender.parent().index() : ""));

                let lp = ui.item.data("lastParent");
                let cp = ui.placeholder.parent()[0];
                let re = (lp === cp);
                if (!re)
                    $(lp).data("resortFunc")();
                $(cp).data("resortFunc")();
                ui.item.data("lastParent", cp);
            },
            update: function (event, ui) {
                // 在这里对元素重新排序
                console.log("update", ui.item.index() + "|sender:" + (ui.sender ? ui.sender[0] : null) + "|target:" + ui.item[0]);
                let fromArray = (ui.sender ? ui.sender : ui.item.parent()).data("dataArray");
                let toArray = ui.item.parent().data("dataArray");
                let data = fromArray.remove(ui.item.data("dataObject"));
                if (!data) return;
                toArray.splice(ui.item.index(), 0, data);

                bsDiv.addClass("bsSelected").siblings(".bsSelected").removeClass('bsSelected');
                bs.LoadUI($("#bufferDiv").empty());

                resortFunc();
            },
            placeholder: "placeholder",
            cursorAt: {
                left: 5,
                top: 5
            },
        });
        // 添加数据项
        bs._dataNodes.forEach(dn => {
            let bo = $("<li></li>")
                .addClass("bufferOperator " + dn.constructor.name)
                .data("dataObject", dn)
                .appendTo(bsul)
                // 这是实际显示效果
                .append("<div></div>")
                .append($("<tooltip></tooltip>").BindProperty(dn, "name", "display"));
        });
        // 初始化
        resortFunc();

        // codeSection按钮
        let bc = bs._codeSection;
        let bcDiv = $("<div class='codeSection'></div>")
            .addClass("codeSection")
            .append($("<line></line>"))
            .append($("<tooltip></tooltip>").BindProperty(bc, "name", "text"))
            .appendTo("#topDiv")
            .click(function () {
                console.log("section click");
                $(this).addClass("osSelected").siblings(".osSelected").removeClass('osSelected');
                bc._codeNodes.forEach(cn => AddCodeTab(cn));
            });
        // 排序
        let bcul = $("<ul></ul>").appendTo(bcDiv).data("dataArray", bc._codeNodes).sortable({
            axis: "x",
            connectWith: ".codeSection>ul",
            change: function (event, ui) {
                // 对空白表列做顺序调整
                let lp = ui.placeholder.filter(":last-child");
                lp.after(lp.prev());
            },
            update: function (event, ui) {
                // 在这里对数据排序
                let fromArray = (ui.sender ? ui.sender : ui.item.parent()).data("dataArray");
                let toArray = ui.item.parent().data("dataArray");
                let data = fromArray.remove(ui.item.data("dataObject"));
                if (!data) return;
                toArray.splice(ui.item.index(), 0, data);

                bcDiv.addClass("osSelected").siblings(".osSelected").removeClass('osSelected');
            },
            stop: function (event, ui) {
                AddCodeTab(ui.item.data("dataObject"));
            },
            placeholder: "placeholder codeOperator",
            cursorAt: {
                left: 5,
                top: 10
            },
            items: "li.codeOperator"
        })
        $("<div></div>").addClass("margin-helper").appendTo(bcul);
        // 添加数据项
        bc._codeNodes.forEach(cn => {
            let bo = $("<li></li>")
                .addClass("codeOperator")
                .data("dataObject", cn)
                .appendTo(bcul)
                .append("<div></div>")
                .append($("<tooltip></tooltip>").BindProperty(cn, "name", "display"))
                .click(function (e) {
                    AddCodeTab(cn);
                    stopBubbling(e);
                });
        });
        $("<div></div>").addClass("margin-helper").appendTo(bcul);
    });

    mpData.bufferSections[0].LoadUI($("#bufferDiv"));


});




//#region Code标签相关
var tabs = $("#codeContentDiv").tabs({
    classes: {
        "ui-tabs-nav": "ui-tabs-xExtended"
    }
});
var targetScrollLeft = 0;   //辅助计算横向滚动位置
var tabCounter = 0;     //辅助变量，防止标签id重复

/**新增一个Code标签
 * @param {CodeDataPrototype} codeDataObject 对应的code数据项
 */
function AddCodeTab(codeDataObject) {
    // 检查标签是否重复
    if (!$("#codeContentDiv>ul>li").every(function (index) { if ($(this).data("codeDataObject") === codeDataObject) { tabs.tabs("option", "active", index); return false; } else return true; })) return;

    var newTabId = codeDataObject.name + tabCounter++;

    // 标签页
    var tabLi = $("<li></li>").append(
        $("<a href='#code" + newTabId + "'></a>").append(
            // Tab标题
            $("<tabTitle></tabTitle>").BindProperty(codeDataObject, "name", "display"),
            // Tab描述
            $("<tabDescription></tabDescription>").BindProperty(codeDataObject, "description", "display")
        ))
        .appendTo("#codeContentDiv>ul").data("codeDataObject", codeDataObject);
    // 标签内容
    var codeTextDiv = $("<div class='codeTextDiv' id='code" + newTabId + "'></div>").appendTo("#codeContentDiv");

    let codeTitle = $("<span></tabTitle>").BindProperty(codeDataObject, "name", "name").appendTo(codeTextDiv);

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
    distance: 15,
    stop: function (e, ui) {
        tabs.tabs("refresh");
        // 排序后自动选择最新标签
        tabs.tabs("option", "active", ui.item.index());
    },
    items: "li:not(.mainCodeLi)",    // 主代码项固定
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





mpData.bufferSections[0]._codeSection._codeNodes =
    [
        new CodeDataJavaScript("Funtion1", "用于把视角空间转换为某某空间"),
        new CodeDataJavaScript("Funtion2", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion3", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion4", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion5", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion6", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion7", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion8", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion9", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funtion10", "用于把视角空间转换为某某空间C2D"),
    ];
mpData.bufferSections[1]._codeSection._codeNodes =
    [
        new CodeDataJavaScript("Funtin1", "用于把视角空间转换为某某空间"),
        new CodeDataJavaScript("Funton2", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funton3", "用于把视角空间转换为某某空间C2D"),
        new CodeDataJavaScript("Funton4", "用于把视角空间转换为某某空间C2D"),
    ];

function Run() {
    //Save All
    $("[contenteditable = plaintext-only]").UpdateProperty();

    var script = "console.log('Run!');";
    mpData.bufferSections.forEach(bs => bs._codeSection._codeNodes.forEach(cn => script += "\n//----\n" + cn.codeJS));
    script += "$('canvas').RespondProperty();"
    $("pipeline").empty().append($("<script>< /script>").html(script));
}

$("#rB").click(Run);

