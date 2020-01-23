/**总数据 */
var mpData = new MPData("test", "test");
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
    //$("#topDiv").addClass("edit-disable");


});

/**在顶部为BufferSection建立一个交互区域
 * @method 方法名
 * @for 所属类名
 * @param {MPData} mpData 数据容器
 * @param {BufferSection} bs 缓存区
 * @param {JQuery<HTMLElement>} preElement 可选参数，若不存在代表直接添加到最后一项，若存在，则插入到对应部分并播放过渡效果
 */
function AddBufferSectionTopDiv(mpData, bs, preElement) {
    // 数据项Section按钮
    let bsDiv = $("<div></div>")
        .addClass("bufferSection")
        .append($("<point></point>"))
        .append($("<tooltip></tooltip>").BindProperty(bs, "name", "display"))
        .appendTo("#topDiv")
        .data("bs", bs)
        .click(function () {
            bs = bsDiv.data("bs");
            console.log("Click!");

            $(this).addClass("bsSelected").siblings(".bsSelected").removeClass('bsSelected');
            bs.LoadUI($("#bufferDiv").empty());
        });
    if (preElement) preElement.after(bsDiv);
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
        scroll: false,
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
            if (!ui.item[0].parentNode) return;
            console.log("update", ui.item.index() + "|sender:" + (ui.sender ? ui.sender[0] : null) + "|data:" + ui.item.data("dataObject"));
            let fromArray = (ui.sender ? ui.sender : ui.item.parent()).data("dataArray");
            let toArray = ui.item.parent().data("dataArray");
            let dd = ui.item.data("dataObject");
            let data = fromArray.remove(ui.item.data("dataObject"));
            if (!data) {
                console.log("Data doesn't exist!");
                return;
            }
            toArray.splice(ui.item.index(), 0, data);
            if (ui.sender) {
                // bs块改变的时候聚焦到新块
                ui.item.parent().parent().click();
            }
            resortFunc();
        },
        beforeStop: function (event, ui) {
            if (ui.position.top > 150) {
                // 删除
                ui.item.parent().data("dataArray").remove(ui.item.data("dataObject"));
                ui.item.remove();
                bsul.sortable("refresh");
                resortFunc(true);
                bsDiv.trigger("click");
                stopBubbling(event);
            }
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
            .append($("<tooltip></tooltip>").BindProperty(dn, "name", "display"))
            .on("dragover", function () {
            });
    });
    // 初始化
    resortFunc();

    // codeSection按钮
    let bc = bs._codeSection;
    let bcDiv = $("<div class='codeSection'></div>")
        .addClass("codeSection")
        .append($("<line></line>"))
        .append($("<tooltip></tooltip>").BindProperty(bc, "name", "text"))
        .click(function () {
            bs = bsDiv.data("bs");
            console.log("section click");
            $(this).addClass("osSelected").siblings(".osSelected").removeClass('osSelected');
            bc._codeNodes.forEach(cn => AddCodeTab(cn));
        });
    bsDiv.after(bcDiv);
    // 排序
    let bcul = $("<ul></ul>").appendTo(bcDiv).data("dataArray", bc._codeNodes).sortable({
        axis: "x",
        connectWith: ".codeSection>ul",
        scroll: false,
        change: function (event, ui) {
            // 对空白表列做顺序调整
            let lp = ui.placeholder.filter(":last-child");
            lp.after(lp.prev());
        },
        update: function (event, ui) {
            // 在这里对数据排序
            if (!ui.item[0].parentNode) return;
            let fromArray = (ui.sender ? ui.sender : ui.item.parent()).data("dataArray");
            let toArray = ui.item.parent().data("dataArray");
            let data = fromArray.remove(ui.item.data("dataObject"));
            if (!data) return;
            toArray.splice(ui.item.index(), 0, data);

            bcDiv.addClass("osSelected").siblings(".osSelected").removeClass('osSelected');
        },
        stop: function (event, ui) {
            if (!ui.item[0].parentNode) return;
            AddCodeTab(ui.item.data("dataObject"));
        },
        beforeStop: function (event, ui) {
            if (ui.position.top > 150) {
                // 删除
                ui.item.parent().data("dataArray").remove(ui.item.data("dataObject"));
                ui.item.remove();
                bcul.sortable("refresh");
                stopBubbling(event);
            }
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
            .on("dragover", function () {
                console.log("Drop!" + $(this).position().left + "|" + $(this).position().top);
            })
            .click(function (e) {
                AddCodeTab(cn);
                stopBubbling(e);
            });
    });
    $("<div></div>").addClass("margin-helper").appendTo(bcul);

    // 删除按钮
    let removeDiv = $("<div>-</div>").addClass("top-remove").appendTo(bsDiv).disableSelection().click(function (e) {
        let index = mpData.bufferSections.indexOf(bs);
        if (index <= 0) {
            console.log("不允许删除第一个节点");
            return;
        }
        // 数据操作
        let preBs = mpData.bufferSections[index - 1];
        preBs._dataNodes = preBs._dataNodes.concat(bs._dataNodes);
        preBs._codeSection._codeNodes = preBs._codeSection._codeNodes.concat(bs._codeSection._codeNodes);
        mpData.bufferSections.splice(index, 1);
        // ui操作
        let preBcul = bsDiv.prev().children("ul").data("dataArray", preBs._codeSection._codeNodes);
        let preBsul = bsDiv.prev().prev().children("ul").data("dataArray", preBs._dataNodes);

        let cw = bsDiv.prev().width();
        let sw = bsDiv.width();

        let bsli = bsul.children("li").css("margin-left", cw + sw);
        preBsul.append(bsli).sortable("refresh").data("resortFunc")();
        bsli.css("margin-left", 0);
        preBcul.children("div").last().before(bcul.children("li"));

        preBsul.parent().click();

        bcDiv.animate({
            "flex-grow": 0
        }, "slow", "easeInCubic", function () { bsDiv.remove(); bcDiv.remove() });
        stopBubbling(e);
    }).append($("<tooltip></tooltip>").text("删除此数据节点"));
    let addDiv = $("<div>+</div>").addClass("top-add").appendTo(bcDiv).disableSelection().click(function (e) {
        let index = mpData.bufferSections.indexOf(bs);
        let newBs = new BufferSection("New", "New", [new BufferDataF1("Name", "Des"), new BufferDataTexture("Name", "Des")]);
        mpData.bufferSections.splice(index + 1, 0, newBs);
        AddBufferSectionTopDiv(mpData, newBs, bcDiv);
        stopBubbling(e);
    }).append($("<tooltip></tooltip>").text("在此插入新节点"));

    if (preElement) {
        // 如果是插入
        bcDiv.css("flex-grow", 0);
        bcDiv.animate({
            "flex-grow": 1
        }, "slow", "easeOutCubic");
        bsDiv.click();
    }
}






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

    let newTabId = codeDataObject.name + tabCounter++;

    // 标签页
    let tabLi = $("<li></li>").append(
        $("<a href='#code" + newTabId + "'></a>").append(
            // Tab标题
            $("<tabTitle></tabTitle>").BindProperty(codeDataObject, "name", "display"),
            // Tab描述
            $("<tabDescription></tabDescription>").BindProperty(codeDataObject, "description", "display")
        ))
        .appendTo("#codeContentDiv>ul").data("codeDataObject", codeDataObject);
    // 标签内容
    let codeTextDiv = $("<div id='code" + newTabId + "'></div>").addClass("codeTextDiv cm-s-codewarm").appendTo("#codeContentDiv");

    //**以下是对代码块的配置
    codeTextDiv.append(
        $("<span>// </span>").addClass("cm-comment"),
        $("<span></span>").addClass("cm-comment").BindProperty(codeDataObject, "description"),
        $("<br />").addClass("cm-comment"),
        $("<span>function </span>").addClass("cm-keyword"),
        $("<span></span>").addClass("cm-def").BindProperty(codeDataObject, "name", "name"),
        $("<span>(…){</span>").addClass("cm-operator")
    );

    //var codeTextArea = $("<div contenteditable='plaintext-only' spellcheck = 'false'></div>").BindProperty(codeDataObject, "codeText", "code").appendTo(codeTextDiv);
    let codeTextArea = $("<div></div>").BindProperty(codeDataObject, "codeText", "code").appendTo(codeTextDiv);

    codeTextDiv.append(
        $("<span>}</span>").addClass("cm-operator")
    );

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

    return tabLi;
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
    let max = $(this)[0].scrollWidth - $(this)[0].clientWidth;
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
    $(".codeText").UpdateProperty();

    var script = "console.log('Run!');";
    script += mpData.codeToJs("mpData");
    script += "$('canvas').RespondProperty();"
    $("pipeline").empty().append($("<script>< /script>").html(script));
}

