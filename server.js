import express from 'express';
import url from 'url';
import path from 'path';
import cors from 'cors';
import nodemailer from 'nodemailer';
import emailForm from './emailForm.js';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    'https://my-portfolio-8zro8pl4f-kakoi1s-projects.vercel.app', // Original frontend
    'https://my-portfolio-weld-three-57.vercel.app', // New frontend
    'http://localhost:3000', // Local dev
  ]
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

app.get('/api/download', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'pdf', 'resume.pdf');
    await fs.access(filePath);
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  } catch (error) {
    console.error('Error in /api/download:', error.message, error.stack);
    res.status(404).json({ error: 'File not found' });
  }
});

app.post('/api/send', async (req, res) => {
  const { userName, userEmail, to, subject, message, phone } = req.body;

  if (!userEmail || !to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: userEmail, to, subject, and message' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const from = userName
    ? `"${userName}" <${process.env.MAIL_USERNAME}>`
    : process.env.MAIL_USERNAME;

  const mailOptions = {
    from,
    to,
    subject,
    html: emailForm(userName, userEmail, phone, subject, message),
    replyTo: userEmail,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully', response: info.response });
  } catch (error) {
    console.error('Error sending email:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});