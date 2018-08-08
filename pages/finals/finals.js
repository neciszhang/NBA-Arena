// pages/finals/finals.js
const api = require('../../api/api.js');
import teams from '../../utils/teams.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        images: [],
        showWest: false,
        showEast: false,
        showFinal: false,
        showFinalPopup: false,
        dirWest: 'left',
        dirEast: 'left',
        dirFinal: 'left',
        // showWestScore: false,
        // showScoreVote2: false,
        // showScoreVote3: false,
        //东部
        predict_team_id_round3_series0: null,
        predict_game_id_round3_series0: null,
        //西部
        predict_team_id_round3_series1: null,
        predict_game_id_round3_series1: null,
        //最终决赛
        predict_team_id_round4_series0: null,
        predict_game_id_round4_series0: null,

        score_active1: null,
        score_active2: null,
        score_active3: null,
        notice: false,
        erroreast: false,
        errorwest: false,
        errorfinal: false,


        guessingDatas: [],
        advPredict: {},


        day_1: '',
        day_2: '',
        hour_1: '',
        hour_2: '',
        min_1: '',
        min_2: '',
        sed_1: '',
        sed_2: '',

        status1: false,
        status2: false,
        status3: false,
        status4: false,
        status5: false,
        // guessing: false,
        // guessed: false,
        // missed: false,
        // guessing_right: false,
        // guessing_error: false,
        champion: '',
        // allscroe: '',
        // win_users: ''
    },
    toWebView() {
        let webViewUrl = encodeURIComponent('https://www.nbaqmq.com/');
        wx.navigateTo({
            url: `/pages/webview/webview?url=${webViewUrl}`
        })
    },
    //点击图标
    clickWinner(e) {
        if (!this.data.status1) {
            return false;
        }
        let show = e.currentTarget.dataset.show;
        let team_id = e.currentTarget.dataset.team_id;
        let dir = e.currentTarget.dataset.dir;
        if (show == 'showWest') {
            this.setData({
                showWest: true,
                predict_team_id_round3_series1: team_id,
                showWestScore: true,
                chooseWestTeam: team_id,

                score_active1: null,
                dirWest: dir,
                predict_game_id_round3_series1: null,
            });
        }

        if (show == 'showEast') {
            this.setData({
                showEast: true,
                predict_team_id_round3_series0: team_id,
                showEastScore: true,
                chooseEastTeam: team_id,


                score_active2: null,
                dirEast: dir,
                predict_game_id_round3_series0: null,
            });
        }

        if (show == 'showFinal') {
            if (this.data.predict_team_id_round3_series0 && this.data.predict_team_id_round3_series1) {
                this.setData({
                    showFinal: true,
                    predict_team_id_round4_series0: team_id,
                    showFinalScore: true,
                    chooseFinalTeam: team_id,


                    score_active3: null,
                    dirFinal: dir,
                    predict_game_id_round4_series0: null,
                });
            }
        }
    },
    //点击分数
    clickScore(e) {
        let score_active = e.currentTarget.dataset.active;
        let show = e.currentTarget.dataset.show;
        let series = e.currentTarget.dataset.series;
        if (show == 'west') {
            this.setData({
                score_active1: score_active,
                predict_game_id_round3_series1: series,
            })
        }
        if (show == 'east') {
            this.setData({
                score_active2: score_active,
                predict_game_id_round3_series0: series,
            })
        }
        if (show == 'final') {
            this.setData({
                score_active3: score_active,
                predict_game_id_round4_series0: series,
            })
        }
    },
    //验证是否选择球队
    verifyVote() {
        let error = false;
        console.log(this.data.predict_game_id_round3_series0)
        console.log(this.data.predict_game_id_round3_series1)
        console.log(this.data.predict_game_id_round4_series0)
        if (this.data.predict_game_id_round3_series1 == null) {
            error = true;
            this.setData({
                errorwest: true
            });
        };
        if (this.data.predict_game_id_round3_series0 == null) {
            error = true;
            this.setData({
                erroreast: true
            });
        };
        if (this.data.predict_game_id_round4_series0 == null) {
            error = true;
            this.setData({
                errorfinal: true
            })
        };
        if (error) {
            this.setData({
                notice: true
            });
            return false;
        }
        return true;
    },
    //提交
    voteSubmit() {
        if (!this.verifyVote()) {
            return false;
        }
        let obj = {
            predict_team_id_round3_series0: this.data.predict_team_id_round3_series0,
            predict_game_id_round3_series0: this.data.predict_game_id_round3_series0,
            predict_team_id_round3_series1: this.data.predict_team_id_round3_series1,
            predict_game_id_round3_series1: this.data.predict_game_id_round3_series1,
            predict_team_id_round4_series0: this.data.predict_team_id_round4_series0,
            predict_game_id_round4_series0: this.data.predict_game_id_round4_series0,
        }


        console.log(this.data.predict_team_id_round3_series0)
        console.log(this.data.predict_game_id_round3_series0)
        console.log(this.data.predict_team_id_round3_series1)
        console.log(this.data.predict_game_id_round3_series1)
        console.log(this.data.predict_team_id_round4_series0)
        console.log(this.data.predict_game_id_round4_series0)




        let advPredict = this.data.advPredict;
        advPredict.predict_game_id_round3_series0 = this.data.predict_game_id_round3_series0,
        advPredict.predict_team_id_round3_series0 = this.data.predict_team_id_round3_series0,
        advPredict.predict_game_id_round3_series1=  this.data.predict_game_id_round3_series1,
        advPredict.predict_team_id_round3_series1 = this.data.predict_team_id_round3_series1,
        advPredict.predict_game_id_round4_series0= this.data.predict_game_id_round4_series0,
        advPredict.predict_team_id_round4_series0 = this.data.predict_team_id_round4_series0

        api.advPredictPost(obj).then((res) => {
            console.log(res);
            this.setData({
                status1: false,
                status2: true,
                advPredict
            })
            console.log(this.data.status2);
        });
    },
    //清除错误弹窗
    clearErrorTips() {
        this.setData({
            notice: false,
            erroreast: false,
            errorwest: false,
            errorfinal: false
        });
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let self = this;
        api.leagueSeriesStatus(2).then((res) => {
            //获取对战信息
            self.setData({
                guessingDatas: teams.formatTeamsStatus(res.data.resp)
            });

            console.log(this.data.guessingDatas);


            //获取竞猜和结果信息
            api.advPredictGet().then((res) => {
                let datas = res.data;

                // datas.status = 1;
                // datas.count_down_timestamp = new Date('2018/05/22').getTime() / 1000;
                // datas.predict_game_id_round3_series0 = null;
                // datas.predict_game_id_round3_series1= null;
                // datas.predict_game_id_round4_series0= null;
                // datas.predict_team_id_round3_series0=null;
                // datas.predict_team_id_round3_series1=null;
                // datas.predict_team_id_round4_series0=null;
                // datas.win_game_id_round3_series0 = "1";
                // datas.win_game_id_round3_series1 = "2";
                // datas.win_game_id_round4_series0 = "1";
                // datas.win_team_id_round3_series0 = 1610612738;
                // datas.win_team_id_round3_series1 = 1610612757;
                // datas.win_team_id_round4_series0 = 1610612757;


                self.setData({
                    advPredict: datas
                })

                console.log(this.data.advPredict);


                if (datas.predict_team_id_round3_series0 == null && datas.status == 1) {
                    console.log('status1');
                    this.setData({
                        status1: true
                    });
                    this.count_down();
                } else if (datas.predict_team_id_round3_series0 != null && datas.status == 1) {
                    console.log('status2');
                    this.setData({
                        status2: true,

                        //东部
                        predict_team_id_round3_series0: datas.predict_team_id_round3_series0,
                        predict_game_id_round3_series0: datas.predict_game_id_round3_series0,

                        //西部
                        predict_team_id_round3_series1: datas.predict_team_id_round3_series1,
                        predict_game_id_round3_series1: datas.predict_game_id_round3_series1,

                        //最终决赛
                        predict_team_id_round4_series0: datas.predict_team_id_round4_series0,
                        predict_game_id_round4_series0: datas.predict_game_id_round4_series0
                    })
                } else if (datas.predict_team_id_round3_series0 == null && datas.status == 3) {
                    console.log('status3');
                    this.setData({
                        status3: true
                    })
                } else if (datas.predict_team_id_round3_series0 != null && datas.status == 3) {
                    if (datas.predict_team_id_round3_series0 == datas.win_team_id_round3_series0 && datas.predict_team_id_round3_series1 == datas.win_team_id_round3_series1 && datas.predict_team_id_round4_series0 == datas.win_team_id_round4_series0 && datas.predict_game_id_round3_series0 == datas.win_game_id_round3_series0 && datas.predict_game_id_round3_series1 == datas.win_game_id_round3_series1 && datas.predict_game_id_round4_series0 == datas.win_game_id_round4_series0) {
                        console.log('status4');
                        //全部猜对
                        this.setData({
                            status4: true,
                            champion: teams.querytTeamName(datas.win_team_id_round4_series0)
                        })
                    } else {
                        console.log('status5');
                        //猜错
                        this.setData({
                            status5: true
                        })
                        if (datas.predict_team_id_round3_series0 != datas.win_team_id_round3_series0 || datas.predict_team_id_round3_series1 != datas.win_team_id_round3_series1) {
                            //猜错
                            this.setData({
                                showFinalPopup: true
                            })
                        }
                    }
                }
            });
        });
    },
    count_down() {
        clearInterval(this.count_down);
        this.setData({
            day_1: '',
            day_2: '',
            hour_1: '',
            hour_2: '',
            min_1: '',
            min_2: '',
            sed_1: '',
            sed_2: ''
        });
        let times = parseInt(this.data.advPredict.count_down_timestamp);
        this.count_down = setInterval(() => {
            let day_1, day_2, hour_1, hour_2, min_1, min_2, sed_1, sed_2;
            let Time = (times - (new Date().getTime() / 1000));
            let Day = parseInt(Time / 60 / 60 / 24, 10) + '';
            let day = Day.split('');
            if (day.length < 2) {
                day_1 = 0;
                day_2 = day[0];
            } else {
                day_1 = day[0];
                day_2 = day[1];
            }
            let Hour = parseInt(Time / 60 / 60 % 24, 10) + '';
            let hour = Hour.split('');
            if (hour.length < 2) {
                hour_1 = 0;
                hour_2 = hour[0];
            } else {
                hour_1 = hour[0];
                hour_2 = hour[1];
            }
            let Min = parseInt(Time / 60 % 60, 10) + '';
            let min = Min.split('');
            if (min.length < 2) {
                min_1 = 0;
                min_2 = min[0];
            } else {
                min_1 = min[0];
                min_2 = min[1];
            }
            let Sed = parseInt(Time % 60, 10) + '';
            let sed = Sed.split('');
            if (sed.length < 2) {
                sed_1 = 0;
                sed_2 = sed[0];
            } else {
                sed_1 = sed[0];
                sed_2 = sed[1];
            }
            this.setData({
                day_1: day_1,
                day_2: day_2,
                hour_1: hour_1,
                hour_2: hour_2,
                min_1: min_1,
                min_2: min_2,
                sed_1: sed_1,
                sed_2: sed_2,
            })
        }, 1000);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})