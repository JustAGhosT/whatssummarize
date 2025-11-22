import * as React from 'react';

// Minimal context implementation
function createTestContext<T>(defaultValue: T) {
  const Context = React.createContext<T>(defaultValue);
  
  const Provider: React.FC<{ value: T; children: React.ReactNode }> = ({ children, value }) => (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );

  const useTestContext = () => React.useContext(Context);
  
  return { Provider, useTestContext, Context };
}

// Test the context
const { Provider, useTestContext } = createTestContext<string>('default');

const TestComponent: React.FC = () => {
  const value = useTestContext();
  return <div>{value}</div>;
};

export function TestApp() {
  return (
    <Provider value="test">
      <TestComponent />
    </Provider>
  );
}
