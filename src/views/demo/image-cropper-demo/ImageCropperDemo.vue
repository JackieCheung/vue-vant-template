<template>
  <div class="image-cropper-container">
    <van-row
      type="flex"
      justify="center"
      gutter="20"
    >
      <van-col
        span="10"
        style="text-align: center;"
      >
        <h4 style="text-align: left; margin-bottom: 5px;">图片预览：</h4>
        <van-image
          width="9rem"
          height="9rem"
          fit="contain"
          :src="imageSrc"
        >
          <template #loading>
            <van-loading
              type="spinner"
              size="24"
            ></van-loading>
          </template>
          <template #error>
            <van-icon
              name="photo-o"
              size="2rem"
            ></van-icon>
          </template>
        </van-image>
      </van-col>
    </van-row>
    <image-cropper
      ref="imageCropper"
      @real-time="handleRealTime"
    ></image-cropper>
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
