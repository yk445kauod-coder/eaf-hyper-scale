"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Globe, Shield, Zap, Activity } from 'lucide-react';

/**
 * Egytronic Nexus Dashboard v2.0
 * The premium command center for EAF 2.0 autonomous agents.
 */
export default function NexusDashboard() {
  const [logs, setLogs] = useState<{ id: number, text: string, type: 'system' | 'agent' | 'success' | 'error' }[]>([]);
  const [status, setStatus] = useState('ONLINE');
  const [activeAgents, setActiveAgents] = useState(1);
  const [throughput, setThroughput] = useState('15.4k/s');

  useEffect(() => {
    const initialLogs = [
      { id: 1, text: "EAF v2.0 Kernel Booting...", type: 'system' as const },
      { id: 2, text: "Handshaking with Cloudflare Edge...", type: 'system' as const },
      { id: 3, text: "Ollama Local Adapter: SYNCED (GGUF-v3)", type: 'success' as const },
      { id: 4, text: "Master Model: Egytronic_1.0 LOADED", type: 'agent' as const },
    ];
    setLogs(initialLogs);
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4 lg:p-8 flex flex-col gap-6">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:align-center border-b border-cyan-900 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">EGYTRONIC <span className="text-cyan-500">NEXUS</span></h1>
          <p className="text-xs text-cyan-700 uppercase tracking-widest">Hyper-Scale Agent Orchestration v2.0</p>
        </div>
        <div className="flex gap-6">
          <Stat icon={<Activity size={14}/>} label="STATUS" value={status} color="text-green-500" />
          <Stat icon={<Cpu size={14}/>} label="AGENTS" value={activeAgents.toString()} />
          <Stat icon={<Zap size={14}/>} label="LATENCY" value="38ms" />
          <Stat icon={<Globe size={14}/>} label="EDGE" value="CF-AMS-1" />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* LEFT COLUMN: ACTIVE PROCESSES */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg flex-1">
            <h2 className="text-sm font-bold border-b border-zinc-900 pb-2 mb-4 flex items-center gap-2">
              <Shield size={16} className="text-cyan-500"/> SECURITY CORE
            </h2>
            <ul className="text-xs flex flex-col gap-3">
              <li className="flex justify-between"><span>Sandbox Isolation</span> <span className="text-green-500">HIGH</span></li>
              <li className="flex justify-between"><span>Audit Log</span> <span className="text-cyan-600">ENCRYPTED</span></li>
              <li className="flex justify-between"><span>Secret Redaction</span> <span className="text-green-500">ACTIVE</span></li>
              <li className="flex justify-between"><span>Compliance Score</span> <span className="text-white">100/100</span></li>
            </ul>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg">
             <h2 className="text-sm font-bold border-b border-zinc-900 pb-2 mb-4">MASTER MODEL</h2>
             <div className="bg-cyan-950/20 border border-cyan-900/50 p-3 rounded">
               <p className="text-xs text-white font-bold mb-1">Egytronic_1.0</p>
               <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                 <div className="bg-cyan-500 h-full w-[94%] shadow-[0_0_8px_cyan]"></div>
               </div>
               <p className="text-[10px] mt-2 text-cyan-700 uppercase">Reasoning Efficiency: 94%</p>
             </div>
          </div>
        </section>

        {/* CENTER: TERMINAL LOGS */}
        <section className="lg:col-span-6 flex flex-col bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden">
          <div className="bg-zinc-900 px-4 py-2 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12}/> hyper-scale-terminal
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-sm flex flex-col gap-2">
            {logs.map(log => (
              <div key={log.id} className="flex gap-3">
                <span className="text-zinc-700">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className={
                  log.type === 'error' ? 'text-red-500' : 
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'agent' ? 'text-white italic' : 'text-cyan-500'
                }>
                  {log.type === 'agent' && '> '}
                  {log.text}
                </span>
              </div>
            ))}
            <div className="mt-4 flex gap-2 items-center">
              <span className="text-cyan-500">$</span>
              <input 
                type="text" 
                className="bg-transparent border-none outline-none flex-1 text-white placeholder-zinc-700"
                placeholder="Direct command to autonomous developer..."
              />
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: INFRASTRUCTURE */}
        <section className="lg:col-span-3 flex flex-col gap-4">
           <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg flex-1">
            <h2 className="text-sm font-bold border-b border-zinc-900 pb-2 mb-4">ACTIVE TOOLSET</h2>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 uppercase font-bold">
              <ToolBadge label="HyperDev" active />
              <ToolBadge label="Browser" active />
              <ToolBadge label="FileSystem" active />
              <ToolBadge label="GitHub" active />
              <ToolBadge label="Ollama" active />
              <ToolBadge label="DeviceBridge" active />
              <ToolBadge label="Wrangler" active />
              <ToolBadge label="MCP" />
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg">
            <h2 className="text-sm font-bold border-b border-zinc-900 pb-2 mb-4 italic">Throughput</h2>
            <p className="text-4xl font-black text-white">{throughput}</p>
            <p className="text-xs text-zinc-600 mt-1 uppercase">Requests / Second</p>
          </div>
        </section>
      </main>

      <footer className="flex justify-between items-center text-[10px] text-zinc-700 uppercase tracking-widest pt-4 border-t border-zinc-900">
        <p>© 2026 EGYTRONIC TECH</p>
        <p>Built for absolute autonomy</p>
        <p>v2.0.0-PRO</p>
      </footer>
    </div>
  );
}

function Stat({ icon, label, value, color = "text-cyan-400" }: { icon: any, label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
        {icon} {label}
      </span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

function ToolBadge({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <div className={`border p-2 rounded text-center transition-all ${
      active ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-zinc-900 bg-zinc-900/20 text-zinc-700'
    }`}>
      {label}
    </div>
  );
}
