/**整合所有MP模块
 * 
 * js模块的引用结构应该是这样：
 * mpCore.js           //核心数据结构
 * -   mpDataNodes.js      //数据项定义
 *     -   mpWidgets.js        //控件功能
 *     mpSerialization.js  //数据序列化功能
 *     mpCompilation.js    //代码编译运行功能 
 * 
 * 以上，缩进代表依赖引用结构，缩进相同的项平行，子项依赖父项
 */
export * from './mpCore.js';
export * from './mpDataNodes.js';
export * from './mpWidgets.js';
export * from './mpSerialization.js';
export * from './mpCompilation.js';


console.log(JSON.stringify(import.meta));