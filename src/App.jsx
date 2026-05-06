import Sidebar from './components/Sidebar';
import MainArea from './components/MainArea';
import ContextSidebar from './components/ContextSidebar';
import { ChatProvider } from './context/ChatProvider';

function App() {
  return (
    <ChatProvider>
      <Sidebar />
      <MainArea />
      <ContextSidebar />
    </ChatProvider>
  );
}

export default App;
