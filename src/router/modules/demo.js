import Layout from '_v/layout'

const demoRouter = {
  path: '/demo',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Demo',
  meta: {
    title: 'Demo',
    keepAlive: false
  },
  children: [{
    path: 'imageCropper',
    component: () => import('_v/demo/image-cropper-demo'),
    name: 'ImageCropperDemo',
    meta: {
      title: '图片裁剪demo',
      keepAlive: false
    }
  }, {
    path: 'quillEditor',
    component: () => import('_v/demo/quill-editor-demo'),
    name: 'QuillEditorDemo',
    meta: {
      title: 'quill富文本编辑器demo',
      keepAlive: false
    }
  }]
}

export default demoRouter
