import { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import { PlayerTable } from "./components/PlayerTable";
import type { Player } from "./components/PlayerTable";
import { Flex, Group, TextInput, Title } from "@mantine/core";

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
  const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
  const [pickNumber, setPickNumber] = useState(1);

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

  const handleDraft = (player: Player) => {
    setDraftedPlayers((prev) => [...prev, player]);
    setPickNumber(pickNumber + 1);
  };

  const draftedIds = new Set(draftedPlayers.map((p) => p.id));
  const undraftedHitters = hitterData.filter((p) => !draftedIds.has(p.id));
  const undraftedPitchers = pitcherData.filter((p) => !draftedIds.has(p.id));

  const roundNumber = Math.ceil(pickNumber / 12);
  const pickInRound = ((pickNumber - 1) % 12) + 1;

  return (
    <>
      <Title>
        Round: {roundNumber} Pick: {pickInRound} Overall: {pickNumber}
      </Title>
      <TextInput
        label="Player Search"
        description="Search for a player by name"
      />
      <Group gap="md" grow>
        <PlayerTable players={undraftedHitters} onDraft={handleDraft} />
        <PlayerTable players={undraftedPitchers} onDraft={handleDraft} />
      </Group>
      <Flex gap={"md"} direction={"row"} wrap={"wrap"}>
        <PlayerTable
          players={undraftedHitters}
          onDraft={handleDraft}
          position="C"
        />
        <PlayerTable
          players={undraftedHitters}
          onDraft={handleDraft}
          position="1B"
        />
        <PlayerTable
          players={undraftedHitters}
          onDraft={handleDraft}
          position="2B"
        />
        <PlayerTable
          players={undraftedHitters}
          onDraft={handleDraft}
          position="3B"
        />
        <PlayerTable
          players={undraftedHitters}
          onDraft={handleDraft}
          position="SS"
        />
        <PlayerTable
          players={undraftedHitters}
          onDraft={handleDraft}
          position="OF"
        />
        <PlayerTable
          players={undraftedHitters}
          onDraft={handleDraft}
          position="DH"
        />
        <PlayerTable
          players={undraftedPitchers}
          onDraft={handleDraft}
          position="SP"
        />
        <PlayerTable
          players={undraftedPitchers}
          onDraft={handleDraft}
          position="RP"
        />
      </Flex>
    </>
  );
};
