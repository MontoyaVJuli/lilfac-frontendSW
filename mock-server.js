const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;
const DB = path.join(__dirname, "db.json");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
function readDb() { return JSON.parse(fs.readFileSync(DB, "utf-8")); }
function writeDb(data) { fs.writeFileSync(DB, JSON.stringify(data, null, 2)); }
const otpStore = {};
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Usuario y contraseña requeridos" });
    const roles = {
        admin:    "ADMIN",
        caja:     "CAJA",
        bodega:   "BODEGA",
        logistica: "LOGISTICA",
    };
    const role = roles[username.toLowerCase()] || "ADMIN";
    res.json({ token: "mock-jwt-" + Date.now(), user: { id: 1, username, role } });
});
app.post("/api/otp/phone/send", (req, res) => {
  const { phone } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore["phone_" + phone] = code;
  console.log("\n📱 OTP SMS para " + phone + ": \x1b[33m" + code + "\x1b[0m\n");
  res.json({ message: "Código enviado" });
});
app.post("/api/otp/phone/verify", (req, res) => {
  const { phone, code } = req.body;
  const stored = otpStore["phone_" + phone];
  if (!stored) return res.status(400).json({ message: "Primero solicita el código" });
  if (stored !== code) return res.status(400).json({ message: "Código incorrecto" });
  delete otpStore["phone_" + phone];
  res.json({ message: "Teléfono verificado" });
});
app.post("/api/otp/email/send", (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore["email_" + email] = code;
  console.log("\n📧 OTP Email para " + email + ": \x1b[33m" + code + "\x1b[0m\n");
  res.json({ message: "Código enviado" });
});
app.post("/api/otp/email/verify", (req, res) => {
  const { email, code } = req.body;
  const stored = otpStore["email_" + email];
  if (!stored) return res.status(400).json({ message: "Primero solicita el código" });
  if (stored !== code) return res.status(400).json({ message: "Código incorrecto" });
  delete otpStore["email_" + email];
  res.json({ message: "Correo verificado" });
});
app.get("/api/employees", (req, res) => {
  const { page = 0, size = 10, search = "" } = req.query;
  let { employees } = readDb();
  if (search) {
    const q = search.toLowerCase();
    employees = employees.filter(e => e.fullName.toLowerCase().includes(q) || e.idNumber.includes(q));
  }
  const total = employees.length;
  const content = employees.slice(parseInt(page) * parseInt(size), (parseInt(page) + 1) * parseInt(size));
  res.json({ content, totalElements: total, totalPages: Math.ceil(total / size), page: parseInt(page) });
});
app.get("/api/employees/:id", (req, res) => {
  const { employees } = readDb();
  const emp = employees.find(e => e.id === parseInt(req.params.id));
  if (!emp) return res.status(404).json({ message: "No encontrado" });
  res.json(emp);
});
app.post("/api/employees", (req, res) => {
  const db = readDb();
  const newId = db.employees.length ? Math.max(...db.employees.map(e => e.id)) + 1 : 1;
  const employee = { id: newId, ...req.body };
  db.employees.push(employee);
  writeDb(db);
  res.status(201).json(employee);
});
app.put("/api/employees/:id", (req, res) => {
  const db = readDb();
  const idx = db.employees.findIndex(e => e.id === parseInt(req.params.id));
  if (idx < 0) return res.status(404).json({ message: "No encontrado" });
  db.employees[idx] = { ...db.employees[idx], ...req.body, id: parseInt(req.params.id) };
  writeDb(db);
  res.json(db.employees[idx]);
});
app.delete("/api/employees/:id", (req, res) => {
  const db = readDb();
  const idx = db.employees.findIndex(e => e.id === parseInt(req.params.id));
  if (idx < 0) return res.status(404).json({ message: "No encontrado" });
  db.employees.splice(idx, 1);
  writeDb(db);
  res.json({ message: "Eliminado" });
});
app.listen(PORT, () => {
  console.log("\x1b[32mMock server corriendo en http://localhost:" + PORT + "\x1b[0m");
  console.log("Los códigos OTP aparecerán aquí cuando los solicites\n");
});
