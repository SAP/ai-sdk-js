import { Destination } from '@sap-cloud-sdk/connectivity';
import { expectType } from 'tsd';
import { getAiCoreDestination } from '../../packages/gen-ai-hub/src/core/context.js';

expectType<Promise<Destination>>(getAiCoreDestination());
