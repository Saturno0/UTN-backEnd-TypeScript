import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "shopdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection successful!");
    connection.release();
    return true;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    return false;
  }
};

// Middleware to check database connection
const checkDBConnection = async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    await pool.getConnection();
    next();
  } catch (err) {
    res.status(503).json({ error: "Database connection failed" });
  }
};

// Health check endpoint
app.get("/health", async (_req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbConnected ? "connected" : "disconnected"
  });
});

// Products endpoints
app.get("/products", checkDBConnection, async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name,
             GROUP_CONCAT(DISTINCT pc.nombre) as colors,
             GROUP_CONCAT(DISTINCT ps.size) as sizes
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_colors pc ON p.id = pc.product_id
      LEFT JOIN product_sizes ps ON p.id = ps.product_id
      GROUP BY p.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

app.get("/products/:id", checkDBConnection, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product details
    const [products] = await pool.query("SELECT * FROM products WHERE id = ?", [id]) as [any[], any];
    
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    const product = products[0];
    
    // Get product colors
    const [colors] = await pool.query("SELECT * FROM product_colors WHERE product_id = ?", [id]) as [any[], any];
    
    // Get product specifications
    const [specs] = await pool.query("SELECT * FROM product_specs WHERE product_id = ?", [id]) as [any[], any];
    
    // Get product sizes
    const [sizes] = await pool.query("SELECT * FROM product_sizes WHERE product_id = ?", [id]) as [any[], any];
    
    // Get product reviews
    const [reviews] = await pool.query(`
      SELECT r.*, u.username 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ?
    `, [id]) as [any[], any];
    
    const productDetail = {
      ...product,
      colores: colors,
      especificaciones: specs[0] || {},
      tamaños: sizes.map((s: any) => s.size),
      reviews: reviews
    };
    
    res.json(productDetail);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

app.post("/products", checkDBConnection, async (req, res) => {
  const { name, image, category_id, description, precio_actual, precio_original } = req.body;
  
  // Validation
  if (!name || !precio_actual || !precio_original) {
    return res.status(400).json({ error: "Nombre y precios son requeridos" });
  }
  
  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, image, category_id, description, precio_actual, precio_original) VALUES (?, ?, ?, ?, ?, ?)",
      [name, image, category_id, description, precio_actual, precio_original]
    );
    
    const insertResult = result as mysql.ResultSetHeader;
    res.status(201).json({ 
      id: insertResult.insertId, 
      message: "Producto creado exitosamente" 
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// Categories endpoints
app.get("/categories", checkDBConnection, async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// Users endpoints
app.post("/users/register", checkDBConnection, async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email y password son requeridos" });
  }
  
  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    ) as [any[], any];

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(409).json({ error: "Usuario o email ya existe" });
    }
    
    // In production, hash the password here
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
      [username, email, password, first_name, last_name]
    );
    
    const insertResult = result as mysql.ResultSetHeader;
    res.status(201).json({ 
      id: insertResult.insertId, 
      message: "Usuario registrado exitosamente" 
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Orders endpoints
app.post("/orders", checkDBConnection, async (req, res) => {
  const { user_id, items, total_amount, payment_method, shipping_address, shipping_city, shipping_postal_code } = req.body;
  
  if (!items || !total_amount) {
    return res.status(400).json({ error: "Items y total son requeridos" });
  }
  
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create order
      const [orderResult] = await connection.query(
        "INSERT INTO orders (user_id, total_amount, payment_method, shipping_address, shipping_city, shipping_postal_code) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, total_amount, payment_method, shipping_address, shipping_city, shipping_postal_code]
      );
      
      const orderId = (orderResult as mysql.ResultSetHeader).insertId;
      
      // Create order items
      for (const item of items) {
        await connection.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price, color, size) VALUES (?, ?, ?, ?, ?, ?)",
          [orderId, item.product_id, item.quantity, item.price, item.color, item.size]
        );
      }
      
      await connection.commit();
      connection.release();
      
      res.status(201).json({ 
        order_id: orderId, 
        message: "Orden creada exitosamente" 
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Error al crear orden" });
  }
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  
  // Test database connection on startup
  await testConnection();
});
