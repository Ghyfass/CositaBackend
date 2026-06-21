const router = require('express').Router();
const c = require('../controllers/finanzas.controller');

router.get ('/anios',          c.getAnios);
router.get ('/anual/:anio',    c.getResumenAnual);
router.get ('/mensual/:anio',  c.getResumenPorAnio);
router.get ('/:mes/:anio',     c.getResumenMensual);
router.post('/inversion',      c.registrarInversion);

module.exports = router;