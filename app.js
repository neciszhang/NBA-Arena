//app.js
const api = require('./api/answers_api.js');

App({
  host: api.host,
  onLaunch: function () {
    let self = this;
    // 登录
    wx.login({
      success: res => {
        let self = this;
        wx.request({
          url: api.host + '/uat/getOpenId',
          data:{
            code: res.code
          },
          method: 'GET',
          success: function (res) {
            wx.setStorageSync('openid', res.data.openid);
            wx.setStorageSync('all_rank', []);
          }
        })
      }
    })
  }
})