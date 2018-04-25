//index.js
//获取应用实例
const app = getApp()
const api = require('../../api/api.js');
import teams from '../../utils/teams.js';
import loadImagesList from '../../utils/loadImagesList.js';
const ImgLoader = require('../../components/img-loader/img-loader.js')
Page({
    data: {
        loadList: loadImagesList,
        loadImgCount: 0,
        load_progress: 0,
        loadShow: true,
        swiperShow: false,
        showPage: 'center',
        userInfo: {},
        moveLeft: {},
        moveRight: {},
        animationData: {},
        bg_gray_move: {},
        bg_blue_move: {},
        west_title_show: false,
        center_show: true,
        east_title_show: false,
        animated: false,
        arrow_show: false,
        current: 1,
        westStatus: [],
        eastStatus: [],
        finalStatus: [],
        advPredict:{},
        clickIndex: '',
        clickArea: 'final',
        showLogin: false,
        tel: '',
        code: '',
        showTelError: false,
        showCodeError: false,
        isSend: false,
        wait: 60,
        logined: false,
        checked: true
    },
    onLoad: function() {
        if (wx.getStorageSync('uuid') && wx.getStorageSync('token')) {
            this.setData({
                logined: true
            })
        }
        let self = this;
        new ImgLoader(this, function(err, data) {
            let loadImageLength = self.data.loadList.length;
            let load_progress = ((self.data.loadImgCount + 1) / loadImageLength * 100).toFixed(0);

            self.setData({
                loadImgCount: self.data.loadImgCount + 1,
                load_progress
            });
            if (self.data.load_progress >= 100) {
                setTimeout(() => {
                    self.setData({
                        loadShow: false
                    })
                }, 800);
                setTimeout(() => {
                    self.setData({
                        swiperShow: true
                    })
                }, 1200);
            }
        });

        //1
        // api.sendVerification(18221427431).then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

        //2
        // api.verifyCode(18221427431,'4950').then(function (response) {
        //   console.log(response);
        //   if (response.statusCode===200){
        //     wx.setStorageSync('uuid',response.data.uuid);
        //     wx.setStorageSync('token', response.data.token);
        //   }
        // }, function (error) {
        //   console.log(error);
        // });

        //3 403
        // api.seriesPrediction("10", 1610612752).then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

        //4
        // api.leagueSeriesStatus(1).then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

        // 5
        // api.myRewards().then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

        //6 404
        // var obj6 = {
        //   "reward_id": 1,
        //   "name": "用户1",
        //   "province": "上海",
        //   "city": "上海",
        //   "area": "黄浦区",
        //   "address": "蒙自路斜土路999号",
        //   "tel": "11111111111",
        //   "remark": "xxx"
        // };
        // api.saveDelivery(obj6).then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

        // 7 403
        // var obj7 = {
        //   "predict_team_id_round3_series0": 1610612739,
        //   "predict_game_id_round3_series0": 0,
        //   "predict_team_id_round3_series1": 2,
        //   "predict_game_id_round3_series1": 1610612744,
        //   "predict_team_id_round4_series0": 3,
        //   "predict_game_id_round4_series0": 1610612744,
        // };
        // api.advPredictPost(obj7).then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

        // 8
        // api.advPredictGet().then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

        // 9
        // api.rewardNotification().then(function (response) {
        //   console.log(response);
        // }, function (error) {
        //   console.log(error);
        // });

    },
    is_checked(e) {
        this.setData({
            checked: !this.data.checked
        })
        // console.log(e);
    },
    link_login() {
        this.setData({
            showLogin: true
        });
    },
    bindTel: function(e) {
        this.setData({
            tel: e.detail.value
        })
    },

    bindCode: function(e) {
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
        api.sendVerification(self.data.tel).then(function(response) {
            // console.log(response);
            wx.hideLoading();
            self.setWait();
        }, function(error) {
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
        let waitInter = setInterval(function() {
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
        if (!this.data.checked) {
            return false;
        }

        wx.showLoading({
            title: '验证中',
        });

        api.verifyCode(self.data.tel, self.data.code).then(function(response) {
            wx.hideLoading();
            if (response.statusCode === 200) {
                wx.setStorageSync('uuid', response.data.uuid);
                wx.setStorageSync('token', response.data.token);
                self.setData({
                    tel: '',
                    code: '',
                    logined: true
                });
                wx.showLoading({
                    title: '登录成功',
                });

                self.getLeagueSeriesStatus(0, 'westStatus');
                self.getLeagueSeriesStatus(1, 'eastStatus');
                self.getLeagueSeriesStatus(2, 'final');
                
                setTimeout(function() {
                    wx.hideLoading();
                    self.closeLogin();
                }, 1000);
            } else {
                self.setData({
                    showCodeError: true
                });
            }
        }, function(error) {
            // console.log(error);
            wx.hideLoading();
        });

    },

    closeLogin() {
        this.setData({
            showLogin: false
        });
    },

    onShow: function() {
        this.getLeagueSeriesStatus(0, 'westStatus');
        this.getLeagueSeriesStatus(1, 'eastStatus');
        this.getLeagueSeriesStatus(2, 'final');
        api.advPredictGet().then(res=>{
          this.setData({
            advPredict:res.data
          })
        });
        this.moveLeft = wx.createAnimation({
            duration: 500,
            timingFunction: 'linear',
        });
        this.moveRight = wx.createAnimation({
            duration: 500,
            timingFunction: 'linear',
        });
        this.bg_gray_move = wx.createAnimation({
            duration: 500,
            timingFunction: 'linear',
        });
        this.bg_blue_move = wx.createAnimation({
            duration: 500,
            timingFunction: 'linear',
        });
        this.arrow_show = setInterval(() => {
            if (!this.data.swiperShow) {
                return;
            } else {
                clearInterval(this.arrow_show);
                setTimeout(() => {
                    this.setData({
                        arrow_show: true
                    })
                }, 2300)
            }
        }, 200);
    },
    getLeagueSeriesStatus(area, setdata) {
        let self = this;
        api.leagueSeriesStatus(area).then((res) => {
            if (setdata == 'westStatus') {
                self.setData({
                    westStatus: teams.formatTeamsStatus(res.data.resp)
                })

                
            } else if (setdata == 'eastStatus') {
                self.setData({
                    eastStatus: teams.formatTeamsStatus(res.data.resp)
                })

               
            } else if (setdata == 'final') {
                self.setData({
                    finalStatus: teams.formatTeamsStatus(res.data.resp)
                })

                
            }
        })
    },
    handleWest: function() {
        this.setData({
            current: 0
        });
    },
    handleEast: function() {
        this.setData({
            current: 2
        });
    },
    moveWest: function() {
        this.setData({
            east_title_show: false,
            animated: true,
            showPage: 'west',
            clickArea: 'west'
        });
        this.moveLeft.left('0%').step();
        this.setData({
            animationData: this.moveLeft.export(),
        });
        this.bg_gray_move.right("12%").step();
        this.bg_blue_move.right("12%").step();
        this.setData({
            bg_gray_move: this.bg_gray_move.export(),
            bg_blue_move: this.bg_blue_move.export()
        });
        setTimeout(() => {
            this.setData({
                west_title_show: true,
                animated: false
            })
        }, 800);
        setTimeout(() => {
            this.setData({
                animated: false
            })
        }, 800);
    },
    moveEast: function() {
        this.setData({
            west_title_show: false,
            animated: true,
            showPage: 'east',
            clickArea: 'east'
        });
        this.moveRight.left('-200%').step();
        this.setData({
            animationData: this.moveRight.export()
        });
        this.bg_gray_move.right("-15.5%").step();
        this.bg_blue_move.right("-15.5%").step();
        this.setData({
            bg_gray_move: this.bg_gray_move.export(),
            bg_blue_move: this.bg_blue_move.export()
        });
        setTimeout(() => {
            this.setData({
                east_title_show: true,
            })
        }, 800);
        setTimeout(() => {
            this.setData({
                animated: false
            })
        }, 800);
    },
    moveCenter: function() {
        this.setData({
            west_title_show: false,
            east_title_show: false,

            animated: true,
            showPage: 'center',
            clickArea: 'final'
        });
        this.moveRight.left('-100%').step();
        this.setData({
            animationData: this.moveRight.export()
        });
        this.bg_gray_move.right("0%").step();
        this.bg_blue_move.right("0%").step();
        this.setData({
            bg_gray_move: this.bg_gray_move.export(),
            bg_blue_move: this.bg_blue_move.export()
        });
        setTimeout(() => {
            this.setData({
                animated: false
            })
        }, 800);
    },
    swiperChange(e) {
        let pageIndex = e.detail.current;
        if (pageIndex == 0) {
            this.moveWest();
        } else if (pageIndex == 1) {
            this.moveCenter();
        } else if (pageIndex == 2) {
            this.moveEast();
        }

    },
    getUserInfo: function(e) {
        // console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    handleClick: function(e) {
        if (!wx.getStorageSync('uuid') && !wx.getStorageSync('token')) {
            this.setData({
                showLogin: true
            });
            return;
        }
        let index = e.currentTarget.dataset.index;
        let area = e.currentTarget.dataset.area;
        this.setData({
            clickIndex: index,
            clickArea: area
        })
    },
    reset_index(e) {
        this.setData({
            clickIndex: ''
        })
    },
    link_west_east(e) {
        let area = e.detail.area;
        if (area == 'west') {
            this.handleWest();
        } else {
            this.handleEast();
        }
    },
    onShareAppMessage() {
        return {
            title: "征战季后赛，一起来竞猜",
            path: "/pages/index/index"
        }
    }
})