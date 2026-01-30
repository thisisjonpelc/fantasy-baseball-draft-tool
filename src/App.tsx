import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'

function App() {
  const [count, setCount] = useState(0)

  const loadData = () => {
    console.log('LOADING DATA')

   Papa.parse('/fangraphs-auction-calculator-hitters.csv', {
    header: true,
    download: true,
    complete: (results) => {console.log(results)}
   })
  }

  useEffect(() => {
   loadData()
  }, [])



  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
