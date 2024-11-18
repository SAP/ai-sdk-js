/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Collection } from './collection.js';
/**
 * A response containing collections retrieved from the server.
 */
export type CollectionsListResponse = {
  resources: Collection[];
  count?: number;
} & Record<string, any>;
