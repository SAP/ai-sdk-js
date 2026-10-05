import { getAiCoreDestination } from '@sap-ai-sdk/core';

import { expectType } from 'tsd';

import type { HttpDestination } from '@sap-cloud-sdk/connectivity';

expectType<Promise<HttpDestination>>(getAiCoreDestination());
