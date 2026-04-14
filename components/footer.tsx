"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from "@heroicons/react/24/outline";

// Importing official brand icons from react-icons
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaYoutube, 
  FaInstagram, 
  FaTiktok 
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0B1E3A] text-white pt-16 pb-8 overflow-hidden z-10">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E7B947] to-transparent opacity-50" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Navigation */}
          <div>
            <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
                  <span className="h-px w-4 bg-zinc-700" /> Home
                </Link>
              </li>
              <li>
                <Link href="/sectors" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
                  <span className="h-px w-4 bg-zinc-700" /> Sectors
                </Link>
              </li>
              <li>
                <Link href="/trade" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
                  <span className="h-px w-4 bg-zinc-700" /> Trade Policy
                </Link>
              </li>
              <li>
                <Link href="/tax" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
                  <span className="h-px w-4 bg-zinc-700" /> Tax
                </Link>
              </li>
              <li>
                <Link href="/trade" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
                  <span className="h-px w-4 bg-zinc-700" /> Publication
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
                  <span className="h-px w-4 bg-zinc-700" /> Research Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Get in Touch</h4>
            <div className="space-y-3 text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-[#E7B947] mt-1 flex-shrink-0" />
                <div>
                  <div>Location: KAM House, 15 Mwanzi Rd Opp. Westgate Mall, Westlands, Nairobi</div>
                  <div>P.O. Box 30225 - 00100 Nairobi, Kenya</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 text-[#E7B947] mt-1 flex-shrink-0" />
                <div>Phone: +254 722 201368, 734 646005, +254 (20) 232 4817</div>
              </div>
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-[#E7B947] mt-1 flex-shrink-0" />
                <div>
                  <a href="mailto:info@kam.co.ke" className="hover:text-white transition">Email: info@kam.co.ke</a> | 
                  <a href="https://www.kam.co.ke" target="_blank" rel="noopener noreferrer" className="hover:text-white transition ml-1">Website: www.kam.co.ke</a>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Support */}
          <div className="space-y-8">
            <div>
              <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Follow Us</h4>
              <div className="flex gap-4">
                <Link href="https://www.facebook.com/KenyaAssociationofManufacturers" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947] transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
                    <FaFacebookF className="h-6 w-6 text-[#E7B947] group-hover:text-[#0B1E3A]" />
                  </span>
                </Link>
                <Link href="https://www.linkedin.com/company/kenya-association-of-manufacturers/" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947] transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
                    <FaLinkedinIn className="h-6 w-6 text-[#E7B947] group-hover:text-[#0B1E3A]" />
                  </span>
                </Link>
                <Link href="https://www.youtube.com/@KAMTV_" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947] transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
                    <FaYoutube className="h-6 w-6 text-[#E7B947] group-hover:text-[#0B1E3A]" />
                  </span>
                </Link>
                <Link href="https://www.instagram.com/kam_kenya/" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947] transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
                    <FaInstagram className="h-6 w-6 text-[#E7B947] group-hover:text-[#0B1E3A]" />
                  </span>
                </Link>
                <Link href="https://www.tiktok.com/@kam_kenya" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947] transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
                    <FaTiktok className="h-6 w-6 text-[#E7B947] group-hover:text-[#0B1E3A]" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Institutional Support */}
            <div>
              <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Supported by:</h4>
              <p className="text-zinc-400 text-xs mb-4">Supported by FCDO and TradeMark Africa (TMA).</p>
              <div className="flex flex-wrap gap-4">
                
                {/* uk international development logo */}
                <div className="h-20 w-40 relative bg-white/10 rounded-lg border border-white/5 flex items-center justify-center cursor-help overflow-hidden">
                  <Image 
                    src="/images/UkDvpntLogo.png" 
                    alt="UK international development logo"
                    fill
                    className="object-contain p-3"
                  />
                </div>

                {/* TradeMark Africa Logo */}
                <div className="h-20 w-40 relative bg-white/10 rounded-lg border border-white/5 flex items-center justify-center cursor-help overflow-hidden">
                  <Image 
                    src="/images/Trademarklogo.jpg" 
                    alt="TradeMark Africa Logo"
                    fill
                    className="object-contain p-3"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-tighter text-zinc-500 font-medium">
          <p>© {currentYear} Kenya Association of Manufacturers. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="https://kam.co.ke/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="https://kam.co.ke/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { 
//   MapPinIcon, 
//   PhoneIcon, 
//   EnvelopeIcon, 
//   UserGroupIcon, 
//   PlayIcon, 
//   AcademicCapIcon, 
//   SparklesIcon, 
//   ChartBarIcon 
// } from "@heroicons/react/24/outline";

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="relative bg-[#0B1E3A] text-white pt-16 pb-8 overflow-hidden z-10">
//       {/* Subtle Background Accent */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E7B947] to-transparent opacity-50" />
      
