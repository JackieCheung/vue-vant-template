<template>
  <div>
    <QuillEditor
      v-model="content"
      @change="handleEditorChange"></QuillEditor>
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
        content: 'test'
      }
    },
    methods: {
      handleEditorChange ({ editor, html, text }) {
        this.content = html
      }
    }
  }
</script>

<style scoped>

</style>
