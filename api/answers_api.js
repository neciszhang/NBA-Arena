

let api = "https://yooqapp.com/api"

function getReq(url, data, method, callback, fail) {
  let options = {
    wechatPartyNo: wx.getStorageSync('openid')
  }
  data = Object.assign({}, options, data);
  return wx.request({
    url: api + url,
    method: method,
    data,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      callback(res.data)
    },
    fail() {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '网络错误',
        confirmText: '重试',
        confirmColor: '',
        success: function (res) {
          if (res.confirm) {
            console.log(getCurrentPages());
            wx.reLaunch({
              url: '/pages/answers/index/index',
            })
          }
        }
      })
    }
  })
}
module.exports = {
  getReq,
  host: api
}