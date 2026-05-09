// Application Orchestrator - Premium SaaS Level
import { initAuth, saveDocument, getUserDocuments, updateDocument, saveDataset } from './firebase-service.js';
import { AIEngine } from './ai-engine.js';
import { ExportService } from './export-service.js';

class EducreateApp {
    constructor() {
        this.state = {
            user: null,
            currentDocId: null,
            isGenerating: false,
            lastSavedContent: ''
        };
        this.autoSaveTimer = null;
        this.init();
    }

    async init() {
        this.cacheDOM();
        this.bindEvents();
        
        try {
            this.updateStatus("جاري تهيئة النظام...", false);
            this.state.user = await initAuth();
            this.updateStatus(`متصل (UID: ${this.state.user.uid.substring(0, 5)})`, true);
            await this.loadHistory();
        } catch (error) {
            this.updateStatus("خطأ حيوي: فقدان الاتصال", false);
            this.showToast("لا يمكن الوصول لقاعدة البيانات.", "error");
        }
    }

    cacheDOM() {
        this.els = {
            topic: document.getElementById('topic'),
            type: document.getElementById('type'),
            lang: document.getElementById('lang'),
            dataset: document.getElementById('dataset'),
            theme: document.getElementById('theme'),
            generateBtn: document.getElementById('generate-btn'),
            btnText: document.getElementById('btn-text'),
            loaderSection: document.getElementById('loader-section'),
            editor: document.getElementById('editor'),
            outputSection: document.getElementById('output-section'),
            historyList: document.getElementById('history-list'),
            sysStatus: document.getElementById('sys-status'),
            sysIndicator: document.getElementById('sys-indicator'),
            saveIndicator: document.getElementById('save-indicator'),
            exportPdfBtn: document.getElementById('export-pdf'),
            exportTxtBtn: document.getElementById('export-txt'),
            copyBtn: document.getElementById('copy-btn')
        };
    }

