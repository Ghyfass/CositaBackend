require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());
app.use('/api/clientes',   require('./routes/clientes.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/productos',  require('./routes/productos.routes'));
app.use('/api/inventario', require('./routes/inventario.routes'));
app.use('/api/pedidos', require('./routes/pedidos.routes'));
app.use('/api/ventas',   require('./routes/ventas.routes'));
app.use('/api/finanzas', require('./routes/finanzas.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.listen(process.env.PORT || 3000, () =>
  console.log(`GestorCosita API corriendo en puerto ${process.env.PORT || 3000}`)
);