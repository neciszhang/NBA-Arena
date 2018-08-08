// pages/login/login.js
const api = require('../../../api/answers_api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  userInfoHandler(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.setStorageSync('logined', true);
      wx.setStorageSync('userInfo', e.detail.userInfo);
      api.getReq('/user/add', {
        name: wx.getStorageSync('userInfo').nickName,
        wechatPicUrl: wx.getStorageSync('userInfo').avatarUrl
      }, 'POST', function (res) {
        if (res.status == 'SUCCESS') {
          wx.showToast({
            title: "登录成功"
          });
          wx.setStorageSync('user_msg', res.userDTO);
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      })
    }
  }
})