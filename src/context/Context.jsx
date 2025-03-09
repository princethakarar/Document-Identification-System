import { createContext, useState } from "react";
import run from "../Config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [response, setResponse] = useState("");

    const onSent = async (base64string, mimeType) => {
        const geminiResponse = await run(base64string, mimeType);
        setResponse(geminiResponse);
    };

    const contextValue = {
        onSent,
        response,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
