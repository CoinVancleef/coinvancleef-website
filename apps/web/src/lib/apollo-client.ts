import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

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

// Add retry logic to handle transient network errors
const retryLink = new RetryLink({
  delay: {
    initial: 300, // Start with 300ms delay
    max: 3000, // Max 3 seconds between retries
    jitter: true, // Add randomness to avoid thundering herd
  },
  attempts: {
    max: 3, // Retry up to 3 times
    retryIf: (error, operation) => {
      // Retry on network errors and 5xx server errors
      const isNetworkError = !error.result && error.message === 'Failed to fetch';
      const isServerError = error.statusCode >= 500;

      if (isNetworkError || isServerError) {
        console.log(`Retrying operation ${operation.operationName} due to error:`, error);
        return true;
      }
      return false;
    },
  },
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
    console.warn(`[Network error]: ${networkError}`);
  }
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all', // Don't treat graphql errors as fatal
    },
    query: {
      fetchPolicy: 'network-only', // Don't use cache after modifications
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
