import { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordLength, setPasswordLength] = useState<number>(8); // Set initial value to 8
  const [passwordLabel, setPasswordLabel] = useState<string>("Password Length");
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [copyButtonText, setCopyButtonText] = useState<string>("Copy");
  const [includeNumbersPercent, setIncludeNumbersPercent] =
    useState<number>(30);
  const [includeSymbolsPercent, setIncludeSymbolsPercent] =
    useState<number>(30);
  const [includeMemorable, setIncludeMemorable] = useState<boolean>(false);
  const [memorableSeparator, setMemorableSeparator] = useState<string>("-");
  const memorableSeparators = ["-", ".", "+", "/", ":", ">", "<", "&"];

  useEffect(() => {
    // Update password length when the component mounts based on includeMemorable status
    setPasswordLength(includeMemorable ? 3 : 8);
  }, [includeMemorable]);

  const handleMemorableSeparatorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMemorableSeparator(e.target.value);
  };

  const handleIncludeNumbersPercentChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setIncludeNumbersPercent(value);
    }
  };
  ``;

  const handleIncludeSymbolsPercentChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setIncludeSymbolsPercent(value);
    }
  };

  const percentOptions = [30, 60, 100];

  const renderPercentOptions = (options: number[]) => {
    return options.map((option) => (
      <option key={option} value={option}>
        {option === 100 ? "Normal" : `${option}%`}
      </option>
    ));
  };

  const generatePassword = async () => {
    const response = await fetch(
      // change the url wit your flask url
      "https://arz-aiopgb.vercel.app/generate-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          length: passwordLength,
          includeNumbers: includeNumbers && !includeMemorable,
          includeSymbols: includeSymbols && !includeMemorable,
          includeUppercase: includeUppercase && !includeMemorable,
          includeLowercase: includeLowercase && !includeMemorable,
          includeNumbersPercent:
            includeNumbersPercent === 100 && !includeMemorable
              ? 100
              : includeNumbersPercent,
          includeSymbolsPercent:
            includeSymbolsPercent === 100 && !includeMemorable
              ? 100
              : includeSymbolsPercent,
          includeMemorable: includeMemorable,
          memorableSeparator: includeMemorable ? memorableSeparator : null,
        }),
      }
    );
    const data = await response.json();
    setPassword(data.password);

    // Set Copy button text to 'Copy' when password is regenerated
    setCopyButtonText("Copy");
  };

  const copyToClipboard = () => {
    const textarea = document.createElement("textarea");
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    setCopyButtonText("Copied");
  };

  const handleIncludeMemorableChange = () => {
    setIncludeMemorable(!includeMemorable);
    // Reset other options when Include Memorable is toggled
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    // Reset Password Length based on includeMemorable status
    setPasswordLength(includeMemorable ? 3 : 8);
    // Update password label based on includeMemorable status
    setPasswordLabel(includeMemorable ? "Password Length" : "Words");
  };

  return (
    <div className="container mx-auto mt-8 p-8 bg-gray-100 rounded-lg shadow-md max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <h1 className="text-3xl font-bold mb-4 text-blue-500">
        Password Generator
      </h1>
      <div className="mb-4">
        <label className="text-lg text-gray-700 block mb-2">
          {passwordLabel}: {passwordLength}
        </label>
        <input
          type="range"
          min={includeMemorable ? 3 : 8}
          max={includeMemorable ? 15 : 100}
          value={passwordLength}
          onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
          className="w-full appearance-none bg-gray-300 h-2 rounded-full focus:outline-none focus:shadow-outline hover:cursor-e-resize"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={() => setIncludeUppercase(!includeUppercase)}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded-full"
              disabled={includeMemorable}
            />
            <span className="text-lg text-gray-700">Include Uppercase</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={() => setIncludeLowercase(!includeLowercase)}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded-full"
              disabled={includeMemorable}
            />
            <span className="text-lg text-gray-700">Include Lowercase</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeMemorable}
              onChange={handleIncludeMemorableChange}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded-full"
            />
            <span className="text-lg text-gray-700">Include Memorable</span>
          </label>

          {includeMemorable && (
            <div className="mb-4">
              <label className="text-lg text-gray-700 block mb-2">
                Memorable Separator:
              </label>
              <select
                value={memorableSeparator}
                onChange={handleMemorableSeparatorChange}
                className="border p-2 rounded text-sm flex w-24"
              >
                {memorableSeparators.map((separator) => (
                  <option key={separator} value={separator}>
                    {separator}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded-full"
              disabled={includeMemorable}
            />
            <span className="text-lg text-gray-700">Include Numbers</span>
            {includeNumbers && (
              <div className="ml-2 flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Include Numbers %:
                </span>
                <select
                  value={includeNumbersPercent}
                  onChange={handleIncludeNumbersPercentChange}
                  className="border p-2 rounded text-sm"
                  disabled={includeMemorable}
                >
                  {renderPercentOptions(percentOptions)}
                </select>
              </div>
            )}
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded-full"
              disabled={includeMemorable}
            />
            <span className="text-lg text-gray-700">Include Symbols</span>
            {includeSymbols && (
              <div className="ml-2 flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Include Symbols %:
                </span>
                <select
                  value={includeSymbolsPercent}
                  onChange={handleIncludeSymbolsPercentChange}
                  className="border p-2 rounded text-sm"
                  disabled={includeMemorable}
                >
                  {renderPercentOptions(percentOptions)}
                </select>
              </div>
            )}
          </label>
        </div>
      </div>

      <button
        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        onClick={generatePassword}
      >
        Generate Password
      </button>
      <div className="mt-4">
        <p className="text-xl font-semibold mb-2 text-purple-500">
          Generated Password:
        </p>
        <div className="flex">
          <input
            type="text"
            value={password}
            readOnly
            className="border p-2 w-full rounded font-courier font-bold text-gray-700"
          />
          <button
            className={`ml-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ${
              copyButtonText === "Copied" ? "bg-green-500" : ""
            }`}
            onClick={copyToClipboard}
          >
            {copyButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
