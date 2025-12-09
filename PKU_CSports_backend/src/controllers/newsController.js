const newsService = require('../services/newsService');

exports.list = async (req, res) => {
  try {
    const { type = 'all', tag = '', page = 1, pageSize = 10 } = req.query;
    const data = await newsService.list({ type, tag, page, pageSize });
    res.json({ success: true, data });
  } catch (err) {
    console.error('news list error', err);
    res.status(500).json({ success: false, message: '获取列表失败' });
  }
};

exports.detail = async (req, res) => {
  try {
    const item = await newsService.detail(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: '未找到资讯' });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error('news detail error', err);
    res.status(500).json({ success: false, message: '获取详情失败' });
  }
};

exports.create = async (req, res) => {
  try {
    const body = req.body || {};
    const result = await newsService.create({ ...body, authorId: req.user.id });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('news create error', err);
    res.status(500).json({ success: false, message: '创建失败' });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await newsService.update(req.params.id, req.body || {});
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('news update error', err);
    res.status(500).json({ success: false, message: '更新失败' });
  }
};

