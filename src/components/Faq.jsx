import React, { useState } from "react";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-5 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-100 transition-colors">
        <span>{question}</span>
        <span className="text-orange-500 text-xl font-bold">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="p-5 bg-white border-t border-gray-200 text-gray-600 transition-all">
          {answer}
        </div>
      )}
    </div>
  );
}

function Faq() {
  return (
    <section id="faq" className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <FAQItem
            question="Bagaimana cara memesan makanan di DapoerTeoti?"
            answer="Cukup pilih kategori menu yang Anda inginkan, klik tombol 'Tambah +' pada menu pilihan Anda, buka keranjang belanja, kemudian ikuti instruksi pembayaran untuk menyelesaikan pesanan Anda."
          />
          <FAQItem
            question="Metode pembayaran apa saja yang didukung?"
            answer="Kami menerima berbagai metode pembayaran termasuk Kartu Kredit/Debit, Net Banking, QRIS, dan dompet digital populer (GoPay, OVO, Dana)."
          />
          <FAQItem
            question="Apakah saya bisa menjadwalkan pesanan untuk nanti?"
            answer="Ya, Anda dapat mengatur waktu pengantaran terjadwal pada halaman checkout sesuai dengan jam operasional mitra restoran kami."
          />
        </div>
      </div>
    </section>
  );
}

export default Faq;
