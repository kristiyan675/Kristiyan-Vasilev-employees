import React, { useState } from "react";
import { getOldestPair } from "./getOldestPair";


function App() {
    const [results, setResults] = useState(null)

    const [file, setFile] = useState(null);

    const fileReader = new FileReader();
    fileReader.onload = (event) => getOldestPair(event, setResults)

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.readAsText(file);
        }
    };



    return (
        <div style={{ textAlign: "center" }}>
            <h1>Choose the file and click Import CSV</h1>
            <form>
                <input
                    type="file"
                    id="csvFileInput"
                    accept=".csv"
                    onChange={handleOnChange}
                />

                <button
                    type="submit"
                    onClick={
                        handleOnSubmit
                    }
                >
                    Import CSV
                </button>
            </form>
            <br />
            <h3>Result: </h3>
            <table style={{display: 'inline'}}>
                <thead>
                    <tr>
                        <th >Employee 1</th>
                        <th >Employee 2</th>
                    </tr>
                </thead>
                {results && <tbody>
                    <tr>
                        <td>{results[0].split("-")[0]}</td>
                        <td>{results[0].split("-")[1]}</td>
                    </tr>
                </tbody>}
            </table>
            <table style={{display: 'inline'}}>
                <thead>
                    <tr>
                        <th >Project ID</th>
                        <th>Days worked</th>
                    </tr>
                </thead>
                {results && <tbody>
                    {results[1].commonProjects.map(project => <tr key={Math.random()}>
                        <td>{Object.keys(project)[0]}</td>
                        <td>{Object.values(project)[0]}</td>
                    </tr>)}
                </tbody>}
            </table>
            <table style={{display: 'inline'}}>
                <thead>
                <tr>
                    <th >Total</th>
                </tr>
                </thead>
                {results && <tbody>
                    <tr>
                        <td>{results[1].timePaired}</td>
                    </tr>
                </tbody>}
            </table>
        </div >
    );
}

export default App;
