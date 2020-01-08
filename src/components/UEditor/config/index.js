import toolbars from './toolbars'
const config = {
  toolbars,
  zIndex: 99, // 编辑器层级的基数,默认是900
  wordCount: false, // 是否开启字数统计
  wordCountMsg: '', // 输入提示
  maximumWords: Number.MAX_VALUE, // 允许的最大字符数
  serverUrl: '', // 服务器统一请求接口路径
  enableAutoSave: false, // 不自动保存
  enableContextMenu: false, // 禁用右键
  autoHeightEnabled: false, // 不自动扩展编辑器高度
  elementPathEnabled: false // 不显示html元素路径
}

export default config
