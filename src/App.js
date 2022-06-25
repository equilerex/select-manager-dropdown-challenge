import React from 'react';
import './App.scss';
import SelectManagerDropdown from "./components/select-manager-dropdown/select-manager-dropdown";

function App() {
  return (
    <div className="App">
      <div className="App__author">
        <p>Peakon Frontend challenge by:</p>
        <p>Joosep Kõivistik</p>
      </div>

      <SelectManagerDropdown />
    </div>
  );
}

export default App;
