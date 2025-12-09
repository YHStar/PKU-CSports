const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authMiddleware, allowRoles } = require('../middleware/auth');

router.get('/', newsController.list);
router.get('/:id', newsController.detail);
router.post('/', authMiddleware, allowRoles('association', 'admin'), newsController.create);
router.patch('/:id', authMiddleware, allowRoles('association', 'admin'), newsController.update);

module.exports = router;

