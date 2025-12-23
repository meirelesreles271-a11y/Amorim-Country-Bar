
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import WaiterPanel from './views/WaiterPanel';
import CashierPanel from './views/CashierPanel';
import CommandList from './views/CommandList';
import Settings from './views/Settings';
import DigitalMenu from './views/DigitalMenu';
import { subscribeToChanges, getState } from './dataStore';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getState());

  useEffect(() => {
    // Sync state between tabs/windows
    const unsubscribe = subscribeToChanges((newState) => {
      setState(newState);
    });

    // Listen to local changes (within this tab) via storage events if needed
    // But BroadcastChannel is better for same-origin real-time sync.
    
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard state={state} />} />
          <Route path="/inventory" element={<Inventory products={state.products} />} />
          <Route path="/waiter" element={<WaiterPanel products={state.products} commands={state.commands} />} />
          <Route path="/commands" element={<CommandList commands={state.commands} />} />
          <Route path="/cashier" element={<CashierPanel cashier={state.cashier} commands={state.commands} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/menu" element={<DigitalMenu products={state.products} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
