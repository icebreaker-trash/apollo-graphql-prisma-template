/* eslint-disable no-case-declarations */
import {
  GraphQLError,
  Kind,
  DefinitionNode,
  FragmentDefinitionNode,
  OperationDefinitionNode,
  ValidationContext,
  ASTNode
} from 'graphql'

import {
  createComplexityRule,
  simpleEstimator,
  fieldExtensionsEstimator,
  ComplexityEstimator,
  ComplexityEstimatorArgs
} from 'graphql-query-complexity'

function getQueriesAndMutations(definitions: readonly DefinitionNode[]) {
  return definitions.reduce<Record<string, OperationDefinitionNode>>(
    (map, definition) => {
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        map[definition.name ? definition.name.value : ''] = definition
      }
      return map
    },
    {}
  )
}

function getFragments(definitions: readonly DefinitionNode[]) {
  return definitions.reduce<Record<string, FragmentDefinitionNode>>(
    (map, definition) => {
      if (definition.kind === Kind.FRAGMENT_DEFINITION) {
        map[definition.name.value] = definition
      }
      return map
    },
    {}
  )
}
//  fragments: Record<string, FragmentDefinitionNode>,
function determineDepth(node: ASTNode, depthSoFar: number = 0): number {
  switch (node.kind) {
    case Kind.FIELD:
      // by default, ignore the introspection fields which begin with double underscores
      // __typename ignore
      const shouldIgnore = /^__/.test(node.name.value)

      if (shouldIgnore || !node.selectionSet) {
        return 0
      }
      return (
        1 +
        Math.max(
          ...node.selectionSet.selections.map((selection) =>
            determineDepth(selection, depthSoFar + 1)
          )
        )
      )
    case Kind.FRAGMENT_SPREAD:
      return determineDepth(node, depthSoFar + 1)
    case Kind.INLINE_FRAGMENT:
    case Kind.FRAGMENT_DEFINITION:
    case Kind.OPERATION_DEFINITION:
      return Math.max(
        ...node.selectionSet.selections.map((selection) =>
          determineDepth(selection, depthSoFar)
        )
      )
    default:
      throw new Error('uh oh! depth crawler cannot handle: ' + node.kind)
  }
}

// 从内到外的顺序，同时会 resolve fragment
export function myCustomEstimator(): ComplexityEstimator {
  return (args: ComplexityEstimatorArgs): number | void => {
    const depth = determineDepth(args.node)
    return depth
  }
}

export const rule = createComplexityRule({
  // The maximum allowed query complexity, queries above this threshold will be rejected
  maximumComplexity: 1000,

  // The query variables. This is needed because the variables are not available
  // in the visitor of the graphql-js library
  variables: {},

  // The context object for the request (optional)
  context: {},

  // specify operation name only when pass multi-operation documents
  // operationName: string,

  // Optional callback function to retrieve the determined query complexity
  // Will be invoked whether the query is rejected or not
  // This can be used for logging or to implement rate limiting
  onComplete: (complexity: number) => {
    console.log('Determined query complexity: ', complexity)
  },

  // Optional function to create a custom error
  createError: (max: number, actual: number) => {
    return new GraphQLError(
      `Query is too complex: ${actual}. Maximum allowed complexity: ${max}`
    )
  },
  // operationName:'',

  // Add any number of estimators. The estimators are invoked in order, the first
  // numeric value that is being returned by an estimator is used as the field complexity.
  // If no estimator returns a value, an exception is raised.
  estimators: [
    // Add more estimators here...
    // This will assign each field a complexity of 1 if no other estimator
    // returned a value.
    // fieldExtensionsEstimator(),
    // https://www.npmjs.com/package/graphql-depth-limit
    // https://github.com/4Catalyzer/graphql-validation-complexity
    // myCustomEstimator()
    // 字段数量处理器
    // simpleEstimator({
    //   defaultComplexity: 1
    // })
  ]
})
