const router = require('express').Router();
const c = require('../controllers/ventas.controller');

router.get('/anios',          c.getAnios);
router.get('/top-productos',  c.getTopProductos);
router.get('/:mes/:anio',     c.getVentasMes);
router.get('/',               c.getVentas);

module.exports = router;