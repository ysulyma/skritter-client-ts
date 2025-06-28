import { type ApiFetch, GET } from "../../utils.ts";

import { ListItemsQuery, ListItemsResponse } from "./list-items.ts";

export const itemsEndpoint = (apiFetch: ApiFetch) => ({
  listItems: GET(
    "listItems",
    "/items",
    ListItemsQuery,
    ListItemsResponse,
    apiFetch,
  ),
});
