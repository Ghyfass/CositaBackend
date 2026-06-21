const router = require('express').Router();
const c = require('../controllers/categorias.controller');

router.get   ('/',    c.getCategorias);
router.post  ('/',    c.createCategoria);
router.put   ('/:id', c.updateCategoria);
router.delete('/:id', c.deleteCategoria);

module.exports = router;