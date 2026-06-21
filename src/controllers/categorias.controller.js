const pool = require('../config/db');

exports.getCategorias = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categoria ORDER BY nombre');
  res.json(rows);
};

exports.createCategoria = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre es requerido' });
  const [result] = await pool.query(
    'INSERT INTO categoria (nombre) VALUES (?)', [nombre]
  );
  res.status(201).json({ id: result.insertId, nombre });
};

exports.updateCategoria = async (req, res) => {
  const { nombre } = req.body;
  await pool.query('UPDATE categoria SET nombre=? WHERE id=?', [nombre, req.params.id]);
  res.json({ message: 'Categoría actualizada' });
};

exports.deleteCategoria = async (req, res) => {
  // Verifica que no tenga productos asociados
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM producto WHERE id_categoria=?', [req.params.id]
  );
  if (total > 0)
    return res.status(400).json({ error: 'No se puede eliminar, tiene productos asociados' });

  await pool.query('DELETE FROM categoria WHERE id=?', [req.params.id]);
  res.json({ message: 'Categoría eliminada' });
};