import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.static(path.join(__dirname, "frontend", "vistas")));

// Mock data storage
let pets = [
  { id: 1, nombre: "Max", especie: "Perro", foto: "", adoptable: true },
  { id: 2, nombre: "Luna", especie: "Gato", foto: "", adoptable: false },
  { id: 3, nombre: "Birdie", especie: "Pajaro", foto: "", adoptable: true },
];

let products = [
  { id: 1, nombre: "Comida para perros", precio: 25.99, stock: 50 },
  { id: 2, nombre: "Juguete para gatos", precio: 12.5, stock: 30 },
  { id: 3, nombre: "Collar para perro", precio: 15.0, stock: 20 },
];

let appointments = [];
let coupons = [];
let users = {};
let cart = {};

let petIdCounter = 4;
let appointmentIdCounter = 1;

// ============ AUTH ROUTES ============
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  // Mock login - accept any email/password combination
  res.json({
    ok: true,
    data: {
      id: 1,
      email,
      name: "Test User",
      role: "user",
    },
  });
});

app.post("/api/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields required" });
  }
  users[email] = { email, password, name };
  res.json({
    ok: true,
    data: { id: 1, email, name },
  });
});

app.post("/api/logout", (req, res) => {
  res.json({ ok: true, data: { message: "Logged out" } });
});

app.get("/api/session", (req, res) => {
  res.json({
    ok: true,
    data: {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      isAuthenticated: true,
    },
  });
});

app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }
  res.json({
    ok: true,
    data: { message: "Password reset link sent to email" },
  });
});

app.post("/api/reset-password", (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password required" });
  }
  res.json({
    ok: true,
    data: { message: "Password reset successfully" },
  });
});

// ============ PRODUCTS ROUTES ============
app.get("/api/products", (req, res) => {
  res.json({ ok: true, data: products });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ ok: true, data: product });
});

// ============ CART ROUTES ============
app.get("/api/cart", (req, res) => {
  const userId = req.headers["user-id"] || "default";
  res.json({ ok: true, data: cart[userId] || [] });
});

app.post("/api/cart", (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.headers["user-id"] || "default";

  if (!cart[userId]) {
    cart[userId] = [];
  }

  const existingItem = cart[userId].find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart[userId].push({ productId, quantity: quantity || 1 });
  }

  res.json({ ok: true, data: cart[userId] });
});

app.put("/api/cart/:productId", (req, res) => {
  const { quantity } = req.body;
  const userId = req.headers["user-id"] || "default";
  const productId = parseInt(req.params.productId);

  if (!cart[userId]) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const item = cart[userId].find((i) => i.productId === productId);
  if (!item) {
    return res.status(404).json({ error: "Item not in cart" });
  }

  item.quantity = quantity;
  res.json({ ok: true, data: cart[userId] });
});

app.delete("/api/cart/:productId", (req, res) => {
  const userId = req.headers["user-id"] || "default";
  const productId = parseInt(req.params.productId);

  if (!cart[userId]) {
    return res.status(404).json({ error: "Cart not found" });
  }

  cart[userId] = cart[userId].filter((i) => i.productId !== productId);
  res.json({ ok: true, data: cart[userId] });
});

app.delete("/api/cart", (req, res) => {
  const userId = req.headers["user-id"] || "default";
  cart[userId] = [];
  res.json({ ok: true, data: [] });
});

// ============ COUPONS ROUTES ============
app.get("/api/coupons", (req, res) => {
  res.json({ ok: true, data: coupons });
});

app.post("/api/coupons/validate", (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code required" });
  }

  const coupon = coupons.find((c) => c.code === code);
  if (!coupon) {
    return res.status(404).json({ error: "Coupon not found" });
  }

  res.json({
    ok: true,
    data: { code, discount: coupon.discount, valid: true },
  });
});

app.post("/api/coupons", (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code required" });
  }

  const newCoupon = { code, discount: 10, createdAt: new Date() };
  coupons.push(newCoupon);
  res.json({ ok: true, data: newCoupon });
});

app.delete("/api/coupons/:code", (req, res) => {
  const code = decodeURIComponent(req.params.code);
  coupons = coupons.filter((c) => c.code !== code);
  res.json({ ok: true, data: { message: "Coupon deleted" } });
});

// ============ PETS/ADOPTIONS ROUTES ============
app.get("/api/pets", (req, res) => {
  res.json({ ok: true, data: pets });
});

app.get("/api/pets/:id", (req, res) => {
  const pet = pets.find((p) => p.id === parseInt(req.params.id));
  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }
  res.json({ ok: true, data: pet });
});

app.post("/api/pets", (req, res) => {
  const { nombre, especie, foto, adoptable } = req.body;

  if (!nombre || !especie) {
    return res.status(400).json({ error: "Nombre and especie required" });
  }

  const newPet = {
    id: petIdCounter++,
    nombre,
    especie,
    foto: foto || "",
    adoptable: adoptable || false,
  };

  pets.push(newPet);
  res.json({ ok: true, data: newPet });
});

app.put("/api/pets/:id", (req, res) => {
  const pet = pets.find((p) => p.id === parseInt(req.params.id));
  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }

  Object.assign(pet, req.body);
  res.json({ ok: true, data: pet });
});

app.delete("/api/pets/:id", (req, res) => {
  const index = pets.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Pet not found" });
  }

  const deletedPet = pets.splice(index, 1);
  res.json({ ok: true, data: deletedPet });
});

// ============ APPOINTMENTS ROUTES ============
app.get("/api/appointments", (req, res) => {
  res.json({ ok: true, data: appointments });
});

app.post("/api/appointments", (req, res) => {
  const { petId, motivo } = req.body;

  if (!petId || !motivo) {
    return res.status(400).json({ error: "PetId and motivo required" });
  }

  const pet = pets.find((p) => p.id === petId);
  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }

  const newAppointment = {
    id: appointmentIdCounter++,
    petId,
    petName: pet.nombre,
    motivo,
    date: new Date().toISOString(),
  };

  appointments.push(newAppointment);
  res.json({ ok: true, data: newAppointment });
});

// ============ FORMS ROUTES ============
app.post("/api/formulario", (req, res) => {
  const formData = req.body;

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({ error: "Form data required" });
  }

  const newForm = {
    id: Date.now(),
    ...formData,
    submittedAt: new Date().toISOString(),
  };

  // In a real app, you'd save this to a database
  console.log("Form submitted:", newForm);

  res.json({ ok: true, data: newForm });
});

// ============ STATIC PAGES ============
// Serve main index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "vistas", "index.html"));
});

app.get("/adopciones", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend", "vistas", "adopciones", "adopciones.html")
  );
});

app.get("/tienda", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "vistas", "tienda", "tienda.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend", "vistas", "login", "login.html")
  );
});

app.get("/register", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend", "vistas", "register", "register.html")
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  console.log(`📁 Serving frontend from: ${path.join(__dirname, "frontend")}`);
  console.log(`\n📝 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/adopciones`);
  console.log(`   GET  http://localhost:${PORT}/tienda`);
  console.log(`   GET  http://localhost:${PORT}/login`);
  console.log(`   GET  http://localhost:${PORT}/register`);
  console.log(`\n🔌 API endpoints available at http://localhost:${PORT}/api/*`);
});
