import request from '@/utils/request'

// import { validImage } from '@/utils/validate'

const setImgSrc = (el, binding) => {
  if (!binding.value) {
    // el.localName === 'img' ? el.src = '' : el.innerHTML = `<span>暂无内容</span>`
    el.localName === 'img' && (el.src = '')
    return false
  }
  let url = ''
  let fn = null // 图片加载后的回调函数，返回当前图片的远程地址
  // let remove = false // 是否移除当前元素
  if (Object.prototype.toString.call(binding.value) === '[object Object]') {
    url = binding.value.url || ''
    fn = binding.value.fn || null
    // remove = binding.value.remove || false
  } else {
    url = binding.value || ''
    // remove = false
  }
  if (typeof binding.oldValue === 'undefined' || JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)) {
    // el.localName !== 'img' ? el.innerHTML = `<span>加载中...</span>` : ''
    request({
      url: url,
      method: 'GET'
    }).then(response => {
      if (response.data) {
        // validImage(response.data).then(res => {
        //   const src = res ? response.data.signatureUrl : ''
        //   el.localName === 'img' ? el.src = src : ''
        //   fn && fn(src)
        //   !res && remove ? el.parentNode.removeChild(el) : ''
        // })
        const src = response.data
        el.localName === 'img' && (el.src = src)
        fn && fn(src)
      } else {
        el.localName === 'img' && (el.src = '')
        fn && fn('')
        // remove ? el.parentNode.removeChild(el) : ''
      }
      // el.localName === 'img' ? el.src = res.data.signatureUrl : el.innerHTML = `<img src="${res.data.signatureUrl}" alt="" />`
      // el.localName === 'img' ? el.src = res.data.signatureUrl : ''
      // fn && fn(res.data.signatureUrl || '')
      // const reader = new FileReader()
      // reader.onload = e => {
      //   el.localName === 'img' ? el.src = e.target.result : el.innerHTML = `<img src="${e.target.result}" alt="" />`
      // }
      // reader.readAsDataURL(res)
    }).catch(error => {
      console.error(error)
      // el.localName === 'img' ? el.src = '' : el.innerHTML = `<span>加载失败</span>`
      el.localName === 'img' && (el.src = '')
      fn && fn('')
      // remove ? el.parentNode.removeChild(el) : ''
    })
  }
}

export default {
  bind: function (el, binding) {
    setImgSrc(el, binding)
  },
  componentUpdated: function (el, binding) {
    setImgSrc(el, binding)
  }
}
