"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  X,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/shared/Navbar";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
        )}
        <p className="text-sm text-zinc-900 dark:text-zinc-100 flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function LeadSearchApp() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "All",
    dateFrom: "",
    dateTo: "",
  });
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchLeads = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setLeads(data.leads || data || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setToast({ message: "Failed to fetch leads", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showNotification = (message, type = "success") => {
    setToast({ message, type });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotification("Phone number copied!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Phone",
      "City",
      "Called Date",
      "Found Date",
      "Link",
    ];
    const rows = filteredLeads.map((r) => [
      r.first_name || "",
      r.last_name || "",
      r.phone_number || "",
      r.city || "",
      r.called_date || "",
      r.found_date || "",
      r.link || "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    showNotification("CSV exported successfully", "success");
  };

  const clearFilters = () => {
    setFilters({ city: "All", dateFrom: "", dateTo: "" });
    setSearchTerm("");
    showNotification("Filters cleared", "success");
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_number?.includes(searchTerm);

    const matchesCity = filters.city === "All" || lead.city === filters.city;

    return matchesSearch && matchesCity;
  });

  const cities = [
    "All",
    ...new Set(leads.map((lead) => lead.city).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 md:py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, phone, or notes..."
                  className="w-full h-10 pl-10 pr-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-10 px-4 cursor-pointer rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    showFilters
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <button
                  onClick={exportToCSV}
                  className="h-10 px-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-md border border-zinc-200 dark:border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      City
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Date From
                    </label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) =>
                        setFilters({ ...filters, dateFrom: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Date To
                    </label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) =>
                        setFilters({ ...filters, dateTo: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
                    />
                  </div>
                </div>
                <button
                  onClick={clearFilters}
                  className="mt-3 h-9 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                    Called Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                    Found Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                        Loading leads...
                      </p>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        No leads found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => (
                    <tr
                      key={lead.id || index}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {`${lead.first_name || ""} ${lead.last_name || ""}`}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded inline-block">
                          {lead.phone_number}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400 hidden md:table-cell">
                        {lead.called_date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400 hidden lg:table-cell">
                        {lead.found_date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              copyToClipboard(lead.phone_number, lead.id)
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Copy phone"
                          >
                            {copiedId === lead.id ? (
                              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          {lead.link && (
                            <button
                              onClick={() => window.open(lead.link, "_blank")}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Open link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
