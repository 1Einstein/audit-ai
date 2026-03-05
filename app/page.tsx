'use client'; // Moves the request to the user's browser to bypass data center blocks

import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, BarChart3, Users, Zap, Activity } from "lucide-react";

export default function AuditPage() {
  const [targetUser, setTargetUser] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const API_KEY = "3uMNn7ShBUg8w6TQqrv8ZE7LDUN2";

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    setLoading(true);
    setErrorDetail(null);
    setData(null);

    try {
      // Fetching directly from the browser (Client-side)
      const res = await fetch(`https://api.scrapecreators.com/v2/instagram/info?handle=${targetUser.trim()}`, {
        method: 'GET',
        headers: { 
          'x-api-key': API_KEY,
          'Accept': 'application/json'
        }
      });

      const result = await res.json();
      if (!res.ok) {
        setErrorDetail(`Status ${res.status}: ${result.message || "Invalid Request"}`);
      } else {
        setData(result);
      }
    } catch (e) {
      setErrorDetail("Connection Failed: Ensure you have an active internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const user = data?.data?.user;
  const followers = user?.edge_followed_by?.count || 0;
  const posts = user?.edge_owner_to_timeline_media?.count || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      <nav className="p-8 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black italic uppercase tracking-tighter">
          <ShieldCheck className="text-green-500 w-6 h-6" /> Audit.AI
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-20 px-6">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8]">
            Intelligence <br/><span className="text-green-500">Unfiltered.</span>
          </h1>
          <p className="text-zinc-500 text-lg">Analyze any creator's authenticity instantly.</p>
        </div>

        <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto mb-20 text-center">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-green-500/50 shadow-2xl mb-4">
            <input 
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="instagram_handle" 
              className="w-full bg-transparent py-4 px-6 focus:outline-none text-white text-lg" 
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-white text-black font-bold px-10 rounded-xl hover:bg-zinc
