import { TabpfnClient } from '@sap-ai-sdk/tabpfn';
import { resilience } from '@sap-cloud-sdk/resilience';

import type { PredictResponse } from '@sap-ai-sdk/tabpfn';

const client = new TabpfnClient('tabpfn-3.5-plus');

/**
 * Predict churn labels (classification) from inline JSON data.
 * @returns The prediction results.
 */
export async function predictClassification(): Promise<PredictResponse> {
  return client.predict({
    task_config: {
      task: 'classification',
      predict_params: { output_type: 'probas' }
    },
    X_train: {
      age: [42, 51, 29, 37, 33],
      tenure: [3, 9, 1, 5, 2]
    },
    y_train: { churn: [0, 1, 0, 0, 1] },
    X_test: { age: [37], tenure: [5] }
  });
}

/**
 * Predict a numeric target (regression) from inline JSON data.
 * @returns The prediction results.
 */
export async function predictRegression(): Promise<PredictResponse> {
  return client.predict({
    task_config: {
      task: 'regression',
      predict_params: { output_type: 'mean' }
    },
    X_train: [
      [5.0, 2.0],
      [2.0, 1.5],
      [3.2, 0.7],
      [0.8, 2.8]
    ],
    y_train: [1.0, 1.8, 1.6, 1.8],
    X_test: [
      [1.5, 1.9],
      [2.4, 0.8],
      [3.6, 4.5]
    ]
  });
}

/**
 * Predict regression quantiles with advanced model options.
 * @returns The prediction results.
 */
export async function predictRegressionQuantiles(): Promise<PredictResponse> {
  return client.predict({
    task_config: {
      task: 'regression',
      predict_params: {
        output_type: 'quantiles',
        quantiles: [0.1, 0.5, 0.9]
      },
      tabpfn_config: {
        n_estimators: 4,
        random_state: 42,
        memory_saving_mode: true
      }
    },
    X_train: [
      [5.0, 2.0],
      [2.0, 1.5],
      [3.2, 0.7],
      [0.8, 2.8]
    ],
    y_train: [1.0, 1.8, 1.6, 1.8],
    X_test: [
      [1.5, 1.9],
      [2.4, 0.8]
    ]
  });
}

const xTrainCsv = `age,tenure
42,3
51,9
29,1
37,5
33,2
`;

const yTrainCsv = `churn
0
1
0
0
1
`;

const xTestCsv = `age,tenure
37,5
`;

/**
 * Predict churn labels by uploading CSV dataset files.
 * @returns The prediction results.
 */
export async function predictFiles(): Promise<PredictResponse> {
  const xTrainFile = new File(
    [new Blob([xTrainCsv], { type: 'text/csv' })],
    'x_train.csv',
    { type: 'text/csv' }
  );
  const yTrainFile = new File(
    [new Blob([yTrainCsv], { type: 'text/csv' })],
    'y_train.csv',
    { type: 'text/csv' }
  );
  const xTestFile = new File(
    [new Blob([xTestCsv], { type: 'text/csv' })],
    'x_test.csv',
    { type: 'text/csv' }
  );
  return client.predictFiles({
    x_train: xTrainFile,
    y_train: yTrainFile,
    x_test: xTestFile,
    request: {
      task_config: {
        task: 'classification',
        predict_params: { output_type: 'probas' }
      }
    }
  });
}

export const stringFeaturesData = {
  xTrain: [
    { product: 'Laptop', price: 999.99 },
    { product: 'Office Chair', price: 142.99 },
    { product: 'Mechanical Keyboard', price: 89.99 },
    { product: 'Standing Desk', price: 450.0 },
    { product: 'USB-C Hub', price: 39.99 },
    { product: 'Ergonomic Mouse', price: 59.99 },
    { product: 'Monitor Arm', price: 75.0 },
    { product: 'SSD External Drive', price: 109.99 }
  ],
  yTrain: ['Tech', 'Home', 'Tech', 'Home', 'Tech', 'Tech', 'Home', 'Tech'],
  xTest: [
    { product: 'Wireless Headphones', price: 199.99 },
    { product: 'Bookshelf', price: 320.0 },
    { product: 'Graphics Card', price: 549.99 }
  ]
};

/**
 * Predict a product's sales group (classification with string features) using tabpfn-3.5-plus,
 * which has better support for string-valued columns.
 * @returns The prediction results.
 */
export async function predictWithStringFeatures(): Promise<PredictResponse> {
  return new TabpfnClient('tabpfn-3.5-plus').predict({
    task_config: {
      task: 'classification',
      predict_params: { output_type: 'probas' },
      tabpfn_config: {
        categorical_features_indices: [0]
      }
    },
    X_train: {
      product: stringFeaturesData.xTrain.map(r => r.product),
      price: stringFeaturesData.xTrain.map(r => r.price)
    },
    y_train: { salesgroup: stringFeaturesData.yTrain },
    X_test: {
      product: stringFeaturesData.xTest.map(r => r.product),
      price: stringFeaturesData.xTest.map(r => r.price)
    }
  });
}

/**
 * Predict churn labels using resilience middleware.
 * Configures a 30-second timeout, circuit breaker, and one retry attempt.
 * @returns The prediction results.
 */
export async function predictResilient(): Promise<PredictResponse> {
  return client.predict(
    {
      task_config: {
        task: 'classification',
        predict_params: { output_type: 'preds' }
      },
      X_train: {
        age: [42, 51, 29, 37, 33],
        tenure: [3, 9, 1, 5, 2]
      },
      y_train: { churn: [0, 1, 0, 0, 1] },
      X_test: { age: [37], tenure: [5] }
    },
    {
      middleware: resilience({ timeout: 30000, circuitBreaker: true, retry: 1 })
    }
  );
}
