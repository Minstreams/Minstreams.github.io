/**mp控件加载器
 * 用于在浏览器界面中加载mp控件
 * 
 * 标签属性:{
 *      class: mpBuffer|mpCode,     // 数据项|代码项
 *      data: number,               // mpData数据的序号，默认为0
 *      section: id|name,           // 节的序号|名称
 *      node: id|name,              // 节点序号|名称
 *      authority: fullControl/editable(default)/readonly    //控件的权限
 * }
 */
/**@type {typeof import('./modules/mpModule')} */
var _MP;

/**存放所有的mpData 
 * @type {Array<typeof _MP.MPData.prototype>}
 */
var _mpData = [];


async function _onload() {
    /**MP模块 */
    _MP = await import('./modules/mpModule');

    $('mpData>pre').each(function () {
        _mpData.push(_MP.MPOS.parse(this.innerHTML));
    });
    $('.mpBuffer').each(function (i) {
        if ($(this).attr('section') === undefined || $(this).attr('node') === undefined) {
            error('mpBuffer requires attributes "section" & "node"!');
            return;
        }
        let index = parseInt($(this).attr('data')) || 0;
        let section = parseInt($(this).attr('section'));
        let node = parseInt($(this).attr('node'));
        let authority = $(this).attr('authority') || 'editable';
        $(this).MPLoadWidget(section < 0 ? _mpData[index].uniformSection.bufferSection._dataNodes[node] : _mpData[index].sections[section].bufferSection._dataNodes[node], authority);
    });
    $('.mpCode').each(function (i) {
        if ($(this).attr('node') === undefined) {
            error('mpCode requires attributes "node"!');
            return;
        }
        let node = parseInt($(this).attr('node'));
        if ($(this).attr('section') === undefined && node >= 0) {
            error('mpCode requires attributes "section"!');
            return;
        }
        let index = parseInt($(this).attr('data')) || 0;
        let section = parseInt($(this).attr('section'));
        let authority = $(this).attr('authority') || 'editable';
        $(this).MPLoadWidget(node < 0 ? _mpData[index].mainCode : section < 0 ? _mpData[index].uniformSection.codeSection._codeNodes[node] : _mpData[index].sections[section].codeSection._codeNodes[node], authority);
        $(this).on('keyup', () => $('.codeText').ApplyProperty());
    });

    $('mpData').data('preUpdateFunc', function () {
        console.log("sad");
        try {
            for (let i = 0; i < _mpData.length; ++i) {
                _mpData[i].Run();
            }
        }
        catch (err) {
            error(err);
        }
    });
    _MP.UpdateAll();


}