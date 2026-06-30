import React from "react";

function Hero() {
  return (
    <header
      id="home"
      className="relative bg-zinc-900 h-[80vh] flex items-center justify-center text-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')",
        }}></div>
      <div className="relative z-10 max-w-3xl px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-4">
          Discover The Best{" "}
          <span className="text-orange-500">Food & Drinks</span> In Your Area
        </h1>
        <p className="text-gray-200 text-lg sm:text-xl mb-8">
          Makanan otentik dari restoran lokal terbaik, diantarkan cepat langsung
          ke depan pintu rumah Anda!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-colors">
            Cari Makanan
          </a>
          <button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold px-8 py-3 rounded-full backdrop-blur-sm transition-colors">
            Lihat Promo
          </button>
        </div>
      </div>
    </header>
  );
}

export default Hero;
