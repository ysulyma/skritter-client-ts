import type { ZodSafeParseResult } from "zod/v4";

import { type ListItemsQuery, ListItemsResponse } from "./list-items.ts";

export const itemsEndpoint = (
  apiFetch: <T, Q extends string>(
    url: string,
    query?: Partial<Record<Q, number | boolean | string>>,
  ) => Promise<T>,
) => ({
  async listItems(
    query?: ListItemsQuery,
  ): Promise<ZodSafeParseResult<ListItemsResponse>> {
    const rawResponse = await apiFetch("/items", query);
    const $parsedResponse = ListItemsResponse.safeParse(rawResponse);

    if (!$parsedResponse.success) {
      console.log("ERROR [listItems]");
      console.dir(
        {
          query,
          rawResponse,
        },
        { depth: null },
      );
    }

    return $parsedResponse;
  },
});
