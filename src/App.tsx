import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'

interface DataRow {
  Name: string
  Team: string
  POS: string
  ADP: string
  PA: string
  rPTS: string
  PTS: string
  aPOS: string
  Dollars: string
  NameASCII: string
  PlayerId: string
  MLBAMID: string
}

interface Player {
  name: string,
  team: string,
  position: String,
  adp: number,
  value: number
}

function App() {
  const [hitterData, setHitterData] = useState<Player[]>([])
  const [pitcherData, setPitcherData] = useState<Player[]>([])

  const loadData = () => {
   Papa.parse<DataRow>('/fangraphs-auction-calculator-hitters.csv', {
    header: true,
    download: true,
    complete: (results: ParseResult<DataRow>) => {
      const hitterData = results.data.map(({Name, Team, POS, ADP, Dollars}) => {
        return {
          name: Name,
          team: Team,
          position: POS,
          adp: +ADP,
          value: +Dollars
        }
      })

      setHitterData(hitterData)
    }
   })

   Papa.parse<DataRow>('/fangraphs-auction-calculator-pitchers.csv', {
    header: true,
    download: true,
    complete: (results: ParseResult<DataRow>) => {
      const pitcherData =  results.data.map(({Name, Team, POS, ADP, Dollars}) => {
        return {
          name: Name,
          team: Team,
          position: POS,
          adp: +ADP,
          value: +Dollars
        }
      })

      setPitcherData(pitcherData)
    }
   })
  }

  useEffect(() => {
   loadData()
  }, [])

  return (
    <>
     
    </>
  )
}

export default App
