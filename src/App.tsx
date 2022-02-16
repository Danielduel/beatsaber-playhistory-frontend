// import React from "react";
// import styled from "styled-components";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";

const queryClient = new QueryClient();

type HistoryItem = {
  mapName: string;
  coverUrl: string;
  mapHash: string;
  bsrCode: string;
};

const renderHistoryItem = ({mapName, coverUrl, mapHash, bsrCode}: HistoryItem) => {
  return (
    <p>
      <img style={{float: "left"}} src={coverUrl} />
      <span>
        <div>{mapName}</div>
        <div><code>{mapHash}</code></div>
        <div><code>{bsrCode}</code></div>
      </span>
    </p>
  );
}

const Listing = () => {
  const {isLoading, error, data} = useQuery('playerData', () =>
    fetch('/api/history/test/list').then(res =>
      res.json() as Promise<HistoryItem[]>
    )
  );

  return (
    <div>
      {data && data.map(renderHistoryItem)}
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Listing />
    </QueryClientProvider>
  );
};

export default App;
