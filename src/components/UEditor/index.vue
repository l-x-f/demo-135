<template>
  <div class="custom-ueditor-container">
    <div :id="id" :style="{ width: width + 'px', height: height + 'px' }"></div>
    <multiple-upload
      class="custom-upload-button"
      :button-style="buttonStyle"
      @success="imageSuccess"
    />
  </div>
</template>
<script>
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable space-in-parens */
import axios from 'axios'
import config from './config'
import MultipleUpload from '../MultipleUpload'

// 接口根据自己后端提供的写
import { uploadHtml } from '@/api/upload'

const UE = window.UE

// 设置 UEDITOR_HOME_URL
window.UEDITOR_HOME_URL = 'static/ueditor'
export default {
  components: {
    MultipleUpload
  },
  props: {
    width: {
      type: Number,
      default: 750
    },
    height: {
      type: Number,
      default: 400
    },
    html: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ueditor: null,
      buttonStyle: {
        padding: '3px 6px'
      }
    }
  },
  computed: {
    // 生成唯一id
    id() {
      const id =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        '-ueditor-' +
        +new Date()
      return id
    }
  },
  watch: {
    html(val) {
      this.loadUrl(val)
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroyEditor()
  },

  methods: {
    // 编辑器初始化
    init() {
      this.ueditor = UE.getEditor(this.id, { ...config })
      if (this.html) {
        this.loadUrl(this.html)
      }
    },

    // 加载html内容
    async loadUrl(url) {
      try {
        const { data } = await axios.get(url)
        this.setContent(data)
      } catch (error) {
        this.setContent('服务器数据加载失败，请重试!')
      }
    },

    // 图片上传成功添加到编辑器
    async imageSuccess(urlList) {
      try {
        let imageTemplateList = ''
        urlList.forEach(item => {
          const image = `<img style="max-width:100%;" src="${item}">`
          imageTemplateList = imageTemplateList + image
        })
        this.inserthtml(imageTemplateList, true)
        this.$message.success('上传成功！')
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      }
    },

    // 编辑器内容上传到cos，调用返回url
    async content2Url() {
      try {
        if (!this.hasContent()) {
          throw new Error('未输入内容')
        }
        const content = this.getContent()
        const res = await uploadHtml(content)
        return res
      } catch (error) {
        throw new Error(error)
      }
    },

    // 设置编辑器内容  isAppendTo为true时是追加内容到编辑器，false是覆盖
    setContent(content, isAppendTo) {
      if (!content) return
      this.ueditor.ready(() => {
        this.ueditor.setContent(content, isAppendTo)
      })
    },

    // 在当前光标位置插入html内容
    inserthtml(content) {
      if (!content) return
      this.ueditor.execCommand('inserthtml', content)
    },

    // 获取编辑器内容
    getContent() {
      return this.ueditor.getContent()
    },

    // 设置编辑器聚焦
    setFocus() {
      this.ueditor.focus()
    },

    // 判断编辑器是否有内容
    hasContent() {
      return this.ueditor.hasContents()
    },

    // 销毁编辑器
    destroyEditor() {
      this.ueditor.destroy()
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-ueditor-container {
  position: relative;
  color: #373737;
  line-height: 22px;
  .custom-upload-button {
    position: absolute;
    left: 650px;
    top: 32px;
    z-index: 99;
  }
}
</style>

<style>
.edui-button.edui-for-135editor .edui-button-wrap .edui-button-body .edui-icon {
  background-image: url('http://static.135editor.com/img/icons/editor-135-icon.png') !important;
  background-size: 85%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
