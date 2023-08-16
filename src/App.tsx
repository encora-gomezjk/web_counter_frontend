import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import { useLazyQuery, gql } from '@apollo/client';


const GET_COUNT = gql`
  query Count_words($text: String!) {
    count_words(text: $text)
  }
`;

function App() {

  const textRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const [getCount, {loading, data}] = useLazyQuery(GET_COUNT, {
    variables: {
      text
    }
  });

  const analize = () => {
    if (textRef.current?.value) {
      setText(textRef.current?.value)
      getCount()
    } else {
      setResults([])
      alert('Plase type the text you want to analize')
    }
  }

  useEffect(() => {
    if (data && data.count_words) {
      const counting = data.count_words;
      const keys =  Object.keys(counting);

      const words = keys.map(k => {
        return {
          word: k,
          value: counting[k]
        }
      }).sort((a, b) => b.value - a.value).filter((word_item => word_item.word.length > 0));

      const _results = words.map((word_item, i) => {
        return <li key={i}>{word_item.word}: {word_item.value}</li>
      });
      setResults(_results);
    }
  }, [data])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Count words excluding the 100 most common English words</h1>
        <label htmlFor="text">Text to analize</label>
        <textarea ref={textRef} id='text' className='input-text' rows={10} defaultValue={text}></textarea>
        <button onClick={analize}>Analize</button>

        {results.length > 0 && <>
          <h2>Results: </h2>
          <ul className='list-results'>
            {results}
          </ul>
        </>}

        {loading && <p>Loading...</p>}
      </header>
    </div>
  );
}

export default App;
