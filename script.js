// ========== Dark Mode ==========
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️";
}

darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "☀️";
        localStorage.setItem("darkMode", "enabled");
    } else {
        darkModeToggle.textContent = "🌙";
        localStorage.setItem("darkMode", "disabled");
    }
});

// ========== Notes App ==========
const addNoteBtn = document.getElementById("addNoteBtn");
const noteFormContainer = document.getElementById("noteFormContainer");
const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteColor = document.getElementById("noteColor");
const notePinned = document.getElementById("notePinned");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editId = null;

// Generate ID unik
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderNotes(filter = "") {
    let filtered = notes;

    if (filter) {
        const keyword = filter.toLowerCase();
        filtered = notes.filter(n =>
            n.title.toLowerCase().includes(keyword) ||
            n.content.toLowerCase().includes(keyword)
        );
    }

    // Pin di atas
    filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    notesList.innerHTML = "";

    if (filtered.length === 0) {
        emptyMessage.classList.remove("hidden");
        return;
    }

    emptyMessage.classList.add("hidden");

    filtered.forEach(note => {
        const card = document.createElement("div");
        card.className = `note-card ${note.color} ${note.pinned ? "pinned" : ""}`;
        
        card.innerHTML = `
            <div class="note-title">${escapeHtml(note.title)}</div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-footer">
                <span>${formatDate(note.updatedAt)}</span>
                <div class="note-actions">
                    <button class="edit-btn" data-id="${note.id}" title="Edit">✎</button>
                    <button class="delete-btn" data-id="${note.id}" title="Hapus">×</button>
                </div>
            </div>
        `;
        notesList.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function openForm(note = null) {
    noteFormContainer.classList.remove("hidden");
    
    if (note) {
        editId = note.id;
        noteTitle.value = note.title;
        noteContent.value = note.content;
        noteColor.value = note.color;
        notePinned.checked = note.pinned;
        saveBtn.textContent = "Update";
    } else {
        editId = null;
        noteForm.reset();
        noteColor.value = "default";
        saveBtn.textContent = "Simpan";
    }
    
    noteTitle.focus();
}

function closeForm() {
    noteFormContainer.classList.add("hidden");
    editId = null;
    noteForm.reset();
}

// Event: Tambah catatan
addNoteBtn.addEventListener("click", () => openForm());

// Event: Batal
cancelBtn.addEventListener("click", closeForm);

// Event: Simpan / Update
noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const color = noteColor.value;
    const pinned = notePinned.checked;

    if (!title || !content) return;

    const now = new Date().toISOString();

    if (editId) {
        // Update
        const index = notes.findIndex(n => n.id === editId);
        if (index !== -1) {
            notes[index] = {
                ...notes[index],
                title,
                content,
                color,
                pinned,
                updatedAt: now
            };
        }
    } else {
        // Tambah baru
        notes.unshift({
            id: generateId(),
            title,
            content,
            color,
            pinned,
            createdAt: now,
            updatedAt: now
        });
    }

    saveNotes();
    renderNotes(searchInput.value);
    closeForm();
});

// Event: Edit & Hapus
notesList.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("edit-btn")) {
        const note = notes.find(n => n.id === id);
        if (note) openForm(note);
    }

    if (e.target.classList.contains("delete-btn")) {
        if (confirm("Hapus catatan ini?")) {
            notes = notes.filter(n => n.id !== id);
            saveNotes();
            renderNotes(searchInput.value);
        }
    }
});

// Event: Search
searchInput.addEventListener("input", () => {
    renderNotes(searchInput.value);
});

// Render awal
renderNotes();