// components/focus_popup/focus_popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show_popup: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close_focus_popup() {
      this.triggerEvent('closeFocus', {})
    }
  }
})
