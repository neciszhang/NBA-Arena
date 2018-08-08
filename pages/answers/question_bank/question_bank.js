// pages/answers/question_bank/question_bank.js
const answers_api = require('../../../api/answers_api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    gameQuestionList:[],
    focus_popup_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  getData(){
    let self = this;
    self.setData({
      gameQuestionList:[]
    })
    answers_api.getReq('/game/getGameQuestionList', {}, 'GET', function (res) {
      self.setData({
        gameQuestionList: res.gameQuestionList,
        current:0
      });
    })
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


  prv(){
    this.setData({
      current: this.data.current - 1
    })
  },

  next(){
    this.setData({
      current: this.data.current + 1
    })
  },
  swiper_change(e){
    let current = e.detail.current;
    this.setData({
      current
    })
  },
  again(){
    this.getData();
  },
  clear(){
    let openId = wx.getStorageSync("openid");
    wx.request({
      url: 'https://yooqapp.com/api/test/delRankData',
      method:"POST",
      data: { wechatPartyNo: openId},
      success:function(res){
        console.log(res);
      }
    })
    wx.request({
      url: 'https://yooqapp.com/api/test/unbindNba',
      method:"GET",
      data: { wechatPartyNo: openId},
      success:function(res){
        console.log(res);
      }
    })
    wx.showModal({
      title:'提示',
      content:'清除成功'
    })
  },
  focus_popup_show() {
    this.setData({
      focus_popup_show: true
    })
  },
  closeFocus() {
    this.setData({
      focus_popup_show: false
    });
    this.again();
  }
})