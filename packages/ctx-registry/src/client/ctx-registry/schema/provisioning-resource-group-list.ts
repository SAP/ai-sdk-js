/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ProvisioningResourceList } from './provisioning-resource-list.js';
import type { ProvisioningResourceGroup } from './provisioning-resource-group.js';
/**
 * Representation of the 'ProvisioningResourceGroupList' schema.
 */
export type ProvisioningResourceGroupList = ProvisioningResourceList & {
  resources?: ProvisioningResourceGroup[];
} & Record<string, any>;
