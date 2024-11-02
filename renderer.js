window.addEventListener('DOMContentLoaded', async () => {
    const notesList = document.getElementById('notes-list');
    const noteText = document.getElementById('note-text');
    const saveButton = document.getElementById('save-button');
    let selectedIndex = null;
    let selectedListItem = null;
  
    const loadNotes = async () => {
      const notes = await window.electronAPI.loadNotes();
      notesList.innerHTML = '';
  
      notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note;
  
        li.addEventListener('click', () => {
          noteText.value = note;
          selectedIndex = index;
  
          if (selectedListItem) {
            selectedListItem.classList.remove('selected');
          }
          li.classList.add('selected');
          selectedListItem = li;
        });
  
        notesList.appendChild(li);
      });
    };
  
    saveButton.addEventListener('click', async () => {
      const note = noteText.value.trim();
  
      if (note) {
        const notes = await window.electronAPI.saveNote(note, selectedIndex);
  
        await loadNotes();
  
        if (selectedIndex !== null) {
          noteText.value = note;
          const listItems = notesList.getElementsByTagName('li');
          if (selectedIndex < listItems.length) {
            selectedListItem = listItems[selectedIndex];
            selectedListItem.classList.add('selected');
          }
        } else {
          noteText.value = ''; 
        }
        
        selectedIndex = null;
      }
    });
  
    loadNotes();
  });
  