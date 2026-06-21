const pool = require('../config/db');

exports.getProductos = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM v_productos ORDER BY nombre');
  res.json(rows);
};

exports.getProducto = async (req, res) => {
  const [[row]] = await pool.query(
    'SELECT * FROM v_productos WHERE id=?', [req.params.id]
  );
  if (!row) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(row);
};

exports.createProducto = async (req, res) => {
  const { nombre, id_categoria, dimension_ideal, material_consumido, tiempo_produccion, precio, costo_material } = req.body;

  if (!nombre || !id_categoria || !dimension_ideal || !material_consumido || !tiempo_produccion || !precio || !costo_material)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });

  const [result] = await pool.query(
    `INSERT INTO producto
      (nombre, id_categoria, dimension_ideal, material_consumido, tiempo_produccion, precio, costo_material)
     VALUES (?,?,?,?,?,?,?)`,
    [nombre, id_categoria, dimension_ideal, material_consumido, tiempo_produccion, precio, costo_material]
  );
  res.status(201).json({ id: result.insertId, nombre });
};

exports.updateProducto = async (req, res) => {
  const { nombre, id_categoria, dimension_ideal, material_consumido, tiempo_produccion, precio, costo_material } = req.body;
  await pool.query(
    `UPDATE producto SET
      nombre=?, id_categoria=?, dimension_ideal=?,
      material_consumido=?, tiempo_produccion=?, precio=?, costo_material=?
     WHERE id=?`,
    [nombre, id_categoria, dimension_ideal, material_consumido, tiempo_produccion, precio, costo_material, req.params.id]
  );
  res.json({ message: 'Producto actualizado' });
};

exports.deleteProducto = async (req, res) => {
  // Verifica que no tenga pedidos asociados
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM pedido WHERE id_producto=?', [req.params.id]
  );
  if (total > 0)
    return res.status(400).json({ error: 'No se puede eliminar, tiene pedidos asociados' });

  await pool.query('DELETE FROM producto WHERE id=?', [req.params.id]);
  res.json({ message: 'Producto eliminado' });
};