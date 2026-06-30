import React, { useState, useEffect } from "react";

function ProductDetailModal({ isOpen, onClose, item, onAddToCart, onOrderNow }) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (isOpen) setQty(1);
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(item.price);

  const handleDecrease = () => setQty((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQty((prev) => prev + 1);
  const handleQtyInput = (e) => {
    const value = parseInt(e.target.value, 10);
    setQty(Number.isNaN(value) || value < 1 ? 1 : value);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 text-gray-500 hover:text-gray-700 w-9 h-9 flex items-center justify-center rounded-full shadow-md font-bold text-lg">
          ✕
        </button>

        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-64 object-cover rounded-t-3xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
          }}
        />

        <div className="p-6">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {item.category || "Menu"}
          </span>

          <h2 className="font-black text-2xl text-gray-900 mt-3 mb-2">
            {item.name}
          </h2>

          {item.description && (
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>
          )}

          <div className="text-2xl font-black text-gray-950 mb-6">
            {formattedPrice}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Jumlah Pesanan
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-lg">
                -
              </button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={handleQtyInput}
                className="w-16 text-center px-2 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                onClick={handleIncrease}
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-lg">
                +
              </button>
            </div>
          </div>

          <div className="flex items-stretch gap-3">
            <button
              onClick={() => onAddToCart(item, qty)}
              title="Tambah Daftar Pesanan"
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors">
              <i className="ri-shopping-cart-2-line text-xl"></i>
            </button>

            <button
              onClick={() => onOrderNow(item, qty)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm">
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
