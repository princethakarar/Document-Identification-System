import { useState, useContext, useEffect } from "react";
import Sidebar from "./sidebar/sidebar";
import { Context } from "./context/Context";

function App() {
  const [imageData, setImageData] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(""); 
  const { onSent, response } = useContext(Context);
  const [prevPrompts, setPrevPrompts] = useState([]); // Store previous responses

  // Function to remove HTML tags for Sidebar display
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = async (e) => {
      let base64string = e.target.result.split(",")[1];
      setImageData(e.target.result);
      onSent(base64string, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Store response when a new one arrives
  useEffect(() => {
    if (response) {
      const cleanResponse = stripHtmlTags(response);
      setPrevPrompts((prev) => [{ text: cleanResponse, html: response, img: imageData }, ...prev.slice(0, 9)]);
      setSelectedResponse(response);
    }
  }, [response]);

  // Function to handle past document selection
  const handleSelectPrompt = (selectedPrompt) => {
    setImageData(selectedPrompt.img);
    setSelectedResponse(selectedPrompt.html);
  };

  return (
    <div className="flex w-full">
      <Sidebar prevPrompts={prevPrompts} onSelectPrompt={handleSelectPrompt} />
      <div className="flex flex-col min-h-screen w-full bg-gray-100">
        <header className="w-full bg-blue-600 text-white py-4 text-center text-xl font-semibold shadow-md">
          Document Identification & Recognition
        </header>
        <section className="bg-blue-50 py-10 px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Automate Your Document Processing</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Our AI-powered solution can automatically identify, classify, and recognize various document types
            like invoices, ID cards, certificates, and forms while ensuring data privacy and security.
          </p>
        </section>
        <main className="flex flex-col flex-grow items-center justify-center w-full max-w-screen-lg mx-auto px-4 py-8">
          {imageData && (
            <img
              src={imageData}
              alt="Uploaded Preview"
              className="mt-6 w-48 md:w-64 lg:w-80 h-auto rounded-lg border border-gray-300 shadow-md"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4 block w-fit px-6 py-3 text-sm font-semibold text-white 
              bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md 
              cursor-pointer border-2 border-transparent 
              transition-all duration-300 ease-in-out
              hover:from-blue-600 hover:to-blue-800 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          />

          {selectedResponse && (
            <div
              className="mt-4 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 text-sm leading-relaxed shadow-md w-full max-w-lg"
              dangerouslySetInnerHTML={{ __html: selectedResponse }}
            ></div>
          )}
        </main>

        <footer className="w-full bg-gray-800 text-white py-3 text-center text-sm">
          &copy; 2025 Document Recognition App | Built with React & Tailwind CSS
        </footer>
      </div>
    </div>
  );
}

export default App;
