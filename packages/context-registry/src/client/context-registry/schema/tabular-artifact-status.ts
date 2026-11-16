/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Lifecycle status of the Tabular Artifact. PROCESSING — the artifact is being created asynchronously (onboarding may be in progress). ERROR — the artifact creation failed. ACTIVE — the artifact is fully available. DELETING — the artifact has been soft-deleted and is awaiting async cleanup.
 *
 */
export type TabularArtifactStatus =
  | 'PROCESSING'
  | 'ERROR'
  | 'ACTIVE'
  | 'DELETING';
