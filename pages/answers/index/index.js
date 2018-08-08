// pages/answers/index/index.js
const answers_api = require('../../../api/answers_api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_msg: {},
    show_login: false,
    answer_count_over: false,
    answer_count_over2:false,
    today_answer_over:false,
    inviteCode: 0,
    news:{},
    isIpx:false,
    pointGameCountMaxShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    self.isIpx();
    self.setData({
      pointGameCountMaxShow:false
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              wx.setStorageSync('userInfo', res.userInfo)
            }
          })
        }
      }
    });
    let inviteCode = options.inviteCode;
    if (inviteCode) {
      this.setData({
        inviteCode
      });
    }
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
    let self = this;
    wx.request({
      url: 'https://yooqapp.com/rc/games/news.json',
      success: function (res) {
        self.setData({
          news: res.data
        })
      }
    });
    let inviteCode = self.data.inviteCode;
    let user_msg = wx.getStorageSync('user_msg');
    if (!user_msg) {
      wx.navigateTo({
        url: '/pages/answers/login/login'
      });
    } else {
      self.setData({
        user_msg
      });
      answers_api.getReq('/user/add', {
        name: wx.getStorageSync('userInfo').nickName,
        wechatPicUrl: wx.getStorageSync('userInfo').avatarUrl
      }, 'POST', function (res) {
        if (res.status == 'SUCCESS') {
          wx.setStorageSync('user_msg', res.userDTO);
          self.setData({
            user_msg: res.userDTO
          });
        }
      });
      if (inviteCode) {
        let openId = wx.getStorageSync('openid');
        if (openId && user_msg) {
          answers_api.getReq('/user/addRelationship', {
            wechatPartyNo: openId,
            inviteCode
          }, "POST", function (res) {
            if (res.status == 'SUCCESS') {
              wx.navigateTo({
                url: `/pages/answers/game/game?gameType=invite&get_index=3&inviteCode=${inviteCode}`,
              });
              self.setData({
                inviteCode: 0
              })
            };
          })
        }
      }
    }

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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let self = this;
      let user_msg = wx.getStorageSync('user_msg');
      if (user_msg.totalGameCount >= user_msg.totalGameCountMax) {
        return {
          title: 'NBA竞技场',
          path: '/pages/answers/index/index',
          imageUrl: "http://cdn.yooqapp.com/rc/games/default_share.png",
          success: function (res) {
            wx.showModal({
              title: '提示',
              content: "今日游戏次数已达上限",
              showCancel: false
            })
          },
          fail: function (res) {
            // 转发失败
            wx.hideLoading();
          }
        }
      }
      else {
        let openid = wx.getStorageSync('openid');
        return {
          title: 'NBA竞技场',
          path: `/pages/answers/index/index?inviteCode=${openid}`,
          imageUrl: "http://cdn.yooqapp.com/rc/games/invite_share.png",
          success: function (res) {
            // 转发成功
            wx.navigateTo({
              url: `/pages/answers/game/game?gameType=invite&inviteCode=${openid}&get_index=2`
            });
          },
          fail: function (res) {
            // 转发失败
            console.log('邀请好友失败');
          }
        }
      }
    }
    else {
      return {
        title: 'NBA竞技场',
        path: '/pages/answers/index/index',
        imageUrl: "http://cdn.yooqapp.com/rc/games/default_share.png",
        success: function (res) {
          // 转发成功
          wx.hideLoading();
        },
        fail: function (res) {
          // 转发失败
          wx.hideLoading();
        }
      }
    }
  },
  skip_matching() {
    let self = this;
    let user_msg = wx.getStorageSync('user_msg');

    if (user_msg.totalGameCount >= user_msg.totalGameCountMax) {
      self.setData({
        today_answer_over: true
      })
      return;
    }
    
    //没绑定手机
    if (user_msg.userStatus == 1) {
      if (user_msg.pointGameCount >= user_msg.pointGameCountMax) {
        self.setData({
          answer_count_over: true
        })
        return;
      }
    }
    //绑定了手机
    else {
      if (!self.data.pointGameCountMaxShow && (user_msg.pointGameCount >= user_msg.pointGameCountMax)) {
        self.setData({
          answer_count_over2: true
        })
        return;
      }
    }



    wx.navigateTo({
      url: '/pages/answers/game/game?gameType=matching'
    })
  },

  skip_ranking() {
    wx.navigateTo({
      url: '/pages/answers/ranking/ranking'
    })
  },
  skip_question_bank() {
    wx.navigateTo({
      url: '/pages/answers/question_bank/question_bank'
    })
  },
  skip_shop() {
    wx.navigateToMiniProgram({
      appId: 'wx8cadecf65e2b790a',
      path: '/pages/index/index'
    })
  },
  skip(e) {
    // 1是webview，2是内部小程序页面，3是外部小程序页面
    if (e.currentTarget.dataset.link == null) return;
    let skipType = e.currentTarget.dataset.type;
    let skipLink = e.currentTarget.dataset.link;
    if (skipType == 1) {
      let link = encodeURIComponent(skipLink);
      wx.navigateTo({
        url: `/pages/answers/webview/webview?url=${link}`,
      })
    }
    else if (skipType == 2) {
      wx.navigateTo({
        url: skipLink
      })
    }
    else {
      wx.navigateToMiniProgram({
        appId: 'wx8cadecf65e2b790a',
        path: skipLink
      })
    }
  },
  skip_setting(){
    wx.navigateTo({
      url: '/pages/answers/person/person'
    })
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
    })
  },
  answer_count_over_close() {
    this.setData({
      answer_count_over: false
    });
    wx.navigateTo({
      url: '/pages/answers/game/game?gameType=matching',
    })
  },
  answer_count_over2_close() {
    this.setData({
      answer_count_over2: false,
      pointGameCountMaxShow:true
    });
   
    wx.navigateTo({
      url: '/pages/answers/game/game?gameType=matching',
    })
  },
  today_answer_over_close(){
    this.setData({
      today_answer_over:false
    })
  },
  isIpx(){
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        let name = 'iPhone X';
        if (res.model.indexOf(name) > -1) {
          self.setData({
            isIpx:true
          })
        }
      }
    })
  }
})