const commentService = require('../services/commentService');

exports.create = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId = null } = req.body || {};
    if (!content) return res.status(400).json({ success: false, message: '内容必填' });
    const data = await commentService.create({
      postId,
      userId: req.user.id,
      content,
      parentId
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('comment create error', err);
    res.status(500).json({ success: false, message: '发表评论失败' });
  }
};

exports.list = async (req, res) => {
  try {
    const { postId } = req.params;
    const data = await commentService.list(postId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('comment list error', err);
    res.status(500).json({ success: false, message: '获取评论失败' });
  }
};

