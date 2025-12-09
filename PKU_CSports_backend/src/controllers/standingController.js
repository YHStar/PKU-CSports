const standingService = require('../services/standingService');

exports.listStandings = async (req, res) => {
  try {
    const { league = '' } = req.query;
    const data = await standingService.listStandings({ league });
    res.json({ success: true, data });
  } catch (err) {
    console.error('standings error', err);
    res.status(500).json({ success: false, message: '获取积分榜失败' });
  }
};

exports.listPlayerStats = async (req, res) => {
  try {
    const { league = '', sort = 'goals' } = req.query;
    const data = await standingService.listPlayerStats({ league, sort });
    res.json({ success: true, data });
  } catch (err) {
    console.error('player stats error', err);
    res.status(500).json({ success: false, message: '获取球员榜失败' });
  }
};

