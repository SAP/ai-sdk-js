/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Lifecycle status of the Data Destination. PROCESSING — creation is in progress (background task running). ACTIVE — fully created and available. ERROR — creation failed; see errorMessage for details. DELETING — marked for deletion, awaiting async cleanup.
 *
 */
export type DataDestinationStatus =
  | 'PROCESSING'
  | 'ACTIVE'
  | 'DELETING'
  | 'ERROR';
