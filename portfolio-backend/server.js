const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "johnpauloibe.bsit@gmail.com",
        pass: "rgxhicpbkoryxccn"
    }
});

app.get("/", (req, res) => {
    res.send("Portfolio backend is running");
});

app.post("/contact", async (req, res) => {

    const { name, email, message } = req.body;

    const mailOptions = {
        from: "johnpauloibe.bsit@gmail.com",
        to: "johnpauloibe.bsit@gmail.com",
        subject: `New Contact From ${name}`,
        text: `
Name: ${name}
Email: ${email}

Message:
${message}
`
    };

    try {

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});