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
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageData && <img src={imageData} alt="Uploaded Preview" width="200" />}
      
      {/* Displaying formatted response */}
      <p dangerouslySetInnerHTML={{ __html: response }}></p>
    </div>
  );
}

export default App;
