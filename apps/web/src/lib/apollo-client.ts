import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Create a function that gets called for every request
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  let token = '';

  // Only run this on the client side
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create an http link
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
});

// Keep track of whether we've already triggered a logout
let isLoggingOut = false;

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation.operationName}`,
      );

      // Handle auth errors (e.g., token expired)
      const isAuthError =
        message.includes('not authenticated') ||
        message.includes('unauthorized') ||
        message.includes('token expired');

      if (isAuthError && typeof window !== 'undefined' && !isLoggingOut) {
        // Don't log out if it's just a profile page or common query after page refresh
        const isRefreshQuery =
          operation.operationName === 'GetUserProfile' ||
          operation.operationName === 'GetUserClearEntries';

        // Check if we have valid auth in localStorage before logging out
        const hasToken = !!localStorage.getItem('token');
        const hasUser = !!localStorage.getItem('user');

        // Only log out if there's a genuine auth error (not just a refresh race condition)
        if (!isRefreshQuery || !hasToken || !hasUser) {
          isLoggingOut = true;
          console.warn('Authentication error detected, logging out');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          console.log(
            'Ignoring auth error during page refresh for query:',
            operation.operationName,
          );
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;
