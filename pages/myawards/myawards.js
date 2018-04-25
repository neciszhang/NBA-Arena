// pages/myawards/myawards.js
const api = require('../../api/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myRewards: null,
    images: [],
    is_modal_Hidden: true,
    select: '',
    item: {},
    ind:'',
    isToLink:false,
    linkSrc:null
  },
  /**
   * 获得我的奖品
   */
  getMyRewards() {
    let self = this;
    api.myRewards().then((response) => {
      // console.log(response);
      if (response.statusCode == 200) {
        self.setData({
          myRewards: response.data.prod_list
        });
      }else{
        self.setData({
          myRewards: []
        });
      }
    }, (error) => {
      // console.log(error);
    })
  },
  /**
   * 自动适应图片尺寸
   */
  autoImage: function (e) {
    var imageWidth = e.detail.width;
    var imageHeight = e.detail.height;
    var image = this.data.images;
    image[e.target.dataset.index] = {
      width: imageWidth,
      height: imageHeight
    }
    this.setData({
      images: image
    });
  },
  /**
   * 返回首页
   */
  goToHome() {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  /**
   * 展示模板
   */
  showExchangeModel(event) {
    let item = event.currentTarget.dataset.item;
    let index = event.currentTarget.dataset.index;
    //已领取返回
    if (item.status === 1) {
      return false;
    }
    //积分兑换
    if(item.prod_id=='0'){
      return false;
    }
    //NBA鞋会50元
    if (item.prod_id ==="17PLAYOFFC3"){
      return false;
    }
    this.setData({
      is_modal_Hidden: false,
      item: item,
      ind:index
    });
    this.selectComponent("#exchange").resetForm();
  },

  onSyncAttrUpdate(e) {
    let str = 'myRewards['+e.detail+'].status';
    let obj ={[str]:1};
    this.setData(obj)
  },

  onTriggerLink(e){
    this.setData({
      isToLink: true,
      linkSrc: e.detail
    })
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
    this.getMyRewards();
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
    return {
      title: "征战季后赛，一起来竞猜",
      path: "/pages/index/index"
    }
  }
})