<template>
  <quill-editor
    ref="quillEditor"
    v-model="quillEditor.content"
    :options="quillEditor.opts"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)">
  </quill-editor>
</template>

<script>
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: 'QuillEditor',
    components: {
      [quillEditor.name]: quillEditor
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        quillEditor: {
          content: '', // 富文本编辑器内容
          opts: {
            // height: 100, // 富文本编辑器高度
            theme: 'snow', // 富文本编辑器主题，默认snow
            placeholder: '请输入内容....' // 富文本编辑器placeholder
          }
        }
      }
    },
    computed: {
      editor () { // 富文本编辑器对象
        return this.$refs.quillEditor.quill
      }
    },
    watch: {
      value: {
        handler (newVal) {
          this.quillEditor.content = newVal
        },
        immediate: true
      }
    },
    mounted () {
      // // 设置富文本编辑器高度，注：这种设置方式的高度无法响应式，建议直接设置元素div.ql-container的css样式
      // this.editor.container.style.height = `${this.quillEditor.opts.height}px`
      // hack to fixed editor failed to focus at the first time
      this.editor.blur()
    },
    methods: {
      // 富文本编辑器准备完成回调
      onEditorReady (quill) {
        this.$emit('ready', quill)
      },
      // 富文本编辑器失去焦点回调
      onEditorBlur (quill) {
        this.$emit('blur', quill)
      },
      // 富文本编辑器获得焦点回调
      onEditorFocus (quill) {
        this.$emit('focus', quill)
      },
      // 富文本编辑器内容改变回调
      onEditorChange ({ quill, html, text }) {
        this.$emit('change', {
          quill,
          html,
          text
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .quill-editor {
    ::v-deep .ql-container {
      height: 100px;
    }
  }
</style>