    bindEvents() {
        this.els.generateBtn.addEventListener('click', () => this.handleGenerate());
        this.els.editor.addEventListener('input', () => this.debouncedAutoSave());
        this.els.theme.addEventListener('change', (e) => this.applyTheme(e.target.value));
        
        // Export & Copy Handlers
        this.els.exportPdfBtn.addEventListener('click', () => ExportService.handleExport('pdf', this.els.editor.innerHTML, {topic: this.els.topic.value}));
        this.els.exportTxtBtn.addEventListener('click', () => ExportService.handleExport('txt', this.els.editor.innerHTML, {topic: this.els.topic.value}));
        this.els.copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    updateStatus(message, isConnected) {
        this.els.sysStatus.textContent = message;
        if(isConnected) {
            this.els.sysIndicator.classList.add('connected');
        } else {
            this.els.sysIndicator.classList.remove('connected');
        }
    }

    setLoading(isLoading) {
        this.state.isGenerating = isLoading;
        this.els.generateBtn.disabled = isLoading;
        
        if (isLoading) {
            this.els.btnText.textContent = "جاري التوليد...";
            this.els.loaderSection.style.display = 'flex';
            this.els.outputSection.classList.remove('visible');
            this.els.editor.innerHTML = ''; // Clear previous
        } else {
            this.els.btnText.textContent = "توليد المحتوى بذكاء ⚡";
            this.els.loaderSection.style.display = 'none';
        }
    }

    async handleGenerate() {
        if (this.state.isGenerating) return;

        const params = {
            topic: this.els.topic.value.trim(),
            type: this.els.type.value,
            language: this.els.lang.value,
            dataset: this.els.dataset.value.trim()
        };

        if (!params.topic) {
            this.showToast("يرجى إدخال موضوع الدرس أولاً.", "error");
            this.els.topic.focus();
            return;
        }

        this.setLoading(true);

        try {
            if (params.dataset.length > 50) {
                await saveDataset(this.state.user.uid, params.dataset, "user_input");
            }

            const rawHtml = await AIEngine.generate(params);
            
            // Switch UI before typing effect
            this.setLoading(false);
            this.els.outputSection.classList.add('visible');
            this.applyTheme(this.els.theme.value);
            
            // Magic Typing Effect
            await this.typeWriterEffect(rawHtml);
            
            this.state.lastSavedContent = this.els.editor.innerHTML;
            
            const docId = await saveDocument({
                uid: this.state.user.uid,
                ...params,
                output: this.state.lastSavedContent,
                theme: this.els.theme.value
            });
            
            this.state.currentDocId = docId;
            this.showToast("تم توليد الدرس بنجاح!", "success");
            await this.loadHistory();

        } catch (error) {
            this.setLoading(false);
            this.showToast(`حدث خطأ: ${error.message}`, "error");
        }
    }

    async typeWriterEffect(htmlString) {
        return new Promise(resolve => {
            this.els.editor.innerHTML = '';
            this.els.editor.classList.add('typing-cursor');
            
            // For complex HTML, simple character typing breaks tags.
            // We'll simulate it by injecting block by block quickly, or fading them in.
            // For true premium feel, we fade in child nodes sequentially.
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;
            const nodes = Array.from(tempDiv.childNodes);
            
            let i = 0;
            const appendNode = () => {
                if (i < nodes.length) {
                    const node = nodes[i].cloneNode(true);
                    if (node.nodeType === 1) {
                        node.style.opacity = '0';
                        node.style.transform = 'translateY(10px)';
                        node.style.transition = 'all 0.4s ease';
                        this.els.editor.appendChild(node);
                        
                        // Trigger reflow
                        void node.offsetWidth;
                        
                        node.style.opacity = '1';
                        node.style.transform = 'translateY(0)';
                    } else {
                        this.els.editor.appendChild(node);
                    }
                    i++;
                    setTimeout(appendNode, 50); // Speed of blocks appearing
                } else {
                    this.els.editor.classList.remove('typing-cursor');
                    resolve();
                }
            };
            
            // Scroll to output
            this.els.outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(appendNode, 300);
        });
    }

    debouncedAutoSave() {
        if (!this.state.currentDocId) return;
        
        clearTimeout(this.autoSaveTimer);
        this.els.saveIndicator.classList.add('show');
        this.els.saveIndicator.innerHTML = '<span class="pulse-dot"></span> جاري الحفظ...';

        this.autoSaveTimer = setTimeout(async () => {
            const currentHTML = this.els.editor.innerHTML;
            if (currentHTML === this.state.lastSavedContent) {
                this.els.saveIndicator.classList.remove('show');
                return;
            }

            try {
                await updateDocument(this.state.currentDocId, { output: currentHTML });
                this.state.lastSavedContent = currentHTML;
                this.els.saveIndicator.innerHTML = '<span class="pulse-dot" style="background:var(--success)"></span> تم الحفظ ✓';
                setTimeout(() => {
                    this.els.saveIndicator.classList.remove('show');
                }, 2000);
            } catch (e) {
                this.els.saveIndicator.innerHTML = '⚠️ فشل الحفظ';
            }
        }, 1500);
    }

    async loadHistory() {
        try {
            const docs = await getUserDocuments(this.state.user.uid);
            this.els.historyList.innerHTML = '';
            
            if (docs.length === 0) {
                this.els.historyList.innerHTML = '<div class="history-item" style="opacity:0.5"><p>لا توجد مستندات بعد</p></div>';
                return;
            }

            docs.forEach(doc => {
                const div = document.createElement('div');
                div.className = `history-item ${doc.id === this.state.currentDocId ? 'active' : ''}`;
                
                const date = doc.updatedAt ? new Date(doc.updatedAt.toDate()).toLocaleDateString('ar-EG') : 'الآن';
                
                div.innerHTML = `
                    <h4>${doc.topic}</h4>
                    <p><span>${doc.type}</span> <span>${date}</span></p>
                `;
                
                div.addEventListener('click', () => this.loadDocument(doc));
                this.els.historyList.appendChild(div);
            });
        } catch (error) {
            console.error("History Error:", error);
        }
    }

    loadDocument(docData) {
        this.state.currentDocId = docData.id;
        this.els.editor.innerHTML = docData.output || '';
        this.state.lastSavedContent = docData.output;
        this.els.topic.value = docData.topic || '';
        if(docData.theme) {
            this.els.theme.value = docData.theme;
            this.applyTheme(docData.theme);
        }
        
        this.els.outputSection.classList.add('visible');
        this.loadHistory(); // Refresh to set active class
        this.els.outputSection.scrollIntoView({ behavior: 'smooth' });
    }

    applyTheme(themeName) {
        this.els.editor.className = `content-editable theme-${themeName}`;
        // Update body background slightly based on theme for full immersion
        if(themeName === 'minimal') {
            document.body.style.background = '#f1f5f9';
        } else if (themeName === 'academic') {
            document.body.style.background = '#e2e8f0';
        } else {
            document.body.style.background = ''; // reset to CSS default
        }
    }

    async copyToClipboard() {
        try {
            const textToCopy = this.els.editor.innerText;
            await navigator.clipboard.writeText(textToCopy);
            this.showToast("تم النسخ إلى الحافظة!", "success");
        } catch (err) {
            this.showToast("فشل النسخ.", "error");
        }
    }

    showToast(message, type) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? '✨' : '⚠️';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.educreate = new EducreateApp();
});
