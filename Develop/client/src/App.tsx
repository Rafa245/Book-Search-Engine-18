import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Create Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Ensure this is your Apollo Server URL
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
