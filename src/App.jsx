import { useState, useContext } from "react";
import "./App.css";
import Sidebar from "./sidebar/sidebar"
import { Context } from "./context/Context";

function App() {
  const [imageData, setImageData] = useState(null);
  const { onSent, response } = useContext(Context);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = async (e) => {
      let base64string = e.target.result.split(",")[1];
      setImageData(e.target.result); 

      // Send image to Gemini API
      onSent(base64string, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex w-full">
      <div>
        <Sidebar />
      </div>
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
          
          {/* File Upload Button */}
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

          {response && (
            <div
              className="mt-4 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 text-sm leading-relaxed shadow-md w-full max-w-lg"
              dangerouslySetInnerHTML={{ __html: response }}
            ></div>
          )}
        </main>

        <section className="bg-white py-10 px-6">
          <h2 className="text-center text-2xl font-semibold text-gray-800">Features</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6 max-w-5xl mx-auto">
            <div className="p-4 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-900">AI-Based Recognition</h3>
              <p className="text-gray-700 text-sm">Automatically classify and extract data from documents.</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-900">High Accuracy</h3>
              <p className="text-gray-700 text-sm">Achieves over 90% accuracy in document recognition.</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-900">Supports Multiple Formats</h3>
              <p className="text-gray-700 text-sm">Processes invoices, ID cards, certificates, and more.</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-900">Secure & Private</h3>
              <p className="text-gray-700 text-sm">Ensures data privacy and meets security standards.</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-900">Fast Processing</h3>
              <p className="text-gray-700 text-sm">Reduces manual effort and speeds up document handling.</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-900">User-Friendly</h3>
              <p className="text-gray-700 text-sm">Designed for ease of use for citizens and organizations.</p>
            </div>
          </div>
        </section>

        <footer className="w-full bg-gray-800 text-white py-3 text-center text-sm">
          &copy; 2025 Document Recognition App | Built with React & Tailwind CSS
        </footer>
      </div>
    </div>
  );
}

export default App;
