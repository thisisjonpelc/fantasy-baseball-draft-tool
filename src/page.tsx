import { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import { PlayerTable } from "./components/PlayerTable";
import type { Player } from "./components/PlayerTable";
import { Flex, Grid } from "@mantine/core";

interface DataRow {
  Name: string;
  Team: string;
  POS: string;
  ADP: string;
  PA: string;
  rPTS: string;
  PTS: string;
  aPOS: string;
  Dollars: string;
  NameASCII: string;
  PlayerId: string;
  MLBAMID: string;
}

export const FantasyBaseballDraftTool = () => {
  const [hitterData, setHitterData] = useState<Player[]>([]);
  const [pitcherData, setPitcherData] = useState<Player[]>([]);

  const loadData = () => {
    Papa.parse<DataRow>("/fangraphs-auction-calculator-hitters.csv", {
      header: true,
      download: true,
      complete: (results: ParseResult<DataRow>) => {
        const hitterData = results.data.map(
          ({ Name, Team, POS, ADP, Dollars, MLBAMID }) => {
            return {
              name: Name,
              team: Team,
              position: POS,
              adp: +ADP,
              value: +Dollars,
              id: MLBAMID,
            };
          },
        );

        setHitterData(hitterData);
      },
    });

    Papa.parse<DataRow>("/fangraphs-auction-calculator-pitchers.csv", {
      header: true,
      download: true,
      complete: (results: ParseResult<DataRow>) => {
        const pitcherData = results.data.map(
          ({ Name, Team, POS, ADP, Dollars, MLBAMID }) => {
            return {
              name: Name,
              team: Team,
              position: POS,
              adp: +ADP,
              value: +Dollars,
              id: MLBAMID,
            };
          },
        );

        setPitcherData(pitcherData);
      },
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Flex gap="md" direction="row">
        <div style={{ width: 450 }}>
          <PlayerTable players={hitterData} />
        </div>
        <Flex gap={"md"} direction={"row"} wrap={"wrap"}>
          <PlayerTable players={hitterData} position="C" />
          <PlayerTable players={hitterData} position="1B" />
          <PlayerTable players={hitterData} position="2B" />
          <PlayerTable players={hitterData} position="3B" />
          <PlayerTable players={hitterData} position="SS" />
          <PlayerTable players={hitterData} position="OF" />
          <PlayerTable players={hitterData} position="DH" />
        </Flex>
      </Flex>
    </>
  );
};
