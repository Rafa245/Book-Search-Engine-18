import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Create Apollo Client instance
const client = new ApolloClient({
  uri: '/graphql', // Ensure this is your Apollo Server URL
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem("id_token")}` || "",
  },
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
