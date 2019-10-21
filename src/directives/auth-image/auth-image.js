import request from '@/utils/request'

const setImgSrc = (el, binding) => {
  if (!binding.value) {
    // todo 绑定的值为空时显示提示信息
    el.localName === 'img' ? el.src = '' : el.innerHTML = `<span>暂无内容</span>`
    return false
  }
  if (typeof binding.oldValue === 'undefined' || binding.value !== binding.oldValue) {
    // todo 显示加载中loading提示
    el.localName !== 'img' ? el.innerHTML = `<span>加载中...</span>` : ''
    request({
      url: binding.value,
      method: 'GET',
      responseType: 'blob'
    }).then(res => {
      const reader = new FileReader()
      reader.onload = e => {
        el.localName === 'img' ? el.src = e.target.result : el.innerHTML = `<img src="${e.target.result}" alt="" />`
      }
      reader.readAsDataURL(res)
    }).catch(error => {
      console.log(error)
      // todo 显示加载失败提示信息
      el.localName === 'img' ? el.src = '' : el.innerHTML = `<span>加载失败</span>`
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
