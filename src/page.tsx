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

  const byPosition = (players: Player[], pos: string) =>
    players.filter((p) => p.position.split("/").includes(pos));

  const catchers = byPosition(undraftedPlayers, "C");
  const firstBase = byPosition(undraftedPlayers, "1B");
  const secondBase = byPosition(undraftedPlayers, "2B");
  const thirdBase = byPosition(undraftedPlayers, "3B");
  const shortstops = byPosition(undraftedPlayers, "SS");
  const outfielders = byPosition(undraftedPlayers, "OF");
  const designatedHitters = byPosition(undraftedPlayers, "DH");
  const startingPitchers = byPosition(undraftedPlayers, "SP");
  const relievers = byPosition(undraftedPlayers, "RP");

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
            <Tabs.Tab value="C">C</Tabs.Tab>
            <Tabs.Tab value="1B">1B</Tabs.Tab>
            <Tabs.Tab value="2B">2B</Tabs.Tab>
            <Tabs.Tab value="3B">3B</Tabs.Tab>
            <Tabs.Tab value="SS">SS</Tabs.Tab>
            <Tabs.Tab value="OF">OF</Tabs.Tab>
            <Tabs.Tab value="DH">DH</Tabs.Tab>
            <Tabs.Tab value="SP">SP</Tabs.Tab>
            <Tabs.Tab value="RP">RP</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="C">
            <PositionTable
              players={catchers}
              onDraft={handleDraft}
              position="C"
            />
          </Tabs.Panel>
          <Tabs.Panel value="1B">
            <PositionTable
              players={firstBase}
              onDraft={handleDraft}
              position="1B"
            />
          </Tabs.Panel>
          <Tabs.Panel value="2B">
            <PositionTable
              players={secondBase}
              onDraft={handleDraft}
              position="2B"
            />
          </Tabs.Panel>
          <Tabs.Panel value="3B">
            <PositionTable
              players={thirdBase}
              onDraft={handleDraft}
              position="3B"
            />
          </Tabs.Panel>
          <Tabs.Panel value="SS">
            <PositionTable
              players={shortstops}
              onDraft={handleDraft}
              position="SS"
            />
          </Tabs.Panel>
          <Tabs.Panel value="OF">
            <PositionTable
              players={outfielders}
              onDraft={handleDraft}
              position="OF"
            />
          </Tabs.Panel>
          <Tabs.Panel value="DH">
            <PositionTable
              players={designatedHitters}
              onDraft={handleDraft}
              position="DH"
            />
          </Tabs.Panel>
          <Tabs.Panel value="SP">
            <PositionTable
              players={startingPitchers}
              onDraft={handleDraft}
              position="SP"
            />
          </Tabs.Panel>
          <Tabs.Panel value="RP">
            <PositionTable
              players={relievers}
              onDraft={handleDraft}
              position="RP"
            />
          </Tabs.Panel>
        </Tabs>
      </Group>
    </Stack>
  );
};
