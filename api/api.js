const host = "https://www.nbaqmq.com";
// const host = "https://nbaqmq.akqatest.cn";

const sendRequest = function (url, method, data, header) {
  header = header || {
    'content-type': 'application/json'
  };
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: resolve,
      fail: reject
    })
  });
  return promise;
};

//1. Send Verification Code
const sendVerification = phone => {
  return sendRequest(host + '/api/user/phone', 'POST', { phone: phone });
}

//2. Verify user sms code to login/register
const verifyCode = (phone, code) => {
  return sendRequest(host + '/api/user/enroll/0', 'POST', { external_customer_id: phone, confirmation_code: code });
}

//3. Series Prediction
const seriesPrediction = (id, team_id) => {
  return sendRequest(host + '/api/playoffs/predict', 'POST', { rs_id: id, predict_team_id: team_id, channel: "baozun" }, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

//4. League Series Status
const leagueSeriesStatus = (league) => {
  if (!wx.getStorageSync('uuid') && league == undefined) {
    return sendRequest(host + '/api/playoffs/leaguestatus/', 'GET');
  }
  if (!wx.getStorageSync('uuid') && league!=undefined) {
    return sendRequest(host + '/api/playoffs/leaguestatus/' + league, 'GET');
  }
  if (wx.getStorageSync('uuid') && league == undefined) {
    return sendRequest(host + '/api/playoffs/leaguestatus/', 'GET', {}, {
      'content-type': 'application/json',
      "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
    });
  }
  return sendRequest(host + '/api/playoffs/leaguestatus/' + league, 'GET', {}, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

//5. My Rewards
const myRewards = (league) => {
  return sendRequest(host + '/api/playoffs/myrewards', 'GET', {}, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

//6. Save Delivery Address
const saveDelivery = (obj) => {
  return sendRequest(host + '/api/playoffs/savedelivery', 'POST', obj, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

//7. Advanced Prediction
const advPredictPost = (obj) => {
  obj.channel = "baozun";
  return sendRequest(host + '/api/playoffs/advpredict', 'POST', obj, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

//8. Advanced Prediction
const advPredictGet = () => {
  if (!wx.getStorageSync('uuid')) {
    return sendRequest(host + '/api/playoffs/advpredict', 'GET');
  }
  return sendRequest(host + '/api/playoffs/advpredict', 'GET', {}, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

//9. Rewards Notification
const rewardNotification = () => {
  if (!wx.getStorageSync('uuid')){
    return sendRequest(host + '/api/playoffs/rewardnotification', 'GET');
  }
  return sendRequest(host + '/api/playoffs/rewardnotification', 'GET', {}, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

//10. Get predict vote rate
const getPredictVoteRate = (rs_id) => {
  return sendRequest(host + '/api/playoffs/predict/rate/' + rs_id, 'GET', {}, {
    'content-type': 'application/json',
    "Authorization": wx.getStorageSync('uuid') + "." + wx.getStorageSync('token')
  });
}

module.exports = {
  sendRequest: sendRequest,
  sendVerification: sendVerification,
  verifyCode: verifyCode,
  seriesPrediction: seriesPrediction,
  leagueSeriesStatus: leagueSeriesStatus,
  myRewards: myRewards,
  saveDelivery: saveDelivery,
  advPredictPost: advPredictPost,
  advPredictGet: advPredictGet,
  rewardNotification: rewardNotification,
  getPredictVoteRate: getPredictVoteRate,
  host: host
}