const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { authMiddleware, allowRoles } = require('../middleware/auth');

router.get('/', matchController.list);
router.get('/:id', matchController.detail);
router.post('/:id/result', authMiddleware, allowRoles('association', 'admin'), matchController.upsertResult);
router.post('/:id/lineup', authMiddleware, allowRoles('association', 'admin'), matchController.upsertLineup);

module.exports = router;

