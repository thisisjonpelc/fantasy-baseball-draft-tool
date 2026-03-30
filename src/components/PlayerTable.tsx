import { Table, ScrollArea } from "@mantine/core";

const TIER_COLORS = ["#d4e09b", "#f6f4d2", "#cbdfbd", "#f19c79"];

export interface Player {
  name: string;
  team: string;
  position: String;
  adp: number;
  value: number;
  id: string;
  tier: number;
}

interface PlayerTableProps {
  players: Player[];
  onDraft: (player: Player) => void;
}

export const PlayerTable = ({ players, onDraft }: PlayerTableProps) => {
  const topValue = players.length > 0 ? players[0].value : 0;

  const rows = players.map((player, i) => {
    const { name, team, position: pos, value, id, tier } = player;
    const diff = i === 0 ? 0 : value - topValue;
    return (
      <Table.Tr
        key={`${id}-${pos}`}
        onClick={() => onDraft(player)}
        style={{
          cursor: "pointer",
          backgroundColor: TIER_COLORS[(tier - 1) % 4],
        }}
      >
        <Table.Td>{name}</Table.Td>
        <Table.Td>{team}</Table.Td>
        <Table.Td>{pos}</Table.Td>
        <Table.Td>${value.toFixed(2)}</Table.Td>
        <Table.Td>{diff === 0 ? "" : diff.toFixed(2)}</Table.Td>
        <Table.Td>{tier}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea h={500} w="100%">
      <Table
        stickyHeader
        layout="fixed"
        style={{
          textAlign: "left",
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={130}>Name</Table.Th>
            <Table.Th w={80}>Team</Table.Th>
            <Table.Th w={80}>Position</Table.Th>
            <Table.Th w={80}>Value</Table.Th>
            <Table.Th w={80}>Diff</Table.Th>
            <Table.Th w={80}>Tier</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
