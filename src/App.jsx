import { useState, useContext, useEffect } from "react";
import "./App.css";
import Sidebar from "./sidebar/sidebar";
import { Context } from "./context/Context";

function App() {
  const [imageData, setImageData] = useState(null);
  const { onSent, response } = useContext(Context);
  const [responseText, setResponseText] = useState(null);
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [file, setFile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isHistorySelected, setIsHistorySelected] = useState(false); // NEW: Track history selection

  // Function to remove HTML tags from response text
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Handle file upload for image processing
  const handleImageChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    let reader = new FileReader();
    reader.onload = async (e) => {
      setImageData(e.target.result);
      setShowInfo(false);
      setIsHistorySelected(false); // Reset history flag
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Confirm & Submit button action
  const handleSubmit = () => {
    if (imageData && file) {
      let base64string = imageData.split(",")[1];
      onSent(base64string, file.type);
      setIsConfirmed(true);
    }
  };

  // Handle response updates & store in history
  useEffect(() => {
    if (response) {
      setResponseText(response);
      const cleanResponse = stripHtmlTags(response);
      setPrevPrompts((prev) => [{ text: cleanResponse, image: imageData, fileName: file?.name }, ...prev]);
    }
  }, [response]);

  // Function to reset the chat but keep the sidebar history
  const handleNewChat = () => {
    setResponseText(null);
    setImageData(null);
    setFile(null);
    setIsConfirmed(false);
    setShowInfo(true);
    setIsHistorySelected(false); // Reset history flag
  };

  return (
    <div className="flex w-full">
      <Sidebar 
        prevPrompts={prevPrompts} 
        onSelectPrompt={(item) => {
          setResponseText(item.text);
          setImageData(item.image);
          setFile({ name: item.fileName });
          setShowInfo(false);
          setIsConfirmed(true); // Mark it as confirmed (skip submit button)
          setIsHistorySelected(true); // NEW: Mark history selection
        }} 
        onNewChat={handleNewChat} 
      />

      <div className="flex flex-col min-h-screen w-full bg-gray-100">
        <header className="w-full bg-blue-600 text-white py-4 text-center text-xl font-semibold shadow-md">
          Document Identification & Recognition
        </header>

        {showInfo && (
          <section className="bg-blue-50 py-10 px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Automate Your Document Processing</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Our AI-powered solution can identify, classify, and recognize various document types like invoices, ID cards, certificates, and forms while ensuring data privacy and security.
            </p>
          </section>
        )}

        <main className="flex flex-col flex-grow items-center justify-center w-full max-w-screen-lg mx-auto px-4 py-8">
          {/* Image Preview (Always Shows After Upload) */}
          {imageData && (
            <div className="mt-6 flex flex-col items-center">
              <img
                src={imageData}
                alt="Uploaded Preview"
                className="w-48 md:w-64 lg:w-80 h-auto rounded-lg border border-gray-300 shadow-md"
              />
              <p className="mt-2 text-gray-600 text-sm">{file?.name}</p>
            </div>
          )}

          {/* Upload File Button */}
{!imageData ? (
  <label className="mt-4 flex flex-col items-center justify-center w-fit px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md cursor-pointer border-2 border-transparent transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
    <span className="flex items-center space-x-2">
      <span>Choose File</span>
    </span>
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
  </label>
) : (
  !isConfirmed && !isHistorySelected && ( // Hide submit button if history is selected
    <button
      onClick={handleSubmit}
      className="mt-4 px-6 py-3 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 ease-in-out cursor-pointer hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
    >
      Confirm & Submit
    </button>
  )
)}


          {/* Response Display (Only Shows After Confirm & Submit or History Selection) */}
          {(isConfirmed || isHistorySelected) && responseText && (
            <div
              className="mt-4 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 text-sm leading-relaxed shadow-md w-full max-w-lg"
              dangerouslySetInnerHTML={{ __html: responseText }}
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
