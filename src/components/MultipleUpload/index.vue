<template>
  <div class="upload-container">
    <el-tooltip
      class="item"
      effect="dark"
      content="上传图片"
      placement="bottom"
      :hide-after="800"
    >
      <el-button
        :style="buttonStyle"
        icon="el-icon-upload"
        size="mini"
        type="primary"
        @click="showDialog"
      >
        上传图片
      </el-button>
    </el-tooltip>

    <el-dialog
      title="上传图片"
      append-to-body
      width="700px"
      :visible.sync="dialogVisible"
      center
    >
      <div v-for="(item, index) in imgSrcList" :key="index" class="img-box">
        <span class="delete-image" title="点击删除">
          <i class="el-icon-delete-solid" @click="deleteImage(index)" />
        </span>
        <img v-if="item" class="img" :src="item" alt />
      </div>
      <div class="uploadImg-box">
        <input
          ref="fileElem"
          accept="image/*"
          class="img-input"
          type="file"
          multiple="multiple"
          @change="onchange"
        />
        <el-button
          class="btn"
          size="small"
          type="primary"
          @click="handleOpenFile"
        >
          点击上传
        </el-button>
      </div>

      <div class="btn-box">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { readFile } from '@/utils/upload'
import { Base64ToBlob } from '@/utils'

// 接口根据自己后端提供的写
import { uploadImage } from '@/api/upload'
export default {
  name: 'MultipleUpload',
  props: {
    // 最大上传文件的大小
    maxFileSize: {
      type: Number,
      default: 5
    },
    buttonStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      imgSrcList: []
    }
  },
  methods: {
    // 打开文件
    handleOpenFile() {
      const input = this.$refs.fileElem
      // 解决同一个文件不能监听的问题
      input.addEventListener(
        'click',
        function() {
          this.value = ''
        },
        false
      )
      // 点击input
      input.click()
    },

    // 显示弹窗
    showDialog() {
      this.dialogVisible = true
      this.imgSrcList = []
    },

    //  监听input上传
    async onchange() {
      try {
        // 文件列表
        const files = this.$refs.fileElem.files
        // 文件所有尺寸
        const sizes = []
        // 所有文件的base64位地址
        const allReadFile = []
        for (let index = 0; index < files.length; index++) {
          const item = files[index]
          sizes.push(item.size)
          allReadFile.push(readFile(item))
        }
        // 获取最大尺寸检验
        const maxSize = Math.max.apply(null, sizes)
        if (maxSize > 1024 * 1024 * this.maxFileSize) {
          this.$message({
            message: `图片不得大于${this.maxFileSize}M`,
            type: 'warning',
            duration: 2000
          })
          return
        }
        // 读取所有文件为base64数据
        const base64List = await Promise.all(allReadFile)
        this.imgSrcList = [...this.imgSrcList, ...base64List]
      } catch (error) {
        console.log(error)
      }
    },

    // 确定上传
    async handleSubmit() {
      if (!this.imgSrcList.length) {
        this.$message({
          message: '请上传图片！',
          type: 'error'
        })
        return
      }
      // 添加页面loading
      const loadingInstance = Loading.service({
        fullscreen: true,
        text: '上传中...'
      })
      // 添加按钮loading
      this.loading = true
      try {
        // 所有blob文件
        const blobFiles = []
        // 所有上传图片请求
        const allRequest = []
        // Base64 数据转成blob数据
        this.imgSrcList.forEach(item => {
          const blobFile = Base64ToBlob(item)
          blobFiles.push(blobFile)
        })

        // 添加请求
        blobFiles.forEach(item => {
          console.log(item)
          allRequest.push(uploadImage(item))
        })
        // 执行请求拿到结果
        const urlList = await Promise.all(allRequest)
        // 分发事件
        this.$emit('success', urlList)
      } catch (error) {
        console.log(error, error)
      }
      // 停止loading关闭弹窗
      this.loading = false
      this.dialogVisible = false
      loadingInstance.close()
    },

    // 删除图片
    deleteImage(index) {
      this.imgSrcList.splice(index, 1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.btn-box {
  text-align: right !important;
}

.img-box {
  position: relative;
  display: inline-block;
  width: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
  text-align: center;
  .img {
    width: 100%;
  }
  .delete-image {
    display: none;
    .el-icon-delete-solid {
      width: 40px;
      height: 40px;
      line-height: 40px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      color: #000;
      font-weight: 900;
    }
  }

  &:hover {
    .delete-image {
      cursor: pointer;
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.6);
      display: inline-block;
    }
  }
}
.uploadImg-box {
  width: 100%;
  height: 40px;
  margin: 0 auto;
  border-radius: 6px;
  position: relative;
  margin: 20px 0;
  .img-input {
    display: none;
  }
  .btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
