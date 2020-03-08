/**mp管线编辑器加载器
 * 用于加载管线编辑器页面
 * 依赖：
 * ·    mp套件
 * ·    jquery-ui.js
 */
/**MP模块 */
var _MP;
var mo;
/**存放当前mpData 
 * @type {typeof _MP.MPData.prototype}
 */
var _mpData;
async function _onload() {
    _MP = await import('./modules/mpModule.js');
    //#region Code标签
    let tabCounter = 0;     //辅助变量，防止标签id重复
    let targetScrollLeft = 0;   //辅助计算横向滚动位置
    let tabs = $('#codeDiv').tabs({
        classes: {
            'ui-tabs-nav': 'ui-tabs-xExtended'
        }
    });
    {
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
    }
    /**关闭一个Code标签
     * @param {typeof _MP.MPCodeData.prototype} codeDataObject 对应的code数据项
     */
    function CloseCodeTab(codeDataObject) {
        $('#codeDiv>ul>li').each(function () {
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
        codeDataObjects.forEach(codeDataObject => {
            // 检查标签是否重复
            if (!$('#codeDiv>ul>li').every(function (index) { if ($(this).data('codeDataObject') !== codeDataObject) return true; tabs.tabs('option', 'active', index); return false; })) return;
            let newTabId = codeDataObject.name + tabCounter++;
            let isMainCode = codeDataObject === _mpData.mainCode;
            // 标签内容
            let codeTextDiv = $('<div id=\'code' + newTabId + '\'></div>').appendTo('#codeDiv').MPLoadWidget(codeDataObject, isMainCode ? 'editable' : 'fullControl');
            // 标签页
            let tabLi = $('<li></li>')
                .append(
                    $('<a href=\'#code' + newTabId + '\'></a>').append(
                        // Tab标题
                        $('<tabTitle></tabTitle>').BindProperty(codeDataObject, 'name', 'readonly'),
                        // Tab描述
                        $('<tabDescription></tabDescription>').BindProperty(codeDataObject, 'description', 'readonly')
                    ).css('outline', 'none')
                )
                .appendTo('#codeDiv>ul')
                .data('codeDataObject', codeDataObject)
                .data('codeTextDiv', codeTextDiv);
            if (!isMainCode) {
                tabLi.append(
                    // 标签关闭按钮
                    $('<div></div>').addClass('ui-tabs-close').click(function () {
                        // 点击时删除此标签
                        CloseCodeTab(codeDataObject);
                    })
                );
            } else {
                tabLi.addClass('mainCodeLi').on('dragstart', function () { return false; });
            }
            newTabliIndex = tabLi.index();
            out.add(tabLi);
        });
        if (newTabliIndex !== -1) {
            // 刷新并选中新项
            tabs.tabs('refresh');
            tabs.tabs('option', 'active', newTabliIndex);
        }
        _MP.UpdateAll();
        return out;
    }
    //#endregion
    //#region Top
    /**管线编辑状态 */
    var _mpEdit = false;

    /**选择一个缓存节
     * @this {HTMLElement} 被选择的bsDiv
     */
    function BSSelect() {
        $('.bsSelected').removeClass('bsSelected');
        $(this).addClass('bsSelected');
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
         * @return {JQuery<HTMLElement>} bsul
         */
        BSAdd(...dataNodes) {
            let bsdns = this.data('mpArray');
            dataNodes.forEach(dn => {
                $('<li></li>')
                    .addClass('bufferOperator ' + dn.constructor.name)
                    .data('mpObject', dn)
                    .appendTo(this)
                    .data('lastParent', this)
                    // 这是实际显示效果
                    .append('<div></div>')
                    .append($('<tooltip></tooltip>').BindProperty(dn, 'name', 'readonly'))
                    // .on('dragover', function () {})  //？？？
                    ;
                if (!bsdns.includes(dn)) bsdns.push(dn);
            });
            this.BSResort(true).parent().click();
            return this;
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
                let o = 27;
                let r = 22;
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
                            let data = (ui.sender ? ui.sender : ui.item.parent()).data('mpArray').remove(ui.item.data('mpObject'));
                            if (!data) { /**移到新节后会调用两次update，其中一次没有data */ return; }
                            console.log('update', ui.item.index() + '|sender:' + (ui.sender ? ui.sender[0] : null) + '|data:' + ui.item.data('mpObject'));
                            ui.item.parent().data('mpArray').splice(ui.item.index(), 0, data);
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
         * @return {JQuery<HTMLElement>} csul
         */
        CSAdd(...codeNodes) {
            let csdns = this.data('mpArray');
            codeNodes.forEach(cn => {
                $('<li></li>')
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
                    ;
                if (!csdns.includes(cn)) csdns.push(cn);
            });
            return this.sortable('refresh');
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
                        update: function (event, ui) {
                            // 在这里对数据排序
                            if (!ui.item[0].parentNode) return; // 元素悬空不排序
                            let data = (ui.sender ? ui.sender : ui.item.parent()).data('mpArray').remove(ui.item.data('mpObject'));
                            if (!data) {/**移到新节后会调用两次update，其中一次没有data */return; }
                            console.log('update', ui.item.index() + '|sender:' + (ui.sender ? ui.sender[0] : null) + '|data:' + ui.item.data('mpObject'));
                            ui.item.parent().data('mpArray').splice(ui.item.index(), 0, data);

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
                        .CSAdd(...cs._codeNodes)
                );
            return this;
        },
        /**特化于编辑器的加载控件方法 */
        MPLoadEditorWidget(mpObject) {
            this.MPLoadWidget(mpObject)
                .append($('<div>↕</div>').addClass('dragHandler'));
            return this;
        }
    });
    /**添加一个管线节
     * @param {typeof _MP.MPSection.prototype} section 管线节
     */
    function addSection(section, preElement) {
        let bs = section.bufferSection;
        let cs = section.codeSection;

        // 缓存节按钮
        let bsDiv = $('<div></div>').appendTo('#sectionDiv').BSInit(bs);
        // codeSection按钮
        let csDiv = $('<div></div>').appendTo('#sectionDiv').CSInit(cs);

        if (preElement) {
            preElement.after(bsDiv);
            bsDiv.after(csDiv);
        }

        // 删除按钮
        let removeDiv = $('<div>-</div>').addClass('top-remove').appendTo(bsDiv).disableSelection().click(function (e) {
            // todo 在此停止代码运行
            let index = _mpData.sections.indexOf(section);
            if (index <= 0) {
                // 第一个节点的删除按钮在画面外面，一般来说是点不到的
                console.warn('不允许删除第一个节点');
                return;
            }
            // 数据操作
            let pres = _mpData.sections[index - 1];
            pres.bufferSection._dataNodes = pres.bufferSection._dataNodes.concat(bs._dataNodes);
            pres.codeSection._codeNodes = pres.codeSection._codeNodes.concat(cs._codeNodes);
            _mpData.sections.splice(index, 1);

            // ui操作
            let preCsDiv = bsDiv.prev();
            let preCsul = preCsDiv.children('ul').data('mpArray', pres.codeSection._codeNodes);
            let preBsDiv = preCsDiv.prev();
            let preBsul = preBsDiv.children('ul').data('mpArray', pres.bufferSection._dataNodes);

            let bsli = bsDiv.children('ul').children('li').css('margin-left', preCsDiv.width() + bsDiv.width());
            preBsul.append(bsli).sortable('refresh').BSResort();
            bsli.css('margin-left', 0);
            preCsul.children('div').last().before(csDiv.children('ul').children('li'));

            preBsDiv.click();

            csDiv.animate({
                'flex-grow': 0
            }, 'slow', 'easeInCubic', function () { bsDiv.remove(); csDiv.remove() });
            stopBubbling(e);
        }).append($('<tooltip></tooltip>').text('删除此数据节点'));
        // 添加按钮
        let addDiv = $('<div>+</div>').addClass('top-add').appendTo(csDiv).disableSelection().click(function (e) {
            // todo 在此停止代码运行
            let index = _mpData.sections.indexOf(section);
            let newsec = new _MP.MPSection();
            _mpData.sections.splice(index + 1, 0, newsec);
            addSection(newsec, csDiv);
            stopBubbling(e);
        }).append($('<tooltip></tooltip>').text('在此插入新节点'));
        if (_mpEdit) removeDiv.add(addDiv).css('visibility', 'visible');

        if (preElement) {
            // 如果是插入
            csDiv.css('flex-grow', 0);
            csDiv.animate({
                'flex-grow': 1
            }, 'slow', 'easeOutCubic');
            bsDiv.click();
        }
    }

    /**加载缓存节界面
     * @param {typeof _MP.MPBufferSection.prototype} bs 缓存节对象
     */
    function BSLoadPage() {
        let bsDiv = $('.bsSelected');
        let bs = bsDiv.data('mpObject');
        let bDiv = $('#bufferDiv').empty();
        bsDiv.children('ul').children('li:data(mpObject)').each(function (i) { $('<div></div>').appendTo(bDiv).data('mpLi', $(this)).MPLoadEditorWidget($(this).data('mpObject')); });
        let isUniform = bs === _mpData.uniformSection.bufferSection;
        $('#bsTitleDiv>div').UnbindProperty().BindProperty(bs, 'name', isUniform ? 'readonly' : 'text');
        $('#bsTitleDiv>span').UnbindProperty().BindProperty(bs, 'description', isUniform ? 'readonly' : 'text');
        _MP.UpdateAll();
    }
    /**停止代码运行 */
    function StopRunning() {
        $('#errorLog').text('');
    }

    {
        // 添加新缓存数据按钮
        $('#toolAddData').click(function () {
            $('.bsSelected').children('ul').BSAdd(new _MP.MPF1());
        });
        // 添加新代码数据按钮
        $('#toolAddCn').click(function () {
            $('.bsSelected').next().children('ul').CSAdd(new _MP.MPCodeData());
            _MP.UpdateAll();
        });
        // 保存数据
        $('#toolSave').click(function () {
            $('.codeText').ApplyProperty();
            jstring = _MP.MPOS.stringify(_mpData);

            console.log(jstring);

            // $.get({
            //     url: '/MinsPipeline/mpData/getMPData.php',
            //     data: {
            //         'table': 'test',
            //         'name': 'kkk'
            //     }
            // }, function (data, status) {
            //     $("#ef").html(data);
            // });
            $.post(
                '/MinsPipeline/mpData/postMPData.php',
                {
                    'table': 'test',
                    'name': _mpData.name,
                    'description': _mpData.description,
                    'data': jstring
                }
                , function (data, status) {
                    $("#errorLog").html(data);
                });
        });
        // 运行代码
        $('#toolRunCode').click(function () {
            StopRunning();
            $('.codeText').ApplyProperty();
            try {
                _mpData.Run();
            }
            catch (err) {
                $('#errorLog').text(err.stack);
            }
            _MP.UpdateAll();
        });
        // 切换到全局变量
        $('#toolUniformNav').click(function () {
            $('#toolUniformNav').add('#sectionDiv').css('display', 'none');
            $('#toolPipelineNav').css('display', 'block');
            $('#uniformDiv').css('display', 'flex').children('.bufferSection').click();
        });
        // 切换到管线变量
        $('#toolPipelineNav').click(function () {
            $('#toolPipelineNav').add('#uniformDiv').css('display', 'none');
            $('#toolUniformNav').css('display', 'block');
            $('#sectionDiv').css('display', 'flex').children('.bufferSection').first().click();
        });
        // 打开管线编辑状态
        $('#toolEditSectionOff').click(function () {
            $('#sectionDiv .top-add').add('#sectionDiv .top-remove').css('visibility', 'visible');
            $(this).css('display', 'none');
            $('#toolEditSectionOn').css('display', 'block');
            _mpEdit = true;
        });
        // 关闭管线编辑状态
        $('#toolEditSectionOn').click(function () {
            $('#sectionDiv .top-add').add('#sectionDiv .top-remove').css('visibility', 'hidden');
            $(this).css('display', 'none');
            $('#toolEditSectionOff').css('display', 'block');
            _mpEdit = false;
        });
    }
    $('#topDiv>#toolDiv>#toolYClamper>.toolSection>div').addClass('noselect');
    $('#bufferDiv').sortable({
        handle: ".dragHandler",
        axis: 'y',
    });


    // 通过url参数载入对应数据，默认载入一个文件
    var mpDataFile = getQueryString('mpData') || 'default';
    $.get('/MinsPipeline/mpData/' + mpDataFile, function (data, status) {
        _mpData = _MP.MPOS.parse(data);
        console.log(mpDataFile);
        console.log(data);

        AddCodeTab(_mpData.mainCode);
        _mpData.sections.forEach(s => addSection(s));
        $('#mpInfo>h2').BindProperty(_mpData, 'name', 'text');
        $('#mpInfo>p').BindProperty(_mpData, 'description', 'text');
        $('#uniformDiv').append(
            $('<div></div>').BSInit(_mpData.uniformSection.bufferSection),
            $('<div></div>').CSInit(_mpData.uniformSection.codeSection)
        ).children('.bufferSection').click();
    });

    __showTutorial();
}





