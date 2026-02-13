import type {
  HttpDestination,
  HttpDestinationOrFetchOptions
} from '@sap-cloud-sdk/connectivity';

/**
 * A function that provides a destination dynamically.
 * You can use this to decouple destination resolution from environment variables and to enable custom destination resolution logic.
 * This will be called for every request
 * Consider caching the result for better performance.
 * @returns A promise resolving to an HttpDestination or an HttpDestination directly.
 * @example
 * ```typescript
 * import { transformServiceBindingToDestination, type HttpDestination } from '@sap-cloud-sdk/connectivity';
 *
 * const provider = async () => {
 *   const serviceBinding = getCustomServiceBinding();
 *   return transformServiceBindingToDestination(serviceBinding, {
 *       useCache: true
 *   }) as HttpDestination;
 * };
 * ```
 */
export type DestinationProvider = () => Promise<HttpDestination>;

/**
 * A resolvable destination that can be:
 * - An HttpDestination object
 * - Destination fetch options (DestinationFetchOptions)
 * - A provider function that returns a destination.
 *
 * All three forms will be resolved to an HttpDestination when making requests.
 * Using a provider function allows you to avoid environment variable dependencies
 * and implement custom destination resolution logic.
 * @example
 * ```typescript
 * // Option 1: Direct destination
 * const dest: DestinationResolvable = { url: 'https://api.ai.ml.hana.ondemand.com' };
 *
 * // Option 2: Fetch options
 * const dest: DestinationResolvable = { destinationName: 'my-aicore' };
 *
 * // Option 3: Provider function
 * const dest: DestinationResolvable = async () => {
 *   const serviceBinding: Service = {
 *     name: 'aicore',
 *     label: 'aicore',
 *     tags: ['aicore'],
 *     credentials // <-- your service key here
 *   };
 *   return transformServiceBindingToDestination(serviceBinding, {
 *     useCache: true
 *   }) as Promise<HttpDestination>;
 * };
 * ```
 */
export type DestinationResolvable =
  | HttpDestinationOrFetchOptions
  | DestinationProvider;
