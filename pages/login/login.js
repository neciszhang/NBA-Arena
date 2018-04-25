// pages/login/login.js
const api = require('../../api/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: true,
    tel: '',
    code: '',
    showTelError: false,
    showCodeError: false,
    isSend: false,
    wait: 60
  },

  bindTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  bindCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  sendMessage() {
    let self = this;
    if (!self.verifyTel()) {
      return false;
    }
    self.setData({
      isSend: true
    });
    wx.showLoading({
      title: '发送中',
    });
    api.sendVerification(self.data.tel).then(function (response) {
      // console.log(response);
      wx.hideLoading();
      self.setWait();
    }, function (error) {
      // console.log(error);
      wx.hideLoading();
    });


  },

  verifyTel() {
    let tel = this.data.tel;
    let regTel = new RegExp(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/);
    if (!(tel && regTel.test(tel))) {
      this.setData({
        showTelError: true
      });
      return false;
    }
    this.setData({
      showTelError: false
    });
    return true;
  },

  verifyCode() {
    let code = this.data.code;
    if (!(code && code.length === 4)) {
      this.setData({
        showCodeError: true
      });
      return false;
    }
    this.setData({
      showCodeError: false
    });
    return true;
  },

  setWait() {
    let self = this;
    let waitInter = setInterval(function () {
      let time = self.data.wait - 1;
      let timeWord = time < 10 ? '0' + time : time;
      self.setData({
        wait: timeWord
      });
      if (time <= 0) {
        clearInterval(waitInter);
        self.setData({
          isSend: false,
          wait: 60
        });
      }
    }, 1000);
  },

  login() {
    let self = this;
    if (!(self.verifyTel() && self.verifyCode())) {
      return false;
    }

    wx.showLoading({
      title: '验证中',
    });

    api.verifyCode(self.data.tel, self.data.code).then(function (response) {
      // console.log(response);
      wx.hideLoading();
      if (response.statusCode === 200) {
        wx.setStorageSync('uuid', response.data.uuid);
        wx.setStorageSync('token', response.data.token);
        self.setData({
          tel: '',
          code: ''
        });
        wx.showLoading({
          title: '登录成功',
        });
        setTimeout(function () {
          wx.hideLoading();
          self.closeLogin();
        }, 1000);
      } else {
        self.setData({
          showCodeError: true
        });
      }
    }, function (error) {
      // console.log(error);
      wx.hideLoading();
    });

  },

  closeLogin() {
    this.setData({
      showLogin: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})