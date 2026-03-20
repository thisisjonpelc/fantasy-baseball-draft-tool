import { Table, ScrollArea } from "@mantine/core";

export interface Player {
  name: string;
  team: string;
  position: String;
  adp: number;
  value: number;
  id: string;
}

interface PlayerTableProps {
  players: Player[];
  position?: string;
}

export const PlayerTable = ({ players, position }: PlayerTableProps) => {
  const filtered = position
    ? players.filter((p) => p.position.split("/").includes(position))
    : players;

  const rows = filtered.map(({ name, team, position: pos, value, adp, id }) => (
    <Table.Tr key={id}>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{pos}</Table.Td>
      <Table.Td>{adp.toFixed(2)}</Table.Td>
      <Table.Td>{value.toFixed(2)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={position ? 200 : 600} w={position ? undefined : "100%"}>
      <Table
        stickyHeader
        layout="fixed"
        style={{
          textAlign: "left",
          tableLayout: "fixed",
          width: position ? 370 : "100%",
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={130}>Name</Table.Th>
            <Table.Th w={80}>Position</Table.Th>
            <Table.Th w={80}>ADP</Table.Th>
            <Table.Th w={80}>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
