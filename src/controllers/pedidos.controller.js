const pool = require('../config/db');

exports.getPedidos = async (req, res) => {
  const { estado } = req.query;
  let query = 'SELECT * FROM v_pedidos';
  const params = [];
  if (estado) {
    query += ' WHERE estado = ?';
    params.push(estado);
  }
  query += ' ORDER BY fecha_pedido DESC';
  const [rows] = await pool.query(query, params);
  res.json(rows);
};

exports.getPedido = async (req, res) => {
  const [[row]] = await pool.query(
    'SELECT * FROM v_pedidos WHERE id=?', [req.params.id]
  );
  if (!row) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json(row);
};

exports.createPedido = async (req, res) => {
  const { id_cliente, tipo_cliente, id_producto, cantidad_slot, fecha_entrega, notas } = req.body;

  if (!id_cliente || !tipo_cliente || !id_producto || !cantidad_slot)
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  // Consultar stock disponible para informar (no bloquear)
  const [[inv]] = await pool.query(
    'SELECT cantidad FROM inventario WHERE id_producto=?', [id_producto]
  );
  const stockDisponible = inv?.cantidad ?? 0;

  const [result] = await pool.query(
    `INSERT INTO pedido
      (id_cliente, tipo_cliente, id_producto, cantidad_slot, fecha_entrega, notas)
     VALUES (?,?,?,?,?,?)`,
    [id_cliente, tipo_cliente, id_producto, cantidad_slot,
     fecha_entrega || null, notas || null]
  );

  res.status(201).json({
    id: result.insertId,
    aviso: stockDisponible < cantidad_slot
      ? `Stock insuficiente (disponible: ${stockDisponible}). El pedido se creó igual.`
      : null
  });
};

exports.updateEstado = async (req, res) => {
  const { estado, fecha_entrega } = req.body;
  const { id } = req.params;

  const estadosValidos = ['pendiente', 'en_produccion', 'entregado', 'cancelado'];
  if (!estadosValidos.includes(estado))
    return res.status(400).json({ error: 'Estado inválido' });

  await pool.query(
    'UPDATE pedido SET estado=?, fecha_entrega=COALESCE(?, fecha_entrega) WHERE id=?',
    [estado, fecha_entrega || null, id]
  );
  res.json({ message: 'Estado actualizado' });
};

exports.updatePedido = async (req, res) => {
  const { id_cliente, tipo_cliente, id_producto, cantidad_slot, fecha_entrega, notas } = req.body;
  await pool.query(
    `UPDATE pedido SET
      id_cliente=?, tipo_cliente=?, id_producto=?,
      cantidad_slot=?, fecha_entrega=?, notas=?
     WHERE id=? AND estado = 'pendiente'`,
    [id_cliente, tipo_cliente, id_producto, cantidad_slot,
     fecha_entrega || null, notas || null, req.params.id]
  );
  res.json({ message: 'Pedido actualizado' });
};

exports.deletePedido = async (req, res) => {
  const [[pedido]] = await pool.query(
    'SELECT estado FROM pedido WHERE id=?', [req.params.id]
  );
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  if (pedido.estado === 'entregado')
    return res.status(400).json({ error: 'No se puede eliminar un pedido entregado' });

  await pool.query('DELETE FROM pedido WHERE id=?', [req.params.id]);
  res.json({ message: 'Pedido eliminado' });
};