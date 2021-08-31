import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
