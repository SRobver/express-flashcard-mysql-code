const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Replace with your MySQL root password
    database: 'flashcards'     // Make sure this matches the name of the database you created
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// API Routes
app.get('/flashcards', (req, res) => {
    db.query('SELECT * FROM flashcards', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching flashcards');
        } else {
            res.json(results);
        }
    });
});

app.post('/flashcards', (req, res) => {
    const { question, answer } = req.body;
    db.query('INSERT INTO flashcards (question, answer) VALUES (?, ?)', [question, answer], (err, results) => {
        if (err) {
            res.status(500).send('Error adding flashcard');
        } else {
            res.json({ id: results.insertId, question, answer });
        }
    });
});

app.put('/flashcards/:id', (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    db.query('UPDATE flashcards SET question = ?, answer = ? WHERE id = ?', [question, answer, id], (err, results) => {
        if (err) throw err;
        res.json({ id, question, answer });
    });
});

app.delete('/flashcards/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM flashcards WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Flashcard deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
