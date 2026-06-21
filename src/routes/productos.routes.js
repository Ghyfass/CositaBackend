const router = require('express').Router();
const c = require('../controllers/productos.controller');

router.get   ('/',    c.getProductos);
router.get   ('/:id', c.getProducto);
router.post  ('/',    c.createProducto);
router.put   ('/:id', c.updateProducto);
router.delete('/:id', c.deleteProducto);

module.exports = router;