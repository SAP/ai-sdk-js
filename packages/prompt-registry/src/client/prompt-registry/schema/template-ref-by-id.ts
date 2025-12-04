/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'TemplateRefByID' schema.
 */
export type TemplateRefByID = {
  /**
   * ID of the template in prompt registry
   * @example "template_id"
   */
  id: string;
  /**
   * Defines the scope that is searched for the referenced template.  'tenant' indicates the template is shared across all resource groups within the tenant,  while 'resource_group' indicates the template is only accessible within the specific resource group.
   *
   * Default: "tenant".
   */
  scope?: 'resource_group' | 'tenant';
};
