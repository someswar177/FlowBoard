import { Header } from './Header';
import { Toast } from '../common/Toast';
import { AIAssistant } from '../ai/AIAssistant';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-20">{children}</main>
      <AIAssistant />
      <Toast />
    </div>
  );
};
