interface GetSentencesQuery {
  /**
   * string used for pagination
   */
  cursor: string;

  /**
   * The language of the Vocabs you want to search or query for.
   * (default: user setting)*/
  lang: string;

  /**
   * maximum number of Vocabs to fetch
   * (default: 10) (max: 10)*/
  limit: string;

  /**
   * comma-separated list of Vocab properties to return.
   * (default: all)
   */
  fields: string;
}

interface GetSentencesResponse {
  /**
   * list of sentence Vocabs. May return a few more than the given limit.
   */

  Sentences: string;

  /**
   * string to pass back in future requests for pagination. If not included, there are no more. If included, there probably are more.
   */
  cursor: string;
}
