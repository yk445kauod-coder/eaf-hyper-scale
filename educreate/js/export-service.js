// Production-Grade Export Service
export class ExportService {
    static downloadJSON(filename, dataObj) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    static downloadTXT(filename, htmlContent) {
        // Strip HTML tags for basic TXT
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        
        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename + ".txt");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    static exportPDF() {
        // Utilizing native print which is heavily styled in CSS for production PDFs
        // This is often more reliable than client-side JS PDF generators for complex layouts + Arabic
        window.print();
    }

    static handleExport(type, content, metadata = {}) {
        const safeTitle = (metadata.topic || 'Educreate_Document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeTitle}_${new Date().getTime()}`;

        switch(type) {
            case 'json':
                this.downloadJSON(filename, {
                    metadata,
                    content_html: content,
                    generated_at: new Date().toISOString()
                });
                break;
            case 'txt':
                this.downloadTXT(filename, content);
                break;
            case 'pdf':
            case 'print':
                this.exportPDF();
                break;
            default:
                console.warn(`Export type ${type} not fully supported yet.`);
        }
    }
}