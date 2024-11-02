const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

const notesFilePath = path.join(__dirname, 'notes.json');


function saveNotes(notes) {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
}

function loadNotes() {
  if (fs.existsSync(notesFilePath)) {
    return JSON.parse(fs.readFileSync(notesFilePath));
  }
  return [];
}


ipcMain.handle('load-notes', () => loadNotes());
ipcMain.handle('save-note', (event, note, index) => {
  const notes = loadNotes();

  if (index !== null && index >= 0 && index < notes.length) {
    notes[index] = note; 
  } else {
    notes.push(note); 
  }

  saveNotes(notes);
  return notes; 
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
