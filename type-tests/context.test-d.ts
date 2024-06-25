import { Destination } from '@sap-cloud-sdk/connectivity';
import { expectType } from 'tsd';
import { getAiCoreDestination } from '../src/core/context.js';

expectType<Promise<Destination>>(getAiCoreDestination());
