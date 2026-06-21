const pool = require('../config/db');

exports.getStats = async (req, res) => {
  const mes  = new Date().getMonth() + 1;
  const anio = new Date().getFullYear();

  const [[pedidos]] = await pool.query(
    `SELECT COUNT(*) as total FROM pedido
     WHERE estado IN ('pendiente', 'en_produccion')`
  );

  const [[clientes]] = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM cliente_normal WHERE activo = TRUE) +
      (SELECT COUNT(*) FROM cliente_mayorista WHERE activo = TRUE) as total`
  );

  const [[ingresos]] = await pool.query(
    `SELECT COALESCE(SUM(total), 0) as total FROM pedido
     WHERE estado = 'entregado'
       AND MONTH(fecha_pedido) = ? AND YEAR(fecha_pedido) = ?`,
    [mes, anio]
  );

  const [[material]] = await pool.query(
    `SELECT COALESCE(SUM(pr.material_consumido * p.cantidad_slot), 0) as total
     FROM pedido p
     JOIN producto pr ON pr.id = p.id_producto
     WHERE p.estado = 'entregado'
       AND MONTH(p.fecha_pedido) = ? AND YEAR(p.fecha_pedido) = ?`,
    [mes, anio]
  );

  const [topProductos] = await pool.query(
    `SELECT pr.nombre, SUM(p.cantidad_slot) as total_vendido
     FROM pedido p
     JOIN producto pr ON pr.id = p.id_producto
     WHERE p.estado = 'entregado'
       AND MONTH(p.fecha_pedido) = ? AND YEAR(p.fecha_pedido) = ?
     GROUP BY pr.id ORDER BY total_vendido DESC LIMIT 5`,
    [mes, anio]
  );

  const [stockBajo] = await pool.query(
    `SELECT nombre, stock FROM v_productos WHERE stock < 5 ORDER BY stock ASC LIMIT 5`
  );

  res.json({
    pedidos_activos:      pedidos.total,
    clientes_activos:     clientes.total,
    ingresos_mes:         Number(ingresos.total),
    material_consumido_g: Number(material.total),
    top_productos:        topProductos,
    stock_bajo:           stockBajo
  });
};