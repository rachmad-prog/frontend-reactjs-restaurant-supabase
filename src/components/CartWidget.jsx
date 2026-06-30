import React from "react";

function CartWidget({
  cart,
  totalAmount,
  onCheckout,
  onUpdateQuantity,
  onClose,
  isLoading,
}) {
  const hasCartItems = cart && cart.length > 0;

  if (!hasCartItems) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const displayItems = cart;

  const totalQty = displayItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQtyChange = (item, val) => {
    onUpdateQuantity(item.id || item._id, val);
  };

  return (
    // Tambahkan 'animate-in fade-in duration-200' jika Anda menggunakan tailwindcss-animate
    // Saya tambahkan 'pb-safe' (padding bottom) untuk handle iPhone notch
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end p-4 md:p-6">
      {/* Background Dimmer */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}></div>

      {/* Konten Widget */}
      <div className="relative bg-white shadow-2xl rounded-2xl p-6 w-full max-w-sm max-h-[85vh] flex flex-col border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Tutup Keranjang">
          <i className="ri-close-line text-2xl"></i>
        </button>

        <h3 className="font-bold text-gray-800 text-lg mb-4">
          🛒 Keranjang ({totalQty})
        </h3>

        {/* List Item */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
          {displayItems.map((item, idx) => (
            <div
              key={item.id || item._id || `pending-${idx}`}
              className="flex items-center justify-between gap-4">
              <img
                src={
                  item.imageUrl ||
                  item.image ||
                  "https://placehold.co/100x100?text=No+Image"
                }
                alt={item.name}
                className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100?text=No+Image";
                }}
              />
              <div className="flex flex-col flex-1">
                <span className="font-medium text-gray-800 text-sm">
                  {item.name}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => {
                      const val =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      handleQtyChange(item, val);
                    }}
                    className="w-14 px-2 py-1 border rounded-lg text-center font-semibold bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <span className="font-semibold text-gray-900 mt-1">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
              <button
                onClick={() => handleQtyChange(item, 0)}
                title="Hapus dari keranjang"
                aria-label="Hapus dari keranjang"
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                <i className="ri-delete-bin-line text-lg"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-gray-900 mb-4">
            <span>Total:</span>
            <span className="text-orange-600 text-lg">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <button
            onClick={onCheckout}
            disabled={isLoading} // disable jika sedang memproses
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-center disabled:bg-gray-400">
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartWidget;
