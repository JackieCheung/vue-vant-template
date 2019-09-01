<template>
  <div class="cropper-container">
    <vue-cropper
      ref="cropper"
      :mode="mode"
      :img="img"
      :output-size="outputSize"
      :output-type="outputType"
      :info="info"
      :info-true="infoTrue"
      :can-scale="canScale"
      :auto-crop="autoCrop"
      :auto-crop-width="autoCropWidth"
      :auto-crop-height="autoCropHeight"
      :fixed="fixed"
      :fixed-number="fixedNumber"
      :fixed-box="fixedBox"
      :full="full"
      :can-move="canMove"
      :can-move-box="canMoveBox"
      :original="original"
      :center-box="centerBox"
      :high="high"
      :max-img-size="maxImgSize"
      :enlarge="enlarge"
      @imgLoad="handleImgLoad"
      @realTime="handleRealTime"
      @imgMoving="handleImgMoving"
      @cropMoving="handleCropMoving"></vue-cropper>
    <!--todo 放大、缩小、左旋转、右旋转按钮-->
  </div>
</template>

<script>
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
      /**
       * Description of the default rendering mode of the image
       * Image layout mode mode achieves the same effect as css background
       * Contain Centered layout Default does not scale Ensure the image is inside the container mode: 'contain'
       * Cover stretch layout fill the entire container mode: 'cover'
       * If only one value is given, this value will be used as the width value and the height value will be set to auto. mode: '50px'
       * If two values are given, the first one will be the width value and the second will be the height value. mode: '50px 60px'
       **/
      /**
       * 图片布局方式 mode 实现和css背景一样的效果
       * contain  居中布局 默认不会缩放 保证图片在容器里面 mode: 'contain'
       * cover    拉伸布局 填充整个容器  mode: 'cover'
       * 如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为auto。 mode: '50px'
       * 如果有两个数值被给定，第一个将作为宽度值大小，第二个作为高度值大小。 mode: '50px 60px'
       **/
      // 图片默认渲染方式，默认值：contain，可选值：contain , cover, 100px, 100%, auto
      mode: {
        type: String,
        default: 'contain'
      },
      // 裁剪图片的地址，默认值：空，可选值：url 地址 || base64 || blob
      img: {
        type: [String, Blob, null, File],
        default: ''
      },
      // 输出图片压缩比
      // 裁剪生成图片的质量，默认值：1，可选值：0.1 - 1
      outputSize: {
        type: Number,
        default: 1
      },
      // 裁剪生成图片的格式，默认值：jpg (jpg 需要传入jpeg)，可选值：jpeg || png || webp
      outputType: {
        type: String,
        default: 'jpeg'
      },
      // 是否显示裁剪框的大小信息，默认值：true，可选值：true || false
      info: {
        type: Boolean,
        default: true
      },
      // 截图框展示宽高类型
      // true 为展示真实输出图片宽高，false 为展示看到的截图框宽高，默认值：false，可选值：true || false
      infoTrue: {
        type: Boolean,
        default: false
      },
      // 是否开启滚轮放大缩小
      // 图片是否允许滚轮缩放，默认值：true，可选值：true || false
      canScale: {
        type: Boolean,
        default: true
      },
      // 是否默认生成截图框，默认值：false，可选值：true || false
      // 是否自成截图框
      autoCrop: {
        type: Boolean,
        default: false
      },
      // 默认生成截图框宽度，默认值：容器的 80%，可选值：0 ~ max
      autoCropWidth: {
        type: [Number, String],
        default: 0
      },
      // 默认生成截图框高度，默认值：容器的 80%，可选值：0 ~ max
      autoCropHeight: {
        type: [Number, String],
        default: 0
      },
      // 是否开启固定宽高比
      // 是否开启截图框宽高固定比例，默认值：true，可选值：true || false
      fixed: {
        type: Boolean,
        default: true
      },
      // 宽高比 w/h
      // 截图框的宽高比例，默认值：[1, 1]，可选值：[宽度, 高度]
      fixedNumber: {
        type: Array,
        default: () => {
          return [1, 1]
        }
      },
      // 固定大小，禁止改变截图框大小
      // 固定截图框大小，不允许改变，默认值：false，可选值：true || false
      fixedBox: {
        type: Boolean,
        default: false
      },
      // 输出截图是否缩放
      // 是否输出原图比例的截图，默认值：false，可选值：true || false
      full: {
        type: Boolean,
        default: false
      },
      // 是否可以拖动图片
      // 上传图片是否可以移动，默认值：true，可选值：true || false
      canMove: {
        type: Boolean,
        default: true
      },
      // 是否可以拖动截图框
      // 截图框能否拖动，默认值：true，可选值：true || false
      canMoveBox: {
        type: Boolean,
        default: true
      },
      // 上传图片按照原始比例显示
      // 上传图片按照原始比例渲染，默认值：false，可选值：true || false
      original: {
        type: Boolean,
        default: false
      },
      // 截图框能否超过图片
      // 截图框是否被限制在图片里面，默认值：false，可选值：true || false
      centerBox: {
        type: Boolean,
        default: false
      },
      // 是否根据 dpr 输出高清图片
      // 是否按照设备的 dpr 输出等比例图片，默认值：true，可选值：true || false
      high: {
        type: Boolean,
        default: true
      },
      // 可以压缩图片宽高 ，默认不超过 200
      // 限制图片最大宽度和高度，默认值：2000，可选值：0 - max
      maxImgSize: {
        type: Number,
        default: 2000
      },
      // 倍数，可渲染当前截图框的 n 倍 0 - 1000;
      // 图片根据截图框输出比例倍数，默认值：1，可选值：0 - max（建议不要太大不然会卡死的呢）
      enlarge: {
        type: [Number, String],
        default: 1
      }
    },
    data () {
      return {}
    },
    computed: {
      // 截图框宽度
      cropW () {
        return this.$refs.cropper.cropW
      },
      // 截图框高度
      cropH () {
        return this.$refs.cropper.cropH
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
      // 实时预览回调
      handleRealTime (obj) {
        this.$emit('realTime', obj)
        this.$emit('real-time', obj)
      },
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
      changeScale () {
        return this.$refs.cropper.changeScale()
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
      goAutoCrop () {
        return this.$refs.cropper.goAutoCrop()
      },
      // 向右边旋转90度
      rotateRight () {
        return this.$refs.cropper.rotateRight()
      },
      // 向左边旋转90度
      rotateLeft () {
        return this.$refs.cropper.rotateLeft()
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
      }
    }
  }
</script>

<style scoped>

</style>
