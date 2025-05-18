import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBFfOMVFqC3zh70lH9-tBlQ5FHM5cGpMVI"; 
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(base64string, mimeType) {
    try {
        const prompt = `Which document is this and give numerical details written in the document. and behave professionaly don't print unneccessary text(like, here is numerical details and all or numerical details are) i mean to say that you don't need to print it is numerical details we can understand what it is. give details in bold and numerical details in normal details should be accurate. in the starting 10 character of response should contain document name. last character is not coming in each field so scan it well it should be accurate`;

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
        
        let responseArray = response.split("**").map(item => item.trim());
        let newArray = "";

        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newArray +=  responseArray[i].slice(0, );
            } else {
                newArray += "<br><b>" + responseArray[i] + "</b>"; 
            }
        }

        return newArray; 
    } catch (error) {
        console.error("Error processing image:", error);
        return "Failed to get response.";
    }
}

export default run;
