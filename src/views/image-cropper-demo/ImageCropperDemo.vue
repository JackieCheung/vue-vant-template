<template>
  <div class="image-cropper-container">
    <van-row
      type="flex"
      justify="center"
      gutter="20">
      <van-col
        span="10"
        style="text-align: center;">
        <h4 style="text-align: left; margin-bottom: 5px;">预览：</h4>
        <van-image
          width="9rem"
          height="9rem"
          fit="contain"
          :src="imageSrc">
          <template v-slot:loading>
            <van-loading
              type="spinner"
              size="24"></van-loading>
          </template>
          <template v-slot:error>
            <van-icon
              name="photo-o"
              size="2rem"></van-icon>
          </template>
        </van-image>
      </van-col>
      <van-col span="13">span: 6</van-col>
    </van-row>
    <image-cropper
      ref="imageCropper"
      :auto-crop="true"
      :fixed="false"
      :output-size="0.8"
      :center-box="true"
      :max-img-size="1200"
      @real-time="handleRealTime"></image-cropper>
  </div>
</template>

<script>
  import ImageCropper from '_c/ImageCropper'

  export default {
    name: 'ImageCropperDemo',
    components: {
      'image-cropper': ImageCropper
    },
    data () {
      return {
        previews: {},
        imageSrc: ''
      }
    },
    methods: {
      handleRealTime (obj) {
        // 不在nextTick后执行，首次旋转会出现黑色边
        this.$nextTick(_ => {
          this.$refs.imageCropper.getCropBase64(data => {
            this.imageSrc = data
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-cropper-container {
    padding-top: 16px;
  }
</style>
