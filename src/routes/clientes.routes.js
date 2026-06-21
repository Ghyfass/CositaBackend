const router = require('express').Router();
const c = require('../controllers/clientes.controller');

// Normales
router.get   ('/normales',              c.getNormales);
router.post  ('/normales',              c.createNormal);
router.put   ('/normales/:id',          c.updateNormal);
router.delete('/normales/:id',          c.deleteNormal);
router.patch ('/normales/:id/compra',   c.registrarCompraNormal);
router.patch('/normales/:id/inhabilitar', c.inhabilitarNormal);
router.patch('/normales/:id/reactivar',   c.reactivarNormal);

// Mayoristas
router.get   ('/mayoristas',            c.getMayoristas);
router.post  ('/mayoristas',            c.createMayorista);
router.put   ('/mayoristas/:id',        c.updateMayorista);
router.delete('/mayoristas/:id',        c.deleteMayorista);
router.patch ('/mayoristas/:id/compra', c.registrarCompraMayorista);
router.patch('/mayoristas/:id/inhabilitar', c.inhabilitarMayorista);
router.patch('/mayoristas/:id/reactivar',   c.reactivarMayorista);

module.exports = router;