import { Table } from '@mantine/core'

export interface Player {
  name: string
  team: string
  position: String
  adp: number
  value: number
  id: string
}

interface PlayerTableProps {
  players: Player[]
  position?: string
}

export const PlayerTable = ({ players, position }: PlayerTableProps) => {
  const filtered = position
    ? players.filter(p => p.position.split('/').includes(position))
    : players

  const rows = filtered.map(({ name, team, position: pos, value, adp, id }) => (
    <Table.Tr key={id}>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{team}</Table.Td>
      <Table.Td>{pos}</Table.Td>
      <Table.Td>{adp.toFixed(2)}</Table.Td>
      <Table.Td>{value.toFixed(2)}</Table.Td>
    </Table.Tr>
  ))

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Team</Table.Th>
          <Table.Th>Position</Table.Th>
          <Table.Th>ADP</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
