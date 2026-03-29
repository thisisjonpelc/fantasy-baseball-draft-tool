import { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import { PlayerTable } from "./components/PlayerTable";
import type { Player } from "./components/PlayerTable";
import { Flex, Group, Stack, TextInput, Title } from "@mantine/core";

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
  const [playerSearch, setPlayerSearch] = useState("");

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
    setPlayerSearch("");
  };

  const draftedIds = new Set(draftedPlayers.map((p) => p.id));
  const search = playerSearch.toLowerCase();
  const undraftedHitters = hitterData.filter(
    (p) => !draftedIds.has(p.id) && p.name.toLowerCase().includes(search),
  );
  const undraftedPitchers = pitcherData.filter(
    (p) => !draftedIds.has(p.id) && p.name.toLowerCase().includes(search),
  );

  const byPosition = (players: Player[], pos: string) =>
    players.filter((p) => p.position.split("/").includes(pos));

  const catchers = byPosition(undraftedHitters, "C");
  const firstBase = byPosition(undraftedHitters, "1B");
  const secondBase = byPosition(undraftedHitters, "2B");
  const thirdBase = byPosition(undraftedHitters, "3B");
  const shortstops = byPosition(undraftedHitters, "SS");
  const outfielders = byPosition(undraftedHitters, "OF");
  const designatedHitters = byPosition(undraftedHitters, "DH");
  const startingPitchers = byPosition(undraftedPitchers, "SP");
  const relievers = byPosition(undraftedPitchers, "RP");

  const roundNumber = Math.ceil(pickNumber / 12);
  const pickInRound = ((pickNumber - 1) % 12) + 1;

  return (
    <Stack>
      <Flex gap={"md"} align={"flex-end"}>
        <Title>
          Round: {roundNumber} Pick: {pickInRound} Overall: {pickNumber}
        </Title>
        <TextInput
          label="Player Search"
          value={playerSearch}
          onChange={(event) => setPlayerSearch(event.currentTarget.value)}
        />
      </Flex>
      <Group gap="md" grow>
        <PlayerTable players={undraftedHitters} onDraft={handleDraft} />
        <PlayerTable players={undraftedPitchers} onDraft={handleDraft} />
      </Group>
      <Flex gap={"md"} direction={"row"} wrap={"wrap"}>
        <PlayerTable players={catchers} onDraft={handleDraft} position="C" />
        <PlayerTable players={firstBase} onDraft={handleDraft} position="1B" />
        <PlayerTable players={secondBase} onDraft={handleDraft} position="2B" />
        <PlayerTable players={thirdBase} onDraft={handleDraft} position="3B" />
        <PlayerTable players={shortstops} onDraft={handleDraft} position="SS" />
        <PlayerTable players={outfielders} onDraft={handleDraft} position="OF" />
        <PlayerTable players={designatedHitters} onDraft={handleDraft} position="DH" />
        <PlayerTable players={startingPitchers} onDraft={handleDraft} position="SP" />
        <PlayerTable players={relievers} onDraft={handleDraft} position="RP" />
      </Flex>
    </Stack>
  );
};
