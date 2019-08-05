import './package/index'
import plTable from './lib/plTable'
export default {
  install (Vue, opts = {}) {
    Vue.component('plTable', plTable);
  }
}
