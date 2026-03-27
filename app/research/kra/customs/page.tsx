import { redirect } from "next/navigation";

export default function KraCustomsRedirectPage() {
	redirect("/research/kra");
}

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Search, Download, Filter, TrendingUp, BarChart3, FileText, Eye, Calendar, Globe } from "lucide-react";

// interface ICMSRecord {
//   id: number;
//   year?: number;
//   month?: string;
//   entry_number?: string;
//   hscode?: string;
//   good_description?: string;
//   origin_country?: string;
//   country_name?: string;
//   quantity?: number;
//   fob_value?: number;
//   import_duty?: number;
//   entry_status?: string;
// }

// export default function CustomsPage() {
//   const [records, setRecords] = useState<ICMSRecord[]>([]);
//   const [filteredRecords, setFilteredRecords] = useState<ICMSRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedYear, setSelectedYear] = useState<string>("");
//   const [selectedCountry, setSelectedCountry] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // Fetch ICMS data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/customs/icms");
//         const data = await response.json();
//         setRecords(data);
//         setFilteredRecords(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching ICMS data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let filtered = records;

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (record) =>
//           record.good_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           record.hscode?.includes(searchTerm) ||
//           record.entry_number?.includes(searchTerm)
//       );
//     }

//     if (selectedYear) {
//       filtered = filtered.filter((record) => record.year?.toString() === selectedYear);
//     }

//     if (selectedCountry) {
//       filtered = filtered.filter((record) => record.country_name === selectedCountry);
//     }

//     setFilteredRecords(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedYear, selectedCountry, records]);

//   // Pagination
//   const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
//   const startIndex = (currentPage - 1) * recordsPerPage;
//   const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

//   // Get unique values for filters
//   const years = [...new Set(records.map((r) => r.year).filter(Boolean))].sort((a, b) => (b || 0) - (a || 0));
//   const countries = [...new Set(records.map((r) => r.country_name).filter(Boolean))].sort();

//   // Calculate statistics
//   const totalRecords = records.length;
//   const totalValue = records.reduce((sum, r) => sum + (r.fob_value || 0), 0);
//   const totalDuties = records.reduce((sum, r) => sum + (r.import_duty || 0), 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#193C8D] mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading customs data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="bg-[#0B1E3A] text-white py-16">
//         <div className="container mx-auto px-6">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-12 h-12 bg-[#E7B947] rounded-lg flex items-center justify-center">
//               <Globe className="w-6 h-6 text-[#0B1E3A]" />
//             </div>
//             <h1 className="text-4xl font-bold">Kenya Customs & Trade Data</h1>
//           </div>
//           <p className="text-xl text-gray-300 max-w-3xl">
//             Explore detailed ICMS (International Customs Management System) data on imports, exports, tariffs, and trade flows. 
//             Access real-time insights into Kenya's customs transactions and trade statistics.
//           </p>
//         </div>
//       </section>

//       {/* Statistics Cards */}
//       <section className="py-12 border-b bg-white">
//         <div className="container mx-auto px-6">
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-sm font-bold text-gray-600 uppercase">Total Records</h3>
//                 <BarChart3 className="w-6 h-6 text-[#193C8D]" />
//               </div>
//               <p className="text-3xl font-bold text-[#193C8D]">{totalRecords.toLocaleString()}</p>
//               <p className="text-xs text-gray-600 mt-2">Customs transactions indexed</p>
//             </div>

//             <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-sm font-bold text-gray-600 uppercase">Total Value</h3>
//                 <TrendingUp className="w-6 h-6 text-[#E7B947]" />
//               </div>
//               <p className="text-3xl font-bold text-[#E7B947]">KES {(totalValue / 1e9).toFixed(1)}B</p>
//               <p className="text-xs text-gray-600 mt-2">FOB value of transactions</p>
//             </div>

//             <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-sm font-bold text-gray-600 uppercase">Total Duties</h3>
//                 <FileText className="w-6 h-6 text-red-600" />
//               </div>
//               <p className="text-3xl font-bold text-red-600">KES {(totalDuties / 1e9).toFixed(1)}B</p>
//               <p className="text-xs text-gray-600 mt-2">Import duties collected</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Filters & Search */}
//       <section className="py-8 bg-white border-b sticky top-20 z-40">
//         <div className="container mx-auto px-6">
//           <div className="grid md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search: Product, HS Code, Entry #"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193C8D]"
//               />
//             </div>

//             {/* Year Filter */}
//             <div>
//               <select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193C8D]"
//               >
//                 <option value="">All Years</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Country Filter */}
//             <div>
//               <select
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#193C8D]"
//               >
//                 <option value="">All Countries</option>
//                 {countries.slice(0, 50).map((country) => (
//                   <option key={country} value={country}>
//                     {country}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Clear Filters */}
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedYear("");
//                 setSelectedCountry("");
//               }}
//               className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
//             >
//               Clear Filters
//             </button>
//           </div>
//           <p className="text-sm text-gray-600 mt-4">
//             Showing <span className="font-bold">{paginatedRecords.length}</span> of{" "}
//             <span className="font-bold">{filteredRecords.length}</span> records
//           </p>
//         </div>
//       </section>

