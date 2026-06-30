import React from "react";

function AddToCartModal({ isOpen, onClose, item, onUpdateQty, onConfirm, isLoading }) {
  if (!isOpen || !item) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleDecrease = () => onUpdateQty(Math.max(1, item.quantity - 1));
  const handleIncrease = () => onUpdateQty(item.quantity + 1);
  const handleQtyInput = (e) => {
    const val = parseInt(e.target.value, 10);
    onUpdateQty(Number.isNaN(val) || val < 1 ? 1 : val);
  };

  const total = item.price * item.quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end p-4 md:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}></div>

      <div className="relative bg-white shadow-2xl rounded-2xl p-6 w-full max-w-sm max-h-[85vh] flex flex-col border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Tutup">
          <i className="ri-close-line text-2xl"></i>
        </button>

        <h3 className="font-bold text-gray-800 text-lg mb-4">
          🛒 Konfirmasi Keranjang
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={
              item.imageUrl ||
              item.image ||
              "https://placehold.co/100x100?text=No+Image"
            }
            alt={item.name}
            className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/100x100?text=No+Image";
            }}
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatCurrency(item.price)}
            </p>
          </div>
        </div>

        <div className="mb-4">
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
              value={item.quantity}
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

        <div className="border-t pt-4 mt-auto">
          <div className="flex justify-between font-bold text-gray-900 mb-4">
            <span>Total:</span>
            <span className="text-orange-600 text-lg">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-center disabled:bg-gray-400">
            Masukan Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToCartModal;
