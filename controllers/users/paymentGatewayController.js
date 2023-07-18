const xenditApiKey = require('../config/xendit');
const Xendit = require('xendit-node');
const xendit = new Xendit(xenditApiKey);

// Fungsi untuk membuat pembayaran dan mendapatkan URL pembayaran
async function createPayment(req, res) {
  const { amount, successUrl, failureUrl } = req.body;

  try {
    const createPaymentResponse = await xendit.Invoice.create({
      externalID: '88753', // ID unik untuk pembayaran
      amount,
      payerEmail: 'customer@example.com',
      description: 'Pembayaran Barang',
      successRedirectUrl: process.env.APP_URL+"payment/success",
      failureRedirectUrl: process.env.APP_URL+"payment/failure"
    });

    const paymentUrl = createPaymentResponse.invoice_url;
    
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat pembayaran' });
  }
}

async function handleSuccessPayment(req, res) {
  const { paymentId } = req.body;

  try {

    // Jika berhasil

    await Payment.update({ status: 'completed' }, { where: { id: paymentId } });

    res.status(200).json({ message: 'Pembayaran berhasil, tindakan berhasil dilakukan.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menangani pembayaran berhasil.' });
  }
}

// Fungsi untuk memeriksa status pembayaran
async function checkPaymentStatus(req, res) {
  const { paymentId } = req.params;

  try {
    const paymentStatus = await xendit.Invoice.retrieve(paymentId);

    if (paymentStatus.status === 'PAID') {
      // Pembayaran berhasil
      res.status(200).json({ status: 'success', message: 'Pembayaran berhasil.' });
    } else if (paymentStatus.status === 'EXPIRED' || paymentStatus.status === 'VOIDED') {
      // Pembayaran kadaluarsa atau dibatalkan
      res.status(200).json({ status: 'failed', message: 'Pembayaran kadaluarsa atau dibatalkan.' });
    } else {
      // Pembayaran masih dalam proses atau status lainnya
      res.status(200).json({ status: 'pending', message: 'Pembayaran masih dalam proses.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa status pembayaran.' });
  }
}

module.exports = {
  createPayment,
  handleSuccessPayment,
  checkPaymentStatus
};
