import express from 'express';
import url  from 'url';
import path from 'path';
import cors from 'cors';
import nodemailer from 'nodemailer';
import emailForm from './emailForm.js'
import fs  from 'fs/promises';
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});
app.get('/api/download', async (req, res) => {
    try {
        // Path to the PDF file in the backend project folder
        const filePath = path.join(__dirname, 'pdf', 'resume.pdf');

        // Check if file exists
        await fs.access(filePath);

        // Set headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename="sample.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Failed to download file' });
            }
        });
    } catch (error) {
        console.error('Error in /api/download:', error);
        res.status(404).json({ error: 'File not found' });
    }
});

app.post('/api/send', async (req, res) => {
  const { userName, userEmail, to, subject, message, phone} = req.body;

  if (!userEmail || !to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: userEmail, to, subject, and message' });
  }
  const from = userName
    ? `"${userName}" <${process.env.MAIL_USERNAME}>`
    : process.env.MAIL_USERNAME;

  const mailOptions = {
    from,
    to,
    subject,
    html: emailForm(userName, userEmail, phone, subject, message),
    replyTo: userEmail 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully', response: info.response });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});