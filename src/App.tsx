import './App.css'
import { MantineProvider } from '@mantine/core'
import { FantasyBaseballDraftTool } from './page'
import { theme } from './theme'

function App() {  
  return (
    <MantineProvider theme={theme}>
      <FantasyBaseballDraftTool />
    </MantineProvider>
  )
}

export default App
