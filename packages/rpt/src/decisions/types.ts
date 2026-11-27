import type {
  ChoiceQuestion,
  Example,
  Request,
  Response,
  Usage
} from './client/rpt-decisions/schema/index.ts';

/**
 * A JSON value in an RPT Decisions request.
 */
export type SystemOneJsonValue =
  | string
  | number
  | boolean
  | null
  | SystemOneJsonValue[]
  | { [key: string]: SystemOneJsonValue };

/**
 * Content to evaluate, as a string or structured data.
 */
export type SystemOneState = Request['state'];

/**
 * Instructions describing a decision task.
 */
export type SystemOnePrompt = ChoiceQuestion['instructions'];

/**
 * A choice, binary or score question.
 */
export type SystemOneQuestion = Request['questions'][string];

/**
 * A labeled example containing a state and known answers.
 */
export type SystemOneExample = Example;

/**
 * An RPT Decisions request requiring at least two labeled examples.
 */
export type SystemOneRequest = Omit<Request, 'examples'> & {
  /**
   * At least two labeled examples. The service accepts up to 2048 examples.
   */
  examples: [Example, Example, ...Example[]];
};

/**
 * A choice, binary or score answer.
 */
export type SystemOneAnswer = Response['answers'][string];

/**
 * Usage information reported by RPT Decisions.
 */
export type SystemOneUsage = Usage;

/**
 * Answers and metadata returned by RPT Decisions.
 */
export type SystemOneResponse = Response;
