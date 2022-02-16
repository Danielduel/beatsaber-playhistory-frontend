import React, {useCallback} from "react";
import qs from "query-string";
import styled from "styled-components";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {BeatSaber} from "@duelsik/twitch-overlay-toolkit";

type SearchParams = {
  secret?: string; // don't do that at home kids
  bridgeMode?: string;
};
const searchParams = qs.parse(window.location.search) as unknown as SearchParams;

const queryClient = new QueryClient();

type PostRequestBody = {
  playerName: string;
  secret: string;
};

type HistoryItem = {
  mapName: string;
  timestamp: number;
  coverUrl: string;
  mapHash: string;
  bsrCode: string;
};

const HistoryItemWrapper = styled.div`
  margin-bottom: 2rem;
`;
const CoverImg = styled.img`
  float: left;
  width: 5rem;
  height: 5rem;
  margin-right: 2rem;
  border: 0px solid black;
  border-radius: 1rem;
`;
const renderHistoryItem = ({mapName, coverUrl, mapHash, bsrCode}: HistoryItem) => {
  return (
    <HistoryItemWrapper>
      <CoverImg src={coverUrl} />
      <span>
        <div>{mapName}</div>
        <div><code>{mapHash}</code></div>
        <div><code>{bsrCode}</code></div>
      </span>
    </HistoryItemWrapper>
  );
}

const Listing = () => {
  const {data} = useQuery('playerData', () =>
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

const ListingInput = () => {
  const isEnabled = !!searchParams.secret;
  const pseudoUserAuth: PostRequestBody = {
    playerName: "test",
    secret: searchParams.secret as string,
  };
  const testData: HistoryItem = {
    bsrCode: "test",
    mapHash: "test",
    mapName: "test",
    coverUrl: "https://wallup.net/wp-content/uploads/2016/03/12/305164-nature-cat.jpg",
    timestamp: Date.now()
  };
  const pushItem = React.useCallback(() => {
    fetch("/api/history/push", {
      method: "POST",
      body: JSON.stringify({...testData, ...pseudoUserAuth}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }, [ pseudoUserAuth, testData ]);
  const clearAll = React.useCallback(() => {
    fetch("/api/history/clearAll", {
      method: "POST",
      body: JSON.stringify({...pseudoUserAuth}),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }, [ pseudoUserAuth ]);


  if (!isEnabled) return null;

  return (
    <div>
      <button onClick={pushItem}>Push data</button>
      <button onClick={clearAll}>Clear all</button>
    </div>
  );
}

const BridgeComponent = () => {
  const pseudoUserAuth = {
    playerName: "test",
    secret: searchParams.secret as string,
  };
  const onSongStart: BeatSaber.HTTPStatus.SongStartHandler = useCallback(async (event) => {
    const {beatmap} = event.status;

    if (!beatmap) return;

    const {songHash, songName, songAuthorName, levelAuthorName} = beatmap;
    const beatsaverDataResponse = await fetch(`https://api.beatsaver.com/hash/${songHash}`);
    const beatsaverData = await beatsaverDataResponse.json() ?? {id: "none"};
    const id = beatsaverData.id as string;
    const coverUrl = beatsaverData?.versions[0]?.coverUrl as string ?? "";

    const mapData: HistoryItem = {
      bsrCode: id,
      mapHash: songHash,
      mapName: `${songName} (${songAuthorName}) mapped by ${levelAuthorName}`,
      coverUrl,
      timestamp: Date.now()
    };
    fetch("/api/history/push", {
      method: "POST",
      body: JSON.stringify({...mapData, ...pseudoUserAuth}),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }, [ pseudoUserAuth ]);

  BeatSaber.useHTTPStatusWebsocket({
    address: "ws://localhost:6557",
    debug: false,
    errorHandler: console.error
  }, [
    {
     songStart: onSongStart
    }
  ]);
  
  return null;
};

const App = () => {
  if (!!searchParams.bridgeMode) {
    return <BridgeComponent />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ListingInput />
      <Listing />
    </QueryClientProvider>
  );
};

export default App;
