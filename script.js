// ========== Dark Mode ==========
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️";
}

darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    darkModeToggle.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
    localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
});

// ========== State ==========
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editId = null;
let currentFilter = "all";
let currentSort = "newest";
let currentModalId = null;

// ========== Elements ==========
const addNoteBtn = document.getElementById("addNoteBtn");
const noteFormContainer = document.getElementById("noteFormContainer");
const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteColor = document.getElementById("noteColor");
const noteTags = document.getElementById("noteTags");
const notePinned = document.getElementById("notePinned");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const charCount = document.getElementById("charCount");
const sortSelect = document.getElementById("sortSelect");
const filterButtons = document.querySelectorAll(".filter-btn");
const exportBtn = document.getElementById("exportBtn");

const noteModal = document.getElementById("noteModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalTags = document.getElementById("modalTags");
const modalContent = document.getElementById("modalContent");
const modalEditBtn = document.getElementById("modalEditBtn");
const modalDuplicateBtn = document.getElementById("modalDuplicateBtn");
const modalArchiveBtn = document.getElementById("modalArchiveBtn");
const modalDeleteBtn = document.getElementById("modalDeleteBtn");

// ========== Helpers ==========
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function parseTags(str) {
    if (!str) return [];
    return str.split(",")
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);
}

function updateCharCount() {
    const text = noteContent.value;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    charCount.textContent = `${text.length} karakter · ${words} kata`;
}

// ========== Render ==========
function getFilteredNotes() {
    let result = [...notes];

    if (currentFilter === "pinned") {
        result = result.filter(n => n.pinned && !n.archived);
    } else if (currentFilter === "archived") {
        result = result.filter(n => n.archived);
    } else {
        result = result.filter(n => !n.archived);
    }

    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword) {
        result = result.filter(n =>
            n.title.toLowerCase().includes(keyword) ||
            n.content.toLowerCase().includes(keyword) ||
            (n.tags && n.tags.some(tag => tag.includes(keyword)))
        );
    }

    if (currentSort === "newest") {
        result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (currentSort === "oldest") {
        result.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (currentSort === "title") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (currentFilter !== "archived") {
        result.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }

    return result;
}

function renderNotes() {
    const filtered = getFilteredNotes();
    notesList.innerHTML = "";

    if (filtered.length === 0) {
        emptyMessage.classList.remove("hidden");
        return;
    }

    emptyMessage.classList.add("hidden");

    filtered.forEach(note => {
        const card = document.createElement("div");
        card.className = `note-card ${note.color || "default"} ${note.pinned ? "pinned" : ""}`;
        card.dataset.id = note.id;

        const tagsHtml = (note.tags || []).map(t => `<span class="tag">#${t}</span>`).join("");

        card.innerHTML = `
            <div class="note-title">${escapeHtml(note.title)}</div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-tags">${tagsHtml}</div>
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

// ========== Form ==========
function openForm(note = null) {
    noteFormContainer.classList.remove("hidden");
    if (note) {
        editId = note.id;
        noteTitle.value = note.title;
        noteContent.value = note.content;
        noteColor.value = note.color || "default";
        noteTags.value = (note.tags || []).join(", ");
        notePinned.checked = note.pinned || false;
        saveBtn.textContent = "Update";
    } else {
        editId = null;
        noteForm.reset();
        noteColor.value = "default";
        saveBtn.textContent = "Simpan";
    }
    updateCharCount();
    noteTitle.focus();
}

function closeForm() {
    noteFormContainer.classList.add("hidden");
    editId = null;
    noteForm.reset();
}

// ========== Modal ==========
function openModal(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    currentModalId = id;
    modalTitle.textContent = note.title;
    modalMeta.textContent = `Dibuat: ${formatDate(note.createdAt)} · Diupdate: ${formatDate(note.updatedAt)}`;
    modalContent.textContent = note.content;

    modalTags.innerHTML = (note.tags || []).map(t => `<span class="tag">#${t}</span>`).join("") || "";
    modalArchiveBtn.textContent = note.archived ? "Kembalikan" : "Arsipkan";

    noteModal.classList.remove("hidden");
}

function closeModal() {
    noteModal.classList.add("hidden");
    currentModalId = null;
}

// ========== Events ==========
addNoteBtn.addEventListener("click", () => openForm());
cancelBtn.addEventListener("click", closeForm);
noteContent.addEventListener("input", updateCharCount);

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    if (!title || !content) return;

    const now = new Date().toISOString();
    const tags = parseTags(noteTags.value);

    if (editId) {
        const index = notes.findIndex(n => n.id === editId);
        if (index !== -1) {
            notes[index] = {
                ...notes[index],
                title, content, tags,
                color: noteColor.value,
                pinned: notePinned.checked,
                updatedAt: now
            };
        }
    } else {
        notes.unshift({
            id: generateId(),
            title, content, tags,
            color: noteColor.value,
            pinned: notePinned.checked,
            archived: false,
            createdAt: now,
            updatedAt: now
        });
    }

    saveNotes();
    renderNotes();
    closeForm();
});

notesList.addEventListener("click", (e) => {
    const id = e.target.dataset.id || e.target.closest(".note-card")?.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("edit-btn")) {
        openForm(notes.find(n => n.id === id));
        return;
    }

    if (e.target.classList.contains("delete-btn")) {
        if (confirm("Hapus catatan ini secara permanen?")) {
            notes = notes.filter(n => n.id !== id);
            saveNotes();
            renderNotes();
        }
        return;
    }

    openModal(id);
});

closeModalBtn.addEventListener("click", closeModal);
noteModal.addEventListener("click", (e) => {
    if (e.target === noteModal) closeModal();
});

modalEditBtn.addEventListener("click", () => {
    const note = notes.find(n => n.id === currentModalId);
    closeModal();
    openForm(note);
});

modalDuplicateBtn.addEventListener("click", () => {
    const original = notes.find(n => n.id === currentModalId);
    if (!original) return;

    const now = new Date().toISOString();
    notes.unshift({
        ...original,
        id: generateId(),
        title: original.title + " (Salinan)",
        pinned: false,
        archived: false,
        createdAt: now,
        updatedAt: now
    });

    saveNotes();
    renderNotes();
    closeModal();
});

modalArchiveBtn.addEventListener("click", () => {
    const note = notes.find(n => n.id === currentModalId);
    if (note) {
        note.archived = !note.archived;
        note.updatedAt = new Date().toISOString();
        saveNotes();
        renderNotes();
        closeModal();
    }
});

modalDeleteBtn.addEventListener("click", () => {
    if (confirm("Hapus catatan ini secara permanen?")) {
        notes = notes.filter(n => n.id !== currentModalId);
        saveNotes();
        renderNotes();
        closeModal();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderNotes();
    });
});

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    renderNotes();
});

searchInput.addEventListener("input", renderNotes);

exportBtn.addEventListener("click", () => {
    if (notes.length === 0) return alert("Tidak ada catatan");
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        openForm();
    }
    if (e.key === "Escape") {
        closeForm();
        closeModal();
    }
});

// Init
renderNotes();