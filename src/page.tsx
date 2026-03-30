import { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import { PlayerTable } from "./components/PlayerTable";
import type { Player } from "./components/PlayerTable";
import { PositionTable } from "./components/PositionTable";
import { Flex, Group, Stack, Tabs, TextInput, Title } from "@mantine/core";

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
  Tier: string;
}

const POSITIONS = ["C", "1B", "2B", "3B", "SS", "OF", "DH", "SP", "RP"] as const;

export const FantasyBaseballDraftTool = () => {
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
  const [pickNumber, setPickNumber] = useState(1);
  const [playerSearch, setPlayerSearch] = useState("");

  const loadData = () => {
    Papa.parse<DataRow>("/fangraphs-auction-calculator-combined.csv", {
      header: true,
      download: true,
      complete: (results: ParseResult<DataRow>) => {
        const playerData = results.data
          .filter(({ Name }) => !!Name)
          .map(({ Name, Team, POS, ADP, Dollars, MLBAMID, Tier }) => {
            return {
              name: Name,
              team: Team,
              position: POS,
              adp: +ADP,
              value: +Dollars,
              id: MLBAMID,
              tier: +Tier,
            };
          });

        setPlayerData(playerData);
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

  const undraftedPlayers = playerData.filter(
    (p) => !draftedIds.has(p.id) && p.name.toLowerCase().includes(search),
  );

  const groupByPosition = (players: Player[]): Record<string, Player[]> =>
    players.reduce<Record<string, Player[]>>((acc, player) => {
      for (const pos of player.position.split("/")) {
        (acc[pos] ??= []).push(player);
      }
      return acc;
    }, {});

  const playersByPosition = groupByPosition(undraftedPlayers);

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
        <PlayerTable players={undraftedPlayers} onDraft={handleDraft} />
        <Tabs defaultValue="C">
          <Tabs.List>
            {POSITIONS.map((pos) => (
              <Tabs.Tab key={pos} value={pos}>{pos}</Tabs.Tab>
            ))}
          </Tabs.List>
          {POSITIONS.map((pos) => (
            <Tabs.Panel key={pos} value={pos}>
              <PositionTable
                players={playersByPosition[pos] ?? []}
                onDraft={handleDraft}
                position={pos}
              />
            </Tabs.Panel>
          ))}
        </Tabs>
      </Group>
    </Stack>
  );
};
