//答题声音
const select_audio = wx.createInnerAudioContext();
const answer_right_audio = wx.createInnerAudioContext();
const answer_error_audio = wx.createInnerAudioContext();
const answer_start_audio = wx.createInnerAudioContext();
const answer_win_audio = wx.createInnerAudioContext();
const answer_lose_audio = wx.createInnerAudioContext();
const answer_tie_audio = wx.createInnerAudioContext();

select_audio.src = 'https://yooqapp.com/rc/games/click.mp3';
answer_right_audio.src = "https://yooqapp.com/rc/games/click-right.mp3";
answer_right_audio.volume = 0.3;
answer_error_audio.src = "https://yooqapp.com/rc/games/click-wrong.mp3";
answer_error_audio.volume = 0.3;
answer_start_audio.src = "https://yooqapp.com/rc/games/start.mp3";
answer_win_audio.volume = 0.3;
answer_win_audio.src = "https://yooqapp.com/rc/games/win.mp3";
answer_win_audio.volume = 0.3;
answer_lose_audio.src = "https://yooqapp.com/rc/games/lose.mp3";
answer_lose_audio.volume = 0.3;
answer_tie_audio.src = "https://yooqapp.com/rc/games/tie.mp3";
answer_tie_audio.volume = 0.3;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_msg:{},
    progress_num: 0,
    matching_percent: 0,
    invite_percent: 0,
    invite_run_time: 120,
    matching_run_time: 10,
    count_time_ms: '10',
    count_time_hm: '00',
    invite_hide:false,
    gameStart: false,
    fight_animation: false,
    result: false,
    gameType: '',
    inviteCode:0,
    gameQuestionList: [],
    current_question: {},
    current_index: 0,
    game_result: {},
    user_score: 0,
    rival_score: 0,
    is_answer: false,
    gameId: 0,
    answerId: 0,
    user_name: '',
    rival_name: '',
    user_avatars: '',
    rival_avatars: '',
    popup:false,
    show_question:true,
    closeWebsocket:true,
    system:''
  },

  /**
   * 生命周期函数--监听页面加载:
   */
  onLoad: function (options) {

    wx.onNetworkStatusChange(function (res) {
      let NetworkStatus = res;
      if (!NetworkStatus.isConnected || NetworkStatus.networkType == "none") {
        wx.showModal({
          title: '提示',
          content: '网络连接断开',
          confirmText: '退出',
          confirmColor: '',
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        })
      }
    })

    this.get_system();
    let user_msg = wx.getStorageSync('user_msg');
    this.setData({
      user_msg
    });
    let self = this;
    if (options.gameType == 'matching') {
      this.setData({
        gameType: 'matching'
      }, function () {
          self.matching_init();
          self.websocket("0", "");
      })
    }
    else {
      let get_index = options.get_index;
      this.setData({
        gameType: 'invite',
        inviteCode: options.inviteCode
      }, function () {
          self.invite_init();
          self.websocket(get_index, options.inviteCode);
      })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.closeWebsocket == false) {
      this.clearInterval();
      wx.closeSocket();
      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.closeWebsocket == false) {
      this.clearInterval();
      wx.closeSocket();
    }
  },

  clearInterval(){
    clearInterval(this.countTime);
    clearInterval(this.matching_time);
    clearTimeout(this.fight_animation);
    clearTimeout(this.count_down);
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

  onShareAppMessage(res){
    let user_score = this.data.user_score;
    if (res.from === 'button') {
      return {
        title: `本场比赛，我拿下了${user_score}分`,
        path: '/pages/answers/index/index',
        imageUrl: "http://cdn.yooqapp.com/rc/games/result_share.png"
      }
    }
    else {
      return {
        title: 'NBA竞技场',
        path: '/pages/answers/index/index',
        imageUrl: "http://cdn.yooqapp.com/rc/games/default_share.png"
      }
    }
  },

  cancel() {
    if (this.data.closeWebsocket == true) {
      wx.navigateBack();
    }
    else {
      wx.closeSocket();
      wx.navigateBack();
    }
  },
  count_down_reset() {
    clearInterval(this.countTime);
    var times = 10 * 100; // 10秒
    this.countTime = setInterval(() => {
      times = --times < 0 ? 0 : times;
      var ms = Math.floor(times / 100).toString();

      if (ms.length <= 1) {
        ms = "0" + ms;
      }
      var hm = Math.floor(times % 100).toString();
      if (hm.length <= 1) {
        hm = "0" + hm;
      }
      if (times == 0) {
        clearInterval(this.countTime);
        this.auto_answer();
      }
      // 获取秒数、毫秒数
      this.setData({
        count_time_ms: ms,
        count_time_hm: hm
      })
    }, 10);
  },

  android_count_down_reset(){
    clearInterval(this.countTime);
    let time = 9;
    this.setData({
      count_time_ms: time
    })
    this.countTime = setInterval(()=>{
        --time;
        this.setData({
          count_time_ms : time
        })
        if (time == 0) {
          clearInterval(this.countTime);
          this.auto_answer();
        }
    },1000);
  },

  invite_init() {
    let run_time = 410 / (this.data.invite_run_time) / 2 / 2 / 2;
    this.setData({
      progress_num:50
    },function(){
      this.count_time = setInterval(() => {
        if (this.data.invite_percent >= this.data.invite_run_time) {
          clearInterval(this.count_time);
          return;
        }
        let invite_percent = Math.floor(this.data.invite_percent + 1);
        let progress_num = this.data.progress_num + 410 / this.data.invite_run_time;
        this.setData({
          progress_num: progress_num,
          invite_percent
        })
      }, 1000);
    })
  },

  matching_init() {
    let run_time = 460 / (this.data.matching_run_time) / 2 / 2 / 2;
    this.matching_time = setInterval(() => {
      if (this.data.progress_num >= 457 || this.data.matching_percent >= 100) {
        clearInterval(this.matching_time);
        return;
      }
      let progress_num = this.data.progress_num + run_time;
      this.setData({
        progress_num: progress_num,
        matching_percent: Math.floor((progress_num / 460) * 100)
      })
    }, 125);
  },

  websocket(type, inviteCode) {
    let self = this;
    wx.connectSocket({
      url: 'wss://yooqapp.com/wss'
    });
    if (inviteCode) {
      wx.onSocketOpen(function (res) {
        wx.onSocketClose(function (res) {
          console.log('WebSocket 已关闭！');
          self.setData({
            closeWebsocket: true
          });
        });
        self.setData({
          closeWebsocket:false
        });
        wx.onSocketError(function(res){
          wx.showModal({
            title: "提示",
            content: "网络连接错误,请稍后重试",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        });
        wx.sendSocketMessage({
          data: JSON.stringify({
            type: type,
            wechatPartyNo: wx.getStorageSync('openid'),
            inviteCode: inviteCode
          })
        });
        wx.onSocketMessage(function (res) {
          let datas = JSON.parse(res.data);
          if (datas.type == 99) {
            clearInterval(self.matching_time);
            clearInterval(self.count_time);
            self.setData({
              invite_hide: true
            })
            setTimeout(() => {
              self.start_game(res);
            }, 400)
          }
          else if (datas.type == 98) {
            self.answer_result(res);
          }
          else if (datas.type == 97) {
            clearInterval(self.countTime);
            self.game_result(res);
          }
          else if(datas.type == 101) {
            wx.showModal({
              title:"提示",
              content:"好友邀请已失效",
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack();
                } 
              }
            })
          }
        });
      });
    }
    else {
      wx.onSocketOpen(function (res) {
        wx.onSocketClose(function (res) {
          console.log('WebSocket 已关闭！');
          self.setData({
            closeWebsocket: true
          });
        });
        self.setData({
          closeWebsocket: false
        });
        wx.onSocketError(function (res) {
          wx.showModal({
            title: "提示",
            content: "网络连接错误,请稍后重试",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        });
        wx.sendSocketMessage({
          data: JSON.stringify({
            type: type,
            wechatPartyNo: wx.getStorageSync('openid')
          })
        });
        
        wx.onSocketMessage(function (res) {
          let datas = JSON.parse(res.data);
          if (datas.type == 99) {
            clearInterval(self.matching_time);
            clearInterval(self.count_time);
            self.setData({
              invite_hide:true
            })
            setTimeout(()=>{
              self.start_game(res);
            },400)
          }
          else if (datas.type == 98) {
            self.answer_result(res);
          }
          else if (datas.type == 97) {
            clearInterval(self.countTime);
            self.game_result(res);
          }
          else if (datas.type == 101) {
            wx.showModal({
              title: "提示",
              content: "好友邀请已失效",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack();
                }
              }
            })
          }
        })
      });
    }
  },

  start_game(res) {
      answer_start_audio.play();
    let self = this;
    let datas = JSON.parse(res.data);
    for (let i = 0; i < datas.gameQuestionList.length; i++) {
      for (let g = 0; g < datas.gameQuestionList[i].answerDetailList.length; g++) {
        datas.gameQuestionList[i].answerDetailList[g].state = "";
        datas.gameQuestionList[i].answerDetailList[g].rival = "";
        datas.gameQuestionList[i].answerDetailList[g].pc_answer = "";
      }
    }
    self.setData({
      gameId: datas.gameId,
      gameQuestionList: datas.gameQuestionList,
      current_question: datas.gameQuestionList[self.data.current_index],
      fight_animation: true,
      is_answer: true,
      user_name: datas.user.name,
      user_avatars: datas.user.wechatPicUrl,
      rival_name: datas.rivalUser.name,
      rival_avatars: datas.rivalUser.wechatPicUrl
    });
    self.fight_animation = setTimeout(() => {
      self.setData({
        gameStart: true,
        fight_animation: false
      }, function () {
        self.count_down = setTimeout(()=>{
          if (self.data.system == 'ios'){
            self.count_down_reset();
            self.setData({
              is_answer:false
            })
          }
          else {
            self.android_count_down_reset();
            self.setData({
              is_answer: false
            })
          }
        },2750);
      });
    }, 3000);
  },
  auto_answer() {
    if(!this.data.gameStart)return;
    let answerDetailList = this.data.current_question.answerDetailList;

    let answer = [0, 1, 2, 3];
    for (let i = 0; i < answerDetailList.length; i++) {
      if (answerDetailList[i].correct) {
        answer.splice(i, 1);
      }
    }
    let randomNum = Math.floor(Math.random() * 3);
    let autoQuestionNum = answer[randomNum];
    let autoQuestion = answerDetailList[autoQuestionNum];
    let autoAnswer = {
      currentTarget: {
          dataset: {
            istrue: false,
            answerid: autoQuestion.id,
            num: autoQuestionNum
          }
      }
    }
    this.select_option(autoAnswer);
  },
  select_option(e) {
    select_audio.play();
    let self = this;
    let is_answer = this.data.is_answer;
    if (is_answer) return;
    this.setData({
      is_answer: true
    });
    let answer = e.currentTarget.dataset.istrue;
    let index = e.currentTarget.dataset.num;
    let current_question = this.data.current_question;
    let answerId = e.currentTarget.dataset.answerid || e.target.dataset.answerid;
    this.setData({
      answerId
    }, function () {
      self.answer_question();
      if (answer) {
        current_question.answerDetailList[index].state = "right";
        setTimeout(()=>{
          answer_right_audio.play();
        },400);
      }
      else {
        current_question.answerDetailList[index].state = "error";
        setTimeout(() => {
          answer_error_audio.play();
        },400);
      }
      self.setData({
        current_question
      });
    });
  },
  answer_question() {
    let self = this;
    wx.sendSocketMessage({
      data: JSON.stringify({
        type: "1",
        wechatPartyNo: wx.getStorageSync('openid'),
        gameId: self.data.gameId,
        questionId: self.data.current_question.questionDetail.id,
        answerId: self.data.answerId
      })
    });
  },
  answer_result(res) {
    let self = this;
    let datas = JSON.parse(res.data);
    let rivalUserMsg = datas.rivalUser;
    let rival_answerId = rivalUserMsg.answerId;
    let rival_answerCorrect = rivalUserMsg.answerCorrect;
    let current_question = this.data.current_question;
    for (let i = 0; i < current_question.answerDetailList.length; i++) {
      if (current_question.answerDetailList[i].id != rival_answerId) {
        continue;
      }
      if (rival_answerCorrect) {
        current_question.answerDetailList[i].rival = 'right';
      }
      else {
        current_question.answerDetailList[i].rival = 'error';
      }
    }
    self.setData({
      current_question
    })

    if (!datas.rivalUser.answerCorrect && !datas.user.answerCorrect) {
      for (let i = 0; i < current_question.answerDetailList.length; i++) {
        if (!current_question.answerDetailList[i].correct) {
          continue;
        }
          current_question.answerDetailList[i].pc_answer = "right";
      }
      setTimeout(()=>{
        self.setData({
          current_question,
          rival_score: datas.rivalUser.gamePoint,
          user_score: datas.user.gamePoint
        })
      },1000);
    }
    else {
      self.setData({
        current_question,
        rival_score: datas.rivalUser.gamePoint,
        user_score: datas.user.gamePoint
      });
    }
    
    clearInterval(self.countTime);

    setTimeout(()=>{
      self.setData({
        show_question: false
      });
    },2750);

    setTimeout(() => {
      self.next_question();
    }, 3200);  

  },
  next_question() {
    if (!this.data.gameStart) return;
    this.setData({
      count_time_ms: '10',
      count_time_hm: '00'
    });
    let self = this;
    this.setData({
      show_question: true,
      // is_answer: false,
      current_index: this.data.current_index + 1,
      current_question: this.data.gameQuestionList[this.data.current_index + 1]
    }, function () {
      setTimeout(()=>{
        if (self.data.system == 'ios') {
          self.count_down_reset();
          self.setData({
            is_answer: false
          })
        }
        else {
          self.android_count_down_reset();
          self.setData({
            is_answer: false
          })
        }
      },2800);
    })
  },
  get_system() {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.system.indexOf('iOS') > -1) {
          self.setData({
            system: 'ios'
          })
        }
        else {
          self.setData({
            system: 'android'
          })
        }
      }
    })
  },
  game_result(res) {
    let datas = JSON.parse(res.data);
    setTimeout(()=>{
      this.setData({
        game_result: datas,
        result: true,
        gameStart: false,
        is_answer:false
      })
      console.log(datas);
      if (datas.gameResult=="0"){
        answer_tie_audio.play();
      }
      if (datas.gameResult=="1"){
        answer_win_audio.play();
      }
      if (datas.gameResult=="2"){
        answer_lose_audio.play();
      }
    },2700)
  },
  skip_index(){
    wx.navigateBack();
  },
  skip_ranking(){
    wx.navigateTo({
      url: '/pages/answers/ranking/ranking',
    })
  }
})