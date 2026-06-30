import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Menu from "./components/Menu";
import Hero from "./components/Hero";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Header from "./components/Header";
import OrderHistory from "./components/OrderHistory";
import MenuModal from "./components/MenuModal";
import CartWidget from "./components/CartWidget";
import DirectOrderModal from "./components/DirectOrderModal";
import AuthModal from "./components/AuthModal";
import "remixicon/fonts/remixicon.css";

// Helper notifikasi toast (pakai SweetAlert2) supaya tampilannya konsisten
// dan tidak nge-block render React seperti alert() bawaan browser.
const notify = (message, icon = "success") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

function App() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [orders, setOrders] = useState([]);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: "",
    category: "Makanan",
    price: "",
    image: "",
    description: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [refreshMenuTrigger, setRefreshMenuTrigger] = useState(0);

  const API_URL = "https://backend-express-restaurant-midtrans.vercel.app/api";

  // 1. Cek Sesi Login otomatis
  useEffect(() => {
    const checkUserLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success || result.user) {
          setUser(result.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Gagal verifikasi session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserLogin();
  }, []);

  // Muat keranjang milik user yang sedang login (per id user), saat user berubah (login/logout/ganti akun)
  const getUserKey = (u) => u && (u.id || u._id || u.email || u.username);

  useEffect(() => {
    const userKey = getUserKey(user);
    if (!userKey) {
      setCart([]);
      return;
    }
    try {
      const saved = localStorage.getItem(`cart_${userKey}`);
      setCart(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Gagal memuat keranjang dari penyimpanan:", error);
      setCart([]);
    }
  }, [user]);

  // Simpan keranjang ke localStorage khusus untuk user yang sedang login,
  // agar tetap ada saat logout/login kembali, dan tidak tercampur dengan user lain
  useEffect(() => {
    const userKey = getUserKey(user);
    if (!userKey) return;
    try {
      localStorage.setItem(`cart_${userKey}`, JSON.stringify(cart));
    } catch (error) {
      console.error("Gagal menyimpan keranjang:", error);
    }
  }, [cart, user]);

  // 2. Mengambil riwayat transaksi
  const fetchOrderHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_URL}/orders/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let result;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (response.ok && result && result.success) {
        setOrders(result.data || []);
      } else {
        console.error("Gagal memuat riwayat pesanan:", result);
        notify(
          (result && (result.message || result.error)) ||
            `Gagal memuat riwayat pesanan (status ${response.status}).`,
          "error",
        );
      }
    } catch (error) {
      console.error("Gagal memuat riwayat pesanan:", error);
      notify(
        "Terjadi kesalahan jaringan saat memuat riwayat pesanan.",
        "error",
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderHistory();
    } else {
      setOrders([]);
    }
  }, [user]);

  // 3. Load Midtrans Snap script
  useEffect(() => {
    const snapClientKey = "SB-Mid-client-pqB-7fz8f3olG9M-";
    const scriptId = "midtrans-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.id = scriptId;
      script.setAttribute("data-client-key", snapClientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegisterMode ? "register" : "login";
    const payload = isRegisterMode
      ? { username, email, password }
      : { email, password };

    try {
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        if (isRegisterMode) {
          notify(result.message || "Registrasi Berhasil! Silakan masuk.");
          setIsRegisterMode(false);
          setUsername("");
          setEmail("");
          setPassword("");
        } else {
          localStorage.setItem("token", result.token);
          setUser(result.user);
          closeAuthModal();
        }
      } else {
        notify(result.message || "Gagal memproses.", "error");
      }
    } catch (error) {
      console.error("Gagal proses autentikasi:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Cart akan otomatis dikosongkan dari tampilan (lihat effect [user]),
    // tapi datanya tetap tersimpan di localStorage per user.id dan akan
    // muncul kembali saat user yang sama login lagi.
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleAddToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const isExist = prevCart.find((item) => item.id === product.id);
      if (isExist) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
    // FIX: Buka CartWidget saat item ditambahkan
    setIsCartOpen(true);
  };

  // FIX: Tambah ke keranjang tanpa membuka popup cart/pembayaran (untuk tombol icon di detail produk)
  const handleAddToCartSilent = (product, qty = 1) => {
    setCart((prevCart) => {
      const isExist = prevCart.find((item) => item.id === product.id);
      if (isExist) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
  };

  // Item dari "Pesan Sekarang" — transaksi TERPISAH dari keranjang utama,
  // tidak ikut dihitung ke cart/badge header, dan punya popup pembayaran sendiri.
  const [pendingOrder, setPendingOrder] = useState(null);

  const handleOrderNow = (product, qty = 1) => {
    setPendingOrder({ ...product, quantity: qty });
  };

  const handleCloseDirectOrder = () => {
    setPendingOrder(null);
  };

  const handleUpdatePendingQty = (newQuantity) => {
    setPendingOrder((prev) => {
      if (!prev) return prev;
      if (newQuantity <= 0) return null;
      return { ...prev, quantity: newQuantity };
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      const updated = prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item,
        )
        .filter((item) => item.quantity > 0);
      // FIX: Tutup cart jika kosong
      if (updated.length === 0) setIsCartOpen(false);
      return updated;
    });
  };

  // totalItemsInCart (badge header) hanya menghitung cart asli
  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
  // totalAmount untuk popup pembayaran keranjang utama — HANYA dari cart,
  // tidak digabung dengan pendingOrder ("Pesan Sekarang") yang transaksinya terpisah
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return notify("Keranjang kosong!", "warning");
    await processCheckout(cart, totalAmount, {
      successMessage: "Pembayaran Keranjang Berhasil! Terima kasih.",
      onSuccess: () => {
        setCart([]);
        setIsCartOpen(false);
      },
    });
  };

  // Checkout khusus untuk "Pesan Sekarang" — transaksi terpisah dari keranjang utama
  const handleDirectCheckout = async () => {
    if (!pendingOrder) return;
    const amount = pendingOrder.price * pendingOrder.quantity;
    await processCheckout([pendingOrder], amount, {
      successMessage: "Pesanan Berhasil Dibayar! Terima kasih.",
      onSuccess: () => {
        setPendingOrder(null);
      },
    });
  };

  // Beri tahu backend bahwa pesanan ini sudah dibayar (status -> "Selesai"),
  // dipanggil langsung dari frontend setelah snap.pay sukses.
  // FIX: token diterima sebagai PARAMETER (bukan diambil ulang dari localStorage)
  // supaya tetap terikat ke user yang MEMULAI checkout, bukan user yang sedang
  // login saat callback async ini akhirnya jalan (mencegah order nyasar ke akun lain).
  const confirmOrderCompleted = async (invoiceNumber, ownerToken) => {
    if (!ownerToken || !invoiceNumber) return;
    try {
      await fetch(`${API_URL}/orders/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ownerToken}`,
        },
        body: JSON.stringify({ invoiceNumber }),
      });
    } catch (error) {
      console.error("Gagal mengupdate status pesanan ke backend:", error);
    }
  };

  // FIX: versi fetchOrderHistory yang menerima token eksplisit, dipakai oleh
  // callback snap.pay supaya hasilnya tidak salah tertimpa kalau user lain
  // sudah login duluan saat popup pembayaran masih terbuka.
  const fetchOrderHistoryForToken = async (ownerToken) => {
    if (!ownerToken) return;
    try {
      const response = await fetch(`${API_URL}/orders/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ownerToken}`,
        },
      });
      let result;
      try {
        result = await response.json();
      } catch {
        result = null;
      }
      // Hanya update state `orders` kalau token ini masih milik user yang
      // SEDANG login sekarang. Kalau sudah beda (user lain login di antara
      // waktu checkout dimulai & callback ini selesai), abaikan supaya tidak
      // menimpa riwayat milik user yang sedang aktif di layar.
      if (localStorage.getItem("token") !== ownerToken) return;

      if (response.ok && result && result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat riwayat pesanan (owner token):", error);
    }
  };

  const processCheckout = async (
    items,
    amount,
    { onSuccess, successMessage = "Pembayaran Berhasil! Terima kasih." },
  ) => {
    // FIX: Cek token login sebelum request ke backend
    const token = localStorage.getItem("token");
    if (!token) {
      notify("Sesi Anda habis, silakan login kembali.", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    // FIX: Cek window.snap sudah siap sebelum memulai proses
    if (!window.snap) {
      notify(
        "Sistem pembayaran belum siap. Pastikan koneksi internet aktif lalu refresh halaman.",
        "error",
      );
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch(`${API_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items,
          totalAmount: amount,
        }),
      });

      const data = await response.json();

      // FIX: Cek response tidak OK (4xx/5xx)
      if (!response.ok) {
        notify(data.message || `Gagal checkout (${response.status})`, "error");
        return;
      }

      if (data.token) {
        // FIX: simpan token milik user yang MEMULAI checkout ini secara eksplisit
        // ke variabel lokal (closure), supaya callback snap.pay di bawah ini
        // (yang baru jalan setelah user menyelesaikan popup pembayaran, bisa
        // beberapa saat kemudian) tetap memakai identitas user yang sama —
        // walau di antara waktu itu sudah ada user lain yang login di tab ini.
        const ownerToken = token;

        window.snap.pay(data.token, {
          onSuccess: () => {
            // Kosongkan cart/pendingOrder DULU, baru kasih notifikasi.
            // Pakai SweetAlert2 (non-blocking) supaya render React (badge keranjang)
            // tidak ketahan oleh dialog seperti halnya alert() bawaan browser.
            onSuccess();
            confirmOrderCompleted(
              data.invoiceNumber ?? data.orderId,
              ownerToken,
            ).then(() => fetchOrderHistoryForToken(ownerToken));
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: successMessage,
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            });
          },
          onPending: () => {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "info",
              title: "Menunggu Pembayaran! Selesaikan pembayaran Anda.",
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            });
            fetchOrderHistoryForToken(ownerToken);
          },
          onError: (result) => {
            console.error("Snap error:", result);
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: "Pembayaran Gagal! Silakan coba lagi.",
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            });
          },
          onClose: () => {
            console.log(
              "User menutup pop-up Midtrans tanpa menyelesaikan pembayaran",
            );
          },
        });
      } else {
        notify(
          data.message || "Gagal mendapatkan token pembayaran dari server.",
          "error",
        );
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      notify(
        "Terjadi kesalahan jaringan. Pastikan server backend berjalan.",
        "error",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleDeleteOrder = async (orderId, invoiceNum) => {
    const konfirmasi = await Swal.fire({
      icon: "warning",
      title: "Hapus Pesanan?",
      text: `Apakah Anda yakin ingin menghapus pesanan ${invoiceNum}?`,
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!konfirmasi.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchOrderHistory();
      } else {
        notify(result.message || "Gagal menghapus pesanan", "error");
      }
    } catch (error) {
      console.error("Error hapus order:", error);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      notify("Format file harus JPG, PNG, atau WEBP", "warning");
      return;
    }

    setImagePreview((prevUrl) => {
      if (prevUrl && prevUrl.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
      return URL.createObjectURL(file);
    });
    setMenuForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleMenuFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingMenu
      ? `${API_URL}/menus/${editingMenu.id}`
      : `${API_URL}/menus`;
    const method = editingMenu ? "PUT" : "POST";

    // Pakai FormData supaya bisa kirim file gambar (multipart/form-data).
    // JANGAN set header Content-Type secara manual — browser akan mengisinya
    // otomatis lengkap dengan "boundary" yang diperlukan multer di backend.
    const formData = new FormData();
    formData.append("name", menuForm.name);
    formData.append("category", menuForm.category);
    formData.append("price", menuForm.price);
    formData.append("description", menuForm.description);
    if (menuForm.imageFile) {
      formData.append("image", menuForm.imageFile);
    } else if (editingMenu && menuForm.image) {
      // Tidak ada file baru saat edit -> kirim path/URL gambar lama
      // supaya backend tidak menganggap field image kosong/wajib diisi.
      formData.append("existingImage", menuForm.image);
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      let result;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (response.ok && result && result.success) {
        notify(result.message || "Menu berhasil disimpan!");
        setIsMenuModalOpen(false);
        setEditingMenu(null);
        setMenuForm({
          name: "",
          category: "Makanan",
          price: "",
          image: "",
          description: "",
          imageFile: null,
        });
        setImagePreview(null);
        setRefreshMenuTrigger((prev) => prev + 1);
      } else {
        notify(
          (result && result.message) ||
            `Gagal menyimpan menu (status ${response.status}).`,
          "error",
        );
      }
    } catch (error) {
      console.error("Gagal menyimpan menu:", error);
      notify("Terjadi kesalahan jaringan saat menyimpan menu.", "error");
    }
  };

  const openEditMenuModal = (menuItem) => {
    setEditingMenu(menuItem);
    setMenuForm({
      name: menuItem.name,
      category: menuItem.category || "Makanan",
      price: menuItem.price,
      image: menuItem.image || "",
      description: menuItem.description || "",
      imageFile: null,
    });
    setImagePreview(menuItem.image || null);
    setIsMenuModalOpen(true);
  };

  const handleOpenAddMenuModal = () => {
    setEditingMenu(null);
    setMenuForm({
      name: "",
      category: "Makanan",
      price: "",
      image: "",
      description: "",
      imageFile: null,
    });
    setImagePreview(null);
    setIsMenuModalOpen(true);
  };

  const scrollToCart = () => {
    if (cart.length === 0)
      return notify("Keranjang belanja Anda kosong.", "warning");
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Memuat konfigurasi aplikasi...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Header
        user={user}
        totalItemsInCart={totalItemsInCart}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setIsAuthModalOpen(true);
          setIsRegisterMode(false);
        }}
        onOpenAddMenu={handleOpenAddMenuModal}
        onScrollToCart={scrollToCart}
      />

      <Hero />

      <Menu
        onAddToCart={handleAddToCart}
        onAddToCartSilent={handleAddToCartSilent}
        onOrderNow={handleOrderNow}
        currentUser={user}
        isLoggedIn={user}
        refreshTrigger={refreshMenuTrigger}
        onEditMenu={openEditMenuModal}
        onDeleteSuccess={() => setRefreshMenuTrigger((prev) => prev + 1)}
        onAddNewMenu={handleOpenAddMenuModal}
        onOpenAuth={() => {
          setIsAuthModalOpen(true);
          setIsRegisterMode(false);
        }}
      />

      {user && user.role !== "admin" && (
        <OrderHistory orders={orders} onDeleteOrder={handleDeleteOrder} />
      )}

      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onSubmit={handleMenuFormSubmit}
        editingMenu={editingMenu}
        menuForm={menuForm}
        setMenuForm={setMenuForm}
        imagePreview={imagePreview}
        onImageFileChange={handleImageFileChange}
      />

      {/* Popup pembayaran KERANJANG UTAMA (hasil addtocart) */}
      {isCartOpen && (
        <CartWidget
          cart={cart}
          totalAmount={totalAmount}
          onCheckout={handleCheckout}
          onUpdateQuantity={handleUpdateQuantity}
          onClose={() => setIsCartOpen(false)}
          isLoading={isCheckingOut}
        />
      )}

      {/* Popup pembayaran TERPISAH untuk "Pesan Sekarang" — tidak digabung dengan keranjang utama */}
      <DirectOrderModal
        isOpen={!!pendingOrder}
        onClose={handleCloseDirectOrder}
        item={pendingOrder}
        onUpdateQty={handleUpdatePendingQty}
        onCheckout={handleDirectCheckout}
        isLoading={isCheckingOut}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        isRegisterMode={isRegisterMode}
        setIsRegisterMode={setIsRegisterMode}
        onSubmit={handleAuthSubmit}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />

      {(!user || user.role !== "admin") && <Faq />}

      <Footer />
    </div>
  );
}

export default App;
