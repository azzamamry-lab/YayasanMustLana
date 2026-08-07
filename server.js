const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tentang', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tentang.html'));
});

app.get('/program', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'program.html'));
});

app.get('/kontak', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kontak.html'));
});

app.get('/donasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'donasi.html'));
});

// API kontak
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('📩 Pesan dari:', name, '(', email, ')');
  console.log('Pesan:', message);
  res.json({ success: true, message: 'Terima kasih, pesan Anda telah terkirim.' });
});

// API donasi
app.post('/api/donasi', (req, res) => {
  const { name, email, phone, program, amount, method, message } = req.body;
  const nominal = Number(amount);

  if (
    !name || !email || !program || !method ||
    !Number.isFinite(nominal) || nominal < 10000
  ) {
    return res.status(400).json({ success: false, message: 'Mohon lengkapi data donasi (minimal Rp 10.000).' });
  }

  const id =
    'DON-' + Date.now().toString(36).toUpperCase().slice(-6) +
    Math.random().toString(36).slice(2, 5).toUpperCase();

  console.log('🤲 Donasi baru:', id);
  console.log('   Donatur :', name, '|', email, '|', phone || '-');
  console.log('   Program :', program, '|', method, '| Rp', nominal.toLocaleString('id-ID'));

  res.json({ success: true, id, message: 'Donasi diterima. Silakan selesaikan pembayaran.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
