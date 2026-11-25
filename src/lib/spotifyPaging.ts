import { SagaIterator } from "redux-saga";
import { call, SagaReturnType } from "redux-saga/effects";

import { spotifyClient } from "./spotifyClient";

/** Maximum page size of most Spotify list endpoints (/me/playlists, /playlists/{id}/items…) */
const PAGE_LIMIT = 50;

/**
 * Saga helper: fetches every page of a Spotify paging endpoint, one after the other
 */
export function* fetchAllPages<Item>(url: string): SagaIterator<Item[]> {
  const items: Item[] = [];
  let offset = 0;
  let hasNextPage = true;

  while (hasNextPage) {
    const request = () =>
      spotifyClient.get<SpotifyApi.PagingObject<Item>>(url, {
        params: { limit: PAGE_LIMIT, offset }
      });
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    items.push(...data.items);
    offset += data.items.length;
    // `next` is null on the last page; an empty page also stops the loop
    hasNextPage = data.next !== null && data.items.length > 0;
  }

  return items;
}
