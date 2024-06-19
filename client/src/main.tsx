import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import ServerDataProvider from 'contexts/ServerDataContext.tsx';

const theme = createTheme({
  colors: {
      'blueGray': [
          '#F7FAFC',
          '#EDF2F7',
          '#E2E8F0',
          '#CBD5E0',
          '#A0AEC0',
          '#718096',
          '#4A5568',
          '#2D3748',
          '#1A202C',
          '#171923',
      ]
  }
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ServerDataProvider>
        <App />
      </ServerDataProvider>
    </MantineProvider>
  </React.StrictMode>,
)
