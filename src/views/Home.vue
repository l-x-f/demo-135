<template>
  <div class="demo">
    <u-editor ref="editor" :height="500" :html="html" @input="getContent" />

    <div class="get-url-btn-warpper">
      <el-button type="primary" size="small" @click="getContentUrl">
        获取上传后的链接
      </el-button>
    </div>
  </div>
</template>

<script>
import UEditor from '@/components/UEditor'
export default {
  name: 'UEditorDemo',
  components: {
    UEditor
  },

  data() {
    return {
      html: '',
      content: ''
    }
  },

  methods: {
    // 获取商品详情编辑器内容
    getContent(content) {
      this.content = content
    },
    // 获取上传后的链接
    async getContentUrl() {
      try {
        const url = await this.$refs.editor.content2Url()
        console.log(url)
      } catch (error) {
        this.$message.warning(error.message)
      }
    }
  }
}
</script>

<style lang="scss">
.demo {
  margin: 50px;
}
.get-url-btn-warpper {
  margin-top: 10px;
}
</style>
