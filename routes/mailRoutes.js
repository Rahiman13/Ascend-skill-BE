const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/send-mail', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Configure your transporter (use your own email service credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ascendskillsedutech@gmail.com',
      pass: 'jrue ejsm lykl xniq'
    }
  });

  const mailOptions = {
    from: email,
    to: 'ascendskillsedutech@gmail.com', // Your destination email
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});


module.exports = router;