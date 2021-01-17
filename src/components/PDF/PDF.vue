<template>
  <pdf
    ref="pdf"
    :src="src"
    :page="page"
    :rotate="rotate"
    :dpi="printDpi"
    @password="handlePassword"
    @progress="handleProgress"
    @loaded="handleLoaded"
    @page-loaded="handlePageLoaded"
    @num-pages="handleNumPages"
    @error="handleError"
    @link-clicked="handleLinkClicked"
  ></pdf>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
    name: 'PDF',
    components: {
      pdf
    },
    props: {
      // The url of the pdf file.
      src: {
        type: [String, Object],
        default: ''
      },
      // The page number to display.
      page: {
        type: Number,
        default: 1
      },
      // The page rotation in degrees, only multiple of 90 are valid.
      rotate: {
        type: Number,
        default: 0
      },
      // The print rezolution of the document.
      printDpi: {
        type: Number,
        default: 100
      }
    },
    methods: {
      /**
       * @description:
       *              This function creates a PDFJS loading task that can be used and reused as :src property.
       *              The loading task is a promise that resolves with the PDFJS pdf document that exposes the numPages property
       *              beware: when the component is destroyed, the object returned by createLoadingTask() become invalid.
       * @params: src: see :src prop
       * @author: Jackie
       * @date: 2020-02-12 14:52
       */
      createLoadingTask (src) {
        return this.$refs.pdf.createLoadingTask(src)
      },
      /**
       * @description: Print the document. * experimental *
       * @params:
       *          dpi: the print rezolution of the document (try 100).
       *          pageList: the list (array) of pages to print.
       * @author: Jackie
       * @date: 2020-02-12 15:11
       */
      print (dpi, pageList) {
        return this.$refs.pdf.print(dpi || this.printDpi, pageList)
      },
      // Triggered when the document needs password.
      handlePassword (updatePassword, reason) {
        this.$emit('password', updatePassword, reason)
      },
      // Document loading progress. Range [0, 1].
      handleProgress (progress) {
        this.$emit('progress', progress)
      },
      // Triggered when the document is loaded.
      handleLoaded () {
        this.$emit('loaded')
      },
      // Triggered when a page is loaded.
      handlePageLoaded (pageNum) {
        this.$emit('page-loaded', pageNum)
        this.$emit('pageLoaded', pageNum)
      },
      // The total number of pages of the pdf.
      handleNumPages (total) {
        this.$emit('num-pages', total)
        this.$emit('numPages', total)
      },
      // Triggered when an error occurred.
      handleError (error) {
        this.$emit('error', error)
      },
      // Triggered when an internal link is clicked.
      handleLinkClicked (linkNum) {
        this.$emit('link-clicked', linkNum)
        this.$emit('linkClicked', linkNum)
      }
    }
  }
</script>

<style scoped>

</style>
