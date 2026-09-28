# Belajar Frontend Development.

# Notes App

Aplikasi catatan modern dan lengkap yang dibuat menggunakan **HTML, CSS, dan JavaScript** murni. Cocok untuk menyimpan ide, to-do singkat, atau catatan harian.

Project ini dilengkapi dengan banyak fitur seperti pin, arsip, tags, pencarian, sorting, dan export data.

---

## Fitur Lengkap

### Manajemen Catatan
- Tambah, edit, dan hapus catatan
- **Pin** catatan penting agar selalu di atas
- **Arsip** catatan (bisa dikembalikan kapan saja)
- **Duplikat** catatan
- Pilih **warna** kartu (Kuning, Biru, Hijau, Pink, Ungu)
- **Tags** (pisahkan dengan koma)

### Organisasi
- Filter: Semua / Di-pin / Arsip
- Urutkan: Terbaru / Terlama / Judul A-Z
- **Pencarian** real-time (judul, isi, maupun tag)
- Modal detail saat catatan diklik

### Lainnya
- Hitung karakter & kata secara langsung
- **Export** semua catatan ke file JSON
- Dark Mode
- Keyboard shortcut:
  - `Ctrl + N` → Buat catatan baru
  - `Esc` → Tutup form / modal
- Fully **Responsive** (HP, Tablet, Desktop)
- Data tersimpan di localStorage

---

## Tech Stack

- HTML5
- CSS3 (CSS Variables + Dark Mode + Media Queries)
- JavaScript (Vanilla)
- localStorage

---

## Cara Menjalankan

1. Clone repository ini:
   ```bash
   git clone https://github.com/SulthanAfif/notes-app.git

# Cara Menggunakan

1. Klik tombol + Baru atau tekan Ctrl + N
2. Isi judul, isi catatan, pilih warna, dan tambahkan tags (opsional)
3. Centang Pin jika ingin catatan tetap di atas
4. Klik Simpan
5. Klik kartu catatan untuk melihat detail lengkap
6. Gunakan filter, sort, dan search untuk mengelola catatan
7. Klik ikon 📥 untuk export data

## Struktur File
```
notes-app/
├── index.html      # Struktur halaman
├── style.css       # Tampilan, dark mode & responsive
├── script.js       # Logika aplikasi
└── README.md       # Dokumentasi
```

# Pengembangan Selanjutnya (Ide)

- Markdown support / preview
- Folder / kategori bertingkat
- Password protection untuk catatan tertentu
- Import dari file JSON
- Mode list view (selain grid)