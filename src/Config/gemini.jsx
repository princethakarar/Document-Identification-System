import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBFfOMVFqC3zh70lH9-tBlQ5FHM5cGpMVI"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(base64string, mimeType) {
    try {
        const prompt = "Which document is this and give numerical details written in the document.";

        const result = await model.generateContent([
            { text: prompt },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64string,
                },
            },
        ]);

        const response = await result.response.text();
        
        // Split and format response
        let responseArray = response.split("**").map(item => item.trim());;
        let newArray = "";

        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newArray +=  responseArray[i].slice(0, -1);
            } else {
                newArray += "<br><b>" + responseArray[i] + "</b>"; 
            }
        }

        return newArray; // Returning formatted response
    } catch (error) {
        console.error("Error processing image:", error);
        return "Failed to get response.";
    }
}

export default run;
