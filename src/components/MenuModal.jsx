import React, { useRef } from "react";

function MenuModal({
  isOpen,
  onClose,
  onSubmit,
  editingMenu,
  menuForm,
  setMenuForm,
  imagePreview,
  onImageFileChange,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl">
          ✕
        </button>
        <h2 className="text-xl font-black text-gray-900 mb-4">
          {editingMenu ? "📝 Edit Menu Kuliner" : "✨ Tambah Menu Kuliner Baru"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Nama Menu
            </label>
            <input
              type="text"
              required
              value={menuForm.name}
              onChange={(e) =>
                setMenuForm({ ...menuForm, name: e.target.value })
              }
              placeholder="Contoh: Sambal Cumi Premium"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Kategori
            </label>
            <select
              value={menuForm.category}
              onChange={(e) =>
                setMenuForm({ ...menuForm, category: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none">
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Cemilan">Cemilan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Harga (IDR)
            </label>
            <input
              type="number"
              required
              value={menuForm.price}
              onChange={(e) =>
                setMenuForm({ ...menuForm, price: e.target.value })
              }
              placeholder="Contoh: 25000"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Gambar Menu
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={
                  menuForm.imageFile
                    ? menuForm.imageFile.name
                    : menuForm.image
                      ? "Gambar saat ini tersimpan"
                      : ""
                }
                placeholder="Belum ada gambar dipilih"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm cursor-pointer focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all">
                Pilih File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={onImageFileChange}
                className="hidden"
              />
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview gambar menu"
                className="mt-3 w-24 h-24 object-cover rounded-xl border border-gray-200"
              />
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Deskripsi Menu
            </label>
            <textarea
              rows="3"
              value={menuForm.description}
              onChange={(e) =>
                setMenuForm({ ...menuForm, description: e.target.value })
              }
              placeholder="Tulis rincian komposisi produk makanan..."
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm mt-2">
            {editingMenu ? "Simpan Perubahan" : "Masukkan ke Daftar Menu"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MenuModal;
