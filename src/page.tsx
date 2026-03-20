import { useEffect, useState } from 'react'
import './App.css'
import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'
import { PlayerTable } from './components/PlayerTable'
import type { Player } from './components/PlayerTable'

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

 export const FantasyBaseballDraftTool = () =>  {
  const [hitterData, setHitterData] = useState<Player[]>([])
  const [pitcherData, setPitcherData] = useState<Player[]>([])

  const loadData = () => {
   Papa.parse<DataRow>('/fangraphs-auction-calculator-hitters.csv', {
    header: true,
    download: true,
    complete: (results: ParseResult<DataRow>) => {
      const hitterData = results.data.map(({Name, Team, POS, ADP, Dollars, MLBAMID}) => {
        return {
          name: Name,
          team: Team,
          position: POS,
          adp: +ADP,
          value: +Dollars,
          id: MLBAMID
        }
      })

      setHitterData(hitterData)
    }
   })

   Papa.parse<DataRow>('/fangraphs-auction-calculator-pitchers.csv', {
    header: true,
    download: true,
    complete: (results: ParseResult<DataRow>) => {
      const pitcherData =  results.data.map(({Name, Team, POS, ADP, Dollars, MLBAMID}) => {
        return {
          name: Name,
          team: Team,
          position: POS,
          adp: +ADP,
          value: +Dollars,
          id: MLBAMID
        }
      })

      setPitcherData(pitcherData)
    }
   })
  }

  useEffect(() => {
   loadData()
  }, [])

  return <PlayerTable players={hitterData} />
}