import { makeVar, InMemoryCache } from '@apollo/client';

export const isLoggedInVar = makeVar(false);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          }
        }
      }
    }
  }
});
