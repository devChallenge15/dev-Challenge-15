import React from 'react';
import PhoneSuggester from './lib';
import './App.css';

function App() {
  return (
    <div className="App">
      <PhoneSuggester
        onChange={(nextItem) => {console.log(nextItem);}}
      />
    </div>
  );
}

export default App;
