/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'TemplateRefByScenarioNameVersion' schema.
 */
export type TemplateRefByScenarioNameVersion = {
  /**
   * Scenario name
   * @example "some-scenario"
   */
  scenario: string;
  /**
   * Name of the template
   * @example "some-template-name"
   */
  name: string;
  /**
   * Version of the template
   * @example "some version, can be `latest`"
   */
  version: string;
} & Record<string, any>;
