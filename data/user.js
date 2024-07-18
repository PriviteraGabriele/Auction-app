const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "users.json");

let users = [];

// Carica i dati salvati se esiste il file users.json, altrimenti inizializza users come array vuoto
try {
    const data = fs.readFileSync(filePath, "utf8");
    if (data.trim().length > 0) {
        users = JSON.parse(data);
    }
} catch (err) {
    // Se il file non esiste, crea un nuovo file users.json con un array vuoto
    if (err.code === "ENOENT") {
        fs.writeFileSync(filePath, "[]", "utf8");
    } else {
        console.error(
            "Errore durante il caricamento dei dati degli utenti:",
            err.message
        );
    }
}

const saveUsers = () => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");
};

const addUser = (email, password) => {
    // Controlla se l'utente esiste già per email
    if (findUserByEmail(email)) {
        return false; // Utente già presente
    }

    // Aggiungi nuovo utente
    users.push({ email, password });
    saveUsers();
    return true; // Utente aggiunto con successo
};

const findUserByEmail = (email) => {
    return users.find((user) => user.email === email);
};

module.exports = { users, addUser, findUserByEmail };
