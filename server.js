const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// Upload route
app.post("/upload", upload.single("photo"), (req, res) => {
    res.send("Image uploaded successfully!");
});

// Gallery route
app.get("/gallery", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).send("Error reading uploads");
        let html = "<h2>Uploaded Photos</h2>";
        files.forEach(f => {
            html += `<div><img src="/uploads/${f}" style="max-width:200px;margin:10px;"></div>`;
        });
        res.send(html);
    });
});

// Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