//       <div className="container mx-auto px-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
//           {/* Navigation */}
//           <div>
//             <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
//             <ul className="space-y-4 text-sm">
//               <li>
//                 <Link href="/" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
//                   <span className="h-px w-4 bg-zinc-700" /> Home
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/sectors" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
//                   <span className="h-px w-4 bg-zinc-700" /> Sectors
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/trade" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
//                   <span className="h-px w-4 bg-zinc-700" /> Trade Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/tax" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
//                   <span className="h-px w-4 bg-zinc-700" /> Tax
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/trade" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
//                   <span className="h-px w-4 bg-zinc-700" /> Publication
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/research" className="text-zinc-300 hover:text-[#E7B947] transition-colors duration-200 flex items-center gap-2">
//                   <span className="h-px w-4 bg-zinc-700" /> Research Hub
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Get in Touch</h4>
//             <div className="space-y-3 text-sm text-zinc-300">
//               <div className="flex items-start gap-3">
//                 <MapPinIcon className="h-5 w-5 text-[#E7B947] mt-1 flex-shrink-0" />
//                 <div>
//                   <div>Location: KAM House, 15 Mwanzi Rd Opp. Westgate Mall, Westlands, Nairobi</div>
//                   <div>P.O. Box 30225 - 00100 Nairobi, Kenya</div>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <PhoneIcon className="h-5 w-5 text-[#E7B947] mt-1 flex-shrink-0" />
//                 <div>Phone: +254 722 201368, 734 646005, +254 (20) 232 4817</div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <EnvelopeIcon className="h-5 w-5 text-[#E7B947] mt-1 flex-shrink-0" />
//                 <div>
//                   <a href="mailto:info@kam.co.ke" className="hover:text-white transition">Email: info@kam.co.ke</a> | 
//                   <a href="https://www.kam.co.ke" target="_blank" rel="noopener noreferrer" className="hover:text-white transition ml-1">Website: www.kam.co.ke</a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Social & Support */}
//           <div className="space-y-8">
//             <div>
//               <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Follow Us</h4>
//               <div className="flex gap-4">
//                 <Link href="https://www.facebook.com/KenyaAssociationofManufacturers" target="_blank" rel="noopener noreferrer" className="group">
//                   <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947]/20 transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
//                     <UserGroupIcon className="h-6 w-6 text-[#E7B947] group-hover:text-white" />
//                   </span>
//                 </Link>
//                 <Link href="https://www.linkedin.com/company/kenya-association-of-manufacturers/" target="_blank" rel="noopener noreferrer" className="group">
//                   <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947]/20 transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
//                     <AcademicCapIcon className="h-6 w-6 text-[#E7B947] group-hover:text-white" />
//                   </span>
//                 </Link>
//                 <Link href="https://www.youtube.com/@KAMTV_" target="_blank" rel="noopener noreferrer" className="group">
//                   <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947]/20 transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
//                     <PlayIcon className="h-6 w-6 text-[#E7B947] group-hover:text-white" />
//                   </span>
//                 </Link>
//                 <Link href="https://www.instagram.com/kam_kenya/" target="_blank" rel="noopener noreferrer" className="group">
//                   <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947]/20 transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
//                     <SparklesIcon className="h-6 w-6 text-[#E7B947] group-hover:text-white" />
//                   </span>
//                 </Link>
//                 <Link href="https://www.tiktok.com/@kam_kenya" target="_blank" rel="noopener noreferrer" className="group">
//                   <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg border-2 border-[#E7B947]/50 bg-white/10 hover:bg-[#E7B947]/20 transition-all duration-200 group-hover:border-[#E7B947] group-hover:scale-105">
//                     <ChartBarIcon className="h-6 w-6 text-[#E7B947] group-hover:text-white" />
//                   </span>
//                 </Link>
//               </div>
//             </div>

//             {/* Institutional Support */}
//             <div>
//               <h4 className="text-[#E7B947] font-bold uppercase tracking-widest text-xs mb-6">Supported by:</h4>
//               <p className="text-zinc-400 text-xs mb-4">Supported by FCDO and TradeMark Africa (TMA).</p>
//               <div className="flex flex-wrap gap-4">
                
//                 {/* uk international development logo */}
//                 <div className="h-20 w-40 relative bg-white/10 rounded-lg border border-white/5 flex items-center justify-center cursor-help overflow-hidden">
//                   <Image 
//                     src="/images/UkDvpntLogo.png" 
//                     alt="UK international development logo"
//                     fill
//                     className="object-contain p-3"
//                   />
//                 </div>

//                 {/* TradeMark Africa Logo */}
//                 <div className="h-20 w-40 relative bg-white/10 rounded-lg border border-white/5 flex items-center justify-center cursor-help overflow-hidden">
//                   <Image 
//                     src="/images/Trademarklogo.jpg" 
//                     alt="TradeMark Africa Logo"
//                     fill
//                     className="object-contain p-3"
//                   />
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-tighter text-zinc-500 font-medium">
//           <p>© {currentYear} Kenya Association of Manufacturers. All Rights Reserved.</p>
//           <div className="flex gap-6">
//             <Link href="https://kam.co.ke/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
//             <Link href="https://kam.co.ke/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

