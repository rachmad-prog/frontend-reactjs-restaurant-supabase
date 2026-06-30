import React from "react";
import Swal from "sweetalert2";

function OrderHistory({ orders, onDeleteOrder }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        📜 Riwayat Pesanan Anda
      </h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 italic text-sm bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          Tidak ada data transaksi yang ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const parsedItems =
              typeof order.items === "string"
                ? JSON.parse(order.items)
                : order.items;
            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                        {order.invoiceNumber}
                      </span>
                      <button
                        onClick={() =>
                          onDeleteOrder(order.id, order.invoiceNumber)
                        }
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors">
                        <i className="ri-delete-bin-line text-base"></i>
                      </button>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : order.status === "Diproses"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                      }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 border-b border-gray-50 pb-4">
                    {Array.isArray(parsedItems) &&
                      parsedItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-600 flex justify-between">
                          <span>
                            {item.name || item.menuName}{" "}
                            <strong className="text-gray-400 font-medium">
                              x{item.quantity}
                            </strong>
                          </span>
                          <span className="font-medium text-gray-700">
                            {formatCurrency(
                              (item.price || 0) * (item.quantity || 0),
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex justify-between items-center font-bold text-gray-900 pt-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Total Transaksi
                  </span>
                  <span className="text-lg text-orange-500">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OrderHistory;
