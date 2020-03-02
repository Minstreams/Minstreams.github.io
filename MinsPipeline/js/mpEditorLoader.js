/**mp管线编辑器加载器
 * 用于加载管线编辑器页面
 * 依赖：
 * ·    mp套件
 * ·    jquery-ui.js
 */

async function _onload() {
    /**MP模块 */
    var _MP = await import('./modules/mpModule');
    /**存放当前mpData 
     * @type {typeof _MP.MPData.prototype}
     */
    var _mpData;

    //#region Code标签
    let tabCounter = 0;     //辅助变量，防止标签id重复
    let targetScrollLeft = 0;   //辅助计算横向滚动位置
    let tabs = $('#codeContentDiv').tabs({
        classes: {
            'ui-tabs-nav': 'ui-tabs-xExtended'
        }
    });
    tabs.find('.ui-tabs-nav')
        // Code标签排序功能
        .sortable({
            axis: 'x',
            distance: 15,
            stop: function (e, ui) {
                tabs.tabs('refresh');
                // 排序后自动选择最新标签
                tabs.tabs('option', 'active', ui.item.index());
            },
            items: 'li:not(.mainCodeLi)',    // 主代码项固定
        })
        // Code标签横向滚动
        .mousewheel(function (event) {
            /**左右滚动系数 */
            const myDeltaFactor = 0.25;
            targetScrollLeft -= event.deltaFactor * event.deltaY * myDeltaFactor;
            let max = $(this)[0].scrollWidth - $(this)[0].clientWidth;
            targetScrollLeft = targetScrollLeft < 0 ? 0 : targetScrollLeft > max ? max : targetScrollLeft;

            $(this).stop().animate({ scrollLeft: targetScrollLeft }, 'fast', 'easeOutCubic');
        });

    /**关闭一个Code标签
     * @param {typeof _MP.MPCodeData.prototype} codeDataObject 对应的code数据项
     */
    function CloseCodeTab(codeDataObject) {
        $('#codeContentDiv>ul>li').each(function () {
            if ($(this).data('codeDataObject') !== codeDataObject) return;
            $(this).data('codeTextDiv').remove();
            $(this).remove();
            tabs.tabs('refresh');
        });
    }
    /**新增一个Code标签
     * @param {(typeof _MP.MPCodeData.prototype)[]} codeDataObjects 对应的code数据项
     */
    function AddCodeTab(...codeDataObjects) {
        let newTabliIndex = -1;
        let out = $();
        for (codeDataObject in codeDataObjects) {
            // 检查标签是否重复
            if (!$('#codeContentDiv>ul>li').every(function (index) { if (this.data('codeDataObject') !== codeDataObject) return true; tabs.tabs('option', 'active', index); return false; })) continue;
            let newTabId = codeDataObject.name + tabCounter++;
            // 标签内容
            let codeTextDiv = $('<div id=\'code' + newTabId + '\'></div>').appendTo('#codeContentDiv').MPLoadWidget(codeDataObject, codeDataObject === _mpData.mainCode ? 'editable' : 'fullControl');
            // 标签页
            let tabLi = $('<li></li>')
                .append(
                    $('<a href=\'#code' + newTabId + '\'></a>').append(
                        // Tab标题
                        $('<tabTitle></tabTitle>').BindProperty(codeDataObject, 'name', 'display'),
                        // Tab描述
                        $('<tabDescription></tabDescription>').BindProperty(codeDataObject, 'description', 'display')
                    ),
                    // 标签关闭按钮
                    $('<div></div>').addClass('ui-tabs-close').click(function () {
                        // 点击时删除此标签
                        CloseCodeTab(codeDataObject);
                    })
                )
                .appendTo('#codeContentDiv>ul')
                .data('codeDataObject', codeDataObject)
                .data('codeTextDiv', codeTextDiv);
            newTabliIndex = tabLi.index();
            out.add(tabLi);
        }
        if (newTabliIndex !== -1) {
            // 刷新并选中新项
            tabs.tabs('refresh');
            tabs.tabs('option', 'active', newTabliIndex);
        }
        return out;
    }
    //#endregion
    /**加载缓存节界面
     * @param {typeof _MP.MPBufferSection.prototype} bs 缓存节对象
     */
    function BSLoadPage() {
        let bDiv = $('#bufferDiv')
            .empty()
            .append($('<h2></h2>').BindProperty(bs, 'name', 'name'))
            .append($('<p></p>').BindProperty(bs, 'description'));
        $('.bsSelected').children('ul').children('li').each(function (i) { $('<div></div>').appendTo(bDiv).data('mpLi', $(this)).MPLoadWidget($(this).data('mpObject')); });
    }
    /**选择一个缓存节
     * @this {HTMLElement} 被选择的bsDiv
     */
    function BSSelect() {
        $(this).addClass('bsSelected').siblings('.bsSelected').removeClass('bsSelected');
        BSLoadPage();
    }
    $.fn.extend({
        /**删除数据项
         * @this {JQuery<HTMLElement>} bsli
         * @return {JQuery<HTMLElement>} bsul
         */
        BSDelete() {
            let bsul = this.parent();
            // 删除数据
            bsul.data('mpArray').remove(this.data('mpObject'));
            // 删除UI
            this.remove();
            // 重新排序、重新聚焦
            return bsul.BSResort(true).parent().click();
        },
        /**添加数据项
         * @this {JQuery<HTMLElement>} bsul
         * @return {JQuery<HTMLElement>} bsli
         */
        BSAdd(...dataNodes) {
            let out = $();
            for (dn in dataNodes) {
                out.add($('<li></li>')
                    .addClass('bufferOperator ' + dn.constructor.name)
                    .data('mpObject', dn)
                    .appendTo(this)
                    .data('lastParent', this)
                    // 这是实际显示效果
                    .append('<div></div>')
                    .append($('<tooltip></tooltip>').BindProperty(dn, 'name', 'readonly'))
                    // .on('dragover', function () {})  //？？？
                );
            }
            this.BSResort(true).parent().click();
            return out;
        },
        /**对圆环上的数据项进行排列 
         * @this {JQuery<HTMLElement>} bsul
         */
        BSResort(withoutHolder) {
            // todo 在此停止代码运行
            let els = this.find('li').not('.ui-sortable-helper');
            if (withoutHolder) els = els.not('.ui-sortable-placeholder');
            // console.log('resort!' + els.length);
            els.each(function (i, e) {
                let angle = ((i + 1) / (els.length + 1)) * 2 * Math.PI;
                let o = 17;
                let r = 18;
                $(this).css({
                    left: (o + r * Math.cos(angle)) + 'px',
                    top: (o - r * Math.sin(angle)) + 'px'
                });
            });
            return this.sortable('refresh');
        },
        /**缓存节按钮初始化 
         * @this {JQuery<HTMLElement>} bsDiv
         * @param {typeof _MP.MPBufferSection.prototype} bs 缓存节
         */
        BSInit(bs) {
            this.addClass('bufferSection')
                .data('mpObject', bs)
                .click(BSSelect)
                .append(
                    $('<point></point>'),
                    $('<tooltip></tooltip>').BindProperty(bs, 'name', 'readonly'),
                    $('<ul></ul>').data('mpArray', bs._dataNodes).sortable({
                        connectWith: '.bufferSection>ul',   // 定义同类筛选器
                        scroll: false,
                        start: function (event, ui) {
                            let hp = ui.item.position();
                            ui.placeholder.css({
                                left: hp.left,
                                top: hp.top
                            });
                            ui.item.data('lastParent', ui.item.parent()[0]);
                        },
                        change: function (event, ui) {
                            if (ui.sender) return;  // 去掉一个重复的调用
                            // console.log('change' + (ui.sender ? '|sender:' + ui.sender.parent().index() : ''));

                            let lp = ui.item.data('lastParent');
                            let cp = ui.placeholder.parent()[0];
                            if (lp !== cp)
                                $(lp).BSResort();
                            $(cp).BSResort();
                            ui.item.data('lastParent', cp);
                        },
                        update: function (event, ui) {
                            // 在这里对元素重新排序
                            if (!ui.item[0].parentNode) return; // 元素悬空不排序
                            console.log('update', ui.item.index() + '|sender:' + (ui.sender ? ui.sender[0] : null) + '|data:' + ui.item.data('mpObject'));
                            let fromArray = (ui.sender ? ui.sender : ui.item.parent()).data('mpArray');
                            let toArray = ui.item.parent().data('mpArray');
                            let data = fromArray.remove(ui.item.data('mpObject'));
                            if (!data) {
                                // todo 如果一直不出现这个警告，可以吧这很多行代码简化
                                console.warn('Data doesn\'t exist!');
                                return;
                            }
                            toArray.splice(ui.item.index(), 0, data);
                            // 重新排序、重新聚焦
                            ui.item.parent().BSResort().parent().click();
                        },
                        beforeStop: function (event, ui) {
                            if (ui.position.top > 150) {
                                ui.item.BSDelete();
                                stopBubbling(event);    //已经删除，不触发Update事件
                            }
                        },
                        placeholder: 'placeholder',
                        cursorAt: {
                            left: 5,
                            top: 5
                        },
                    })
                        // 添加数据项
                        .BSAdd(...bs._dataNodes)
                );
            return this;
        },
        /**删除代码项
         * @this {JQuery<HTMLElement>} csli
         * @return {JQuery<HTMLElement>} csul
         */
        CSDelete() {
            // todo 在这里停止运行
            let codeNode = this.data('mpObject');
            let csul = this.parent();
            // 关掉代码标签
            CloseCodeTab(codeNode);
            // 删除数据
            csul.data('mpArray').remove(codeNode);
            // 删除UI
            this.remove();
            // 重新排序、重新聚焦
            return csul.sortable('refresh');
        },
        /**添加代码项
         * @this {JQuery<HTMLElement>} csul
         * @return {JQuery<HTMLElement>} csli
         */
        CSAdd(...codeNodes) {
            let out = $();
            for (cn in codeNodes) {
                out.add($('<li></li>')
                    .addClass('codeOperator')
                    .data('mpObject', cn)
                    .appendTo(this)
                    // 这是实际显示效果
                    .append('<div></div>')
                    .append($('<tooltip></tooltip>').BindProperty(cn, 'name', 'readonly'))
                    .on('dragover', function () {
                        console.log('Drop!' + $(this).position().left + '|' + $(this).position().top);
                    })
                    .click(function (e) {
                        AddCodeTab(cn);
                        stopBubbling(e);
                    })
                );
            }
            this.sortable('refresh');
            return out;
        },
        /**代码节按钮初始化 
         * @this {JQuery<HTMLElement>} csDiv
         * @param {typeof _MP.MPCodeSection.prototype} cs 缓存节
         */
        CSInit(cs) {
            this.addClass('codeSection')
                .data('mpObject', cs)
                .click(function () {
                    $(this).addClass('csSelected').siblings('.csSelected').removeClass('csSelected');
                    AddCodeTab(...cs._codeNodes);
                })
                .append(
                    $('<line></line>'),
                    $('<tooltip></tooltip>').BindProperty(cs, 'name', 'text'),
                    $('<ul></ul>').data('mpArray', cs._codeNodes).sortable({
                        axis: 'x',
                        connectWith: '.codeSection>ul',
                        scroll: false,
                        change: function (event, ui) {
                            // 对空白表列做顺序调整
                            let lp = ui.placeholder.filter(':last-child');
                            lp.after(lp.prev());
                        },
                        update: function (event, ui) {
                            // 在这里对数据排序
                            if (!ui.item[0].parentNode) return; // 元素悬空不排序
                            let fromArray = (ui.sender ? ui.sender : ui.item.parent()).data('mpArray');
                            let toArray = ui.item.parent().data('mpArray');
                            let data = fromArray.remove(ui.item.data('mpObject'));
                            if (!data) {
                                // todo 如果一直不出现这个警告，可以吧这很多行代码简化
                                console.warn('Data doesn\'t exist!');
                                return;
                            }
                            toArray.splice(ui.item.index(), 0, data);

                            ui.item.parent().parent().addClass('csSelected').siblings('.csSelected').removeClass('csSelected');
                        },
                        stop: function (event, ui) {
                            if (!ui.item[0].parentNode) return;
                            AddCodeTab(ui.item.data('mpObject'));
                        },
                        beforeStop: function (event, ui) {
                            if (ui.position.top > 150) {
                                // 删除
                                ui.item.CSDelete();
                                stopBubbling(event)
                            }
                        },
                        placeholder: 'placeholder codeOperator',
                        cursorAt: {
                            left: 5,
                            top: 10
                        },
                        items: 'li.codeOperator'
                    })
                        .append($('<div></div>').addClass('margin-helper'))
                        .CSAdd(...cs._codeNodes)
                        .append($('<div></div>').addClass('margin-helper'))
                );
            return this;
        },
    });
    /**添加一个管线节
     * @param {typeof _MP.MPSection.prototype} section 管线节
     */
    function addSection(section) {
        let bs = section.bufferSection;
        let cs = section.codeSection;

        // 缓存节按钮
        let bsDiv = $('<div></div>').appendTo('#topDiv').BSInit(bs);
        // codeSection按钮
        let csDiv = $('<div></div>').appendTo('#topDiv').CSInit(cs);

        if (preElement) {
            preElement.after(bsDiv);
            bsDiv.after(csDiv);
        }

        // 删除按钮
        let removeDiv = $('<div>-</div>').addClass('top-remove').appendTo(bsDiv).disableSelection().click(function (e) {
            __StopFrame();
            let index = mpData.bufferSections.indexOf(bs);
            if (index <= 0) {
                console.log('不允许删除第一个节点');
                return;
            }
            // 数据操作
            let preBs = mpData.bufferSections[index - 1];
            preBs._dataNodes = preBs._dataNodes.concat(bs._dataNodes);
            preBs._codeSection._codeNodes = preBs._codeSection._codeNodes.concat(bs._codeSection._codeNodes);
            mpData.bufferSections.splice(index, 1);
            // ui操作
            let precsul = bsDiv.prev().children('ul').data('mpArray', preBs._codeSection._codeNodes);
            let preBsul = bsDiv.prev().prev().children('ul').data('mpArray', preBs._dataNodes);

            let cw = bsDiv.prev().width();
            let sw = bsDiv.width();

            let bsli = bsul.children('li').css('margin-left', cw + sw);
            preBsul.append(bsli).sortable('refresh').data('resortFunc')();
            bsli.css('margin-left', 0);
            precsul.children('div').last().before(csul.children('li'));

            preBsul.parent().click();

            csDiv.animate({
                'flex-grow': 0
            }, 'slow', 'easeInCubic', function () { bsDiv.remove(); csDiv.remove() });
            stopBubbling(e);
        }).append($('<tooltip></tooltip>').text('删除此数据节点'));
        // 添加按钮
        let addDiv = $('<div>+</div>').addClass('top-add').appendTo(csDiv).disableSelection().click(function (e) {
            __StopFrame();
            let index = mpData.bufferSections.indexOf(bs);
            let newBs = new BufferSection('New', 'New', [
                new BufferDataF1('Name', 'Des'),
                new BufferDataF2('Name', 'Des'),
                new BufferDataF3('Name', 'Des'),
                new BufferDataF4('Name', 'Des'),
                new BufferDataTexture('Name', 'Des'),
                new BufferDataMatrix('Name', 'Des'),
            ]);
            mpData.bufferSections.splice(index + 1, 0, newBs);
            AddBufferSectionTopDiv(mpData, newBs, csDiv);
            stopBubbling(e);
        }).append($('<tooltip></tooltip>').text('在此插入新节点'));

        if (preElement) {
            // 如果是插入
            csDiv.css('flex-grow', 0);
            csDiv.animate({
                'flex-grow': 1
            }, 'slow', 'easeOutCubic');
            bsDiv.click();
        }
    }

}





