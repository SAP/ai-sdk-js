/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ProvisioningResourceGroupName } from './provisioning-resource-group-name.js';
import type { ProvisioningProvisioningLabel } from './provisioning-provisioning-label.js';
/**
 * Representation of the 'ProvisioningResourceGroupBaseData' schema.
 */
export type ProvisioningResourceGroupBaseData = {
  name: ProvisioningResourceGroupName;
  /**
   * Arbitrary labels as meta information
   */
  labels?: ProvisioningProvisioningLabel[];
} & Record<string, any>;
