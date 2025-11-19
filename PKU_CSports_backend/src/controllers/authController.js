const userService = require('../services/userService');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '请求失败，用户名和密码为必填项' 
      });
    }

    // Call the service layer to perform login
    const result = await userService.loginUser(username, password);

    if (!result.success) {
      return res.status(401).json({ success: false, message: result.message });
    }

    // Login successful, send back token and user info
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token: result.token,
        user: result.user,
      },
    });

  } catch (error) {
    console.error('Login controller error:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};
