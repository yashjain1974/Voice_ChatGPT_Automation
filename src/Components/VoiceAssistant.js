import './voiceAssistant.css';
import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { Configuration,OpenAIApi } from 'openai';
// import { Configuration, OpenAI } from 'openai';


function VoiceAssistant() {
  
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [data, setData] = useState(null);
  async function generateCompletion() {
  const configuration = new Configuration({
    apiKey: "<Enter your Chat GPT API>",
  });
  const openai = new OpenAIApi(configuration);
  
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: transcript,
      max_tokens: 200,
    });
    setResponse(completion.data.choices[0].text);
  }
  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  const handleListening = () => {
    resetTranscript();
    setIsListening(true);
    microphoneRef.current.classList.add("pulse");
    SpeechRecognition.startListening({
      continuous: true,
    });

  };

  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("pulse");
    SpeechRecognition.stopListening();
    generateCompletion();
    resetTranscript();

  };

  const handleReset = () => {
    stopHandle();
    setData(null);
  };

  return (
    <div className="App">
      <div className="microphone-container">
        <h1>Voice Assistant</h1>
        <div className="microphone-wrapper">
          <div className="microphone-icon-circle" ref={microphoneRef} onClick={handleListening}>
            <FontAwesomeIcon icon={faMicrophone} size="4x" color="white" className="fa-icon" />
          </div>
          <div className="microphone-status">
            {isListening ? <h3>Listening...</h3> : <h3>Click to start listening</h3>}
          </div>
        </div>

        <div className="microphone-result">
          <div className="speech-transcript">{transcript}</div>
          <button className="reset-transcript controls" onClick={handleReset}>Reset</button>

          {isListening && (
            <button className="microphone-stop btn controls" onClick={stopHandle}  >
              Stop
            </button>
          )}
<div>{data}</div>
        </div>
        <div>
      <h1>OpenAI Text Completion</h1>
     
      <button onClick={generateCompletion}>Generate Completion</button>
      <p>{response}</p>
    </div>

      </div>

    </div>
  );
}

export default VoiceAssistant;
