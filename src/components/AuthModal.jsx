import React from "react";

function AuthModal({
  isOpen,
  onClose,
  isRegisterMode,
  setIsRegisterMode,
  onSubmit,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl p-1">
          ✕
        </button>
        <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">
          {isRegisterMode ? "Buat Akun Baru" : "Selamat Datang Kembali"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm mt-2">
            {isRegisterMode ? "Daftar Akun" : "Masuk Sekarang"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          {isRegisterMode ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setUsername("");
              setEmail("");
              setPassword("");
            }}
            className="text-orange-600 font-bold hover:underline">
            {isRegisterMode ? "Masuk di sini" : "Daftar sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
