import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ProductDetailModal from "./ProductDetailModal";
import AddToCartModal from "./AddToCartModal";

function Menu({
  onAddToCart,
  onAddToCartSilent,
  onOrderNow,
  currentUser,
  isLoggedIn,
  refreshTrigger,
  onEditMenu,
  onDeleteSuccess,
  onAddNewMenu,
  onOpenAuth,
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Popup konfirmasi "Masukan Keranjang" (terbuka setelah klik icon +cart)
  const [addConfirmItem, setAddConfirmItem] = useState(null);
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);

  const BACKEND_URL = "https://backend-express-restaurant-midtrans.vercel.app";

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/menus`);
        const result = await response.json();
        if (result.success) {
          setMenuItems(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [refreshTrigger]);

  const handleDeleteMenu = async (id, name) => {
    const result = await Swal.fire({
      title: "Yakin hapus menu?",
      text: `Menu ${name} akan dihapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URL}/api/menus/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const resData = await response.json();
        if (resData.success) {
          Swal.fire("Berhasil!", "Menu telah dihapus.", "success");
          if (onDeleteSuccess) onDeleteSuccess();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getImageUrl = (item) => {
    let imageUrl = "https://placehold.co/600x400?text=No+Image";
    if (item.image) {
      if (
        item.image.startsWith("http://") ||
        item.image.startsWith("https://")
      ) {
        imageUrl = item.image;
      } else {
        const cleanPath = item.image.startsWith("/")
          ? item.image
          : `/${item.image}`;
        imageUrl = `${BACKEND_URL}${cleanPath}`;
      }
    }
    return imageUrl;
  };

  const handleOpenDetail = (item) => {
    setSelectedItem({ ...item, imageUrl: getImageUrl(item) });
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedItem(null);
  };

  const handleShowAddConfirm = (item, qty = 1) => {
    if (!isLoggedIn) {
      setIsDetailOpen(false);
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Anda harus login terlebih dahulu untuk memesan!",
        confirmButtonColor: "#e86827",
        confirmButtonText: "Login Sekarang",
      }).then((result) => {
        if (result.isConfirmed) {
          if (onOpenAuth) onOpenAuth();
        }
      });
      return;
    }

    // FIX: Admin tidak diizinkan melakukan transaksi/pemesanan
    if (isLoggedIn.role === "admin") {
      setIsDetailOpen(false);
      Swal.fire({
        icon: "info",
        title: "Akses Admin",
        text: "Akun admin tidak dapat melakukan pemesanan. Gunakan akun pelanggan untuk bertransaksi.",
        confirmButtonColor: "#e86827",
      });
      return;
    }

    // Tutup popup detail produk, lalu tampilkan popup konfirmasi "Masukan Keranjang"
    setIsDetailOpen(false);
    setAddConfirmItem({ ...item, quantity: qty });
    setIsAddConfirmOpen(true);
  };

  const handleCloseAddConfirm = () => {
    setIsAddConfirmOpen(false);
    setAddConfirmItem(null);
  };

  const handleUpdateAddConfirmQty = (newQty) => {
    setAddConfirmItem((prev) =>
      prev ? { ...prev, quantity: Math.max(1, newQty) } : prev,
    );
  };

  const handleConfirmAddToCart = () => {
    if (!addConfirmItem) return;
    handleOrder(addConfirmItem, true, addConfirmItem.quantity); // silent: masuk ke keranjang
    setIsAddConfirmOpen(false);
    setAddConfirmItem(null);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Dimasukan ke keranjang",
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  };

  const handleOrderNowFromModal = (item, qty = 1) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Anda harus login terlebih dahulu untuk memesan!",
        confirmButtonColor: "#e86827",
        confirmButtonText: "Login Sekarang",
      }).then((result) => {
        if (result.isConfirmed) {
          if (onOpenAuth) onOpenAuth();
        }
      });
      return;
    }

    // FIX: Admin tidak diizinkan melakukan transaksi/pemesanan
    if (isLoggedIn.role === "admin") {
      Swal.fire({
        icon: "info",
        title: "Akses Admin",
        text: "Akun admin tidak dapat melakukan pemesanan. Gunakan akun pelanggan untuk bertransaksi.",
        confirmButtonColor: "#e86827",
      });
      return;
    }

    if (onOrderNow) onOrderNow(item, qty);
    handleCloseDetail();
  };

  // FIX: Hanya satu fungsi handler untuk tombol keranjang (hapus handleCartClick yang redundant)
  const handleOrder = (item, silent = false, qty = 1) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Anda harus login terlebih dahulu untuk memesan!",
        confirmButtonColor: "#e86827",
        confirmButtonText: "Login Sekarang",
      }).then((result) => {
        if (result.isConfirmed) {
          if (onOpenAuth) onOpenAuth();
        }
      });
      return;
    }

    // FIX: Admin tidak diizinkan melakukan transaksi/pemesanan
    if (isLoggedIn.role === "admin") {
      Swal.fire({
        icon: "info",
        title: "Akses Admin",
        text: "Akun admin tidak dapat melakukan pemesanan. Gunakan akun pelanggan untuk bertransaksi.",
        confirmButtonColor: "#e86827",
      });
      return;
    }

    if (silent && onAddToCartSilent) {
      onAddToCartSilent(item, qty);
    } else {
      onAddToCart(item, qty);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat hidangan lezat...
      </div>
    );
  }

  const isAdmin = isLoggedIn && isLoggedIn.role === "admin";

  return (
    <main id="menu" className="w-full px-4 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-black text-gray-900 text-center sm:text-left">
            {isAdmin ? "⚙️ Kelola Menu Kuliner" : "🍲 Menu Kuliner Pilihan"}
          </h2>
          {isAdmin && (
            <button
              onClick={onAddNewMenu}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors shadow-sm flex items-center gap-2">
              <i className="ri-add-line text-lg"></i> + Tambah Menu Baru
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {menuItems.map((item) => {
            const imageUrl = getImageUrl(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
                {isAdmin && (
                  <div className="absolute top-8 right-8 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1.5 rounded-xl backdrop-blur-sm shadow-md">
                    <button
                      onClick={() => onEditMenu && onEditMenu(item)}
                      className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                      title="Edit Menu">
                      <i className="ri-pencil-line text-lg"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(item.id, item.name)}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Hapus Menu">
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                )}

                <div>
                  <img
                    src={imageUrl}
                    alt={item.name}
                    onClick={() => handleOpenDetail(item)}
                    className="w-full h-48 object-cover rounded-2xl mb-4 cursor-pointer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x400?text=Image+Not+Found";
                    }}
                  />

                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.category || "Menu"}
                  </span>

                  <h3
                    onClick={() => handleOpenDetail(item)}
                    className="font-bold text-xl text-gray-900 mt-2 mb-1 cursor-pointer hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                  <span className="text-lg font-black text-gray-950">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.price)}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => onEditMenu && onEditMenu(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                      Edit Menu
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProductDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
        onAddToCart={handleShowAddConfirm}
        onOrderNow={handleOrderNowFromModal}
      />

      <AddToCartModal
        isOpen={isAddConfirmOpen}
        onClose={handleCloseAddConfirm}
        item={addConfirmItem}
        onUpdateQty={handleUpdateAddConfirmQty}
        onConfirm={handleConfirmAddToCart}
      />
    </main>
  );
}

export default Menu;
