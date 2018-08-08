// components/shade/shade.js
const api = require('../../api/api.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        westStatus: {
            type: Array,
            value: []
        },
        eastStatus: {
            type: Array,
            value: []
        },
        finalStatus: {
            type: Array,
            value: []
        },
        advPredict: {
            type: Object,
            value: {}
        },
        clickArea: {
            type: String,
            value: ''
        },
        clickIndex: {
            type: String,
            value: '',
            observer: function(val) {
                this.shadeControl(val);
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        popup_unbegin_show: false,
        popup_guessing: false,
        popup_guessed: false,
        popup_missed: false,
        popup_gameover_missed: false,
        popup_guess_error: false,
        popup_guess_right: false,
        unbegin_btn: false,
        total_points: 0,
        day_1: '',
        day_2: '',
        hour_1: '',
        hour_2: '',
        min_1: '',
        min_2: '',
        sed_1: '',
        sed_2: '',
        guessingDatas: {},
        rs_id: 0,
        predict_team_id: 0
    },

    attached() {

    },
    /**
     * 组件的方法列表
     */
    methods: {
        popup_unbegin_hide() {
            this.setData({
                popup_unbegin_show: false
            });
            this.triggerEvent("action");
        },
        popup_guessing_hide() {
            clearInterval(this.count_down);
            this.setData({
                popup_guessing: false,
                guessingDatas: {},
                predict_team_id: 0
            });
            this.triggerEvent("action");
        },
        popup_guessed_hide() {
            clearInterval(this.count_down);
            this.setData({
                popup_guessed: false,
                guessingDatas: {}
            });
            this.triggerEvent("action");
        },
        popup_missed_hide() {
            clearInterval(this.count_down);
            this.setData({
                popup_missed: false,
                guessingDatas: {}
            });
            this.triggerEvent("action");
        },
        popup_guess_right_hide() {
            clearInterval(this.count_down);
            this.setData({
                popup_guess_right: false,
                guessingDatas: {}
            });
            this.triggerEvent("action");
        },
        popup_guess_error_hide() {
            clearInterval(this.count_down);
            this.setData({
                popup_guess_error: false,
                guessingDatas: {}
            });
            this.triggerEvent("action");
        },
        popup_gameover_missed_hide() {
            clearInterval(this.count_down);
            this.setData({
                popup_gameover_missed: false,
                guessingDatas: {}
            });
            this.triggerEvent("action");
        },
        link_west_east(e) {
            let area = e.target.dataset.area;
            this.setData({
                popup_unbegin_show: false
            });
            this.triggerEvent("action");
            this.triggerEvent("link", { area: area });
        },
        guessing_team(e) {
            let team_id = e.currentTarget.dataset.teamid;
            this.setData({
                predict_team_id: team_id
            })
        },
        guessing_submit() {
            let self = this;
            if (this.data.predict_team_id == 0) {
                wx.showToast({
                    title: '请选择您支持的队伍',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            api.seriesPrediction(this.data.rs_id, this.data.predict_team_id).then((res) => {
                if (res.statusCode == 200) {
                  console.log(this.data.rs_id);
                    this.setData({
                        rs_id: 0,
                        popup_guessing: false,
                        popup_guessed: true,
                    });

                    self.data.guessingDatas.predict_team_id = this.data.predict_team_id;
                    // console.log(self.data.guessingDatas);
                }
                // console.log(res);
            })
        },
        share_page(e) {
            this.triggerEvent("action", { type: "share_page" });
        },
        shadeControl(val) {
            if (val == '') {
                return;
            }
            let fightIndex = val;
            let area = this.properties.clickArea;
            let fightDatas = {};

            if (area == 'final') {
                fightDatas = this.properties.finalStatus[fightIndex];
                // if (this.properties.advPredict.status != 0) {
                //     this.triggerEvent("action");
                //     wx.navigateTo({
                //         url: '/pages/finals/finals',
                //     });
                // } else {
                //     if (fightIndex == 2) {
                //         this.setData({
                //             popup_unbegin_show: true,
                //             total_points: (fightDatas.total_points).toLocaleString(),
                //             unbegin_btn: true
                //         })
                //     } else {
                //         this.setData({
                //             popup_unbegin_show: true,
                //             total_points: (fightDatas.total_points).toLocaleString(),
                //             unbegin_btn: false
                //         })
                //     }
                // }
                // return false;
            }
            if (area == 'west') {
                fightDatas = this.properties.westStatus[fightIndex];
            }
            if (area == 'east') {
                fightDatas = this.properties.eastStatus[fightIndex];
            }

            if (fightDatas.status == 1 && fightDatas.predict_team_id == null) {
                this.setData({
                    popup_guessing: true,
                    day_1: '',
                    day_2: '',
                    hour_1: '',
                    hour_2: '',
                    min_1: '',
                    min_2: '',
                    sed_1: '',
                    sed_2: '',
                    guessingDatas: fightDatas,
                    total_points: (fightDatas.total_points).toLocaleString(),
                    rs_id: fightDatas.rs_id
                });
                let times = parseInt(fightDatas.count_down_timestamp);
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
            } else if (fightDatas.status == 1 && fightDatas.predict_team_id != null) {
                this.setData({
                    popup_guessed: true,
                    guessingDatas: fightDatas,
                    predict_team_id: fightDatas.predict_team_id
                });
            } else if (fightDatas.status == 3 && fightDatas.win_team_id == null && fightDatas.predict_team_id == null) {
                this.setData({
                    popup_missed: true,
                    guessingDatas: fightDatas,
                    total_points: (fightDatas.total_points).toLocaleString()
                })
            } else if (fightDatas.status == 3 && fightDatas.win_team_id == null && fightDatas.predict_team_id != null) {
                this.setData({
                    popup_guessed: true,
                    guessingDatas: fightDatas,
                    predict_team_id: fightDatas.predict_team_id
                });
            } else if (fightDatas.status == 3 && fightDatas.win_team_id != null && fightDatas.predict_team_id != null) {
                if (fightDatas.predict_team_id == fightDatas.win_team_id) {
                    //正确的
                    this.setData({
                        popup_guess_right: true,
                        guessingDatas: fightDatas,
                    })
                } else {
                    //错误的
                    this.setData({
                        popup_guess_error: true,
                        guessingDatas: fightDatas,
                    })
                }
            } else if (fightDatas.status == 3 && fightDatas.win_team_id != null && fightDatas.predict_team_id == null) {
                //显示比方
                this.setData({
                    popup_gameover_missed: true,
                    guessingDatas: fightDatas,
                    total_points: (fightDatas.total_points).toLocaleString(),
                })
            } else {
                this.setData({
                    popup_unbegin_show: true,
                    total_points: (fightDatas.total_points).toLocaleString(),
                    unbegin_btn: false
                })
            }
        },
    }
})