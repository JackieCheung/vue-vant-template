<template>
  <div style="padding: 16px;">
    <van-divider>
      <h3>vue-quill-editor示例</h3>
    </van-divider>
    <QuillEditor
      v-model="content"
      @change="handleEditorChange"
    ></QuillEditor>
  </div>
</template>

<script>
  import QuillEditor from '_c/QuillEditor'

  export default {
    name: 'QuillEditorDemo',
    components: {
      [QuillEditor.name]: QuillEditor
    },
    data () {
      return {
        content: ''
      }
    },
    methods: {
      handleEditorChange ({ quill, html, text }) {
        this.content = html
      }
    }
  }
</script>

<style scoped>

</style>
