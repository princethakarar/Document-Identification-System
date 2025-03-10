import { useState, useContext } from "react";
import "./App.css";
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
    <div className="flex flex-col items-center justify-center gap-2">
      {imageData && (
        <img
          src={imageData}
          alt="Uploaded Preview"
          className="mt-10 w-48 h-auto rounded-lg border border-gray-300 shadow-md"
        />
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
             file:rounded-lg file:border-0 file:text-sm file:font-semibold 
             file:bg-blue-600 file:text-white hover:file:bg-blue-700 
             cursor-pointer border" />
      {response && (
        <div
          className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: response }}
        ></div>
      )}
    </div>
  );
}

export default App;
