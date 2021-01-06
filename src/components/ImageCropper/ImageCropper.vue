<template>
  <div class="cropper-container">
    <div class="cropper">
      <vue-cropper
        ref="cropper"
        :img="imgSrc"
        v-bind="attrs"
        v-on="listeners"></vue-cropper>
    </div>
    <!--放大、缩小、左旋转、右旋转、更换图片按钮-->
    <div class="btn-controller">
      <van-uploader
        :max-count="1"
        :before-read="handleFileBeforeRead"
        :after-read="handleFileAfterRead">
        <van-button
          type="warning"
          :size="btnSize">
          选择图片
        </van-button>
      </van-uploader>
      <van-button
        type="info"
        class="ml-5"
        :size="btnSize"
        @click="changeScale(1)">
        <font-awesome-icon icon="search-plus" />
      </van-button>
      <van-button
        type="info"
        :size="btnSize"
        @click="changeScale(-1)">
        <font-awesome-icon icon="search-minus" />
      </van-button>
      <van-button
        type="info"
        :size="btnSize"
        @click="rotateLeft">
        <font-awesome-icon icon="undo" />
      </van-button>
      <van-button
        type="info"
        :size="btnSize"
        @click="rotateRight">
        <font-awesome-icon icon="redo" />
      </van-button>
      <van-button
        type="primary"
        :size="btnSize"
        @click="uploadImage">
        <font-awesome-icon icon="upload" />
        上传
      </van-button>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  /**
   * more detail
   * @see https://github.com/xyxiao001/vue-cropper
   * @see https://shnhz.github.io/shn-ui/#/component/vue-cropper
   */
  import { VueCropper } from 'vue-cropper'

  export default {
    name: 'ImageCropper',
    components: {
      'vue-cropper': VueCropper
    },
    props: {
      // 裁剪图片的地址，默认值：空，可选值：url 地址 || base64 || blob
      img: {
        type: [String, Blob, null, File],
        default: ''
      },
      accept: {
        type: String,
        default: 'image/jpeg'
      },
      // 截图框默认是否覆盖原图位置
      cropBoxCover: {
        type: Boolean,
        default: true
      },
      // 图片读取完成前回调
      beforeImageRead: {
        type: Function,
        default: null
      },
      // 图片读取完成后回调
      afterImageRead: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        btnSize: 'mini',
        imgSrc: '', // 裁剪图片的地址，默认值：空，可选值：url 地址 || base64 || blob || file
        cropWidth: '',
        cropHeight: '',
        preview: {
          url: '' // 预览图片的 url 地址
        }
      }
    },
    computed: {
      attrs () {
        return Object.assign(
          {},
          {
            autoCrop: true,
            fixed: false,
            outputSize: 0.8,
            centerBox: true,
            full: true,
            high: false,
            infoTrue: true,
            maxImgSize: 2500
          },
          this.$attrs
        )
      },
      listeners () {
        return Object.assign(
          {},
          {
            imgLoad: this.handleImgLoad,
            realTime: this.handleRealTime,
            imgMoving: this.handleImgMoving,
            cropMoving: this.handleCropMoving
          },
          this.$listeners
        )
      }
    },
    watch: {
      img: {
        handler (newVal) {
          if (newVal) {
            this.imgSrc = newVal
          }
        },
        immediate: true
      }
    },
    methods: {
      // 图片移动事件回调
      handleImgMoving (obj) {
        this.$emit('imgMoving', obj)
        this.$emit('img-moving', obj)
      },
      // 截图框移动事件回调
      handleCropMoving (obj) {
        this.$emit('cropMoving', obj)
        this.$emit('crop-moving', obj)
      },
      // 图片加载后回调
      handleImgLoad (status) {
        this.$emit('img-load', status === 'success')
        this.$emit('imgLoad', status === 'success')
      },
      handleRealTime: debounce(function (obj) {
        this.getCropData(data => { this.preview.url = data })
        this.$emit('realTime', obj)
        this.$emit('real-time', obj)
      }, 400),
      // 开始截图
      startCrop () {
        return this.$refs.cropper.startCrop()
      },
      // 停止截图
      stopCrop () {
        return this.$refs.cropper.stopCrop()
      },
      // 清除截图
      clearCrop () {
        return this.$refs.cropper.clearCrop()
      },
      // 修改图片大小 正数为变大 负数变小
      changeScale (num) {
        if (this.imgSrc) {
          return this.$refs.cropper.changeScale(num || 1)
        }
      },
      // 获取图片基于容器的坐标点
      getImgAxis () {
        return this.$refs.cropper.getImgAxis()
      },
      // 获取截图框基于容器的坐标点
      getCropAxis () {
        return this.$refs.cropper.getCropAxis()
      },
      // 自动生成截图框函数
      goAutoCrop (width, height) {
        return this.$refs.cropper.goAutoCrop(width, height)
      },
      // 向右边旋转90度
      rotateRight () {
        if (this.imgSrc) {
          return this.$refs.cropper.rotateRight()
        }
      },
      // 向左边旋转90度
      rotateLeft () {
        if (this.imgSrc) {
          return this.$refs.cropper.rotateLeft()
        }
      },
      // 获取截图的 base64 数据
      getCropBase64 (fn) {
        // this.$refs.cropper.getCropData((data) => {
        //   // do something
        //   console.log(data)
        // })
        this.$refs.cropper.getCropData(fn)
      },
      // 获取截图的 blob 数据
      getCropBlob (fn) {
        // this.$refs.cropper.getCropBlob((data) => {
        //   // do something
        //   console.log(data)
        // })
        this.$refs.cropper.getCropBlob(fn)
      },
      // 文件读取完成前的回调函数，返回 false 可终止文件读取，支持返回 Promise
      handleFileBeforeRead (file, detail) {
        this.imgSrc = ''
        return this.beforeImageRead ? this.beforeImageRead(file, detail) : true
      },
      // 文件读取完成后的回调函数
      handleFileAfterRead (file, detail) {
        this.imgSrc = file.content
      },
      // 点击上传
      uploadImage () {
        this.$emit('uploadImage', {
          'getCropBase64Str': this.getCropData,
          'getCropBlob': this.getCropBlob
        })
        this.$emit('upload-image', {
          'getCropBase64Str': this.getCropData,
          'getCropBlob': this.getCropBlob
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cropper-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 5px;

    .cropper {
      width: 100%;
      height: 225px;
    }

    .btn-controller {
      width: 100%;
      margin-top: 24px;
      text-align: center;

      .van-button {
        height: 25px;
        line-height: 25px;
      }
    }
  }
</style>
