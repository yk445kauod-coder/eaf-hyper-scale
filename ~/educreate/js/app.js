import { initAuth, saveDocument, saveDataset } from "./firebase-config.js";
import { generateContent } from "./ai-service.js";
import { setupExports } from "./export-service.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Firebase Auth
    initAuth("auth-status");

    // 2. Setup DOM Elements
    const form = document.getElementById("generator-form");
    const editor = document.getElementById("content-editor");
    const overlay = document.getElementById("loading-overlay");
    const themeSelector = document.getElementById("theme-selector");
    const dirToggleBtn = document.getElementById("toggle-dir");
    const htmlElement = document.documentElement;

    // 3. Handle Form Submission (Generation)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Gather inputs
        const topic = document.getElementById("topic").value;
        const type = document.getElementById("type").value;
        const language = document.getElementById("language").value;
        const dataset = document.getElementById("dataset").value;
        const currentTheme = themeSelector.value;

        // UI State: Loading
        overlay.classList.remove("hidden");

        try {
            // Generate AI Content
            const aiHTML = await generateContent({ topic, type, language, dataset });
            
            // Render in Editor
            editor.innerHTML = aiHTML;

            // Set Document Direction based on Language choice
            if (language === "Arabic") {
                htmlElement.setAttribute("dir", "rtl");
            } else {
                htmlElement.setAttribute("dir", "ltr");
            }

            // Save to Firebase Background
            if (dataset.trim().length > 0) {
                await saveDataset(dataset, "text");
            }
            
            await saveDocument({
                topic,
                type,
                language,
                dataset: dataset || null,
                output: aiHTML,
                theme: currentTheme
            });

        } catch (error) {
            console.error(error);
            alert("حدث خطأ في النظام. راجع الـ Console.");
        } finally {
            // Restore UI
            overlay.classList.add("hidden");
        }
    });

    // 4. Handle Theming
    themeSelector.addEventListener("change", (e) => {
        // Remove existing theme classes
        htmlElement.classList.remove("theme-modern", "theme-minimal", "theme-academic", "theme-visual");
        // Add selected
        htmlElement.classList.add(e.target.value);
    });

    // 5. Handle Direction Toggle
    dirToggleBtn.addEventListener("click", () => {
        const currentDir = htmlElement.getAttribute("dir");
        htmlElement.setAttribute("dir", currentDir === "rtl" ? "ltr" : "rtl");
    });

    // 6. Initialize Export Handlers
    setupExports(editor);
});
