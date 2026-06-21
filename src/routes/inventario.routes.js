const router = require('express').Router();
const c = require('../controllers/inventario.controller');

router.get  ('/',           c.getInventario);
router.patch('/:id/ajustar', c.ajustarStock);
router.patch('/:id/set',     c.setStock);

module.exports = router;