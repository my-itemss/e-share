import React, { useState, useCallback, useEffect } from 'react';
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import autotable plugin for jsPDF

function Pdf() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null); // State to hold pdfjsLib

  // Load pdf.js library dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      // Ensure GlobalWorkerOptions.workerSrc is set after pdf.js is loaded
      if (window['pdfjs-dist/build/pdf']) {
        window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        setPdfjsLib(window['pdfjs-dist/build/pdf']); // Set the pdfjsLib state
      } else {
        setError("Failed to load pdf.js library.");
      }
    };
    script.onerror = () => {
      setError("Failed to load pdf.js library.");
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Handles file selection from the input
  const handleFileChange = (event) => {
    setError('');
    setSummary('');
    setExtractedText('');
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  // Extracts text from the PDF file using pdf.js
  const extractTextFromPdf = useCallback(async (file) => {
    if (!pdfjsLib) {
      return Promise.reject("pdf.js library not loaded.");
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ') + '\n';
          }
          resolve(fullText);
        } catch (err) {
          console.error("PDF Extraction Error:", err);
          reject('Failed to extract text from PDF. Ensure it\'s not corrupted.');
        }
      };
      reader.onerror = () => reject('Error reading the file.');
    });
  }, [pdfjsLib]);

  // Handles the summarization process
  const summarizePdf = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setSummary('');
    setError('');

    try {
      // Step 1: Extract text from PDF
      const text = await extractTextFromPdf(selectedFile);
      setExtractedText(text); // Display extracted text for debugging/info
      if (text.trim().length === 0) {
        setError('No text extracted from PDF. The PDF might be image-based or empty.');
        setLoading(false);
        return;
      }

      // Step 2: Call Gemini API for summarization
      // Ensure the prompt is clear and concise for summarization
      const prompt = `Please summarize the following text, focusing on its core arguments, main ideas, key evidence, author's purpose, and significant conclusions, while maintaining objectivity and clarity:\n\n${text}`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error.message || response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const generatedSummary = result.candidates[0].content.parts[0].text;
        setSummary(generatedSummary);
      } else {
        setError('Failed to get a summary from the API. The response structure was unexpected.');
      }
    } catch (err) {
      console.error("Summarization error:", err);
      setError(err.message || 'An unexpected error occurred during summarization.');
    } finally {
      setLoading(false);
    }
  }, [selectedFile, extractTextFromPdf]);

  // Function to download the summary as a PDF
  const downloadSummaryAsPdf = () => {
    const doc = new jsPDF();
    doc.text('Summary:', 10, 10);
    const textLines = doc.splitTextToSize(summary, doc.internal.pageSize.getWidth() - 20); // Wrap text
    doc.setFontSize(12);
    doc.text(textLines, 10, 20);
    doc.save('summary.pdf');
  };

  // Function to copy the summary to the clipboard
  const copySummaryToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!'); // Simple feedback
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy summary to clipboard.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8 tracking-tight">
          Snap Summary 📚
        </h1>


        <div className="mb-6">
          <label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-400 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition duration-300 ease-in-out"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a3 3 0 013 3v10a2 2 0 01-2 2H7a2 2 0 01-2-2v-1a1 1 0 011-1h1v-1a1 1 0 011-1h1v-1a1 1 0 011-1h1V8a1 1 0 011-1h1V6a1 1 0 011-1h1V4a1 1 0 011-1h1V2a1 1 0 011-1h1z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4-4m0 0l4 4m-4-4v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-purple-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-purple-500">PDF (Max 5MB)</p>
            </div>
            <input id="pdf-upload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
          </label>
          {selectedFile && (
            <p className="mt-2 text-sm text-center text-gray-700">
              Selected file: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
        </div>

        <button
          onClick={summarizePdf}
          disabled={!selectedFile || loading || !pdfjsLib}
          className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 ease-in-out transform
            ${selectedFile && !loading && pdfjsLib
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:from-purple-700 hover:to-indigo-700 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Summarizing...
            </span>
          ) : (
            'Summarize PDF'
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {summary && (
          <div className="mt-8">
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl shadow-inner max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Summary:</h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={downloadSummaryAsPdf}
                className="bg-green-200 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
              >
                Download as PDF
              </button>
              <button
                onClick={copySummaryToClipboard}
                className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}

        {extractedText && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-inner max-h-60 overflow-y-auto text-sm text-gray-600">
            <h3 className="font-semibold text-gray-700 mb-2">Extracted Text (for debugging):</h3>
            <p className="whitespace-pre-wrap">{extractedText.substring(0, 500)}...</p>
            <p className="text-xs text-gray-500 mt-2">({extractedText.length} characters extracted)</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Pdf;
