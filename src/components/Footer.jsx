import React from "react";

function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-400 py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-white font-bold text-lg mb-4">DapoerTeoti</p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#home" className="hover:text-white">
            Home
          </a>
          <a href="#menu" className="hover:text-white">
            Menu
          </a>
          <a href="#services" className="hover:text-white">
            Services
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <span className=" font-bold text-amber-500">RESTAURANT</span>{" "}
          DapoerToeti. All rights reserved. by Rachmadinata, S.Kom
        </p>
      </div>
    </footer>
  );
}

export default Footer;
