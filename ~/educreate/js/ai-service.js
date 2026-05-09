const HF_TOKEN = "HF_TOKEN_PLACEHOLDER";
// Using Mistral/Llama for good structural output. Corsproxy helps ensure it passes strict browser CORS policies.
// The proxy is used here to bypass CORS issues from strict browsers, but direct API is the fallback.
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

export async function generateContent(params) {
    const { topic, type, language, dataset } = params;
    
    const prompt = buildPrompt(topic, type, language, dataset);
    
    try {
        // Using standard fetch, HF usually handles CORS for POST if auth is correct.
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 1500,
                    temperature: 0.7,
                    return_full_text: false,
                    top_p: 0.9
                }
            })
        });

        if (!response.ok) {
            // Fallback via CORS proxy if direct fails
            const fallbackResponse = await fetch(`https://corsproxy.io/?${encodeURIComponent(MODEL_URL)}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1500, return_full_text: false } })
            });
            if (!fallbackResponse.ok) throw new Error("CORS Proxy Fallback Failed");
            const data = await fallbackResponse.json();
            return processResponse(data, topic, language);
        }

        const data = await response.json();
        return processResponse(data, topic, language);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return `<div class="error">حدث خطأ أثناء التوليد. الرجاء المحاولة مرة أخرى لاحقاً. <br> التفاصل: ${error.message}</div>`;
    }
}

function buildPrompt(topic, type, language, dataset) {
    const langInstruction = language === "Arabic" ? "Respond ONLY in professional Arabic language. استخدم لغة عربية فصحى واضحة." : "Respond ONLY in professional English.";
    
    let typeInstruction = "";
    switch(type) {
        case "lesson": typeInstruction = "Write a comprehensive educational lesson. Include an introduction, main body with subtitles, and a conclusion."; break;
        case "summary": typeInstruction = "Write a concise, bullet-point summary highlighting the key facts."; break;
        case "quiz": typeInstruction = "Create a multiple-choice quiz with 5 questions, followed by the answer key at the bottom."; break;
        case "worksheet": typeInstruction = "Create an interactive worksheet with fill-in-the-blanks, true/false questions, and short answer prompts."; break;
        case "poster": typeInstruction = "Write visually appealing, short, punchy facts suitable for an educational poster."; break;
    }

    let datasetInstruction = dataset ? `Base your response STRICTLY on the following reference material:\n--- REFERENCE ---\n${dataset}\n--- END REFERENCE ---\n` : "";

    // Instruction format suitable for Mistral/Llama
    return `[INST] You are an expert AI educational assistant.
${langInstruction}
Topic: ${topic}
Task: ${typeInstruction}
Format the output in clean HTML (use <h2>, <h3>, <p>, <ul>, <li>, <strong>). Do NOT wrap the HTML in markdown code blocks (\`\`\`html). Just return the raw HTML tags.
${datasetInstruction}
[/INST]`;
}

function processResponse(data, topic, language) {
    let generatedHTML = "";
    if (Array.isArray(data) && data[0].generated_text) {
        generatedHTML = data[0].generated_text;
    } else {
        generatedHTML = "<p>لم يتم توليد أي محتوى صحيح.</p>";
    }

    // Clean markdown blocks if AI ignored instructions
    generatedHTML = generatedHTML.replace(/```html/gi, "").replace(/```/g, "").trim();

    // Auto-generate AI Image via Pollinations based on the topic
    // Using English translation trick for better image results
    const imagePrompt = `Educational illustration about ${encodeURIComponent(topic)}, clear, high quality, vector art`;
    const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=800&height=400&nologo=true`;
    
    const imageHTML = `<img src="${imageUrl}" alt="${topic} Illustration" class="generated-image" onerror="this.style.display='none'">`;

    return `
        <h1>${topic}</h1>
        ${imageHTML}
        <div class="generated-text">
            ${generatedHTML}
        </div>
    `;
}
