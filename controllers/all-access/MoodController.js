const models = require('../../models');
const Mood = models.Mood

module.exports = {
    async create(req, res) {
      const { mood } = req.body;
  
      // Cek apakah mood yang dimasukkan adalah salah satu dari empat pilihan
      if (!['happy', 'normal', 'sad', 'angry'].includes(mood)) {
        return res.status(400).json({ error: 'Mood tidak valid' });
      }
  
      // Simpan mood ke database
      await Mood.create({ mood });
  
      res.status(201).send();
    },
  
    async index(req, res) {
      // Ambil daftar mood dari database dan urutkan berdasarkan waktu dibuat (dari yang terbaru ke yang terlama)
      const moods = await Mood.findAll({ order: [['createdAt', 'DESC']] });
  
      res.status(200).json(moods);
    }
  };