//       {/* Data Table */}
//       <section className="py-12">
//         <div className="container mx-auto px-6">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Entry Number</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Product Description</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">HS Code</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Country</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Quantity</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">FOB Value (KES)</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {paginatedRecords.length > 0 ? (
//                     paginatedRecords.map((record) => (
//                       <tr key={record.id} className="hover:bg-gray-50 transition">
//                         <td className="px-6 py-4">
//                           <span className="font-mono text-sm text-[#193C8D] font-medium">{record.entry_number || "-"}</span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <p className="text-sm text-gray-700 max-w-xs truncate">{record.good_description || "-"}</p>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded">
//                             {record.hscode || "-"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="text-sm text-gray-600">{record.country_name || "-"}</span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="text-sm font-medium text-gray-700">{record.quantity?.toLocaleString() || "-"}</span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="text-sm font-semibold text-green-700">
//                             {record.fob_value ? `KES ${(record.fob_value / 1e6).toFixed(2)}M` : "-"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span
//                             className={`inline-block px-2.5 py-1 text-xs font-bold rounded uppercase ${
//                               record.entry_status === "Released"
//                                 ? "bg-green-100 text-green-700"
//                                 : record.entry_status === "Pending"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : "bg-gray-100 text-gray-700"
//                             }`}
//                           >
//                             {record.entry_status || "Unknown"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center">
//                         <p className="text-gray-500 font-medium">No records found. Try adjusting your filters.</p>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
//                 <p className="text-sm text-gray-600">
//                   Page {currentPage} of {totalPages}
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Reports & Downloads Section */}
//       <section className="py-16 bg-white border-t">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-bold text-[#0B1E3A] mb-2">Reports & Analytics</h2>
//           <p className="text-gray-600 mb-8">Access interactive dashboards, custom reports, and analytical insights</p>

//           <div className="grid md:grid-cols-2 gap-8 mb-12">
//             {/* Power BI Embed */}
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
//               <div className="flex items-center gap-3 mb-6">
//                 <BarChart3 className="w-8 h-8 text-blue-600" />
//                 <h3 className="text-2xl font-bold text-[#0B1E3A]">Interactive Dashboard</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Explore customs data with interactive visualizations. Filter by date, country, product category, and more.
//               </p>
//               <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-6">
//                 <div className="text-center">
//                   <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-500">Power BI Dashboard Embed</p>
//                   <p className="text-sm text-gray-400 mt-2">(Configure Power BI embed URL in settings)</p>
//                 </div>
//               </div>
//               <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition">
//                 Open Full Dashboard →
//               </button>
//             </div>

//             {/* Monthly Summary Reports */}
//             <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 border border-amber-200">
//               <div className="flex items-center gap-3 mb-6">
//                 <Calendar className="w-8 h-8 text-amber-600" />
//                 <h3 className="text-2xl font-bold text-[#0B1E3A]">Monthly Reports</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Download comprehensive monthly customs reports with detailed trade statistics and analysis.
//               </p>
//               <div className="space-y-3 mb-6">
//                 {[
//                   { month: "December 2024", file: "customs_report_dec_2024.pdf" },
//                   { month: "November 2024", file: "customs_report_nov_2024.pdf" },
//                   { month: "October 2024", file: "customs_report_oct_2024.pdf" },
//                   { month: "September 2024", file: "customs_report_sep_2024.pdf" },
//                 ].map((report) => (
//                   <div key={report.month} className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition">
//                     <div className="flex items-center gap-3">
//                       <FileText className="w-5 h-5 text-red-600" />
//                       <div>
//                         <p className="font-medium text-gray-800">{report.month}</p>
//                         <p className="text-xs text-gray-500">{report.file}</p>
//                       </div>
//                     </div>
//                     <button className="p-2 hover:bg-gray-100 rounded-lg transition">
//                       <Download className="w-5 h-5 text-amber-600" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Additional Reports */}
//           <div>
//             <h3 className="text-xl font-bold text-[#0B1E3A] mb-6">Specialized Reports</h3>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 {
//                   title: "Import/Export Analysis",
//                   description: "Comprehensive overview of import and export trends",
//                   icon: "📊",
//                 },
//                 {
//                   title: "Tariff & Duties Report",
//                   description: "Detailed breakdown of tariffs and duties by category",
//                   icon: "💰",
//                 },
//                 {
//                   title: "Country Trade Profile",
//                   description: "Trade statistics by country and region",
//                   icon: "🌍",
//                 },
//               ].map((report) => (
//                 <div key={report.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
//                   <div className="text-4xl mb-4">{report.icon}</div>
//                   <h4 className="font-bold text-gray-800 mb-2">{report.title}</h4>
//                   <p className="text-sm text-gray-600 mb-4">{report.description}</p>
//                   <button className="flex items-center gap-2 text-[#193C8D] font-bold hover:text-[#E7B947] transition">
//                     <Download className="w-4 h-4" />
//                     Download Report
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-[#0B1E3A] text-white">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-6">Need Custom Analysis?</h2>
//           <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
//             Our trade research team can provide customized reports, data analysis, and insights tailored to your specific needs.
//           </p>
//           <div className="flex flex-wrap gap-4 justify-center">
//             <button className="px-8 py-3 bg-[#E7B947] hover:bg-yellow-500 text-[#0B1E3A] font-bold rounded-lg transition">
//               Request Custom Report
//             </button>
//             <Link
//               href="/contact"
//               className="px-8 py-3 border-2 border-white hover:bg-white hover:text-[#0B1E3A] text-white font-bold rounded-lg transition"
//             >
//               Contact Us
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
