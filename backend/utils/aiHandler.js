const { GoogleGenerativeAI } = require("@google/generative-ai");

// Check karein ki key aa rahi hai ya nahi
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY missing in .env file!");
}

const genAI = new GoogleGenerativeAI(apiKey);

const analyzeImage = async (imageBuffer) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/jpeg",
            },
        };

       const prompt = "Analyze this image. If it's a pothole, road damage, or garbage, return a JSON object with: 1. 'category' (e.g. Road Damage), 2. 'priority' (High/Medium/Low), 3. 'description' (A short 1-sentence explanation of what is seen). Return ONLY the JSON.";

        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();

        // JSON extract karein
        const jsonMatch = text.match(/\{.*\}/s);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { category: "General", priority: "Low" };

    } catch (error) {
        console.error("❌ AI Error:", error.message);
        return { category: "Error", priority: "Low", details: error.message };
    }
};

module.exports = analyzeImage;