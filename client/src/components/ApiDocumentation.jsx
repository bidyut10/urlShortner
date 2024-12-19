import { IoCopyOutline } from "react-icons/io5";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const ApiDocumentation = () => {
  const [alertVisible, setAlertVisible] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 2000); 
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 my-[45px] px-5 md:px-0 pt-12 md:pt-0">
      {/* Title */}
      <header className="text-start space-y-4">
        <h2 className="text-2xl font-normal ">Documentation</h2>
        <p className="text-gray-600 text-lg">
          Welcome to the{" "}
          <strong className="text-blue-500">URL Shortener API</strong>{" "}
          documentation. This API allows you to shorten long URLs easily. Simply
          send a <span className="text-green-600">POST</span> request with the{" "}
          <strong>URL</strong> you want to shorten, and the API will return a
          shortened version for quick sharing and easier access. Below you will
          find detailed instructions on how to integrate and use this API in
          your projects.
        </p>
      </header>

      {/* 1. Endpoint Section */}
      <section>
        <h2 className="text-xl font-normal mb-4">1. Endpoint</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
          <li>
            Base URL: The API is hosted at{" "}
            <span className="text-blue-500">
              `http://cuturl.com/api/v1/url`
            </span>
            . All POST requests should be sent to this endpoint.
          </li>
          <li>
            Purpose: This endpoint accepts a{" "}
            <span className="text-red-500">`longUrl`</span> in the request body
            and returns a shortened URL.
          </li>
        </ul>
        <div className="bg-gray-100 p-4 rounded-lg relative mt-4">
          <code className="text-xl">
            <span className="text-blue-500">POST</span>{" "}
            http://cuturl.com/api/v1/url
          </code>
          <button
            onClick={() => copyToClipboard("POST http://cuturl.com/api/v1/url")}
            className="absolute top-3 right-3 text-gray-800 hover:text-gray-950"
          >
            <IoCopyOutline />
          </button>
          <div className="absolute top-12 right-3 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded">
            Copy URL
          </div>
        </div>
      </section>

      {/* 2. Request Body */}
      <section>
        <h2 className="text-xl font-normal mb-4">2. Request Body</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
          <li>Format: The API requires a JSON object in the request body.</li>
          <li>
            Required Field: The full URL you wish to shorten. It must be a valid
            and reachable URL.
          </li>
        </ul>
        <p className="mt-2 text-lg">
          Example Payload: Below is a sample JSON payload.
        </p>

        <div className="bg-gray-900 text-white rounded-lg relative mt-4">
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            className="rounded-lg p-4 text-lg"
          >
            {`{
  "longUrl": "http://example.com/long-url"
}`}
          </SyntaxHighlighter>
          <button
            onClick={() =>
              copyToClipboard(`{
  "longUrl": "http://example.com/long-url"
}`)
            }
            className="absolute top-3 right-3 text-white hover:text-cyan-400"
          >
            <IoCopyOutline />
          </button>
        </div>
      </section>

      {/* 3. Axios Call */}
      <section>
        <h2 className="text-xl font-normal mb-4">3. Axios Call</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
          <li>
            Step 1: Install <span className="text-blue-500">Axios</span> to make
            HTTP requests in your JavaScript application.
          </li>
          <li>
            Step 2: Use the{" "}
            <span className="text-green-600">`axios.post()`</span> method to
            send the request with the JSON payload.
          </li>
          <li>Step 3: Handle the response and errors appropriately.</li>
        </ul>
        <p className="mt-2 text-lg">
          Below is a complete code snippet for integrating the API with Axios in
          a React application.
        </p>

        <div className="bg-gray-900 text-white rounded-lg relative mt-4">
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            className="rounded-lg p-4 text-lg"
          >
            {`import axios from 'axios';

const shortenUrl = async (longUrl) => {
  try {
    const response = await axios.post('http://cuturl.com/api/v1/url', { longUrl });
    console.log('Shortened URL:', response.data.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Example Usage
shortenUrl('http://example.com/long-url');`}
          </SyntaxHighlighter>
          <button
            onClick={() =>
              copyToClipboard(`import axios from 'axios';

const shortenUrl = async (longUrl) => {
  try {
    const response = await axios.post('http://cuturl.com/api/v1/url', { longUrl });
    console.log('Shortened URL:', response.data.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Example Usage
shortenUrl('http://example.com/long-url');`)
            }
            className="absolute top-3 right-3 text-white hover:text-cyan-400"
          >
            <IoCopyOutline />
          </button>
        </div>
      </section>

      {/* 4. Response Structure */}
      <section>
        <h2 className="text-xl font-normal mb-4">4. Response Structure</h2>
        <p className="mb-2 text-lg">
          Success Response: On a successful request, the API returns:
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
          <ul className="ml-4 list-disc">
            <li>
              <span className="text-green-600">`status`</span> (boolean):
              Indicates success.
            </li>
            <li>
              <span className="text-green-600">`data`</span> (string): The
              shortened URL.
            </li>
            <li>
              <span className="text-green-600">`message`</span> (string): A
              success message.
            </li>
          </ul>
        </ul>
        <p className="mt-2 text-lg">Example Success Response:</p>
        <div className="bg-gray-900 text-white rounded-lg relative mt-4">
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            className="rounded-lg p-4 text-lg"
          >
            {`{
  "status": true,
  "data": "https://cuturl.com/dv345h",
  "message": "successful"
}`}
          </SyntaxHighlighter>
          <button
            onClick={() =>
              copyToClipboard(`{
  "status": true,
  "data": "https://cuturl.com/dv345h",
  "message": "successful"
}`)
            }
            className="absolute top-3 right-3 text-white hover:text-cyan-400"
          >
            <IoCopyOutline />
          </button>
        </div>
        <p className="my-2 text-lg">
          Error Response: In case of failure, the API returns:
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg mt-2">
          <ul className="ml-4 list-disc">
            <li>
              <span className="text-red-500">`status`</span> (boolean):
              Indicates failure.
            </li>
            <li>
              <span className="text-red-500">`message`</span> (string): An error
              message.
            </li>
          </ul>
        </ul>
        <p className="mt-2 text-lg">Example Error Response:</p>
        <div className="bg-gray-900 text-white rounded-lg relative mt-4">
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            className="rounded-lg p-4 text-lg"
          >
            {`{
  "status": false,
  "message": "Invalid URL"
}`}
          </SyntaxHighlighter>
          <button
            onClick={() =>
              copyToClipboard(`{
  "status": false,
  "message": "Invalid URL"
}`)
            }
            className="absolute top-3 right-3 text-white hover:text-cyan-400"
          >
            <IoCopyOutline />
          </button>
        </div>
      </section>

      {/* Custom alert */}
      {alertVisible && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md">
          <span>Copied successfully!</span>
        </div>
      )}
    </div>
  );
};

export default ApiDocumentation;
