/**
 * Chunk an array into smaller arrays of specified chunk size.
 * @param arr - Input array to be chunked.
 * @param chunkSize - Size of each chunk.
 * @returns Array of chunks.
 */
export const chunkArray = <T>(arr: T[], chunkSize: number): T[][] =>
    arr.reduce((chunks, elem, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      const chunk = chunks[chunkIndex] || [];

      chunks[chunkIndex] = chunk.concat([elem]);
      return chunks;
    }, [] as T[][]);
