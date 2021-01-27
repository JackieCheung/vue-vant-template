import Vue from 'vue'

import {
  NavBar,
  NoticeBar,
  Row,
  Col,
  CellGroup,
  Cell,
  Field,
  Button,
  Image,
  Toast,
  Dialog,
  NumberKeyboard,
  ActionSheet,
  Uploader,
  ImagePreview,
  Icon,
  Loading,
  Popup,
  Divider,
  DatetimePicker,
  Picker,
  Area,
  Rate,
  Checkbox,
  Calendar
} from 'vant'

Vue
  .use(NavBar)
  .use(NoticeBar)
  .use(Row)
  .use(Col)
  .use(CellGroup)
  .use(Cell)
  .use(Field)
  .use(Button)
  .use(Image)
  .use(Toast)
  .use(Dialog)
  .use(NumberKeyboard)
  .use(ActionSheet)
  .use(Uploader)
  .use(ImagePreview)
  .use(Icon)
  .use(Loading)
  .use(Popup)
  .use(Divider)
  .use(DatetimePicker)
  .use(Picker)
  .use(Area)
  .use(Rate)
  .use(Checkbox)
  .use(Calendar)

Toast.setDefaultOptions('loading', {
  forbidClick: true,
  duration: 0
})

Vue.prototype.$imagePreview = ImagePreview
