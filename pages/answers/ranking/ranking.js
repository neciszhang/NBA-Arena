// pages/answers/ranking/ranking.js
const answers_api = require('../../../api/answers_api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_type: 'friends',
    friends_ranking: [],
    all_ranking: [],
    friendsUserPosition: '',
    allUserPosition: '',
    all_ranking_null:false,
    friends_ranking_null:false,
    rules_popup_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    });
    let self = this;
    answers_api.getReq('/user/getRankList',
      { req: { rankType: "2", wechatPartyNo:wx.getStorageSync('openid')} }, 
      'GET', function (res) {
        wx.hideLoading();
        if (res.rankList.length <= 0 || res.rankList == null) {
          self.setData({
            friends_ranking_null:true
          });
        }
        if (res.rankList) {
          let rankList = res.rankList.concat();
          res.userPosition.correctRate = parseFloat(((res.userPosition.correctRate) * 100).toFixed(2))
          for (let i = 0; i < rankList.length; i++) {
            rankList[i].correctRate = parseFloat(((rankList[i].correctRate) * 100).toFixed(2));
          }

          self.setData({
            friends_ranking: rankList,
            friendsUserPosition: res.userPosition
          })
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
    wx.removeStorageSync('all_rank'); 
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


  handle_click_tabs(e) {
    let self = this;
    let now_type = this.data.show_type;
    let show_type = e.currentTarget.dataset.type || e.target.dataset.type;
    if(show_type == 'all' && wx.getStorageSync('all_rank').length <= 0) {
      wx.showLoading({
        title: '加载中'
      });
      answers_api.getReq('/user/getRankList',
        { req: { rankType: "1", wechatPartyNo: wx.getStorageSync('openid') } },
        'GET', function (res) {
          wx.hideLoading();
          if (res.rankList.length <= 0 || res.rankList == null) {
            self.setData({
              all_ranking_null: true
            });
          }
          let rankList = res.rankList.concat();
          res.userPosition.correctRate = parseFloat(((res.userPosition.correctRate) * 100).toFixed(2))
          for (let i = 0; i < rankList.length;i++) {
            rankList[i].correctRate = parseFloat(((rankList[i].correctRate) *100).toFixed(2));
          }
          wx.setStorageSync('all_rank', rankList);
          self.setData({
            all_ranking: rankList,
            allUserPosition: res.userPosition
          })
        });
    }
    else {
      self.setData({
        all_ranking: wx.getStorageSync('all_rank')
      })
    }
    if (show_type == now_type) return;
    this.setData({
      show_type
    });
  },
  rules_popup_close(){
    this.setData({
      rules_popup_show:false
    })
  },
  rules_popup_open(){
    this.setData({
      rules_popup_show: true
    })
  }
})