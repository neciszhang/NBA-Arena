let teams = [{
        team_id: 1610612737,
        name: '老鹰'
    },
    {
        team_id: 1610612738,
        name: '凯尔特人'
    },
    {
        team_id: 1610612739,
        name: '骑士'
    },
    {
        team_id: 1610612740,
        name: '鹈鹕'
    },
    {
        team_id: 1610612741,
        name: '公牛'
    },
    {
        team_id: 1610612742,
        name: '独行侠'
    },
    {
        team_id: 1610612743,
        name: '掘金'
    },
    {
        team_id: 1610612744,
        name: '勇士'
    },
    {
        team_id: 1610612745,
        name: '火箭'
    },
    {
        team_id: 1610612746,
        name: '快船'
    },
    {
        team_id: 1610612747,
        name: '湖人'
    },
    {
        team_id: 1610612748,
        name: '热火'
    },
    {
        team_id: 1610612749,
        name: '雄鹿'
    },
    {
        team_id: 1610612750,
        name: '森林狼'
    },
    {
        team_id: 1610612751,
        name: '篮网'
    },
    {
        team_id: 1610612752,
        name: '尼克斯'
    },
    {
        team_id: 1610612753,
        name: '魔术'
    },
    {
        team_id: 1610612754,
        name: '步行者'
    },
    {
        team_id: 1610612755,
        name: '76人'
    },
    {
        team_id: 1610612756,
        name: '太阳'
    },
    {
        team_id: 1610612757,
        name: '开拓者'
    },
    {
        team_id: 1610612758,
        name: '国王'
    },
    {
        team_id: 1610612759,
        name: '马刺'
    },
    {
        team_id: 1610612760,
        name: '雷霆'
    },
    {
        team_id: 1610612761,
        name: '猛龙'
    },
    {
        team_id: 1610612762,
        name: '爵士'
    },
    {
        team_id: 1610612763,
        name: '灰熊'
    },
    {
        team_id: 1610612764,
        name: '奇才'
    },
    {
        team_id: 1610612765,
        name: '活塞'
    },
    {
        team_id: 1610612766,
        name: '黄蜂'
    }
];

function querytTeamName(team_id) {
    for (let team of teams) {
        if (team.team_id == team_id) {
            return team.name;
        }
    }
}

function formatTeamsStatus(datas) {
    let teamsPos = [53, 176, 303, 424, 549, 674, 797, 920];
    let resultPos = [120, 376, 620, 870, 389, 580];
    let teamsIndex = 0;
    let resultIndex = 0;
    //第3个放在第0个后面
    if (datas.length >= 6) {
      // console.log(0)
      let spliceItem = datas.splice(3, 1);
      datas.splice(1, 0, spliceItem[0]);
    }
    for (let data of datas) {
        data.team1_name = querytTeamName(data.team1_id);
        data.team2_name = querytTeamName(data.team2_id);
        data.resultPos = resultPos[resultIndex];
        resultIndex += 1;
        if (data.status == 3 && data.win_team_id != null) {
            data.win_team_url = `../../images/teams/${data.win_team_id}.png`;
            data.predict_team_name = querytTeamName(data.predict_team_id);
        }
        // data.predict_team_name = null;
        // data.win_team_id = null;
        // data.team1_id = null;
        // data.team2_id = null;
        // data.predict_team_name = querytTeamName(data.predict_team_id);
        // data.predict_team_id = data.team1_id;
        // data.win_team_url = `https://ui-cdn.nbaqmq.com/static/logo/${data.win_team_id}.png`;
        // data.winners = 100;
        // data.status = 200;
        // data.count_down_timestamp = 1524153600;
        // data.status = 1;
        if (teamsIndex <= 7) {
            data.team1_pos = teamsPos[teamsIndex];
            data.team2_pos = teamsPos[teamsIndex + 1];
            teamsIndex += 2;
        }

    }
    return datas;
};

export default {
    querytTeamName,
    formatTeamsStatus
};