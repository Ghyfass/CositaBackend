const pool = require('../config/db');

// ── CLIENTES NORMALES ──────────────────────────────────────────

exports.getNormales = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM cliente_normal ORDER BY nombre');
  res.json(rows);
};

exports.createNormal = async (req, res) => {
  const { nombre, telefono } = req.body;
  if (!nombre || !telefono)
    return res.status(400).json({ error: 'nombre y telefono son requeridos' });

  const [result] = await pool.query(
    'INSERT INTO cliente_normal (nombre, telefono) VALUES (?, ?)',
    [nombre, telefono]
  );
  res.status(201).json({ id: result.insertId, nombre, telefono, num_compras: 1 });
};

exports.updateNormal = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono } = req.body;
  await pool.query(
    'UPDATE cliente_normal SET nombre=?, telefono=? WHERE id=?',
    [nombre, telefono, id]
  );
  res.json({ message: 'Cliente actualizado' });
};

exports.deleteNormal = async (req, res) => {
  await pool.query('DELETE FROM cliente_normal WHERE id=?', [req.params.id]);
  res.json({ message: 'Cliente eliminado' });
};

// Suma 1 compra, resetea a 0 si llega a 10
exports.registrarCompraNormal = async (req, res) => {
  const { id } = req.params;
  const [[cliente]] = await pool.query(
    'SELECT num_compras FROM cliente_normal WHERE id=?', [id]
  );
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

  const nuevaCantidad = cliente.num_compras >= 9 ? 0 : cliente.num_compras + 1;

  await pool.query(
    'UPDATE cliente_normal SET num_compras=?, ultima_compra=CURDATE() WHERE id=?',
    [nuevaCantidad, id]
  );
  res.json({ num_compras: nuevaCantidad });
};
// ── CLIENTES MAYORISTAS ────────────────────────────────────────

exports.getMayoristas = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM cliente_mayorista ORDER BY nombre');
  res.json(rows);
};

exports.createMayorista = async (req, res) => {
  const { nombre, telefono, cantidad_slot, descuento } = req.body;
  if (!nombre || !telefono || !cantidad_slot)
    return res.status(400).json({ error: 'nombre, telefono y cantidad_slot son requeridos' });

  const [result] = await pool.query(
    'INSERT INTO cliente_mayorista (nombre, telefono, cantidad_slot, descuento) VALUES (?,?,?,?)',
    [nombre, telefono, cantidad_slot, descuento ?? 0]
  );
  res.status(201).json({ id: result.insertId, nombre, telefono, cantidad_slot });
};

exports.updateMayorista = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, cantidad_slot, descuento } = req.body;
  await pool.query(
    'UPDATE cliente_mayorista SET nombre=?, telefono=?, cantidad_slot=?, descuento=? WHERE id=?',
    [nombre, telefono, cantidad_slot, descuento, id]
  );
  res.json({ message: 'Mayorista actualizado' });
};

exports.deleteMayorista = async (req, res) => {
  await pool.query('DELETE FROM cliente_mayorista WHERE id=?', [req.params.id]);
  res.json({ message: 'Mayorista eliminado' });
};

exports.registrarCompraMayorista = async (req, res) => {
  await pool.query(
    'UPDATE cliente_mayorista SET ultima_compra=CURDATE() WHERE id=?',
    [req.params.id]
  );
  res.json({ message: 'Compra registrada' });
};  
// ── Filtrar solo activos por defecto ──────────────────────────

exports.getNormales = async (req, res) => {
  const mostrarTodos = req.query.todos === 'true';
  const where = mostrarTodos ? '' : 'WHERE activo = TRUE';
  const [rows] = await pool.query(
    `SELECT * FROM v_clientes_normales ${where} ORDER BY nombre`
  );
  res.json(rows);
};

exports.getMayoristas = async (req, res) => {
  const mostrarTodos = req.query.todos === 'true';
  const where = mostrarTodos ? '' : 'WHERE activo = TRUE';
  const [rows] = await pool.query(
    `SELECT * FROM v_clientes_mayoristas ${where} ORDER BY nombre`
  );
  res.json(rows);
};

// ── Inhabilitar (en vez de borrar automático) ─────────────────

exports.inhabilitarNormal = async (req, res) => {
  await pool.query(
    'UPDATE cliente_normal SET activo = FALSE WHERE id = ?',
    [req.params.id]
  );
  res.json({ message: 'Cliente inhabilitado' });
};

exports.inhabilitarMayorista = async (req, res) => {
  await pool.query(
    'UPDATE cliente_mayorista SET activo = FALSE WHERE id = ?',
    [req.params.id]
  );
  res.json({ message: 'Mayorista inhabilitado' });
};

// ── Reactivar ─────────────────────────────────────────────────

exports.reactivarNormal = async (req, res) => {
  await pool.query(
    'UPDATE cliente_normal SET activo = TRUE, ultima_compra = CURDATE() WHERE id = ?',
    [req.params.id]
  );
  res.json({ message: 'Cliente reactivado' });
};

exports.reactivarMayorista = async (req, res) => {
  await pool.query(
    'UPDATE cliente_mayorista SET activo = TRUE, ultima_compra = CURDATE() WHERE id = ?',
    [req.params.id]
  );
  res.json({ message: 'Mayorista reactivado' });
};

// ── Borrado manual (opcional, solo cuando se quiera) ──────────

exports.deleteNormal = async (req, res) => {
  await pool.query('DELETE FROM cliente_normal WHERE id = ?', [req.params.id]);
  res.json({ message: 'Cliente eliminado permanentemente' });
};

exports.deleteMayorista = async (req, res) => {
  await pool.query('DELETE FROM cliente_mayorista WHERE id = ?', [req.params.id]);
  res.json({ message: 'Mayorista eliminado permanentemente' });
};