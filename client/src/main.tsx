import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@mantine/core/styles.css';
// import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import ServerDataProvider from 'contexts/ServerDataContext.tsx';

const theme = createTheme({
  colors: {

  }
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" zIndex={1000} />
      <ServerDataProvider>
        <App />
      </ServerDataProvider>
    </MantineProvider>
  </React.StrictMode>,
)
