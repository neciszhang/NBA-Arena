// pages/answers/person/person.js
const answers_api = require('../../../api/answers_api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_msg:{},
    show_login: false,
    focus_popup_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    answers_api.getReq('/user/add', {
      name: wx.getStorageSync('userInfo').nickName,
      wechatPicUrl: wx.getStorageSync('userInfo').avatarUrl
    }, 'POST', function (res) {
      if (res.status == 'SUCCESS') {
        wx.setStorageSync('user_msg', res.userDTO);
        let user_msg = wx.getStorageSync('user_msg');
        self.setData({
          user_msg
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  showLogin() {
    this.setData({
      show_login: true
    })
  },

  closeLogin() {
    this.setData({
      show_login: false
    })
  },

  updata(e) {
    this.setData({
      user_msg: e.detail.userDTO
    });
  },
  skip_shop() {
    wx.navigateToMiniProgram({
      appId: 'wx8cadecf65e2b790a',
      path: '/pages/index/index'
    })
  },
  focus_popup_show(){
    this.setData({
      focus_popup_show:true
    })
  },
  closeFocus(){
    this.setData({
      focus_popup_show: false
    })
  }
})