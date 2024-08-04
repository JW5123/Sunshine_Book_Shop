import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Jay56607358a",
    database: "nodejs_test"
});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.json("Hello World!");
});

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err)
            return res.json(err);
        else
            return res.json(data);
    })
});

app.post("/books", upload.single('cover'), (req, res) => {
    const coverUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const q = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        coverUrl
    ];

    db.query(q, [values], (err, data) => {
        if (err)
            return res.json(err);
        else
            return res.json("Book has been created successfully.");
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err)
            return res.json(err);
        else
            return res.json("Book has been deleted successfully.");
    });
});

app.put("/books/:id", upload.single('cover'), (req, res) => {
    const bookId = req.params.id;
    const coverUrl = req.file ? `/uploads/${req.file.filename}` : req.body.cover;

    const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        coverUrl
    ];

    db.query(q, [...values, bookId], (err, data) => {
        if (err)
            return res.json(err);
        else
            return res.json("Book has been updated successfully.");
    });
});

app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE id = ?";
    db.query(q, [bookId], (err, data) => {
        if (err) 
            return res.json(err);
        else 
            return res.json(data[0]);
    });
});

app.listen(8800, () => {
    console.log("connected to backend!");
});
