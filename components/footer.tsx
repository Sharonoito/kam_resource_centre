"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0B1E3A] text-white pt-16 pb-8 overflow-hidden z-10">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E7B947] to-transparent opacity-50" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <img src="/images/KAM.jpg" alt="KAM Logo" className="h-8 w-auto object-contain" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">Resource Centre</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Empowering Kenyan manufacturers through data-driven trade intelligence and strategic AfCFTA market access.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm">
              {["About", "Resources", "Reports", "News"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
                    <span className="h-px w-4 bg-zinc-700" /> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-[#E7B947]">📍</span>
                <span>15th Floor, Westlands, <br />Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E7B947]">✉️</span>
                <a href="mailto:info@kam.co.ke" className="hover:text-white transition">info@kam.co.ke</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E7B947]">📞</span>
                <span>+254 (0) 20 232 4817</span>
              </li>
            </ul>
          </div>

          {/* Newsletter/Action */}
          <div>
            <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Institutional Support</h4>
            <p className="text-zinc-400 text-xs mb-4">Supported by FCDO and TradeMark Africa (TMA).</p>
            <div className="flex flex-wrap gap-3">
              <div className="h-10 w-20 bg-white/10 rounded border border-white/5 flex items-center justify-center grayscale hover:grayscale-0 transition cursor-help">
                 <span className="text-[10px] text-zinc-500 font-bold">FCDO</span>
              </div>
              <div className="h-10 w-20 bg-white/10 rounded border border-white/5 flex items-center justify-center grayscale hover:grayscale-0 transition cursor-help">
                 <span className="text-[10px] text-zinc-500 font-bold">TMA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-tighter text-zinc-500 font-medium">
          <p>© {currentYear} Kenya Association of Manufacturers. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}