// components/login/login.js
const api = require('../../api/api.js');
const answers_api = require('../../api/answers_api.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show_login: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // showLogin: false,
    tel: '',
    code: '',
    showTelError: false,
    showCodeError: false,
    isSend: false,
    wait: 60,
    checked:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    is_checked(e) {
      this.setData({
        checked: !this.data.checked
      })
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
      let regTel = new RegExp(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})||(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/);
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
      if (!self.data.checked) return;
      if (!(self.verifyTel() && self.verifyCode())) {
        return false;
      }

      wx.showLoading({
        title: '验证中',
      });

      api.verifyCode(self.data.tel, self.data.code).then(function (response) {
        wx.hideLoading();
        if (response.statusCode === 200) {
          wx.setStorageSync('uuid', response.data.uuid);
          wx.setStorageSync('token', response.data.token);
          answers_api.getReq('/user/bindNba', {
            mobileNo: self.data.tel
          }, 'POST', function (res) {
            if (res.status == 'SUCCESS') {
              answers_api.getReq('/user/add', {
                name: wx.getStorageSync('userInfo').nickName,
                mobileNo: self.data.tel,
                wechatPicUrl: wx.getStorageSync('userInfo').avatarUrl
              }, 'POST', function (res) {
                if (res.status == 'SUCCESS') {
                  wx.setStorageSync('user_msg', res.userDTO);
                  self.triggerEvent('updata', { userDTO: res.userDTO})
                }
              })
            }
          });
          self.setData({
            tel: '',
            code: ''
          });
          wx.showLoading({
            title: '绑定成功',
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
        wx.hideLoading();
      });

    },
    closeLogin() {
      this.triggerEvent('closeLogin',{})
    }
  }
})
