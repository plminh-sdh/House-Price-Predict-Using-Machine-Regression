import './App.css';
import { ThemeProvider } from 'styled-components';
import { brand } from '@/styles/theme';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from '@/routes';
import { NotificationProvider } from '@/providers/NotificationProvider';

function App() {
  const browserRouter = createBrowserRouter(routes);
  return (
    <ThemeProvider theme={brand}>
      <NotificationProvider>
        <RouterProvider router={browserRouter} />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
