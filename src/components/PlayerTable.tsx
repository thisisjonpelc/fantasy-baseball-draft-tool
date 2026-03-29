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
  onDraft: (player: Player) => void;
}

export const PlayerTable = ({
  players,
  position,
  onDraft,
}: PlayerTableProps) => {
  const rows = players.map((player) => {
    const { name, position: pos, value, id } = player;
    return (
      <Table.Tr
        key={id}
        onClick={() => onDraft(player)}
        style={{ cursor: "pointer" }}
      >
        <Table.Td>{name}</Table.Td>
        {!position && <Table.Td>{pos}</Table.Td>}
        <Table.Td>${value.toFixed(2)}</Table.Td>
      </Table.Tr>
    );
  });

  const dropoff3 =
    players.length >= 3 ? players[2].value - players[0].value : 0;
  const dropoff5 =
    players.length >= 5 ? players[4].value - players[0].value : 0;
  const dropoff12 =
    players.length >= 12 ? players[11].value - players[0].value : 0;

  return (
    <ScrollArea h={position ? 210 : 500} w={position ? undefined : "100%"}>
      <Table
        stickyHeader
        layout="fixed"
        style={{
          textAlign: "left",
          tableLayout: "fixed",
          width: position ? 290 : "100%",
        }}
        striped
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={130}>{position ?? "Name"}</Table.Th>
            {!position && <Table.Th w={80}>Position</Table.Th>}
            <Table.Th w={80}>
              {`${dropoff3.toFixed(2)}, ${dropoff5.toFixed(2)}${position ? "" : "," + dropoff12.toFixed(2)}`}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
