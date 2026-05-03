const pool = require('../config/db');

const getNotes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC', [req.user.user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = await pool.query(
      'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, req.user.user_id] 
    );
    res.json(newNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.user_id]);
    
    if (deleteOp.rows.length === 0) {
      return res.status(403).json({ error: 'Catatan tidak ditemukan atau Anda tidak berhak menghapusnya' });
    }
    res.json({ message: 'Catatan berhasil dihapus!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const updatedNote = await pool.query(
      'UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, content, id, req.user.user_id]
    );

    if (updatedNote.rows.length === 0) {
      return res.status(403).json({ error: 'Catatan tidak ditemukan atau Anda tidak berhak mengeditnya' });
    }
    
    res.json(updatedNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { getNotes, createNote, deleteNote, updateNote };