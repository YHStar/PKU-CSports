const bcrypt = require('bcryptjs');
(async () => {
  const hash = await bcrypt.hash('password123', 10);
  console.log('加密后的密码:', hash);
})();
