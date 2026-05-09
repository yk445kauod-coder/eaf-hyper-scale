// Helper to download files
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Convert HTML content to plain text
function extractText(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent;
}

// Export Handlers
export function setupExports(editorElement) {
    document.getElementById("export-txt").addEventListener("click", (e) => {
        e.preventDefault();
        const text = extractText(editorElement.innerHTML);
        downloadFile("educreate-document.txt", text, "text/plain");
    });

    document.getElementById("export-md").addEventListener("click", (e) => {
        e.preventDefault();
        // A simple HTML to MD logic (For complex, a library is better, but this handles basic SaaS needs)
        let md = editorElement.innerHTML
            .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
            .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
            .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n")
            .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
            .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
            .replace(/<.*?>/g, ""); // Strip remaining tags
        downloadFile("educreate-document.md", md, "text/markdown");
    });

    document.getElementById("export-json").addEventListener("click", (e) => {
        e.preventDefault();
        const data = {
            generatedAt: new Date().toISOString(),
            contentHTML: editorElement.innerHTML,
            contentText: extractText(editorElement.innerHTML)
        };
        downloadFile("educreate-document.json", JSON.stringify(data, null, 2), "application/json");
    });

    // DOCX Export (Simplified hack using HTML Mime for MS Word support)
    document.getElementById("export-docx").addEventListener("click", (e) => {
        e.preventDefault();
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + editorElement.innerHTML + footer;
        downloadFile("educreate-document.doc", sourceHTML, "application/msword");
    });

    // PDF Export via html2pdf CDN
    document.getElementById("export-pdf").addEventListener("click", (e) => {
        e.preventDefault();
        const opt = {
            margin:       10,
            filename:     'educreate-document.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        // Remove contenteditable temporarily for cleaner print
        editorElement.removeAttribute("contenteditable");
        html2pdf().set(opt).from(editorElement).save().then(() => {
            editorElement.setAttribute("contenteditable", "true");
        });
    });

    // PNG Poster via html2canvas
    document.getElementById("export-png").addEventListener("click", (e) => {
        e.preventDefault();
        editorElement.removeAttribute("contenteditable");
        html2canvas(editorElement, { useCORS: true, scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            downloadFile("educreate-poster.png", imgData, "image/png"); // Note: DataURL needs to be converted or just use standard approach
            // A better way for DataURI download:
            const a = document.createElement("a");
            a.href = imgData;
            a.download = "educreate-poster.png";
            a.click();
            editorElement.setAttribute("contenteditable", "true");
        });
    });
}
