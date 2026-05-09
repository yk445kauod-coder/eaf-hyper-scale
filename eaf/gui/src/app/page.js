"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
function Home() {
    const [input, setInput] = (0, react_1.useState)('');
    const [logs, setLogs] = (0, react_1.useState)([
        { type: 'system', text: 'EAF System v1.0.0 Booting...' },
        { type: 'system', text: 'All systems nominal.' },
    ]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        setLogs([...logs, { type: 'user', text: input }]);
        // Simulate agent response
        setTimeout(() => {
            setLogs(prev => [...prev, { type: 'agent', text: `Processing: ${input}... (Local Agent Mode Active)` }]);
        }, 1000);
        setInput('');
    };
    return ((0, jsx_runtime_1.jsx)("main", { className: "min-h-screen p-8 bg-[#212529]", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("header", { className: "mb-8 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl text-yellow-400 mb-2", children: "EAF" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Egytronic Agents Framework" })] }), (0, jsx_runtime_1.jsxs)("section", { className: "nes-container is-dark with-title mb-8", children: [(0, jsx_runtime_1.jsx)("p", { className: "title", children: "Control Console" }), (0, jsx_runtime_1.jsx)("div", { className: "h-96 overflow-y-auto mb-4 p-4 bg-black border-2 border-gray-700", children: logs.map((log, i) => ((0, jsx_runtime_1.jsxs)("div", { className: `mb-2 text-xs ${log.type === 'user' ? 'text-cyan-400' :
                                    log.type === 'agent' ? 'text-green-400' : 'text-yellow-400'}`, children: [(0, jsx_runtime_1.jsxs)("span", { className: "mr-2", children: ["[", log.type.toUpperCase(), "]"] }), log.text] }, i))) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", className: "nes-input is-dark flex-grow", placeholder: "Enter command...", value: input, onChange: (e) => setInput(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "nes-btn is-primary", children: "Send" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "nes-container is-dark with-title", children: [(0, jsx_runtime_1.jsx)("p", { className: "title", children: "System Status" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["LLM: ", (0, jsx_runtime_1.jsx)("span", { className: "text-green-400", children: "Ollama (Local)" })] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Memory: ", (0, jsx_runtime_1.jsx)("span", { className: "text-green-400", children: "Stable" })] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Tools: ", (0, jsx_runtime_1.jsx)("span", { className: "text-green-400", children: "3 Active" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "nes-container is-dark with-title", children: [(0, jsx_runtime_1.jsx)("p", { className: "title", children: "Active Tools" }), (0, jsx_runtime_1.jsxs)("ul", { className: "nes-list is-disc text-xs", children: [(0, jsx_runtime_1.jsx)("li", { children: "FileSystem" }), (0, jsx_runtime_1.jsx)("li", { children: "Terminal" }), (0, jsx_runtime_1.jsx)("li", { children: "Termux API" })] })] })] })] }) }));
}
//# sourceMappingURL=page.js.map