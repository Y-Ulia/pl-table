# pl-table  当前版本: "version": "2.2.0"
> 一个表格插件（完美解决万级数据渲染卡顿问题）

> 流畅渲染万级数据并不会影响到el-table的原有功能

> element版本兼容：目前测试能兼容的element-ui的版本为 2.3.9 - 2.11.1(不代表高版本就不能使用)

> author: pengLei

# way to install
> npm i pl-table vuedraggable

# 用前须知 (如果你使用 use-virtual（渲染大数据） 请看如下图)
   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/tishi.png)

## 引入方式 如下
``` javascript
  // main.js
  // 注：需要在Vue.use(ElementUi) 之前引入 （因为基于ele，所以需要安装element）
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import plTable from 'pl-table'
  Vue.use(ElementUI);
  Vue.use(plTable);

  new Vue({
    el: '#app',
    render: h => h(App)
  });
```

# 报错(使用注意点)
  原因：内置组件采用JSX写法
```shell
    error  in ./node_modules/pl-table/package/src/virtual-table-header-render.js
    Module parse failed: Unexpected token (64:8)
    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
    |   if (isGroup) this.$parent.isGroup = true;
    |   return (
    >         <table
    |     class="el-table__header"
    |       cellspacing="0"
```

# 解决上诉问题
   如果你使用的是vue-cli 2.x  配置如下
   第一步:

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/method2.png)
   第二步:

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/method.png)


   如果你使用的是vue-cli 3.x  配置如下
   第一步:

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/vue3method.png)
   第二步:

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/vue3method2.png)

# 实例文件（基础用法）
  https://github.com/livelyPeng/pl-table/blob/master/Example/index.vue

# Component API
  https://github.com/penglei1996/pl-table/wiki/Component-API

# Attributes（表格属性）

