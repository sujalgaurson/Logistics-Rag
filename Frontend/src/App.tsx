import { ThemeProvider } from '@/context/theme-context';
import { Dashboard } from '@/pages/Dashboard';

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
