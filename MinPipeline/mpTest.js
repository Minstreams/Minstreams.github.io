/**总数据 */
var mpData = new MPData("test", "test");



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
            console.log($(this.constructor.name));
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
            __StopFrame();
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
                __StopFrame();
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
                __StopFrame();
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
        __StopFrame();
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
    // 添加按钮
    let addDiv = $("<div>+</div>").addClass("top-add").appendTo(bcDiv).disableSelection().click(function (e) {
        __StopFrame();
        let index = mpData.bufferSections.indexOf(bs);
        let newBs = new BufferSection("New", "New", [
            new BufferDataF1("Name", "Des"),
            new BufferDataF2("Name", "Des"),
            new BufferDataF3("Name", "Des"),
            new BufferDataF4("Name", "Des"),
            new BufferDataTexture("Name", "Des"),
            new BufferDataMatrix("Name", "Des"),
        ]);
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



/**新增一个Code标签
 * @param {CodeDataPrototype} codeDataObject 对应的code数据项
 */
function AddCodeTab(codeDataObject) {
    // 检查标签是否重复
    if (!$("#codeContentDiv>ul>li").every(function (index) { if (this.data("codeDataObject") === codeDataObject) { tabs.tabs("option", "active", index); return false; } else return true; })) return;

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


//#endregion



try {
    //运行代码
    function Run() {
        //停止之前的代码
        __StopFrame();
        //Save All 保存所有代码
        $(".codeText").UpdateProperty();

        //在控制台输出“Run！”并将整个代码块放入try中
        var script = "try{console.log('Run!');\n";
        //载入并整合代码
        script += mpData.codeToJs("mpData");
        //捕获异常，并输出到errorLog中
        script += "respondElements = respondElements.add('canvas');RespondEverything();\n}\ncatch(err){\n\t$('#errorLog').text('【ERROR】'+err.message+JSON.stringify(err.stack));\n}"
        //重置errorLog
        $('#errorLog').text("");

        //在下一帧开始运行
        requestAnimationFrame(function () {
            _stopMark = false;
            $("pipeline").empty().append($("<script>< /script>").html(script));
        });

    }
}
catch (err) {
    __StopFrame();
    $('#errorLog').text('【ERROR】' + err.message);
}



$("#rB").click(Run);
$("#dB").click(function () {
    $(".codeText").UpdateProperty();
    jstring = MPOS.stringify(mpData);

    console.log(jstring);
});
$("#cB").click(function () {
    location.reload(true);
});


//添加主函数标签
function AddMainEntryCodeTab(mpData) {
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
};

// 通过url参数载入对应数据，默认载入一个文件
var mpDataFile = getQueryString("mpData") || "default";
// try {
//     $.get("mpData/" + mpDataFile, function (data, status) {
//         MPOS.parse(mpData, data, "mpData");
//         console.log(mpDataFile);
//         console.log(data);

//         AddMainEntryCodeTab(mpData);
//         mpData.bufferSections.forEach(bs => AddBufferSectionTopDiv(mpData, bs));
//         $("#topDiv").children(".bufferSection").first().click();
//     });
// }
// catch (err) {
var daata = $("tempData").html();
MPOS.parse(mpData, daata, "mpData");
console.log(mpDataFile);
console.log(daata);

AddMainEntryCodeTab(mpData);
mpData.bufferSections.forEach(bs => AddBufferSectionTopDiv(mpData, bs));
$("#topDiv").children(".bufferSection").first().click();
// }

var tt1 = {
    a: 1,
    b: 2,
    length: 5
}
var tt2 = ['t1', 't2', 't3', 't4', 't5'];
tt1 = { ...tt1, ...tt2 };
function outAlertAll() {
    let out = '';
    for (a in arguments) {
        out += arguments[a] + '/';
    };
    alert(out);
}

outAlertAll(...Array.from(tt1));
// alert(JSON.stringify(tt1) + JSON.stringify(tt2) + tt1['y'] + tt2.y);