属性  |  说明  |  类型  |  默认值
:----------: | -------  |  :-------:  |  :-------:
datas  |  表格数据  |  array  |  -
record-table-select  |  是否记录表格的选项id(必须保证行ID存在，且唯一) 默认为false （用于我表格每页选中项进行保存，切换分页，不会导致之前页勾选的选项消失）  |  boolean  |  false
drop-action  |  是否开启掉落元素 （注：就是在表格列中多加一项，用来解决拖动表格引起的表格宽度变小问题，多加一列，页面是看不见的。） |  boolean  |  true
border  |  是否显示纵向边框  |  boolean  |  true
show-summary | 是否需要合计 |  boolean  | false
highlight-current-row | 是否要高亮当前行 |  boolean  | true
stripe | 是否为斑马纹 | boolean | false
sum-text | 合计行第一列的文本 |	String | "合计"2字
row-key | 支持树类型的数据 | String | -
header-drag-style |  是否修改表格的头部拖动样式 | Boolean | false
use-virtual | 是否开启虚拟滚动 (解决大数据渲染卡顿问题) | Boolean | false
row-height | 行高(必须要设置正确的行高，否则会导致表格计算不正确) 最后与CSS设置的表格行高一致，| Number | 60
height-change | 是否开启表格高度随数据多少而变化，如数据少的时候，想把分页放在底部（永远处于底部） | Boolean | true
excess-rows |	可视区域上方和下方额外渲染的行数，行数越多表格接替渲染效果越好，但越耗性能	| Number | 3
paging-scroll | 跳转分页是否需要把表体滚动条回到顶部及左侧 | Boolean | true
total-option | 需要合计的选项（需要开启showSummary：true） |   totalOption格式如下 = [{ label: '金额', // 需要合计的表头名 unit: '元' // 合计出来的单位名 }] | []

# Methods（表格的方法, 可以在组件上绑定ref 然后使用  this.$refs.plTable.方法名（））

方法名  |  说明  |  参数
:----------: | -------  |  :-------:
toggleAllSelection  |  用于多选表格，切换所有行的选中状态  |  -
clearSelection |  用于表格多选，清空用户的选择 | -
toggleRowSelection | 用于表格多选，切换某一行的选中状态 | rows  rows数据格式: [{  row: ror(需要显示的行row), selected: true 设置这一行选中与否（selected 为 true 则选中 }]
setHeight | 当窗口高度变化或者外层高度变化，就调用该方法（从而刷新表格高度） | -

# Events（表格的事件）

事件名  |  说明  |  参数
:----------: | -------  |  :-------:
@table-select-change | 整个表格Checkbox选中的row的id数组, 必须保证row（表格的行数据）存在id且唯一，没有ID可以自己造  注意 : 1. 当@handle-selection-change或者@select或者@select-all事件触发，就会触发这个事件 （可以用来回显表格勾选状态） 2. 参数为 tableSelectData， cancelSelectData  3.  第一个参数是当前表格（含分页）选中项id数组, 第二个参数是当前表格（含分页）取消项id数组  4. 该事件触发方式 需要设置表格属性  record-table-select：true// 具体看表格属性 | tableSelectData， cancelSelectData
@select-all	| 当用户手动勾选全选 Checkbox 时触发的事件 |	selection
@select  | 当用户手动勾选数据行的 Checkbox 时触发的事件 |	selection, row
@load-complete  | 当表格加载完成的事件回调 (当高度变化，数据变化，都会重新去计算表格，重新绘画表格，所以需要有些情况，想知道表格加载情况) |  plTable实例对象
@row-dblclick | 当某一行被双击时会触发该事件 | row, column, event
@expand-change	| 当用户对某一行展开或者关闭的时候会触发该事件 |	row, expandedRows
@row-click  | 当某一行被点击时会触发该事件  | row, column, event
@handle-selection-change | 当选择项发生变化时会触发该事件 | selection
@header-dragend  | 当拖动表头改变了列的宽度的时候会触发该事件  | newWidth, oldWidth, column, event

# Attributes（分页属性）

属性  |  说明  |  类型  |  默认值
:----------: | -------  |  :-------:  |  :-------:
paginationShow | 是否需要分页器 | Boolean  | true
pagerCount | 页码按钮的数量，当总页数超过该值时会折叠 | Number  | 5
page-sizes |	每页显示个数选择器的选项设置 | [number， number，number]  |	[10, 20, 30, 50]
ptTotal | 数据总条数 | Number | 0
pageSize | 每页条数 | Number | 1
currentPage | 当前页 | Number | 1
paginationLayout | 组件布局，子组件名用逗号分隔 | String | total, sizes, prev, pager, next, jumper

# Events（分页的事件）

事件名  |  说明  |  参数
:----------: | -------  |  :-------:
@handlePageSize | 获取当前分页的数据 | page,size

# Attributes（操作（显示字段）属性）

属性  |  说明  |  类型  |  默认值
:----------: | -------  |  :-------:  |  :-------:
dialogData | 选择显示字段数组 格式如下 [{ name: '我的', // 字段名 state: true, // 选择状态 disabled: true // 是否禁用 }] | Array  | []
showAmend  | 是否显示修改字段名按钮 | Boolean | false
fieldTitle  | 弹框的标题 | String |选择显示字段
amendBtnIcon  | 修改字段名按钮的图标字体 (必须是iconfont字体) | String | 'el-icon-edit'
field-sort | 显示字段是否排序（使用排序前  先安装vuedraggable， npm i vuedraggable） |  Boolean | true

# Events（操作（显示字段）的事件）

事件名  |  说明  |  参数
:----------: | -------  |  :-------:
@amend-field  | 修改单个字段按钮点击事件 |  row, index
@show-field  | 获取当前的需要显示的字段 |  当前的字段数组

# Methods（操作（显示字段）的方法）

方法名  |  说明  |  参数
:----------: | -------  |  :-------:
plDialogOpens | 打开弹窗 | -


