<template>
  <el-upload
    v-bind="$attrs"
    action=""
    :show-file-list="false"
    :before-upload="add_files"
    :http-request="before_upload"
    class="upload-demo"
    :accept="accept"
    :file-list="fileList"
  >
    <el-button :primary="isPrimaryBtn" icon="icon-pipeixiazai" slot="trigger" v-bind="$attrs">
      {{ btnTitle }}
    </el-button>
    <div slot="tip" class="el-upload__tip tips">{{ tip }}</div>
  </el-upload>
</template>
<script>
import http from '../../../src/api/http'

export default {
  name: 'wgUploadFile',
  props: {
    /**
     *  默认bcs 文件上传
     */
    url: {
      require: true,
      default: '/bcs/file/upload',
    },
    btnTitle: {
      default: '图片上传',
    },
    tip: {
      default: '注：图片格式为.jpeg | .png | .jpg',
    },
    /**
     *  其他字段域，直接结合字段 ，{systemId:'xx'}
     */
    otherFields: {
      default() {
        return {}
      },
    },
    accept: {
      default: '',
    },
    isPrimaryBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    add_files(file) {
      this.fileList = [file]
    },

    before_upload() {
      if (this.fileList.length > 0) {
        this.uploadFile()
      }
    },
    async uploadFile() {
      const formData = new FormData()
      for (const key in this.otherFields) {
        const item = this.otherFields[key]
        formData.append(key, item)
      }

      formData.append('file', this.fileList[0])
      const data = await http.post(this.url, formData, {
        'Content-Type': 'multipart/form-data',
      })
      if (data.code == '0') {
        this.$message.success('上传成功')
        this.$emit('success', data.data)
      } else {
        this.$emit('error', data)
      }
    },
  },
}
</script>
<style scoped lang="less">
.tips {
  font-size: 12px;
  color: #a6aaac;
  letter-spacing: 0;
  font-weight: 400;
}
</style>
