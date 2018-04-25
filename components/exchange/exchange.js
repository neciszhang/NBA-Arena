const api = require('../../api/api.js');
Component({
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    },
    item: {
      type: Object,
      value: {}
    },
    ind: {
      type: String,
      value: ''
    }
  },
  data: {
    showModelInfo1: true,
    showModelInfo2: false,
    showModelInfo3: false,
    showModelError: false,
    name: '',
    address: '',
    tel: '',
    remark: '',
    region: ['省份*', '城市*', '地区*'],
    showNameError: false,
    showRegionError: false,
    showAddressError: false,
    showTelError: false,
  },
  methods: {
    //重置表单
    resetForm() {
      this.setData({
        showModelInfo1: true,
        showModelInfo2: false,
        showModelInfo3: false,
        name: '',
        address: '',
        tel: '',
        remark: '',
        region: ['省份*', '城市*', '地区*'],
        showNameError: false,
        showRegionError: false,
        showAddressError: false,
        showTelError: false,
      });
    },
    //绑定姓名
    bindName: function (e) {
      this.setData({
        name: e.detail.value
      })
    },
    //绑定地址
    bindAddress: function (e) {
      this.setData({
        address: e.detail.value
      })
    },
    //绑定手机号码
    bindTel: function (e) {
      this.setData({
        tel: e.detail.value
      })
    },
    //绑定备注
    bindRemark: function (e) {
      this.setData({
        remark: e.detail.value
      })
    },
    //绑定三级联动
    bindRegionChange: function (e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        region: e.detail.value
      })
    },
    //验证名字
    verifyName() {
      let name = this.data.name;
      if (!name) {
        this.setData({
          showNameError: true
        });
        return false;
      }
      this.setData({
        showNameError: false
      });
      return true;
    },
    //验证选择三级
    verifyRegion() {
      let region = this.data.region;
      if (region[0] === "省份*") {
        this.setData({
          showRegionError: true
        });
        return false;
      }
      this.setData({
        showRegionError: false
      });
      return true;
    },
    //验证地址
    verifyAddress() {
      let address = this.data.address;
      if (!address) {
        this.setData({
          showAddressError: true
        });
        return false;
      }
      this.setData({
        showAddressError: false
      });
      return true;
    },
    //验证手机号码
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
    //展示提交成功
    showSuccess() {
      this.setData({
        showModelInfo1: false,
        showModelInfo2: true,
        showModelInfo3: false,
      });
    },
    //展示提交失败
    showFail() {
      this.setData({
        showModelInfo1: false,
        showModelInfo2: false,
        showModelInfo3: true,
      });
    },
    //返回填写表单
    returnInfo() {
      this.setData({
        showModelInfo1: true,
        showModelInfo2: false,
        showModelInfo3: false
      });
    },
    //提交
    submit: function () {
      let self = this;
      if (!(self.verifyName() && self.verifyRegion() && self.verifyAddress() && self.verifyTel())) {
        return false;
      }

      wx.showLoading({
        title: '发送中',
      });

      let obj = {
        "reward_id": self.data.item.reward_id,
        "name": self.data.name,
        "province": self.data.region[0],
        "city": self.data.region[1],
        "area": self.data.region[2],
        "address": self.data.address,
        "tel": self.data.tel,
        "remark": self.data.remark
      };
      api.saveDelivery(obj).then(function (response) {
        // console.log(response);
        wx.hideLoading();
        if(response.statusCode===200){
          self.setData({
              'item.status':1
          });

          self.triggerEvent('syncAttrUpdate', self.data.ind)
          self.showSuccess();
          self.setData({
            name: '',
            address: '',
            tel: '',
            remark: '',
            region: ['省份*', '城市*', '地区*'],
            showNameError: false,
            showRegionError: false,
            showAddressError: false,
            showTelError: false,
          });
        }
      }, function (error) {
        console.log(error);
      });

    },
    //去我的详情页
    goToDetails() {
      wx.navigateTo({
        url: '../details/details'
      })
    },
    //关闭modal
    closeModel() {
      this.setData({
        modalHidden: true
      });
    },
    triggerUrl(event){
      let url = event.currentTarget.dataset.url;
      this.triggerEvent('golink', url);
    }
  }
})