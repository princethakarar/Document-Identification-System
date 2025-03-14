import { useState, useContext, useEffect } from "react";
import "./App.css";
import Sidebar from "./sidebar/sidebar";
import { Context } from "./context/Context";
import { databasesHack, storageHack, clientHack } from "./Config/appwrite.js";

function App() {
  const [imageData, setImageData] = useState(null);
  const { onSent, response, setResponse } = useContext(Context);
  const [responseText, setResponseText] = useState(null);
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [file, setFile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [imageURI, setImageURI] = useState("");

  async function prevPromtFetch(){
    try{
      let resp = await databasesHack.listDocuments('677305ac00095c78d53e','67cf3c69000832926f29')
          .then(ob => setPrevPrompts(ob.documents.reverse()))
          .catch(e => console.log(e));
    }catch(e){
        console.log(e);
    }
  }
  useEffect(() => {
    prevPromtFetch();
  }, []); 


  //function to upload file in appwrite bucket and generate image url
  const uploadFile = async (file) => {
    try {
        const responsee = await storageHack.createFile(
            "67cf439a001a12c434ce",
            "unique()",
            file
        );
        console.log("File uploaded successfully:", responsee);
        const url = `https://cloud.appwrite.io/v1/storage/buckets/67cf439a001a12c434ce/files/${responsee.$id}/view?project=677301de002106afb13b`;
        setImageURI(url);
        return url;
    } catch (error) {
        console.error("Upload failed:", error);
        return "";
    }
  };

  // function to upload gemini res and image url in appwrite
  async function uploadResponse(ress, urll){
    try{
      let upRes = await databasesHack.createDocument(
        '677305ac00095c78d53e',
        '67cf3c69000832926f29',
        'unique()',
        {
          'res': ress,
          'imageURI': urll
        }
      );
      console.log('res uploaded successfully',`Unique ID is ${upRes.$id}`);
      return upRes.$id
    } catch(e) {
      console.log('error occurs when uploading res', e);
      return ""
    }
  }

  // Function to strip HTML tags for storing raw text in the sidebar
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Handle file upload
  const handleImageChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    let reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target.result);
      setShowInfo(false);
      setIsHistorySelected(false);
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Confirm & Submit button action
  const handleSubmit = async () => {

    if (imageData && file) {
      // first upload image and generate image URL
      const imageUrl = await uploadFile(file);
      
      // Process the image data
      let base64string = imageData.split(",")[1];
      onSent(base64string, file.type);
      setIsConfirmed(true);
      
      // Store the image URL
      setImageURI(imageUrl);
    }
  };

  // upload response and update state when new respone generates
  useEffect(() => {
    setResponseText(response);
    if (response && imageURI) {

      // store image url and gemini response in appwrite
      let id = uploadResponse(response, imageURI);

    }
  }, [response, imageURI]);

  // Handle selecting a previous prompt
  const handleSelectPrompt = (item) => {
    setResponseText(item.res);
    setImageData(item.imageURI);
    setFile({ name: "" });
    setShowInfo(false);
    setIsConfirmed(true);
    setIsHistorySelected(true);
    setShowLoaading(true)
  };

  // Reset state for handle new chat
  const handleNewChat = () => {
    setResponseText(null);
    setImageData(null);
    setFile(null);
    setIsConfirmed(false);
    setShowInfo(true);
    setIsHistorySelected(false);
    setImageURI("");
    setResponse("")
  };

  useEffect(()=>{
    const channnel = `databases.${"677305ac00095c78d53e"}.collections.${"67cf3c69000832926f29"}.documents`
    const unsubscribe = clientHack.subscribe(channnel, (response) => {
        try{
            let resp = databasesHack.listDocuments('677305ac00095c78d53e','67cf3c69000832926f29')
                .then(ob => setPrevPrompts(ob.documents.reverse()))
                .catch(e => console.log(e));
        }catch(e){
            console.log(e);
        }
    });
    return () => unsubscribe();
  },[])

  return (
    <div className="flex w-full">
      <Sidebar prevPrompts={prevPrompts} onSelectPrompt={handleSelectPrompt} onNewChat={handleNewChat} />

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
          {(imageData || imageURI) && (
            <div className="mt-6 flex flex-col items-center">
              <img
                src={imageURI || imageData}
                alt="Uploaded Preview"
                className="w-48 md:w-64 lg:w-80 h-auto rounded-lg border border-gray-300 shadow-md"
              />
              
              <p className="mt-2 text-gray-600 text-sm">{file?.name || "History"}</p>
            </div>
          )}

          {!(imageData|| imageURI) ? (
            <label className="mt-4 flex flex-col items-center justify-center w-fit px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md cursor-pointer border-2 border-transparent transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              <span className="flex items-center space-x-2">
                <span>Choose File</span>
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          ) : (
            !isConfirmed && !isHistorySelected && (
              <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-3 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 ease-in-out cursor-pointer hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                Confirm & Submit
              </button>
            )
          )}

          {(isConfirmed || isHistorySelected) && responseText && (
            <div
              className="mt-4 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 text-sm leading-relaxed shadow-md w-full max-w-lg"
              dangerouslySetInnerHTML={{ __html: responseText }} // Shows HTML formatted response
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