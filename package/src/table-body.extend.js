import ElementUi, {
  Table
} from 'element-ui'

import Mousewheel from 'element-ui/lib/directives/mousewheel'
import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';

import VirtualTableBodyRender from './virtual-table-body-render.js'
import VirtualTableHeaderRender from './virtual-table-header-render.js'

const ElTableBody = Table.components.TableBody // 表体
const ElTableHeader = Table.components.TableHeader // 头部

function trans (version) {
  const versionNums = version.toString().split('.')
  let result = Array.from({ length: 3 })

  result = result.map((_, idx) => {
    const num = versionNums[idx]

    if (!num) {
      return '00'
    } else {
      return +num < 10 ? `0${num}` : num
    }
  }).join('')

  return +result
}

const ElementUiVersion = trans(ElementUi.version) >= trans(2.8)

ElTableBody.directives = {
  Mousewheel
}

const oldDataComputed = ElTableBody.computed.data
ElTableBody.computed.data = function () {
  const { table } = this
  if (table.useVirtual) {
    return table.data.slice(table.start, table.end)
  } else {
    return oldDataComputed.call(this)
  }
}

const oldHoverRowHandler = ElTableBody.watch && ElTableBody.watch['store.states.hoverRow']
if (oldHoverRowHandler) {
  ElTableBody.watch['store.states.hoverRow'] = function (newVal, oldVal) {
    if (!this.table.useVirtual) {
      oldHoverRowHandler && oldHoverRowHandler.call(this, newVal, oldVal)
    }
  }
}

ElTableBody.methods.getIndex = function (index) {
  return this.table.start + index;
}

const oldGetRowClassHandler = ElTableBody.methods.getRowClass
ElTableBody.methods.getRowClass  = function (row, rowIndex) {
  let classes = oldGetRowClassHandler.call(this, row, rowIndex)
  if (this.table.useVirtual && rowIndex === this.store.states.hoverRow && (this.table.rightFixedColumns.length || this.table.fixedColumns.length)) {
    // 兼容element-ui低版本
    if (ElementUiVersion && Object.prototype.toString.call(classes) === '[object Array]') {
      classes.push('hover-row')
    } else if (typeof classes === 'string') {
      classes += ' hover-row'
    }
  }
  return classes
}

// 修改ele表体源码 （进行重新渲染）
const oldRender = ElTableBody.render
ElTableBody.render = function (h) {
  if (this.table.useVirtual) {
    return VirtualTableBodyRender.call(this, h)
  } else {
    return oldRender.call(this, h)
  }
}

const headerRender = ElTableHeader.render
// 修改ele头部源码 （进行重新渲染）
ElTableHeader.render = function (h) {
  const { table } = this
  // headerDragStyle,通过pl-table插件传递
  if (table.headerDragStyle) {
    if (table.$el) {
      const doms = document.querySelector('.ant-table-scroll')
      // 隐藏ele头部拖动的边框线
      doms.classList.add('pl-table-header-border-right-none')
    }
    return VirtualTableHeaderRender.call(this, h)
  } else {
    return headerRender.call(this, h)
  }
}

// 修改ele表体拖动方法(改变拖动手指样式)
ElTableHeader.methods.handleMouseMove = function (event, column) {
  const { table } = this
  if (column.children && column.children.length > 0) return;
  let target = event.target;
  while (target && target.tagName !== 'TH') {
    target = target.parentNode;
  }

  if (!column || !column.resizable) return;

  if (!this.dragging && this.border) {
    let rect = target.getBoundingClientRect();

    const bodyStyle = document.body.style;
    if (rect.width > 12 && rect.right - event.pageX < 8) {
      // 是否修改ele表体拖动方法(改变拖动手指样式) 通过pl-table插件传递
      if (table.headerDragStyle) {
        bodyStyle.cursor = 'ew-resize';
        if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'ew-resize';
        }
      } else {
        bodyStyle.cursor = 'col-resize';
        if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'col-resize';
        }
      }
      this.draggingColumn = column;
    } else if (!this.dragging) {
      bodyStyle.cursor = '';
      if (hasClass(target, 'is-sortable')) {
        target.style.cursor = 'pointer';
      }
      this.draggingColumn = null;
    }
  }
}