var counter = 0;
var mpDataFile = getQueryString("mpData");
if (mpDataFile) {
    let filee = mpDataFile + ".txt";
    console.log($("mpData").load(filee));
}
if ($("mpData").text()) {
    console.log($("mpData").text());
    MPJSON.parse(mpData, $("mpData").text(), "mpData");
}

$("#rB").click(Run);
$("#dB").click(function () {
    jstring = MPJSON.stringify(mpData);

    console.log(jstring);
    $("mpData").text(jstring);
});

jstring = localStorage.getItem("mpDataString");
if (jstring) {
    console.log("【LoadData!】");
    MPJSON.parse(mpData, jstring, "mpData");

    localStorage.removeItem("mpDataString");
}

//添加主函数标签
(function AddMainEntryCodeTab(mpData) {
    let codeDataObject = mpData.mainCodeData;
    // 标签页
    let tabLi = $("<li></li>").addClass("mainCodeLi").append(
        $("<a href='#mainCode'></a>").append(
            // Tab标题
            $("<tabTitle></tabTitle>").BindProperty(codeDataObject, "name", "display"),
            // Tab描述
            $("<tabDescription></tabDescription>").BindProperty(codeDataObject, "description", "display")
        ))
        .appendTo("#codeContentDiv>ul").data("codeDataObject", codeDataObject);
    // 标签内容
    let codeTextDiv = $("<div id='mainCode'></div>").addClass("codeTextDiv cm-s-codewarm").appendTo("#codeContentDiv");
    //**以下是对代码块的配置
    codeTextDiv.append(
        $("<span>// </span>").addClass("cm-comment"),
        $("<span></span>").addClass("cm-comment").BindProperty(codeDataObject, "description", "display"),
        $("<br />").addClass("cm-comment"),
        $("<span>function </span>").addClass("cm-keyword"),
        $("<span></span>").addClass("cm-def").BindProperty(codeDataObject, "name", "display"),
        $("<span>(){</span>").addClass("cm-operator"),
        $("<div></div>").BindProperty(codeDataObject, "codeText", "code"),
        $("<span>}</span>").addClass("cm-operator")
    );
    // 刷新
    tabs.tabs("refresh");
    tabs.tabs("option", "active", 0);
    return tabLi;
})(mpData);

mpData.bufferSections.forEach(bs => AddBufferSectionTopDiv(mpData, bs));

$("#topDiv").children(".bufferSection").first().click();