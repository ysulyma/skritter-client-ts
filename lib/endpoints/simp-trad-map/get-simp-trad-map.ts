import z from "zod/v4";

export const GetSimpTradMapQuery = z.object({});
export type GetSimpTradMapQuery = z.infer<typeof GetSimpTradMapQuery>;

export const GetSimpTradMapResponse = z.object({
  /** Object map, going from single simplified character strings to multi-character traditional character strings. */
  SimpTradMap: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export type GetSimpTradMapResponse = z.infer<typeof GetSimpTradMapResponse>;
