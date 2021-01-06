/*
 * preserve the scrolling position, compatible with history mode and hash mode
 * usages:
 ---------------------------------------------
    router.beforeEach((to, from, next) => {
      // ...
      scrollPosition.save(from.path)
      // ...
    })
 ---------------------------------------------
    // ...
    mounted() {
      scrollPosition.reset.call(this)
      // or
      scrollPosition.toTop.call(this)
    }
    // ...
 ---------------------------------------------
 */
const cache = {}
let target = document.querySelector('.app-main .el-scrollbar__wrap') || document.documentElement || document.body.parentNode || document.body

export default {
  // init scrolling element
  init ({ scrollElement }) {
    scrollElement && (target = scrollElement)
  },
  // save scrolling position
  save (path) {
    cache[path] = target['scrollTop']
  },
  // reset scrolling position
  reset () {
    this.$nextTick(_ => {
      target = cache[this.$route.path] || 0
    })
  },
  // scroll to top
  toTop () {
    this.$nextTick(_ => {
      target['scrollTop'] = 0
    })
  }
}
