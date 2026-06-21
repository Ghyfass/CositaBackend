const router = require('express').Router();
const c = require('../controllers/pedidos.controller');

router.get   ('/',            c.getPedidos);
router.get   ('/:id',         c.getPedido);
router.post  ('/',            c.createPedido);
router.put   ('/:id',         c.updatePedido);
router.patch ('/:id/estado',  c.updateEstado);
router.delete('/:id',         c.deletePedido);

module.exports = router;