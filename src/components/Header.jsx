import React from "react";
import dapoerToetiIcon from "../assets/logo.png";

function Header({
  user,
  totalItemsInCart,
  onLogout,
  onOpenAuth,
  onOpenAddMenu,
  onScrollToCart,
}) {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-b-xl sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="hidden md:block text-2xl font-black text-orange-500 tracking-wide">
          RESTAURANT<span className="text-gray-900"> Dapoer Toeti</span>
        </span>

        {/* Bagian ini hanya muncul di mobile (disembunyikan di md ke atas) */}
        <img
          src={dapoerToetiIcon}
          alt="Dapoer Toeti"
          className="block md:hidden w-10 h-10 object-contain"
        />
      </div>
      <div className="hidden md:flex space-x-8 font-medium items-center">
        <a
          href="#home"
          className="text-orange-500 border-b-2 border-orange-500 pb-1">
          Home
        </a>
        <a href="#menu" className="hover:text-orange-500 transition-colors">
          Menu
        </a>
        <a href="#services" className="hover:text-orange-500 transition-colors">
          Services
        </a>
        <a href="#faq" className="hover:text-orange-500 transition-colors">
          FAQ
        </a>

        {user && user.role === "admin" && (
          <button
            onClick={onOpenAddMenu}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all text-xs flex items-center gap-1 shadow-sm shadow-orange-200">
            Tambah Menu Baru
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && user.role !== "admin" && (
          <button
            onClick={onScrollToCart}
            className="relative p-2.5 text-gray-600 hover:text-orange-500 bg-gray-50 rounded-xl transition-all border border-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItemsInCart > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItemsInCart}
              </span>
            )}
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Halo, <strong className="text-gray-900">{user.username}</strong>
              {user.role === "admin" && (
                <span className="ml-1.5 text-[10px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-md uppercase">
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
            Masuk / Daftar
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
