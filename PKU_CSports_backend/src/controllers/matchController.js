const matchService = require('../services/matchService');

exports.list = async (req, res) => {
  try {
    const { status = '', league = '', round = '', page = 1, pageSize = 20 } = req.query;
    const data = await matchService.list({ status, league, round, page, pageSize });
    res.json({ success: true, data });
  } catch (err) {
    console.error('match list error', err);
    res.status(500).json({ success: false, message: '获取赛程失败' });
  }
};

exports.detail = async (req, res) => {
  try {
    const data = await matchService.detail(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: '未找到比赛' });
    res.json({ success: true, data });
  } catch (err) {
    console.error('match detail error', err);
    res.status(500).json({ success: false, message: '获取详情失败' });
  }
};

exports.upsertResult = async (req, res) => {
  try {
    const data = await matchService.upsertResult(req.params.id, req.body || {});
    res.json({ success: true, data });
  } catch (err) {
    console.error('match result error', err);
    res.status(500).json({ success: false, message: '更新比分失败' });
  }
};

exports.upsertLineup = async (req, res) => {
  try {
    const data = await matchService.upsertLineup(req.params.id, req.body || {});
    res.json({ success: true, data });
  } catch (err) {
    console.error('match lineup error', err);
    res.status(500).json({ success: false, message: '更新阵容失败' });
  }
};

