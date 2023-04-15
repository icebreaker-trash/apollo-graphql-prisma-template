import { parse, simplify, type ResolveTree } from 'graphql-parse-resolve-info'
import type { GraphQLResolveInfo } from 'graphql'

export type FieldInfo<T> = Partial<Record<keyof T, ResolveTree>>

export function getFields<T = any>(info: GraphQLResolveInfo): FieldInfo<T> {
  const parsedResolveInfoFragment = parse(info) as ResolveTree
  const { fields } = simplify(parsedResolveInfoFragment, info.returnType)
  return fields
}

// export type ShallowSelectFieldInfo<T> = Partial<Record<keyof T, boolean>>

// export function getShallowSelectFields<T = any>(info: GraphQLResolveInfo) {
//   return Object.entries(getFields(info)).reduce<ShallowSelectFieldInfo<T>>(
//     (acc, [k, v]) => {
//       // @ts-ignore
//       acc[k] = Boolean(v)
//       return acc
//     },
//     {}
//   )
// }
