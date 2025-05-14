
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Person
 * 
 */
export type Person = $Result.DefaultSelection<Prisma.$PersonPayload>
/**
 * Model DiaryEntry
 * 
 */
export type DiaryEntry = $Result.DefaultSelection<Prisma.$DiaryEntryPayload>
/**
 * Model DiaryMention
 * 
 */
export type DiaryMention = $Result.DefaultSelection<Prisma.$DiaryMentionPayload>
/**
 * Model DiaryLocation
 * 
 */
export type DiaryLocation = $Result.DefaultSelection<Prisma.$DiaryLocationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more People
 * const people = await prisma.person.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more People
   * const people = await prisma.person.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.person`: Exposes CRUD operations for the **Person** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more People
    * const people = await prisma.person.findMany()
    * ```
    */
  get person(): Prisma.PersonDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.diaryEntry`: Exposes CRUD operations for the **DiaryEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiaryEntries
    * const diaryEntries = await prisma.diaryEntry.findMany()
    * ```
    */
  get diaryEntry(): Prisma.DiaryEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.diaryMention`: Exposes CRUD operations for the **DiaryMention** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiaryMentions
    * const diaryMentions = await prisma.diaryMention.findMany()
    * ```
    */
  get diaryMention(): Prisma.DiaryMentionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.diaryLocation`: Exposes CRUD operations for the **DiaryLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiaryLocations
    * const diaryLocations = await prisma.diaryLocation.findMany()
    * ```
    */
  get diaryLocation(): Prisma.DiaryLocationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Person: 'Person',
    DiaryEntry: 'DiaryEntry',
    DiaryMention: 'DiaryMention',
    DiaryLocation: 'DiaryLocation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "person" | "diaryEntry" | "diaryMention" | "diaryLocation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Person: {
        payload: Prisma.$PersonPayload<ExtArgs>
        fields: Prisma.PersonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PersonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PersonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>
          }
          findFirst: {
            args: Prisma.PersonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PersonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>
          }
          findMany: {
            args: Prisma.PersonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>[]
          }
          create: {
            args: Prisma.PersonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>
          }
          createMany: {
            args: Prisma.PersonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PersonCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>[]
          }
          delete: {
            args: Prisma.PersonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>
          }
          update: {
            args: Prisma.PersonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>
          }
          deleteMany: {
            args: Prisma.PersonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PersonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PersonUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>[]
          }
          upsert: {
            args: Prisma.PersonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonPayload>
          }
          aggregate: {
            args: Prisma.PersonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePerson>
          }
          groupBy: {
            args: Prisma.PersonGroupByArgs<ExtArgs>
            result: $Utils.Optional<PersonGroupByOutputType>[]
          }
          count: {
            args: Prisma.PersonCountArgs<ExtArgs>
            result: $Utils.Optional<PersonCountAggregateOutputType> | number
          }
        }
      }
      DiaryEntry: {
        payload: Prisma.$DiaryEntryPayload<ExtArgs>
        fields: Prisma.DiaryEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiaryEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiaryEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>
          }
          findFirst: {
            args: Prisma.DiaryEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiaryEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>
          }
          findMany: {
            args: Prisma.DiaryEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>[]
          }
          create: {
            args: Prisma.DiaryEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>
          }
          createMany: {
            args: Prisma.DiaryEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiaryEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>[]
          }
          delete: {
            args: Prisma.DiaryEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>
          }
          update: {
            args: Prisma.DiaryEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>
          }
          deleteMany: {
            args: Prisma.DiaryEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiaryEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DiaryEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>[]
          }
          upsert: {
            args: Prisma.DiaryEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryEntryPayload>
          }
          aggregate: {
            args: Prisma.DiaryEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiaryEntry>
          }
          groupBy: {
            args: Prisma.DiaryEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiaryEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiaryEntryCountArgs<ExtArgs>
            result: $Utils.Optional<DiaryEntryCountAggregateOutputType> | number
          }
        }
      }
      DiaryMention: {
        payload: Prisma.$DiaryMentionPayload<ExtArgs>
        fields: Prisma.DiaryMentionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiaryMentionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiaryMentionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>
          }
          findFirst: {
            args: Prisma.DiaryMentionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiaryMentionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>
          }
          findMany: {
            args: Prisma.DiaryMentionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>[]
          }
          create: {
            args: Prisma.DiaryMentionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>
          }
          createMany: {
            args: Prisma.DiaryMentionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiaryMentionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>[]
          }
          delete: {
            args: Prisma.DiaryMentionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>
          }
          update: {
            args: Prisma.DiaryMentionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>
          }
          deleteMany: {
            args: Prisma.DiaryMentionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiaryMentionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DiaryMentionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>[]
          }
          upsert: {
            args: Prisma.DiaryMentionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryMentionPayload>
          }
          aggregate: {
            args: Prisma.DiaryMentionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiaryMention>
          }
          groupBy: {
            args: Prisma.DiaryMentionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiaryMentionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiaryMentionCountArgs<ExtArgs>
            result: $Utils.Optional<DiaryMentionCountAggregateOutputType> | number
          }
        }
      }
      DiaryLocation: {
        payload: Prisma.$DiaryLocationPayload<ExtArgs>
        fields: Prisma.DiaryLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiaryLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiaryLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>
          }
          findFirst: {
            args: Prisma.DiaryLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiaryLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>
          }
          findMany: {
            args: Prisma.DiaryLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>[]
          }
          create: {
            args: Prisma.DiaryLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>
          }
          createMany: {
            args: Prisma.DiaryLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiaryLocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>[]
          }
          delete: {
            args: Prisma.DiaryLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>
          }
          update: {
            args: Prisma.DiaryLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>
          }
          deleteMany: {
            args: Prisma.DiaryLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiaryLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DiaryLocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>[]
          }
          upsert: {
            args: Prisma.DiaryLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiaryLocationPayload>
          }
          aggregate: {
            args: Prisma.DiaryLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiaryLocation>
          }
          groupBy: {
            args: Prisma.DiaryLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiaryLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiaryLocationCountArgs<ExtArgs>
            result: $Utils.Optional<DiaryLocationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    person?: PersonOmit
    diaryEntry?: DiaryEntryOmit
    diaryMention?: DiaryMentionOmit
    diaryLocation?: DiaryLocationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PersonCountOutputType
   */

  export type PersonCountOutputType = {
    mentions: number
  }

  export type PersonCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentions?: boolean | PersonCountOutputTypeCountMentionsArgs
  }

  // Custom InputTypes
  /**
   * PersonCountOutputType without action
   */
  export type PersonCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonCountOutputType
     */
    select?: PersonCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PersonCountOutputType without action
   */
  export type PersonCountOutputTypeCountMentionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryMentionWhereInput
  }


  /**
   * Count Type DiaryEntryCountOutputType
   */

  export type DiaryEntryCountOutputType = {
    mentions: number
    locations: number
  }

  export type DiaryEntryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentions?: boolean | DiaryEntryCountOutputTypeCountMentionsArgs
    locations?: boolean | DiaryEntryCountOutputTypeCountLocationsArgs
  }

  // Custom InputTypes
  /**
   * DiaryEntryCountOutputType without action
   */
  export type DiaryEntryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntryCountOutputType
     */
    select?: DiaryEntryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DiaryEntryCountOutputType without action
   */
  export type DiaryEntryCountOutputTypeCountMentionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryMentionWhereInput
  }

  /**
   * DiaryEntryCountOutputType without action
   */
  export type DiaryEntryCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryLocationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Person
   */

  export type AggregatePerson = {
    _count: PersonCountAggregateOutputType | null
    _min: PersonMinAggregateOutputType | null
    _max: PersonMaxAggregateOutputType | null
  }

  export type PersonMinAggregateOutputType = {
    id: string | null
    name: string | null
    birthday: Date | null
    howWeMet: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PersonMaxAggregateOutputType = {
    id: string | null
    name: string | null
    birthday: Date | null
    howWeMet: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PersonCountAggregateOutputType = {
    id: number
    name: number
    birthday: number
    howWeMet: number
    interests: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PersonMinAggregateInputType = {
    id?: true
    name?: true
    birthday?: true
    howWeMet?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PersonMaxAggregateInputType = {
    id?: true
    name?: true
    birthday?: true
    howWeMet?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PersonCountAggregateInputType = {
    id?: true
    name?: true
    birthday?: true
    howWeMet?: true
    interests?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PersonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Person to aggregate.
     */
    where?: PersonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of People to fetch.
     */
    orderBy?: PersonOrderByWithRelationInput | PersonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PersonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` People from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` People.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned People
    **/
    _count?: true | PersonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PersonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PersonMaxAggregateInputType
  }

  export type GetPersonAggregateType<T extends PersonAggregateArgs> = {
        [P in keyof T & keyof AggregatePerson]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePerson[P]>
      : GetScalarType<T[P], AggregatePerson[P]>
  }




  export type PersonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonWhereInput
    orderBy?: PersonOrderByWithAggregationInput | PersonOrderByWithAggregationInput[]
    by: PersonScalarFieldEnum[] | PersonScalarFieldEnum
    having?: PersonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PersonCountAggregateInputType | true
    _min?: PersonMinAggregateInputType
    _max?: PersonMaxAggregateInputType
  }

  export type PersonGroupByOutputType = {
    id: string
    name: string
    birthday: Date | null
    howWeMet: string | null
    interests: string[]
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: PersonCountAggregateOutputType | null
    _min: PersonMinAggregateOutputType | null
    _max: PersonMaxAggregateOutputType | null
  }

  type GetPersonGroupByPayload<T extends PersonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PersonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PersonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PersonGroupByOutputType[P]>
            : GetScalarType<T[P], PersonGroupByOutputType[P]>
        }
      >
    >


  export type PersonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    birthday?: boolean
    howWeMet?: boolean
    interests?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    mentions?: boolean | Person$mentionsArgs<ExtArgs>
    _count?: boolean | PersonCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["person"]>

  export type PersonSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    birthday?: boolean
    howWeMet?: boolean
    interests?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["person"]>

  export type PersonSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    birthday?: boolean
    howWeMet?: boolean
    interests?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["person"]>

  export type PersonSelectScalar = {
    id?: boolean
    name?: boolean
    birthday?: boolean
    howWeMet?: boolean
    interests?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PersonOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "birthday" | "howWeMet" | "interests" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["person"]>
  export type PersonInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentions?: boolean | Person$mentionsArgs<ExtArgs>
    _count?: boolean | PersonCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PersonIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PersonIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PersonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Person"
    objects: {
      mentions: Prisma.$DiaryMentionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      birthday: Date | null
      howWeMet: string | null
      interests: string[]
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["person"]>
    composites: {}
  }

  type PersonGetPayload<S extends boolean | null | undefined | PersonDefaultArgs> = $Result.GetResult<Prisma.$PersonPayload, S>

  type PersonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PersonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PersonCountAggregateInputType | true
    }

  export interface PersonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Person'], meta: { name: 'Person' } }
    /**
     * Find zero or one Person that matches the filter.
     * @param {PersonFindUniqueArgs} args - Arguments to find a Person
     * @example
     * // Get one Person
     * const person = await prisma.person.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PersonFindUniqueArgs>(args: SelectSubset<T, PersonFindUniqueArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Person that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PersonFindUniqueOrThrowArgs} args - Arguments to find a Person
     * @example
     * // Get one Person
     * const person = await prisma.person.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PersonFindUniqueOrThrowArgs>(args: SelectSubset<T, PersonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Person that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonFindFirstArgs} args - Arguments to find a Person
     * @example
     * // Get one Person
     * const person = await prisma.person.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PersonFindFirstArgs>(args?: SelectSubset<T, PersonFindFirstArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Person that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonFindFirstOrThrowArgs} args - Arguments to find a Person
     * @example
     * // Get one Person
     * const person = await prisma.person.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PersonFindFirstOrThrowArgs>(args?: SelectSubset<T, PersonFindFirstOrThrowArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more People that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all People
     * const people = await prisma.person.findMany()
     * 
     * // Get first 10 People
     * const people = await prisma.person.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const personWithIdOnly = await prisma.person.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PersonFindManyArgs>(args?: SelectSubset<T, PersonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Person.
     * @param {PersonCreateArgs} args - Arguments to create a Person.
     * @example
     * // Create one Person
     * const Person = await prisma.person.create({
     *   data: {
     *     // ... data to create a Person
     *   }
     * })
     * 
     */
    create<T extends PersonCreateArgs>(args: SelectSubset<T, PersonCreateArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many People.
     * @param {PersonCreateManyArgs} args - Arguments to create many People.
     * @example
     * // Create many People
     * const person = await prisma.person.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PersonCreateManyArgs>(args?: SelectSubset<T, PersonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many People and returns the data saved in the database.
     * @param {PersonCreateManyAndReturnArgs} args - Arguments to create many People.
     * @example
     * // Create many People
     * const person = await prisma.person.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many People and only return the `id`
     * const personWithIdOnly = await prisma.person.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PersonCreateManyAndReturnArgs>(args?: SelectSubset<T, PersonCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Person.
     * @param {PersonDeleteArgs} args - Arguments to delete one Person.
     * @example
     * // Delete one Person
     * const Person = await prisma.person.delete({
     *   where: {
     *     // ... filter to delete one Person
     *   }
     * })
     * 
     */
    delete<T extends PersonDeleteArgs>(args: SelectSubset<T, PersonDeleteArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Person.
     * @param {PersonUpdateArgs} args - Arguments to update one Person.
     * @example
     * // Update one Person
     * const person = await prisma.person.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PersonUpdateArgs>(args: SelectSubset<T, PersonUpdateArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more People.
     * @param {PersonDeleteManyArgs} args - Arguments to filter People to delete.
     * @example
     * // Delete a few People
     * const { count } = await prisma.person.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PersonDeleteManyArgs>(args?: SelectSubset<T, PersonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more People.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many People
     * const person = await prisma.person.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PersonUpdateManyArgs>(args: SelectSubset<T, PersonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more People and returns the data updated in the database.
     * @param {PersonUpdateManyAndReturnArgs} args - Arguments to update many People.
     * @example
     * // Update many People
     * const person = await prisma.person.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more People and only return the `id`
     * const personWithIdOnly = await prisma.person.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PersonUpdateManyAndReturnArgs>(args: SelectSubset<T, PersonUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Person.
     * @param {PersonUpsertArgs} args - Arguments to update or create a Person.
     * @example
     * // Update or create a Person
     * const person = await prisma.person.upsert({
     *   create: {
     *     // ... data to create a Person
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Person we want to update
     *   }
     * })
     */
    upsert<T extends PersonUpsertArgs>(args: SelectSubset<T, PersonUpsertArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of People.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonCountArgs} args - Arguments to filter People to count.
     * @example
     * // Count the number of People
     * const count = await prisma.person.count({
     *   where: {
     *     // ... the filter for the People we want to count
     *   }
     * })
    **/
    count<T extends PersonCountArgs>(
      args?: Subset<T, PersonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PersonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Person.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PersonAggregateArgs>(args: Subset<T, PersonAggregateArgs>): Prisma.PrismaPromise<GetPersonAggregateType<T>>

    /**
     * Group by Person.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PersonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PersonGroupByArgs['orderBy'] }
        : { orderBy?: PersonGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PersonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Person model
   */
  readonly fields: PersonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Person.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PersonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mentions<T extends Person$mentionsArgs<ExtArgs> = {}>(args?: Subset<T, Person$mentionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Person model
   */
  interface PersonFieldRefs {
    readonly id: FieldRef<"Person", 'String'>
    readonly name: FieldRef<"Person", 'String'>
    readonly birthday: FieldRef<"Person", 'DateTime'>
    readonly howWeMet: FieldRef<"Person", 'String'>
    readonly interests: FieldRef<"Person", 'String[]'>
    readonly notes: FieldRef<"Person", 'String'>
    readonly createdAt: FieldRef<"Person", 'DateTime'>
    readonly updatedAt: FieldRef<"Person", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Person findUnique
   */
  export type PersonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * Filter, which Person to fetch.
     */
    where: PersonWhereUniqueInput
  }

  /**
   * Person findUniqueOrThrow
   */
  export type PersonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * Filter, which Person to fetch.
     */
    where: PersonWhereUniqueInput
  }

  /**
   * Person findFirst
   */
  export type PersonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * Filter, which Person to fetch.
     */
    where?: PersonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of People to fetch.
     */
    orderBy?: PersonOrderByWithRelationInput | PersonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for People.
     */
    cursor?: PersonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` People from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` People.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of People.
     */
    distinct?: PersonScalarFieldEnum | PersonScalarFieldEnum[]
  }

  /**
   * Person findFirstOrThrow
   */
  export type PersonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * Filter, which Person to fetch.
     */
    where?: PersonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of People to fetch.
     */
    orderBy?: PersonOrderByWithRelationInput | PersonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for People.
     */
    cursor?: PersonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` People from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` People.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of People.
     */
    distinct?: PersonScalarFieldEnum | PersonScalarFieldEnum[]
  }

  /**
   * Person findMany
   */
  export type PersonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * Filter, which People to fetch.
     */
    where?: PersonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of People to fetch.
     */
    orderBy?: PersonOrderByWithRelationInput | PersonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing People.
     */
    cursor?: PersonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` People from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` People.
     */
    skip?: number
    distinct?: PersonScalarFieldEnum | PersonScalarFieldEnum[]
  }

  /**
   * Person create
   */
  export type PersonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * The data needed to create a Person.
     */
    data: XOR<PersonCreateInput, PersonUncheckedCreateInput>
  }

  /**
   * Person createMany
   */
  export type PersonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many People.
     */
    data: PersonCreateManyInput | PersonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Person createManyAndReturn
   */
  export type PersonCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * The data used to create many People.
     */
    data: PersonCreateManyInput | PersonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Person update
   */
  export type PersonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * The data needed to update a Person.
     */
    data: XOR<PersonUpdateInput, PersonUncheckedUpdateInput>
    /**
     * Choose, which Person to update.
     */
    where: PersonWhereUniqueInput
  }

  /**
   * Person updateMany
   */
  export type PersonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update People.
     */
    data: XOR<PersonUpdateManyMutationInput, PersonUncheckedUpdateManyInput>
    /**
     * Filter which People to update
     */
    where?: PersonWhereInput
    /**
     * Limit how many People to update.
     */
    limit?: number
  }

  /**
   * Person updateManyAndReturn
   */
  export type PersonUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * The data used to update People.
     */
    data: XOR<PersonUpdateManyMutationInput, PersonUncheckedUpdateManyInput>
    /**
     * Filter which People to update
     */
    where?: PersonWhereInput
    /**
     * Limit how many People to update.
     */
    limit?: number
  }

  /**
   * Person upsert
   */
  export type PersonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * The filter to search for the Person to update in case it exists.
     */
    where: PersonWhereUniqueInput
    /**
     * In case the Person found by the `where` argument doesn't exist, create a new Person with this data.
     */
    create: XOR<PersonCreateInput, PersonUncheckedCreateInput>
    /**
     * In case the Person was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PersonUpdateInput, PersonUncheckedUpdateInput>
  }

  /**
   * Person delete
   */
  export type PersonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
    /**
     * Filter which Person to delete.
     */
    where: PersonWhereUniqueInput
  }

  /**
   * Person deleteMany
   */
  export type PersonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which People to delete
     */
    where?: PersonWhereInput
    /**
     * Limit how many People to delete.
     */
    limit?: number
  }

  /**
   * Person.mentions
   */
  export type Person$mentionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    where?: DiaryMentionWhereInput
    orderBy?: DiaryMentionOrderByWithRelationInput | DiaryMentionOrderByWithRelationInput[]
    cursor?: DiaryMentionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiaryMentionScalarFieldEnum | DiaryMentionScalarFieldEnum[]
  }

  /**
   * Person without action
   */
  export type PersonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Person
     */
    select?: PersonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Person
     */
    omit?: PersonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonInclude<ExtArgs> | null
  }


  /**
   * Model DiaryEntry
   */

  export type AggregateDiaryEntry = {
    _count: DiaryEntryCountAggregateOutputType | null
    _min: DiaryEntryMinAggregateOutputType | null
    _max: DiaryEntryMaxAggregateOutputType | null
  }

  export type DiaryEntryMinAggregateOutputType = {
    id: string | null
    content: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiaryEntryMaxAggregateOutputType = {
    id: string | null
    content: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiaryEntryCountAggregateOutputType = {
    id: number
    content: number
    date: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DiaryEntryMinAggregateInputType = {
    id?: true
    content?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiaryEntryMaxAggregateInputType = {
    id?: true
    content?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiaryEntryCountAggregateInputType = {
    id?: true
    content?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DiaryEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiaryEntry to aggregate.
     */
    where?: DiaryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryEntries to fetch.
     */
    orderBy?: DiaryEntryOrderByWithRelationInput | DiaryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiaryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiaryEntries
    **/
    _count?: true | DiaryEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiaryEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiaryEntryMaxAggregateInputType
  }

  export type GetDiaryEntryAggregateType<T extends DiaryEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateDiaryEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiaryEntry[P]>
      : GetScalarType<T[P], AggregateDiaryEntry[P]>
  }




  export type DiaryEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryEntryWhereInput
    orderBy?: DiaryEntryOrderByWithAggregationInput | DiaryEntryOrderByWithAggregationInput[]
    by: DiaryEntryScalarFieldEnum[] | DiaryEntryScalarFieldEnum
    having?: DiaryEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiaryEntryCountAggregateInputType | true
    _min?: DiaryEntryMinAggregateInputType
    _max?: DiaryEntryMaxAggregateInputType
  }

  export type DiaryEntryGroupByOutputType = {
    id: string
    content: string
    date: Date
    createdAt: Date
    updatedAt: Date
    _count: DiaryEntryCountAggregateOutputType | null
    _min: DiaryEntryMinAggregateOutputType | null
    _max: DiaryEntryMaxAggregateOutputType | null
  }

  type GetDiaryEntryGroupByPayload<T extends DiaryEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiaryEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiaryEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiaryEntryGroupByOutputType[P]>
            : GetScalarType<T[P], DiaryEntryGroupByOutputType[P]>
        }
      >
    >


  export type DiaryEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    mentions?: boolean | DiaryEntry$mentionsArgs<ExtArgs>
    locations?: boolean | DiaryEntry$locationsArgs<ExtArgs>
    _count?: boolean | DiaryEntryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diaryEntry"]>

  export type DiaryEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["diaryEntry"]>

  export type DiaryEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["diaryEntry"]>

  export type DiaryEntrySelectScalar = {
    id?: boolean
    content?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DiaryEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "date" | "createdAt" | "updatedAt", ExtArgs["result"]["diaryEntry"]>
  export type DiaryEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentions?: boolean | DiaryEntry$mentionsArgs<ExtArgs>
    locations?: boolean | DiaryEntry$locationsArgs<ExtArgs>
    _count?: boolean | DiaryEntryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DiaryEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DiaryEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DiaryEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiaryEntry"
    objects: {
      mentions: Prisma.$DiaryMentionPayload<ExtArgs>[]
      locations: Prisma.$DiaryLocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      date: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["diaryEntry"]>
    composites: {}
  }

  type DiaryEntryGetPayload<S extends boolean | null | undefined | DiaryEntryDefaultArgs> = $Result.GetResult<Prisma.$DiaryEntryPayload, S>

  type DiaryEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DiaryEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DiaryEntryCountAggregateInputType | true
    }

  export interface DiaryEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiaryEntry'], meta: { name: 'DiaryEntry' } }
    /**
     * Find zero or one DiaryEntry that matches the filter.
     * @param {DiaryEntryFindUniqueArgs} args - Arguments to find a DiaryEntry
     * @example
     * // Get one DiaryEntry
     * const diaryEntry = await prisma.diaryEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiaryEntryFindUniqueArgs>(args: SelectSubset<T, DiaryEntryFindUniqueArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DiaryEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DiaryEntryFindUniqueOrThrowArgs} args - Arguments to find a DiaryEntry
     * @example
     * // Get one DiaryEntry
     * const diaryEntry = await prisma.diaryEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiaryEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, DiaryEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiaryEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryEntryFindFirstArgs} args - Arguments to find a DiaryEntry
     * @example
     * // Get one DiaryEntry
     * const diaryEntry = await prisma.diaryEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiaryEntryFindFirstArgs>(args?: SelectSubset<T, DiaryEntryFindFirstArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiaryEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryEntryFindFirstOrThrowArgs} args - Arguments to find a DiaryEntry
     * @example
     * // Get one DiaryEntry
     * const diaryEntry = await prisma.diaryEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiaryEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, DiaryEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DiaryEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiaryEntries
     * const diaryEntries = await prisma.diaryEntry.findMany()
     * 
     * // Get first 10 DiaryEntries
     * const diaryEntries = await prisma.diaryEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diaryEntryWithIdOnly = await prisma.diaryEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiaryEntryFindManyArgs>(args?: SelectSubset<T, DiaryEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DiaryEntry.
     * @param {DiaryEntryCreateArgs} args - Arguments to create a DiaryEntry.
     * @example
     * // Create one DiaryEntry
     * const DiaryEntry = await prisma.diaryEntry.create({
     *   data: {
     *     // ... data to create a DiaryEntry
     *   }
     * })
     * 
     */
    create<T extends DiaryEntryCreateArgs>(args: SelectSubset<T, DiaryEntryCreateArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DiaryEntries.
     * @param {DiaryEntryCreateManyArgs} args - Arguments to create many DiaryEntries.
     * @example
     * // Create many DiaryEntries
     * const diaryEntry = await prisma.diaryEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiaryEntryCreateManyArgs>(args?: SelectSubset<T, DiaryEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiaryEntries and returns the data saved in the database.
     * @param {DiaryEntryCreateManyAndReturnArgs} args - Arguments to create many DiaryEntries.
     * @example
     * // Create many DiaryEntries
     * const diaryEntry = await prisma.diaryEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiaryEntries and only return the `id`
     * const diaryEntryWithIdOnly = await prisma.diaryEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiaryEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, DiaryEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DiaryEntry.
     * @param {DiaryEntryDeleteArgs} args - Arguments to delete one DiaryEntry.
     * @example
     * // Delete one DiaryEntry
     * const DiaryEntry = await prisma.diaryEntry.delete({
     *   where: {
     *     // ... filter to delete one DiaryEntry
     *   }
     * })
     * 
     */
    delete<T extends DiaryEntryDeleteArgs>(args: SelectSubset<T, DiaryEntryDeleteArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DiaryEntry.
     * @param {DiaryEntryUpdateArgs} args - Arguments to update one DiaryEntry.
     * @example
     * // Update one DiaryEntry
     * const diaryEntry = await prisma.diaryEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiaryEntryUpdateArgs>(args: SelectSubset<T, DiaryEntryUpdateArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DiaryEntries.
     * @param {DiaryEntryDeleteManyArgs} args - Arguments to filter DiaryEntries to delete.
     * @example
     * // Delete a few DiaryEntries
     * const { count } = await prisma.diaryEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiaryEntryDeleteManyArgs>(args?: SelectSubset<T, DiaryEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiaryEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiaryEntries
     * const diaryEntry = await prisma.diaryEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiaryEntryUpdateManyArgs>(args: SelectSubset<T, DiaryEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiaryEntries and returns the data updated in the database.
     * @param {DiaryEntryUpdateManyAndReturnArgs} args - Arguments to update many DiaryEntries.
     * @example
     * // Update many DiaryEntries
     * const diaryEntry = await prisma.diaryEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DiaryEntries and only return the `id`
     * const diaryEntryWithIdOnly = await prisma.diaryEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DiaryEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, DiaryEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DiaryEntry.
     * @param {DiaryEntryUpsertArgs} args - Arguments to update or create a DiaryEntry.
     * @example
     * // Update or create a DiaryEntry
     * const diaryEntry = await prisma.diaryEntry.upsert({
     *   create: {
     *     // ... data to create a DiaryEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiaryEntry we want to update
     *   }
     * })
     */
    upsert<T extends DiaryEntryUpsertArgs>(args: SelectSubset<T, DiaryEntryUpsertArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DiaryEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryEntryCountArgs} args - Arguments to filter DiaryEntries to count.
     * @example
     * // Count the number of DiaryEntries
     * const count = await prisma.diaryEntry.count({
     *   where: {
     *     // ... the filter for the DiaryEntries we want to count
     *   }
     * })
    **/
    count<T extends DiaryEntryCountArgs>(
      args?: Subset<T, DiaryEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiaryEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiaryEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiaryEntryAggregateArgs>(args: Subset<T, DiaryEntryAggregateArgs>): Prisma.PrismaPromise<GetDiaryEntryAggregateType<T>>

    /**
     * Group by DiaryEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiaryEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiaryEntryGroupByArgs['orderBy'] }
        : { orderBy?: DiaryEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiaryEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiaryEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiaryEntry model
   */
  readonly fields: DiaryEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiaryEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiaryEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mentions<T extends DiaryEntry$mentionsArgs<ExtArgs> = {}>(args?: Subset<T, DiaryEntry$mentionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    locations<T extends DiaryEntry$locationsArgs<ExtArgs> = {}>(args?: Subset<T, DiaryEntry$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DiaryEntry model
   */
  interface DiaryEntryFieldRefs {
    readonly id: FieldRef<"DiaryEntry", 'String'>
    readonly content: FieldRef<"DiaryEntry", 'String'>
    readonly date: FieldRef<"DiaryEntry", 'DateTime'>
    readonly createdAt: FieldRef<"DiaryEntry", 'DateTime'>
    readonly updatedAt: FieldRef<"DiaryEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiaryEntry findUnique
   */
  export type DiaryEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * Filter, which DiaryEntry to fetch.
     */
    where: DiaryEntryWhereUniqueInput
  }

  /**
   * DiaryEntry findUniqueOrThrow
   */
  export type DiaryEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * Filter, which DiaryEntry to fetch.
     */
    where: DiaryEntryWhereUniqueInput
  }

  /**
   * DiaryEntry findFirst
   */
  export type DiaryEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * Filter, which DiaryEntry to fetch.
     */
    where?: DiaryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryEntries to fetch.
     */
    orderBy?: DiaryEntryOrderByWithRelationInput | DiaryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiaryEntries.
     */
    cursor?: DiaryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiaryEntries.
     */
    distinct?: DiaryEntryScalarFieldEnum | DiaryEntryScalarFieldEnum[]
  }

  /**
   * DiaryEntry findFirstOrThrow
   */
  export type DiaryEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * Filter, which DiaryEntry to fetch.
     */
    where?: DiaryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryEntries to fetch.
     */
    orderBy?: DiaryEntryOrderByWithRelationInput | DiaryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiaryEntries.
     */
    cursor?: DiaryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiaryEntries.
     */
    distinct?: DiaryEntryScalarFieldEnum | DiaryEntryScalarFieldEnum[]
  }

  /**
   * DiaryEntry findMany
   */
  export type DiaryEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * Filter, which DiaryEntries to fetch.
     */
    where?: DiaryEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryEntries to fetch.
     */
    orderBy?: DiaryEntryOrderByWithRelationInput | DiaryEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiaryEntries.
     */
    cursor?: DiaryEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryEntries.
     */
    skip?: number
    distinct?: DiaryEntryScalarFieldEnum | DiaryEntryScalarFieldEnum[]
  }

  /**
   * DiaryEntry create
   */
  export type DiaryEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a DiaryEntry.
     */
    data: XOR<DiaryEntryCreateInput, DiaryEntryUncheckedCreateInput>
  }

  /**
   * DiaryEntry createMany
   */
  export type DiaryEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiaryEntries.
     */
    data: DiaryEntryCreateManyInput | DiaryEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiaryEntry createManyAndReturn
   */
  export type DiaryEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * The data used to create many DiaryEntries.
     */
    data: DiaryEntryCreateManyInput | DiaryEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiaryEntry update
   */
  export type DiaryEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a DiaryEntry.
     */
    data: XOR<DiaryEntryUpdateInput, DiaryEntryUncheckedUpdateInput>
    /**
     * Choose, which DiaryEntry to update.
     */
    where: DiaryEntryWhereUniqueInput
  }

  /**
   * DiaryEntry updateMany
   */
  export type DiaryEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiaryEntries.
     */
    data: XOR<DiaryEntryUpdateManyMutationInput, DiaryEntryUncheckedUpdateManyInput>
    /**
     * Filter which DiaryEntries to update
     */
    where?: DiaryEntryWhereInput
    /**
     * Limit how many DiaryEntries to update.
     */
    limit?: number
  }

  /**
   * DiaryEntry updateManyAndReturn
   */
  export type DiaryEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * The data used to update DiaryEntries.
     */
    data: XOR<DiaryEntryUpdateManyMutationInput, DiaryEntryUncheckedUpdateManyInput>
    /**
     * Filter which DiaryEntries to update
     */
    where?: DiaryEntryWhereInput
    /**
     * Limit how many DiaryEntries to update.
     */
    limit?: number
  }

  /**
   * DiaryEntry upsert
   */
  export type DiaryEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the DiaryEntry to update in case it exists.
     */
    where: DiaryEntryWhereUniqueInput
    /**
     * In case the DiaryEntry found by the `where` argument doesn't exist, create a new DiaryEntry with this data.
     */
    create: XOR<DiaryEntryCreateInput, DiaryEntryUncheckedCreateInput>
    /**
     * In case the DiaryEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiaryEntryUpdateInput, DiaryEntryUncheckedUpdateInput>
  }

  /**
   * DiaryEntry delete
   */
  export type DiaryEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
    /**
     * Filter which DiaryEntry to delete.
     */
    where: DiaryEntryWhereUniqueInput
  }

  /**
   * DiaryEntry deleteMany
   */
  export type DiaryEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiaryEntries to delete
     */
    where?: DiaryEntryWhereInput
    /**
     * Limit how many DiaryEntries to delete.
     */
    limit?: number
  }

  /**
   * DiaryEntry.mentions
   */
  export type DiaryEntry$mentionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    where?: DiaryMentionWhereInput
    orderBy?: DiaryMentionOrderByWithRelationInput | DiaryMentionOrderByWithRelationInput[]
    cursor?: DiaryMentionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiaryMentionScalarFieldEnum | DiaryMentionScalarFieldEnum[]
  }

  /**
   * DiaryEntry.locations
   */
  export type DiaryEntry$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    where?: DiaryLocationWhereInput
    orderBy?: DiaryLocationOrderByWithRelationInput | DiaryLocationOrderByWithRelationInput[]
    cursor?: DiaryLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiaryLocationScalarFieldEnum | DiaryLocationScalarFieldEnum[]
  }

  /**
   * DiaryEntry without action
   */
  export type DiaryEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryEntry
     */
    select?: DiaryEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryEntry
     */
    omit?: DiaryEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryEntryInclude<ExtArgs> | null
  }


  /**
   * Model DiaryMention
   */

  export type AggregateDiaryMention = {
    _count: DiaryMentionCountAggregateOutputType | null
    _min: DiaryMentionMinAggregateOutputType | null
    _max: DiaryMentionMaxAggregateOutputType | null
  }

  export type DiaryMentionMinAggregateOutputType = {
    id: string | null
    personId: string | null
    diaryEntryId: string | null
    createdAt: Date | null
  }

  export type DiaryMentionMaxAggregateOutputType = {
    id: string | null
    personId: string | null
    diaryEntryId: string | null
    createdAt: Date | null
  }

  export type DiaryMentionCountAggregateOutputType = {
    id: number
    personId: number
    diaryEntryId: number
    createdAt: number
    _all: number
  }


  export type DiaryMentionMinAggregateInputType = {
    id?: true
    personId?: true
    diaryEntryId?: true
    createdAt?: true
  }

  export type DiaryMentionMaxAggregateInputType = {
    id?: true
    personId?: true
    diaryEntryId?: true
    createdAt?: true
  }

  export type DiaryMentionCountAggregateInputType = {
    id?: true
    personId?: true
    diaryEntryId?: true
    createdAt?: true
    _all?: true
  }

  export type DiaryMentionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiaryMention to aggregate.
     */
    where?: DiaryMentionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryMentions to fetch.
     */
    orderBy?: DiaryMentionOrderByWithRelationInput | DiaryMentionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiaryMentionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryMentions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryMentions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiaryMentions
    **/
    _count?: true | DiaryMentionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiaryMentionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiaryMentionMaxAggregateInputType
  }

  export type GetDiaryMentionAggregateType<T extends DiaryMentionAggregateArgs> = {
        [P in keyof T & keyof AggregateDiaryMention]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiaryMention[P]>
      : GetScalarType<T[P], AggregateDiaryMention[P]>
  }




  export type DiaryMentionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryMentionWhereInput
    orderBy?: DiaryMentionOrderByWithAggregationInput | DiaryMentionOrderByWithAggregationInput[]
    by: DiaryMentionScalarFieldEnum[] | DiaryMentionScalarFieldEnum
    having?: DiaryMentionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiaryMentionCountAggregateInputType | true
    _min?: DiaryMentionMinAggregateInputType
    _max?: DiaryMentionMaxAggregateInputType
  }

  export type DiaryMentionGroupByOutputType = {
    id: string
    personId: string
    diaryEntryId: string
    createdAt: Date
    _count: DiaryMentionCountAggregateOutputType | null
    _min: DiaryMentionMinAggregateOutputType | null
    _max: DiaryMentionMaxAggregateOutputType | null
  }

  type GetDiaryMentionGroupByPayload<T extends DiaryMentionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiaryMentionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiaryMentionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiaryMentionGroupByOutputType[P]>
            : GetScalarType<T[P], DiaryMentionGroupByOutputType[P]>
        }
      >
    >


  export type DiaryMentionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personId?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
    person?: boolean | PersonDefaultArgs<ExtArgs>
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diaryMention"]>

  export type DiaryMentionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personId?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
    person?: boolean | PersonDefaultArgs<ExtArgs>
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diaryMention"]>

  export type DiaryMentionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personId?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
    person?: boolean | PersonDefaultArgs<ExtArgs>
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diaryMention"]>

  export type DiaryMentionSelectScalar = {
    id?: boolean
    personId?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
  }

  export type DiaryMentionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "personId" | "diaryEntryId" | "createdAt", ExtArgs["result"]["diaryMention"]>
  export type DiaryMentionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    person?: boolean | PersonDefaultArgs<ExtArgs>
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }
  export type DiaryMentionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    person?: boolean | PersonDefaultArgs<ExtArgs>
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }
  export type DiaryMentionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    person?: boolean | PersonDefaultArgs<ExtArgs>
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }

  export type $DiaryMentionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiaryMention"
    objects: {
      person: Prisma.$PersonPayload<ExtArgs>
      diaryEntry: Prisma.$DiaryEntryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      personId: string
      diaryEntryId: string
      createdAt: Date
    }, ExtArgs["result"]["diaryMention"]>
    composites: {}
  }

  type DiaryMentionGetPayload<S extends boolean | null | undefined | DiaryMentionDefaultArgs> = $Result.GetResult<Prisma.$DiaryMentionPayload, S>

  type DiaryMentionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DiaryMentionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DiaryMentionCountAggregateInputType | true
    }

  export interface DiaryMentionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiaryMention'], meta: { name: 'DiaryMention' } }
    /**
     * Find zero or one DiaryMention that matches the filter.
     * @param {DiaryMentionFindUniqueArgs} args - Arguments to find a DiaryMention
     * @example
     * // Get one DiaryMention
     * const diaryMention = await prisma.diaryMention.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiaryMentionFindUniqueArgs>(args: SelectSubset<T, DiaryMentionFindUniqueArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DiaryMention that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DiaryMentionFindUniqueOrThrowArgs} args - Arguments to find a DiaryMention
     * @example
     * // Get one DiaryMention
     * const diaryMention = await prisma.diaryMention.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiaryMentionFindUniqueOrThrowArgs>(args: SelectSubset<T, DiaryMentionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiaryMention that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryMentionFindFirstArgs} args - Arguments to find a DiaryMention
     * @example
     * // Get one DiaryMention
     * const diaryMention = await prisma.diaryMention.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiaryMentionFindFirstArgs>(args?: SelectSubset<T, DiaryMentionFindFirstArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiaryMention that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryMentionFindFirstOrThrowArgs} args - Arguments to find a DiaryMention
     * @example
     * // Get one DiaryMention
     * const diaryMention = await prisma.diaryMention.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiaryMentionFindFirstOrThrowArgs>(args?: SelectSubset<T, DiaryMentionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DiaryMentions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryMentionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiaryMentions
     * const diaryMentions = await prisma.diaryMention.findMany()
     * 
     * // Get first 10 DiaryMentions
     * const diaryMentions = await prisma.diaryMention.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diaryMentionWithIdOnly = await prisma.diaryMention.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiaryMentionFindManyArgs>(args?: SelectSubset<T, DiaryMentionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DiaryMention.
     * @param {DiaryMentionCreateArgs} args - Arguments to create a DiaryMention.
     * @example
     * // Create one DiaryMention
     * const DiaryMention = await prisma.diaryMention.create({
     *   data: {
     *     // ... data to create a DiaryMention
     *   }
     * })
     * 
     */
    create<T extends DiaryMentionCreateArgs>(args: SelectSubset<T, DiaryMentionCreateArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DiaryMentions.
     * @param {DiaryMentionCreateManyArgs} args - Arguments to create many DiaryMentions.
     * @example
     * // Create many DiaryMentions
     * const diaryMention = await prisma.diaryMention.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiaryMentionCreateManyArgs>(args?: SelectSubset<T, DiaryMentionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiaryMentions and returns the data saved in the database.
     * @param {DiaryMentionCreateManyAndReturnArgs} args - Arguments to create many DiaryMentions.
     * @example
     * // Create many DiaryMentions
     * const diaryMention = await prisma.diaryMention.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiaryMentions and only return the `id`
     * const diaryMentionWithIdOnly = await prisma.diaryMention.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiaryMentionCreateManyAndReturnArgs>(args?: SelectSubset<T, DiaryMentionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DiaryMention.
     * @param {DiaryMentionDeleteArgs} args - Arguments to delete one DiaryMention.
     * @example
     * // Delete one DiaryMention
     * const DiaryMention = await prisma.diaryMention.delete({
     *   where: {
     *     // ... filter to delete one DiaryMention
     *   }
     * })
     * 
     */
    delete<T extends DiaryMentionDeleteArgs>(args: SelectSubset<T, DiaryMentionDeleteArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DiaryMention.
     * @param {DiaryMentionUpdateArgs} args - Arguments to update one DiaryMention.
     * @example
     * // Update one DiaryMention
     * const diaryMention = await prisma.diaryMention.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiaryMentionUpdateArgs>(args: SelectSubset<T, DiaryMentionUpdateArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DiaryMentions.
     * @param {DiaryMentionDeleteManyArgs} args - Arguments to filter DiaryMentions to delete.
     * @example
     * // Delete a few DiaryMentions
     * const { count } = await prisma.diaryMention.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiaryMentionDeleteManyArgs>(args?: SelectSubset<T, DiaryMentionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiaryMentions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryMentionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiaryMentions
     * const diaryMention = await prisma.diaryMention.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiaryMentionUpdateManyArgs>(args: SelectSubset<T, DiaryMentionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiaryMentions and returns the data updated in the database.
     * @param {DiaryMentionUpdateManyAndReturnArgs} args - Arguments to update many DiaryMentions.
     * @example
     * // Update many DiaryMentions
     * const diaryMention = await prisma.diaryMention.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DiaryMentions and only return the `id`
     * const diaryMentionWithIdOnly = await prisma.diaryMention.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DiaryMentionUpdateManyAndReturnArgs>(args: SelectSubset<T, DiaryMentionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DiaryMention.
     * @param {DiaryMentionUpsertArgs} args - Arguments to update or create a DiaryMention.
     * @example
     * // Update or create a DiaryMention
     * const diaryMention = await prisma.diaryMention.upsert({
     *   create: {
     *     // ... data to create a DiaryMention
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiaryMention we want to update
     *   }
     * })
     */
    upsert<T extends DiaryMentionUpsertArgs>(args: SelectSubset<T, DiaryMentionUpsertArgs<ExtArgs>>): Prisma__DiaryMentionClient<$Result.GetResult<Prisma.$DiaryMentionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DiaryMentions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryMentionCountArgs} args - Arguments to filter DiaryMentions to count.
     * @example
     * // Count the number of DiaryMentions
     * const count = await prisma.diaryMention.count({
     *   where: {
     *     // ... the filter for the DiaryMentions we want to count
     *   }
     * })
    **/
    count<T extends DiaryMentionCountArgs>(
      args?: Subset<T, DiaryMentionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiaryMentionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiaryMention.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryMentionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiaryMentionAggregateArgs>(args: Subset<T, DiaryMentionAggregateArgs>): Prisma.PrismaPromise<GetDiaryMentionAggregateType<T>>

    /**
     * Group by DiaryMention.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryMentionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiaryMentionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiaryMentionGroupByArgs['orderBy'] }
        : { orderBy?: DiaryMentionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiaryMentionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiaryMentionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiaryMention model
   */
  readonly fields: DiaryMentionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiaryMention.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiaryMentionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    person<T extends PersonDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PersonDefaultArgs<ExtArgs>>): Prisma__PersonClient<$Result.GetResult<Prisma.$PersonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    diaryEntry<T extends DiaryEntryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DiaryEntryDefaultArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DiaryMention model
   */
  interface DiaryMentionFieldRefs {
    readonly id: FieldRef<"DiaryMention", 'String'>
    readonly personId: FieldRef<"DiaryMention", 'String'>
    readonly diaryEntryId: FieldRef<"DiaryMention", 'String'>
    readonly createdAt: FieldRef<"DiaryMention", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiaryMention findUnique
   */
  export type DiaryMentionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * Filter, which DiaryMention to fetch.
     */
    where: DiaryMentionWhereUniqueInput
  }

  /**
   * DiaryMention findUniqueOrThrow
   */
  export type DiaryMentionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * Filter, which DiaryMention to fetch.
     */
    where: DiaryMentionWhereUniqueInput
  }

  /**
   * DiaryMention findFirst
   */
  export type DiaryMentionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * Filter, which DiaryMention to fetch.
     */
    where?: DiaryMentionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryMentions to fetch.
     */
    orderBy?: DiaryMentionOrderByWithRelationInput | DiaryMentionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiaryMentions.
     */
    cursor?: DiaryMentionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryMentions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryMentions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiaryMentions.
     */
    distinct?: DiaryMentionScalarFieldEnum | DiaryMentionScalarFieldEnum[]
  }

  /**
   * DiaryMention findFirstOrThrow
   */
  export type DiaryMentionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * Filter, which DiaryMention to fetch.
     */
    where?: DiaryMentionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryMentions to fetch.
     */
    orderBy?: DiaryMentionOrderByWithRelationInput | DiaryMentionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiaryMentions.
     */
    cursor?: DiaryMentionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryMentions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryMentions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiaryMentions.
     */
    distinct?: DiaryMentionScalarFieldEnum | DiaryMentionScalarFieldEnum[]
  }

  /**
   * DiaryMention findMany
   */
  export type DiaryMentionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * Filter, which DiaryMentions to fetch.
     */
    where?: DiaryMentionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryMentions to fetch.
     */
    orderBy?: DiaryMentionOrderByWithRelationInput | DiaryMentionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiaryMentions.
     */
    cursor?: DiaryMentionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryMentions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryMentions.
     */
    skip?: number
    distinct?: DiaryMentionScalarFieldEnum | DiaryMentionScalarFieldEnum[]
  }

  /**
   * DiaryMention create
   */
  export type DiaryMentionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * The data needed to create a DiaryMention.
     */
    data: XOR<DiaryMentionCreateInput, DiaryMentionUncheckedCreateInput>
  }

  /**
   * DiaryMention createMany
   */
  export type DiaryMentionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiaryMentions.
     */
    data: DiaryMentionCreateManyInput | DiaryMentionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiaryMention createManyAndReturn
   */
  export type DiaryMentionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * The data used to create many DiaryMentions.
     */
    data: DiaryMentionCreateManyInput | DiaryMentionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DiaryMention update
   */
  export type DiaryMentionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * The data needed to update a DiaryMention.
     */
    data: XOR<DiaryMentionUpdateInput, DiaryMentionUncheckedUpdateInput>
    /**
     * Choose, which DiaryMention to update.
     */
    where: DiaryMentionWhereUniqueInput
  }

  /**
   * DiaryMention updateMany
   */
  export type DiaryMentionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiaryMentions.
     */
    data: XOR<DiaryMentionUpdateManyMutationInput, DiaryMentionUncheckedUpdateManyInput>
    /**
     * Filter which DiaryMentions to update
     */
    where?: DiaryMentionWhereInput
    /**
     * Limit how many DiaryMentions to update.
     */
    limit?: number
  }

  /**
   * DiaryMention updateManyAndReturn
   */
  export type DiaryMentionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * The data used to update DiaryMentions.
     */
    data: XOR<DiaryMentionUpdateManyMutationInput, DiaryMentionUncheckedUpdateManyInput>
    /**
     * Filter which DiaryMentions to update
     */
    where?: DiaryMentionWhereInput
    /**
     * Limit how many DiaryMentions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DiaryMention upsert
   */
  export type DiaryMentionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * The filter to search for the DiaryMention to update in case it exists.
     */
    where: DiaryMentionWhereUniqueInput
    /**
     * In case the DiaryMention found by the `where` argument doesn't exist, create a new DiaryMention with this data.
     */
    create: XOR<DiaryMentionCreateInput, DiaryMentionUncheckedCreateInput>
    /**
     * In case the DiaryMention was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiaryMentionUpdateInput, DiaryMentionUncheckedUpdateInput>
  }

  /**
   * DiaryMention delete
   */
  export type DiaryMentionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
    /**
     * Filter which DiaryMention to delete.
     */
    where: DiaryMentionWhereUniqueInput
  }

  /**
   * DiaryMention deleteMany
   */
  export type DiaryMentionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiaryMentions to delete
     */
    where?: DiaryMentionWhereInput
    /**
     * Limit how many DiaryMentions to delete.
     */
    limit?: number
  }

  /**
   * DiaryMention without action
   */
  export type DiaryMentionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryMention
     */
    select?: DiaryMentionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryMention
     */
    omit?: DiaryMentionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryMentionInclude<ExtArgs> | null
  }


  /**
   * Model DiaryLocation
   */

  export type AggregateDiaryLocation = {
    _count: DiaryLocationCountAggregateOutputType | null
    _avg: DiaryLocationAvgAggregateOutputType | null
    _sum: DiaryLocationSumAggregateOutputType | null
    _min: DiaryLocationMinAggregateOutputType | null
    _max: DiaryLocationMaxAggregateOutputType | null
  }

  export type DiaryLocationAvgAggregateOutputType = {
    lat: number | null
    lng: number | null
  }

  export type DiaryLocationSumAggregateOutputType = {
    lat: number | null
    lng: number | null
  }

  export type DiaryLocationMinAggregateOutputType = {
    id: string | null
    name: string | null
    placeId: string | null
    lat: number | null
    lng: number | null
    diaryEntryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiaryLocationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    placeId: string | null
    lat: number | null
    lng: number | null
    diaryEntryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiaryLocationCountAggregateOutputType = {
    id: number
    name: number
    placeId: number
    lat: number
    lng: number
    diaryEntryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DiaryLocationAvgAggregateInputType = {
    lat?: true
    lng?: true
  }

  export type DiaryLocationSumAggregateInputType = {
    lat?: true
    lng?: true
  }

  export type DiaryLocationMinAggregateInputType = {
    id?: true
    name?: true
    placeId?: true
    lat?: true
    lng?: true
    diaryEntryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiaryLocationMaxAggregateInputType = {
    id?: true
    name?: true
    placeId?: true
    lat?: true
    lng?: true
    diaryEntryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiaryLocationCountAggregateInputType = {
    id?: true
    name?: true
    placeId?: true
    lat?: true
    lng?: true
    diaryEntryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DiaryLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiaryLocation to aggregate.
     */
    where?: DiaryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryLocations to fetch.
     */
    orderBy?: DiaryLocationOrderByWithRelationInput | DiaryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiaryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiaryLocations
    **/
    _count?: true | DiaryLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DiaryLocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DiaryLocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiaryLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiaryLocationMaxAggregateInputType
  }

  export type GetDiaryLocationAggregateType<T extends DiaryLocationAggregateArgs> = {
        [P in keyof T & keyof AggregateDiaryLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiaryLocation[P]>
      : GetScalarType<T[P], AggregateDiaryLocation[P]>
  }




  export type DiaryLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiaryLocationWhereInput
    orderBy?: DiaryLocationOrderByWithAggregationInput | DiaryLocationOrderByWithAggregationInput[]
    by: DiaryLocationScalarFieldEnum[] | DiaryLocationScalarFieldEnum
    having?: DiaryLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiaryLocationCountAggregateInputType | true
    _avg?: DiaryLocationAvgAggregateInputType
    _sum?: DiaryLocationSumAggregateInputType
    _min?: DiaryLocationMinAggregateInputType
    _max?: DiaryLocationMaxAggregateInputType
  }

  export type DiaryLocationGroupByOutputType = {
    id: string
    name: string
    placeId: string
    lat: number
    lng: number
    diaryEntryId: string
    createdAt: Date
    updatedAt: Date
    _count: DiaryLocationCountAggregateOutputType | null
    _avg: DiaryLocationAvgAggregateOutputType | null
    _sum: DiaryLocationSumAggregateOutputType | null
    _min: DiaryLocationMinAggregateOutputType | null
    _max: DiaryLocationMaxAggregateOutputType | null
  }

  type GetDiaryLocationGroupByPayload<T extends DiaryLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiaryLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiaryLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiaryLocationGroupByOutputType[P]>
            : GetScalarType<T[P], DiaryLocationGroupByOutputType[P]>
        }
      >
    >


  export type DiaryLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    placeId?: boolean
    lat?: boolean
    lng?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diaryLocation"]>

  export type DiaryLocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    placeId?: boolean
    lat?: boolean
    lng?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diaryLocation"]>

  export type DiaryLocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    placeId?: boolean
    lat?: boolean
    lng?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diaryLocation"]>

  export type DiaryLocationSelectScalar = {
    id?: boolean
    name?: boolean
    placeId?: boolean
    lat?: boolean
    lng?: boolean
    diaryEntryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DiaryLocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "placeId" | "lat" | "lng" | "diaryEntryId" | "createdAt" | "updatedAt", ExtArgs["result"]["diaryLocation"]>
  export type DiaryLocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }
  export type DiaryLocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }
  export type DiaryLocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diaryEntry?: boolean | DiaryEntryDefaultArgs<ExtArgs>
  }

  export type $DiaryLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiaryLocation"
    objects: {
      diaryEntry: Prisma.$DiaryEntryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      placeId: string
      lat: number
      lng: number
      diaryEntryId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["diaryLocation"]>
    composites: {}
  }

  type DiaryLocationGetPayload<S extends boolean | null | undefined | DiaryLocationDefaultArgs> = $Result.GetResult<Prisma.$DiaryLocationPayload, S>

  type DiaryLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DiaryLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DiaryLocationCountAggregateInputType | true
    }

  export interface DiaryLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiaryLocation'], meta: { name: 'DiaryLocation' } }
    /**
     * Find zero or one DiaryLocation that matches the filter.
     * @param {DiaryLocationFindUniqueArgs} args - Arguments to find a DiaryLocation
     * @example
     * // Get one DiaryLocation
     * const diaryLocation = await prisma.diaryLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiaryLocationFindUniqueArgs>(args: SelectSubset<T, DiaryLocationFindUniqueArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DiaryLocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DiaryLocationFindUniqueOrThrowArgs} args - Arguments to find a DiaryLocation
     * @example
     * // Get one DiaryLocation
     * const diaryLocation = await prisma.diaryLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiaryLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, DiaryLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiaryLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryLocationFindFirstArgs} args - Arguments to find a DiaryLocation
     * @example
     * // Get one DiaryLocation
     * const diaryLocation = await prisma.diaryLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiaryLocationFindFirstArgs>(args?: SelectSubset<T, DiaryLocationFindFirstArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiaryLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryLocationFindFirstOrThrowArgs} args - Arguments to find a DiaryLocation
     * @example
     * // Get one DiaryLocation
     * const diaryLocation = await prisma.diaryLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiaryLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, DiaryLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DiaryLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiaryLocations
     * const diaryLocations = await prisma.diaryLocation.findMany()
     * 
     * // Get first 10 DiaryLocations
     * const diaryLocations = await prisma.diaryLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diaryLocationWithIdOnly = await prisma.diaryLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiaryLocationFindManyArgs>(args?: SelectSubset<T, DiaryLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DiaryLocation.
     * @param {DiaryLocationCreateArgs} args - Arguments to create a DiaryLocation.
     * @example
     * // Create one DiaryLocation
     * const DiaryLocation = await prisma.diaryLocation.create({
     *   data: {
     *     // ... data to create a DiaryLocation
     *   }
     * })
     * 
     */
    create<T extends DiaryLocationCreateArgs>(args: SelectSubset<T, DiaryLocationCreateArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DiaryLocations.
     * @param {DiaryLocationCreateManyArgs} args - Arguments to create many DiaryLocations.
     * @example
     * // Create many DiaryLocations
     * const diaryLocation = await prisma.diaryLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiaryLocationCreateManyArgs>(args?: SelectSubset<T, DiaryLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiaryLocations and returns the data saved in the database.
     * @param {DiaryLocationCreateManyAndReturnArgs} args - Arguments to create many DiaryLocations.
     * @example
     * // Create many DiaryLocations
     * const diaryLocation = await prisma.diaryLocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiaryLocations and only return the `id`
     * const diaryLocationWithIdOnly = await prisma.diaryLocation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiaryLocationCreateManyAndReturnArgs>(args?: SelectSubset<T, DiaryLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DiaryLocation.
     * @param {DiaryLocationDeleteArgs} args - Arguments to delete one DiaryLocation.
     * @example
     * // Delete one DiaryLocation
     * const DiaryLocation = await prisma.diaryLocation.delete({
     *   where: {
     *     // ... filter to delete one DiaryLocation
     *   }
     * })
     * 
     */
    delete<T extends DiaryLocationDeleteArgs>(args: SelectSubset<T, DiaryLocationDeleteArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DiaryLocation.
     * @param {DiaryLocationUpdateArgs} args - Arguments to update one DiaryLocation.
     * @example
     * // Update one DiaryLocation
     * const diaryLocation = await prisma.diaryLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiaryLocationUpdateArgs>(args: SelectSubset<T, DiaryLocationUpdateArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DiaryLocations.
     * @param {DiaryLocationDeleteManyArgs} args - Arguments to filter DiaryLocations to delete.
     * @example
     * // Delete a few DiaryLocations
     * const { count } = await prisma.diaryLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiaryLocationDeleteManyArgs>(args?: SelectSubset<T, DiaryLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiaryLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiaryLocations
     * const diaryLocation = await prisma.diaryLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiaryLocationUpdateManyArgs>(args: SelectSubset<T, DiaryLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiaryLocations and returns the data updated in the database.
     * @param {DiaryLocationUpdateManyAndReturnArgs} args - Arguments to update many DiaryLocations.
     * @example
     * // Update many DiaryLocations
     * const diaryLocation = await prisma.diaryLocation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DiaryLocations and only return the `id`
     * const diaryLocationWithIdOnly = await prisma.diaryLocation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DiaryLocationUpdateManyAndReturnArgs>(args: SelectSubset<T, DiaryLocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DiaryLocation.
     * @param {DiaryLocationUpsertArgs} args - Arguments to update or create a DiaryLocation.
     * @example
     * // Update or create a DiaryLocation
     * const diaryLocation = await prisma.diaryLocation.upsert({
     *   create: {
     *     // ... data to create a DiaryLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiaryLocation we want to update
     *   }
     * })
     */
    upsert<T extends DiaryLocationUpsertArgs>(args: SelectSubset<T, DiaryLocationUpsertArgs<ExtArgs>>): Prisma__DiaryLocationClient<$Result.GetResult<Prisma.$DiaryLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DiaryLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryLocationCountArgs} args - Arguments to filter DiaryLocations to count.
     * @example
     * // Count the number of DiaryLocations
     * const count = await prisma.diaryLocation.count({
     *   where: {
     *     // ... the filter for the DiaryLocations we want to count
     *   }
     * })
    **/
    count<T extends DiaryLocationCountArgs>(
      args?: Subset<T, DiaryLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiaryLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiaryLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiaryLocationAggregateArgs>(args: Subset<T, DiaryLocationAggregateArgs>): Prisma.PrismaPromise<GetDiaryLocationAggregateType<T>>

    /**
     * Group by DiaryLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiaryLocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiaryLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiaryLocationGroupByArgs['orderBy'] }
        : { orderBy?: DiaryLocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiaryLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiaryLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiaryLocation model
   */
  readonly fields: DiaryLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiaryLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiaryLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    diaryEntry<T extends DiaryEntryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DiaryEntryDefaultArgs<ExtArgs>>): Prisma__DiaryEntryClient<$Result.GetResult<Prisma.$DiaryEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DiaryLocation model
   */
  interface DiaryLocationFieldRefs {
    readonly id: FieldRef<"DiaryLocation", 'String'>
    readonly name: FieldRef<"DiaryLocation", 'String'>
    readonly placeId: FieldRef<"DiaryLocation", 'String'>
    readonly lat: FieldRef<"DiaryLocation", 'Float'>
    readonly lng: FieldRef<"DiaryLocation", 'Float'>
    readonly diaryEntryId: FieldRef<"DiaryLocation", 'String'>
    readonly createdAt: FieldRef<"DiaryLocation", 'DateTime'>
    readonly updatedAt: FieldRef<"DiaryLocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiaryLocation findUnique
   */
  export type DiaryLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * Filter, which DiaryLocation to fetch.
     */
    where: DiaryLocationWhereUniqueInput
  }

  /**
   * DiaryLocation findUniqueOrThrow
   */
  export type DiaryLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * Filter, which DiaryLocation to fetch.
     */
    where: DiaryLocationWhereUniqueInput
  }

  /**
   * DiaryLocation findFirst
   */
  export type DiaryLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * Filter, which DiaryLocation to fetch.
     */
    where?: DiaryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryLocations to fetch.
     */
    orderBy?: DiaryLocationOrderByWithRelationInput | DiaryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiaryLocations.
     */
    cursor?: DiaryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiaryLocations.
     */
    distinct?: DiaryLocationScalarFieldEnum | DiaryLocationScalarFieldEnum[]
  }

  /**
   * DiaryLocation findFirstOrThrow
   */
  export type DiaryLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * Filter, which DiaryLocation to fetch.
     */
    where?: DiaryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryLocations to fetch.
     */
    orderBy?: DiaryLocationOrderByWithRelationInput | DiaryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiaryLocations.
     */
    cursor?: DiaryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiaryLocations.
     */
    distinct?: DiaryLocationScalarFieldEnum | DiaryLocationScalarFieldEnum[]
  }

  /**
   * DiaryLocation findMany
   */
  export type DiaryLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * Filter, which DiaryLocations to fetch.
     */
    where?: DiaryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiaryLocations to fetch.
     */
    orderBy?: DiaryLocationOrderByWithRelationInput | DiaryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiaryLocations.
     */
    cursor?: DiaryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiaryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiaryLocations.
     */
    skip?: number
    distinct?: DiaryLocationScalarFieldEnum | DiaryLocationScalarFieldEnum[]
  }

  /**
   * DiaryLocation create
   */
  export type DiaryLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * The data needed to create a DiaryLocation.
     */
    data: XOR<DiaryLocationCreateInput, DiaryLocationUncheckedCreateInput>
  }

  /**
   * DiaryLocation createMany
   */
  export type DiaryLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiaryLocations.
     */
    data: DiaryLocationCreateManyInput | DiaryLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiaryLocation createManyAndReturn
   */
  export type DiaryLocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * The data used to create many DiaryLocations.
     */
    data: DiaryLocationCreateManyInput | DiaryLocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DiaryLocation update
   */
  export type DiaryLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * The data needed to update a DiaryLocation.
     */
    data: XOR<DiaryLocationUpdateInput, DiaryLocationUncheckedUpdateInput>
    /**
     * Choose, which DiaryLocation to update.
     */
    where: DiaryLocationWhereUniqueInput
  }

  /**
   * DiaryLocation updateMany
   */
  export type DiaryLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiaryLocations.
     */
    data: XOR<DiaryLocationUpdateManyMutationInput, DiaryLocationUncheckedUpdateManyInput>
    /**
     * Filter which DiaryLocations to update
     */
    where?: DiaryLocationWhereInput
    /**
     * Limit how many DiaryLocations to update.
     */
    limit?: number
  }

  /**
   * DiaryLocation updateManyAndReturn
   */
  export type DiaryLocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * The data used to update DiaryLocations.
     */
    data: XOR<DiaryLocationUpdateManyMutationInput, DiaryLocationUncheckedUpdateManyInput>
    /**
     * Filter which DiaryLocations to update
     */
    where?: DiaryLocationWhereInput
    /**
     * Limit how many DiaryLocations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DiaryLocation upsert
   */
  export type DiaryLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * The filter to search for the DiaryLocation to update in case it exists.
     */
    where: DiaryLocationWhereUniqueInput
    /**
     * In case the DiaryLocation found by the `where` argument doesn't exist, create a new DiaryLocation with this data.
     */
    create: XOR<DiaryLocationCreateInput, DiaryLocationUncheckedCreateInput>
    /**
     * In case the DiaryLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiaryLocationUpdateInput, DiaryLocationUncheckedUpdateInput>
  }

  /**
   * DiaryLocation delete
   */
  export type DiaryLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
    /**
     * Filter which DiaryLocation to delete.
     */
    where: DiaryLocationWhereUniqueInput
  }

  /**
   * DiaryLocation deleteMany
   */
  export type DiaryLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiaryLocations to delete
     */
    where?: DiaryLocationWhereInput
    /**
     * Limit how many DiaryLocations to delete.
     */
    limit?: number
  }

  /**
   * DiaryLocation without action
   */
  export type DiaryLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiaryLocation
     */
    select?: DiaryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiaryLocation
     */
    omit?: DiaryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiaryLocationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PersonScalarFieldEnum: {
    id: 'id',
    name: 'name',
    birthday: 'birthday',
    howWeMet: 'howWeMet',
    interests: 'interests',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PersonScalarFieldEnum = (typeof PersonScalarFieldEnum)[keyof typeof PersonScalarFieldEnum]


  export const DiaryEntryScalarFieldEnum: {
    id: 'id',
    content: 'content',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DiaryEntryScalarFieldEnum = (typeof DiaryEntryScalarFieldEnum)[keyof typeof DiaryEntryScalarFieldEnum]


  export const DiaryMentionScalarFieldEnum: {
    id: 'id',
    personId: 'personId',
    diaryEntryId: 'diaryEntryId',
    createdAt: 'createdAt'
  };

  export type DiaryMentionScalarFieldEnum = (typeof DiaryMentionScalarFieldEnum)[keyof typeof DiaryMentionScalarFieldEnum]


  export const DiaryLocationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    placeId: 'placeId',
    lat: 'lat',
    lng: 'lng',
    diaryEntryId: 'diaryEntryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DiaryLocationScalarFieldEnum = (typeof DiaryLocationScalarFieldEnum)[keyof typeof DiaryLocationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type PersonWhereInput = {
    AND?: PersonWhereInput | PersonWhereInput[]
    OR?: PersonWhereInput[]
    NOT?: PersonWhereInput | PersonWhereInput[]
    id?: StringFilter<"Person"> | string
    name?: StringFilter<"Person"> | string
    birthday?: DateTimeNullableFilter<"Person"> | Date | string | null
    howWeMet?: StringNullableFilter<"Person"> | string | null
    interests?: StringNullableListFilter<"Person">
    notes?: StringNullableFilter<"Person"> | string | null
    createdAt?: DateTimeFilter<"Person"> | Date | string
    updatedAt?: DateTimeFilter<"Person"> | Date | string
    mentions?: DiaryMentionListRelationFilter
  }

  export type PersonOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    birthday?: SortOrderInput | SortOrder
    howWeMet?: SortOrderInput | SortOrder
    interests?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    mentions?: DiaryMentionOrderByRelationAggregateInput
  }

  export type PersonWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PersonWhereInput | PersonWhereInput[]
    OR?: PersonWhereInput[]
    NOT?: PersonWhereInput | PersonWhereInput[]
    name?: StringFilter<"Person"> | string
    birthday?: DateTimeNullableFilter<"Person"> | Date | string | null
    howWeMet?: StringNullableFilter<"Person"> | string | null
    interests?: StringNullableListFilter<"Person">
    notes?: StringNullableFilter<"Person"> | string | null
    createdAt?: DateTimeFilter<"Person"> | Date | string
    updatedAt?: DateTimeFilter<"Person"> | Date | string
    mentions?: DiaryMentionListRelationFilter
  }, "id">

  export type PersonOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    birthday?: SortOrderInput | SortOrder
    howWeMet?: SortOrderInput | SortOrder
    interests?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PersonCountOrderByAggregateInput
    _max?: PersonMaxOrderByAggregateInput
    _min?: PersonMinOrderByAggregateInput
  }

  export type PersonScalarWhereWithAggregatesInput = {
    AND?: PersonScalarWhereWithAggregatesInput | PersonScalarWhereWithAggregatesInput[]
    OR?: PersonScalarWhereWithAggregatesInput[]
    NOT?: PersonScalarWhereWithAggregatesInput | PersonScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Person"> | string
    name?: StringWithAggregatesFilter<"Person"> | string
    birthday?: DateTimeNullableWithAggregatesFilter<"Person"> | Date | string | null
    howWeMet?: StringNullableWithAggregatesFilter<"Person"> | string | null
    interests?: StringNullableListFilter<"Person">
    notes?: StringNullableWithAggregatesFilter<"Person"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Person"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Person"> | Date | string
  }

  export type DiaryEntryWhereInput = {
    AND?: DiaryEntryWhereInput | DiaryEntryWhereInput[]
    OR?: DiaryEntryWhereInput[]
    NOT?: DiaryEntryWhereInput | DiaryEntryWhereInput[]
    id?: StringFilter<"DiaryEntry"> | string
    content?: StringFilter<"DiaryEntry"> | string
    date?: DateTimeFilter<"DiaryEntry"> | Date | string
    createdAt?: DateTimeFilter<"DiaryEntry"> | Date | string
    updatedAt?: DateTimeFilter<"DiaryEntry"> | Date | string
    mentions?: DiaryMentionListRelationFilter
    locations?: DiaryLocationListRelationFilter
  }

  export type DiaryEntryOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    mentions?: DiaryMentionOrderByRelationAggregateInput
    locations?: DiaryLocationOrderByRelationAggregateInput
  }

  export type DiaryEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DiaryEntryWhereInput | DiaryEntryWhereInput[]
    OR?: DiaryEntryWhereInput[]
    NOT?: DiaryEntryWhereInput | DiaryEntryWhereInput[]
    content?: StringFilter<"DiaryEntry"> | string
    date?: DateTimeFilter<"DiaryEntry"> | Date | string
    createdAt?: DateTimeFilter<"DiaryEntry"> | Date | string
    updatedAt?: DateTimeFilter<"DiaryEntry"> | Date | string
    mentions?: DiaryMentionListRelationFilter
    locations?: DiaryLocationListRelationFilter
  }, "id">

  export type DiaryEntryOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DiaryEntryCountOrderByAggregateInput
    _max?: DiaryEntryMaxOrderByAggregateInput
    _min?: DiaryEntryMinOrderByAggregateInput
  }

  export type DiaryEntryScalarWhereWithAggregatesInput = {
    AND?: DiaryEntryScalarWhereWithAggregatesInput | DiaryEntryScalarWhereWithAggregatesInput[]
    OR?: DiaryEntryScalarWhereWithAggregatesInput[]
    NOT?: DiaryEntryScalarWhereWithAggregatesInput | DiaryEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DiaryEntry"> | string
    content?: StringWithAggregatesFilter<"DiaryEntry"> | string
    date?: DateTimeWithAggregatesFilter<"DiaryEntry"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"DiaryEntry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DiaryEntry"> | Date | string
  }

  export type DiaryMentionWhereInput = {
    AND?: DiaryMentionWhereInput | DiaryMentionWhereInput[]
    OR?: DiaryMentionWhereInput[]
    NOT?: DiaryMentionWhereInput | DiaryMentionWhereInput[]
    id?: StringFilter<"DiaryMention"> | string
    personId?: StringFilter<"DiaryMention"> | string
    diaryEntryId?: StringFilter<"DiaryMention"> | string
    createdAt?: DateTimeFilter<"DiaryMention"> | Date | string
    person?: XOR<PersonScalarRelationFilter, PersonWhereInput>
    diaryEntry?: XOR<DiaryEntryScalarRelationFilter, DiaryEntryWhereInput>
  }

  export type DiaryMentionOrderByWithRelationInput = {
    id?: SortOrder
    personId?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
    person?: PersonOrderByWithRelationInput
    diaryEntry?: DiaryEntryOrderByWithRelationInput
  }

  export type DiaryMentionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    personId_diaryEntryId?: DiaryMentionPersonIdDiaryEntryIdCompoundUniqueInput
    AND?: DiaryMentionWhereInput | DiaryMentionWhereInput[]
    OR?: DiaryMentionWhereInput[]
    NOT?: DiaryMentionWhereInput | DiaryMentionWhereInput[]
    personId?: StringFilter<"DiaryMention"> | string
    diaryEntryId?: StringFilter<"DiaryMention"> | string
    createdAt?: DateTimeFilter<"DiaryMention"> | Date | string
    person?: XOR<PersonScalarRelationFilter, PersonWhereInput>
    diaryEntry?: XOR<DiaryEntryScalarRelationFilter, DiaryEntryWhereInput>
  }, "id" | "personId_diaryEntryId">

  export type DiaryMentionOrderByWithAggregationInput = {
    id?: SortOrder
    personId?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
    _count?: DiaryMentionCountOrderByAggregateInput
    _max?: DiaryMentionMaxOrderByAggregateInput
    _min?: DiaryMentionMinOrderByAggregateInput
  }

  export type DiaryMentionScalarWhereWithAggregatesInput = {
    AND?: DiaryMentionScalarWhereWithAggregatesInput | DiaryMentionScalarWhereWithAggregatesInput[]
    OR?: DiaryMentionScalarWhereWithAggregatesInput[]
    NOT?: DiaryMentionScalarWhereWithAggregatesInput | DiaryMentionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DiaryMention"> | string
    personId?: StringWithAggregatesFilter<"DiaryMention"> | string
    diaryEntryId?: StringWithAggregatesFilter<"DiaryMention"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DiaryMention"> | Date | string
  }

  export type DiaryLocationWhereInput = {
    AND?: DiaryLocationWhereInput | DiaryLocationWhereInput[]
    OR?: DiaryLocationWhereInput[]
    NOT?: DiaryLocationWhereInput | DiaryLocationWhereInput[]
    id?: StringFilter<"DiaryLocation"> | string
    name?: StringFilter<"DiaryLocation"> | string
    placeId?: StringFilter<"DiaryLocation"> | string
    lat?: FloatFilter<"DiaryLocation"> | number
    lng?: FloatFilter<"DiaryLocation"> | number
    diaryEntryId?: StringFilter<"DiaryLocation"> | string
    createdAt?: DateTimeFilter<"DiaryLocation"> | Date | string
    updatedAt?: DateTimeFilter<"DiaryLocation"> | Date | string
    diaryEntry?: XOR<DiaryEntryScalarRelationFilter, DiaryEntryWhereInput>
  }

  export type DiaryLocationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    placeId?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    diaryEntry?: DiaryEntryOrderByWithRelationInput
  }

  export type DiaryLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    placeId?: string
    AND?: DiaryLocationWhereInput | DiaryLocationWhereInput[]
    OR?: DiaryLocationWhereInput[]
    NOT?: DiaryLocationWhereInput | DiaryLocationWhereInput[]
    name?: StringFilter<"DiaryLocation"> | string
    lat?: FloatFilter<"DiaryLocation"> | number
    lng?: FloatFilter<"DiaryLocation"> | number
    diaryEntryId?: StringFilter<"DiaryLocation"> | string
    createdAt?: DateTimeFilter<"DiaryLocation"> | Date | string
    updatedAt?: DateTimeFilter<"DiaryLocation"> | Date | string
    diaryEntry?: XOR<DiaryEntryScalarRelationFilter, DiaryEntryWhereInput>
  }, "id" | "placeId">

  export type DiaryLocationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    placeId?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DiaryLocationCountOrderByAggregateInput
    _avg?: DiaryLocationAvgOrderByAggregateInput
    _max?: DiaryLocationMaxOrderByAggregateInput
    _min?: DiaryLocationMinOrderByAggregateInput
    _sum?: DiaryLocationSumOrderByAggregateInput
  }

  export type DiaryLocationScalarWhereWithAggregatesInput = {
    AND?: DiaryLocationScalarWhereWithAggregatesInput | DiaryLocationScalarWhereWithAggregatesInput[]
    OR?: DiaryLocationScalarWhereWithAggregatesInput[]
    NOT?: DiaryLocationScalarWhereWithAggregatesInput | DiaryLocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DiaryLocation"> | string
    name?: StringWithAggregatesFilter<"DiaryLocation"> | string
    placeId?: StringWithAggregatesFilter<"DiaryLocation"> | string
    lat?: FloatWithAggregatesFilter<"DiaryLocation"> | number
    lng?: FloatWithAggregatesFilter<"DiaryLocation"> | number
    diaryEntryId?: StringWithAggregatesFilter<"DiaryLocation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DiaryLocation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DiaryLocation"> | Date | string
  }

  export type PersonCreateInput = {
    id?: string
    name: string
    birthday?: Date | string | null
    howWeMet?: string | null
    interests?: PersonCreateinterestsInput | string[]
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    mentions?: DiaryMentionCreateNestedManyWithoutPersonInput
  }

  export type PersonUncheckedCreateInput = {
    id?: string
    name: string
    birthday?: Date | string | null
    howWeMet?: string | null
    interests?: PersonCreateinterestsInput | string[]
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    mentions?: DiaryMentionUncheckedCreateNestedManyWithoutPersonInput
  }

  export type PersonUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    howWeMet?: NullableStringFieldUpdateOperationsInput | string | null
    interests?: PersonUpdateinterestsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mentions?: DiaryMentionUpdateManyWithoutPersonNestedInput
  }

  export type PersonUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    howWeMet?: NullableStringFieldUpdateOperationsInput | string | null
    interests?: PersonUpdateinterestsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mentions?: DiaryMentionUncheckedUpdateManyWithoutPersonNestedInput
  }

  export type PersonCreateManyInput = {
    id?: string
    name: string
    birthday?: Date | string | null
    howWeMet?: string | null
    interests?: PersonCreateinterestsInput | string[]
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PersonUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    howWeMet?: NullableStringFieldUpdateOperationsInput | string | null
    interests?: PersonUpdateinterestsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    howWeMet?: NullableStringFieldUpdateOperationsInput | string | null
    interests?: PersonUpdateinterestsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryEntryCreateInput = {
    id?: string
    content: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    mentions?: DiaryMentionCreateNestedManyWithoutDiaryEntryInput
    locations?: DiaryLocationCreateNestedManyWithoutDiaryEntryInput
  }

  export type DiaryEntryUncheckedCreateInput = {
    id?: string
    content: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    mentions?: DiaryMentionUncheckedCreateNestedManyWithoutDiaryEntryInput
    locations?: DiaryLocationUncheckedCreateNestedManyWithoutDiaryEntryInput
  }

  export type DiaryEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mentions?: DiaryMentionUpdateManyWithoutDiaryEntryNestedInput
    locations?: DiaryLocationUpdateManyWithoutDiaryEntryNestedInput
  }

  export type DiaryEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mentions?: DiaryMentionUncheckedUpdateManyWithoutDiaryEntryNestedInput
    locations?: DiaryLocationUncheckedUpdateManyWithoutDiaryEntryNestedInput
  }

  export type DiaryEntryCreateManyInput = {
    id?: string
    content: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiaryEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryMentionCreateInput = {
    id?: string
    createdAt?: Date | string
    person: PersonCreateNestedOneWithoutMentionsInput
    diaryEntry: DiaryEntryCreateNestedOneWithoutMentionsInput
  }

  export type DiaryMentionUncheckedCreateInput = {
    id?: string
    personId: string
    diaryEntryId: string
    createdAt?: Date | string
  }

  export type DiaryMentionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    person?: PersonUpdateOneRequiredWithoutMentionsNestedInput
    diaryEntry?: DiaryEntryUpdateOneRequiredWithoutMentionsNestedInput
  }

  export type DiaryMentionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    diaryEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryMentionCreateManyInput = {
    id?: string
    personId: string
    diaryEntryId: string
    createdAt?: Date | string
  }

  export type DiaryMentionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryMentionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    diaryEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryLocationCreateInput = {
    id?: string
    name: string
    placeId: string
    lat: number
    lng: number
    createdAt?: Date | string
    updatedAt?: Date | string
    diaryEntry: DiaryEntryCreateNestedOneWithoutLocationsInput
  }

  export type DiaryLocationUncheckedCreateInput = {
    id?: string
    name: string
    placeId: string
    lat: number
    lng: number
    diaryEntryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiaryLocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    placeId?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    diaryEntry?: DiaryEntryUpdateOneRequiredWithoutLocationsNestedInput
  }

  export type DiaryLocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    placeId?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    diaryEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryLocationCreateManyInput = {
    id?: string
    name: string
    placeId: string
    lat: number
    lng: number
    diaryEntryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiaryLocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    placeId?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryLocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    placeId?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    diaryEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DiaryMentionListRelationFilter = {
    every?: DiaryMentionWhereInput
    some?: DiaryMentionWhereInput
    none?: DiaryMentionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DiaryMentionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PersonCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    birthday?: SortOrder
    howWeMet?: SortOrder
    interests?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PersonMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    birthday?: SortOrder
    howWeMet?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PersonMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    birthday?: SortOrder
    howWeMet?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DiaryLocationListRelationFilter = {
    every?: DiaryLocationWhereInput
    some?: DiaryLocationWhereInput
    none?: DiaryLocationWhereInput
  }

  export type DiaryLocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DiaryEntryCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiaryEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiaryEntryMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PersonScalarRelationFilter = {
    is?: PersonWhereInput
    isNot?: PersonWhereInput
  }

  export type DiaryEntryScalarRelationFilter = {
    is?: DiaryEntryWhereInput
    isNot?: DiaryEntryWhereInput
  }

  export type DiaryMentionPersonIdDiaryEntryIdCompoundUniqueInput = {
    personId: string
    diaryEntryId: string
  }

  export type DiaryMentionCountOrderByAggregateInput = {
    id?: SortOrder
    personId?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
  }

  export type DiaryMentionMaxOrderByAggregateInput = {
    id?: SortOrder
    personId?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
  }

  export type DiaryMentionMinOrderByAggregateInput = {
    id?: SortOrder
    personId?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DiaryLocationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    placeId?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiaryLocationAvgOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
  }

  export type DiaryLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    placeId?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiaryLocationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    placeId?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    diaryEntryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiaryLocationSumOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type PersonCreateinterestsInput = {
    set: string[]
  }

  export type DiaryMentionCreateNestedManyWithoutPersonInput = {
    create?: XOR<DiaryMentionCreateWithoutPersonInput, DiaryMentionUncheckedCreateWithoutPersonInput> | DiaryMentionCreateWithoutPersonInput[] | DiaryMentionUncheckedCreateWithoutPersonInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutPersonInput | DiaryMentionCreateOrConnectWithoutPersonInput[]
    createMany?: DiaryMentionCreateManyPersonInputEnvelope
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
  }

  export type DiaryMentionUncheckedCreateNestedManyWithoutPersonInput = {
    create?: XOR<DiaryMentionCreateWithoutPersonInput, DiaryMentionUncheckedCreateWithoutPersonInput> | DiaryMentionCreateWithoutPersonInput[] | DiaryMentionUncheckedCreateWithoutPersonInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutPersonInput | DiaryMentionCreateOrConnectWithoutPersonInput[]
    createMany?: DiaryMentionCreateManyPersonInputEnvelope
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type PersonUpdateinterestsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DiaryMentionUpdateManyWithoutPersonNestedInput = {
    create?: XOR<DiaryMentionCreateWithoutPersonInput, DiaryMentionUncheckedCreateWithoutPersonInput> | DiaryMentionCreateWithoutPersonInput[] | DiaryMentionUncheckedCreateWithoutPersonInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutPersonInput | DiaryMentionCreateOrConnectWithoutPersonInput[]
    upsert?: DiaryMentionUpsertWithWhereUniqueWithoutPersonInput | DiaryMentionUpsertWithWhereUniqueWithoutPersonInput[]
    createMany?: DiaryMentionCreateManyPersonInputEnvelope
    set?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    disconnect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    delete?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    update?: DiaryMentionUpdateWithWhereUniqueWithoutPersonInput | DiaryMentionUpdateWithWhereUniqueWithoutPersonInput[]
    updateMany?: DiaryMentionUpdateManyWithWhereWithoutPersonInput | DiaryMentionUpdateManyWithWhereWithoutPersonInput[]
    deleteMany?: DiaryMentionScalarWhereInput | DiaryMentionScalarWhereInput[]
  }

  export type DiaryMentionUncheckedUpdateManyWithoutPersonNestedInput = {
    create?: XOR<DiaryMentionCreateWithoutPersonInput, DiaryMentionUncheckedCreateWithoutPersonInput> | DiaryMentionCreateWithoutPersonInput[] | DiaryMentionUncheckedCreateWithoutPersonInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutPersonInput | DiaryMentionCreateOrConnectWithoutPersonInput[]
    upsert?: DiaryMentionUpsertWithWhereUniqueWithoutPersonInput | DiaryMentionUpsertWithWhereUniqueWithoutPersonInput[]
    createMany?: DiaryMentionCreateManyPersonInputEnvelope
    set?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    disconnect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    delete?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    update?: DiaryMentionUpdateWithWhereUniqueWithoutPersonInput | DiaryMentionUpdateWithWhereUniqueWithoutPersonInput[]
    updateMany?: DiaryMentionUpdateManyWithWhereWithoutPersonInput | DiaryMentionUpdateManyWithWhereWithoutPersonInput[]
    deleteMany?: DiaryMentionScalarWhereInput | DiaryMentionScalarWhereInput[]
  }

  export type DiaryMentionCreateNestedManyWithoutDiaryEntryInput = {
    create?: XOR<DiaryMentionCreateWithoutDiaryEntryInput, DiaryMentionUncheckedCreateWithoutDiaryEntryInput> | DiaryMentionCreateWithoutDiaryEntryInput[] | DiaryMentionUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutDiaryEntryInput | DiaryMentionCreateOrConnectWithoutDiaryEntryInput[]
    createMany?: DiaryMentionCreateManyDiaryEntryInputEnvelope
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
  }

  export type DiaryLocationCreateNestedManyWithoutDiaryEntryInput = {
    create?: XOR<DiaryLocationCreateWithoutDiaryEntryInput, DiaryLocationUncheckedCreateWithoutDiaryEntryInput> | DiaryLocationCreateWithoutDiaryEntryInput[] | DiaryLocationUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryLocationCreateOrConnectWithoutDiaryEntryInput | DiaryLocationCreateOrConnectWithoutDiaryEntryInput[]
    createMany?: DiaryLocationCreateManyDiaryEntryInputEnvelope
    connect?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
  }

  export type DiaryMentionUncheckedCreateNestedManyWithoutDiaryEntryInput = {
    create?: XOR<DiaryMentionCreateWithoutDiaryEntryInput, DiaryMentionUncheckedCreateWithoutDiaryEntryInput> | DiaryMentionCreateWithoutDiaryEntryInput[] | DiaryMentionUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutDiaryEntryInput | DiaryMentionCreateOrConnectWithoutDiaryEntryInput[]
    createMany?: DiaryMentionCreateManyDiaryEntryInputEnvelope
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
  }

  export type DiaryLocationUncheckedCreateNestedManyWithoutDiaryEntryInput = {
    create?: XOR<DiaryLocationCreateWithoutDiaryEntryInput, DiaryLocationUncheckedCreateWithoutDiaryEntryInput> | DiaryLocationCreateWithoutDiaryEntryInput[] | DiaryLocationUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryLocationCreateOrConnectWithoutDiaryEntryInput | DiaryLocationCreateOrConnectWithoutDiaryEntryInput[]
    createMany?: DiaryLocationCreateManyDiaryEntryInputEnvelope
    connect?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
  }

  export type DiaryMentionUpdateManyWithoutDiaryEntryNestedInput = {
    create?: XOR<DiaryMentionCreateWithoutDiaryEntryInput, DiaryMentionUncheckedCreateWithoutDiaryEntryInput> | DiaryMentionCreateWithoutDiaryEntryInput[] | DiaryMentionUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutDiaryEntryInput | DiaryMentionCreateOrConnectWithoutDiaryEntryInput[]
    upsert?: DiaryMentionUpsertWithWhereUniqueWithoutDiaryEntryInput | DiaryMentionUpsertWithWhereUniqueWithoutDiaryEntryInput[]
    createMany?: DiaryMentionCreateManyDiaryEntryInputEnvelope
    set?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    disconnect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    delete?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    update?: DiaryMentionUpdateWithWhereUniqueWithoutDiaryEntryInput | DiaryMentionUpdateWithWhereUniqueWithoutDiaryEntryInput[]
    updateMany?: DiaryMentionUpdateManyWithWhereWithoutDiaryEntryInput | DiaryMentionUpdateManyWithWhereWithoutDiaryEntryInput[]
    deleteMany?: DiaryMentionScalarWhereInput | DiaryMentionScalarWhereInput[]
  }

  export type DiaryLocationUpdateManyWithoutDiaryEntryNestedInput = {
    create?: XOR<DiaryLocationCreateWithoutDiaryEntryInput, DiaryLocationUncheckedCreateWithoutDiaryEntryInput> | DiaryLocationCreateWithoutDiaryEntryInput[] | DiaryLocationUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryLocationCreateOrConnectWithoutDiaryEntryInput | DiaryLocationCreateOrConnectWithoutDiaryEntryInput[]
    upsert?: DiaryLocationUpsertWithWhereUniqueWithoutDiaryEntryInput | DiaryLocationUpsertWithWhereUniqueWithoutDiaryEntryInput[]
    createMany?: DiaryLocationCreateManyDiaryEntryInputEnvelope
    set?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    disconnect?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    delete?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    connect?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    update?: DiaryLocationUpdateWithWhereUniqueWithoutDiaryEntryInput | DiaryLocationUpdateWithWhereUniqueWithoutDiaryEntryInput[]
    updateMany?: DiaryLocationUpdateManyWithWhereWithoutDiaryEntryInput | DiaryLocationUpdateManyWithWhereWithoutDiaryEntryInput[]
    deleteMany?: DiaryLocationScalarWhereInput | DiaryLocationScalarWhereInput[]
  }

  export type DiaryMentionUncheckedUpdateManyWithoutDiaryEntryNestedInput = {
    create?: XOR<DiaryMentionCreateWithoutDiaryEntryInput, DiaryMentionUncheckedCreateWithoutDiaryEntryInput> | DiaryMentionCreateWithoutDiaryEntryInput[] | DiaryMentionUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryMentionCreateOrConnectWithoutDiaryEntryInput | DiaryMentionCreateOrConnectWithoutDiaryEntryInput[]
    upsert?: DiaryMentionUpsertWithWhereUniqueWithoutDiaryEntryInput | DiaryMentionUpsertWithWhereUniqueWithoutDiaryEntryInput[]
    createMany?: DiaryMentionCreateManyDiaryEntryInputEnvelope
    set?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    disconnect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    delete?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    connect?: DiaryMentionWhereUniqueInput | DiaryMentionWhereUniqueInput[]
    update?: DiaryMentionUpdateWithWhereUniqueWithoutDiaryEntryInput | DiaryMentionUpdateWithWhereUniqueWithoutDiaryEntryInput[]
    updateMany?: DiaryMentionUpdateManyWithWhereWithoutDiaryEntryInput | DiaryMentionUpdateManyWithWhereWithoutDiaryEntryInput[]
    deleteMany?: DiaryMentionScalarWhereInput | DiaryMentionScalarWhereInput[]
  }

  export type DiaryLocationUncheckedUpdateManyWithoutDiaryEntryNestedInput = {
    create?: XOR<DiaryLocationCreateWithoutDiaryEntryInput, DiaryLocationUncheckedCreateWithoutDiaryEntryInput> | DiaryLocationCreateWithoutDiaryEntryInput[] | DiaryLocationUncheckedCreateWithoutDiaryEntryInput[]
    connectOrCreate?: DiaryLocationCreateOrConnectWithoutDiaryEntryInput | DiaryLocationCreateOrConnectWithoutDiaryEntryInput[]
    upsert?: DiaryLocationUpsertWithWhereUniqueWithoutDiaryEntryInput | DiaryLocationUpsertWithWhereUniqueWithoutDiaryEntryInput[]
    createMany?: DiaryLocationCreateManyDiaryEntryInputEnvelope
    set?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    disconnect?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    delete?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    connect?: DiaryLocationWhereUniqueInput | DiaryLocationWhereUniqueInput[]
    update?: DiaryLocationUpdateWithWhereUniqueWithoutDiaryEntryInput | DiaryLocationUpdateWithWhereUniqueWithoutDiaryEntryInput[]
    updateMany?: DiaryLocationUpdateManyWithWhereWithoutDiaryEntryInput | DiaryLocationUpdateManyWithWhereWithoutDiaryEntryInput[]
    deleteMany?: DiaryLocationScalarWhereInput | DiaryLocationScalarWhereInput[]
  }

  export type PersonCreateNestedOneWithoutMentionsInput = {
    create?: XOR<PersonCreateWithoutMentionsInput, PersonUncheckedCreateWithoutMentionsInput>
    connectOrCreate?: PersonCreateOrConnectWithoutMentionsInput
    connect?: PersonWhereUniqueInput
  }

  export type DiaryEntryCreateNestedOneWithoutMentionsInput = {
    create?: XOR<DiaryEntryCreateWithoutMentionsInput, DiaryEntryUncheckedCreateWithoutMentionsInput>
    connectOrCreate?: DiaryEntryCreateOrConnectWithoutMentionsInput
    connect?: DiaryEntryWhereUniqueInput
  }

  export type PersonUpdateOneRequiredWithoutMentionsNestedInput = {
    create?: XOR<PersonCreateWithoutMentionsInput, PersonUncheckedCreateWithoutMentionsInput>
    connectOrCreate?: PersonCreateOrConnectWithoutMentionsInput
    upsert?: PersonUpsertWithoutMentionsInput
    connect?: PersonWhereUniqueInput
    update?: XOR<XOR<PersonUpdateToOneWithWhereWithoutMentionsInput, PersonUpdateWithoutMentionsInput>, PersonUncheckedUpdateWithoutMentionsInput>
  }

  export type DiaryEntryUpdateOneRequiredWithoutMentionsNestedInput = {
    create?: XOR<DiaryEntryCreateWithoutMentionsInput, DiaryEntryUncheckedCreateWithoutMentionsInput>
    connectOrCreate?: DiaryEntryCreateOrConnectWithoutMentionsInput
    upsert?: DiaryEntryUpsertWithoutMentionsInput
    connect?: DiaryEntryWhereUniqueInput
    update?: XOR<XOR<DiaryEntryUpdateToOneWithWhereWithoutMentionsInput, DiaryEntryUpdateWithoutMentionsInput>, DiaryEntryUncheckedUpdateWithoutMentionsInput>
  }

  export type DiaryEntryCreateNestedOneWithoutLocationsInput = {
    create?: XOR<DiaryEntryCreateWithoutLocationsInput, DiaryEntryUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: DiaryEntryCreateOrConnectWithoutLocationsInput
    connect?: DiaryEntryWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DiaryEntryUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: XOR<DiaryEntryCreateWithoutLocationsInput, DiaryEntryUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: DiaryEntryCreateOrConnectWithoutLocationsInput
    upsert?: DiaryEntryUpsertWithoutLocationsInput
    connect?: DiaryEntryWhereUniqueInput
    update?: XOR<XOR<DiaryEntryUpdateToOneWithWhereWithoutLocationsInput, DiaryEntryUpdateWithoutLocationsInput>, DiaryEntryUncheckedUpdateWithoutLocationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DiaryMentionCreateWithoutPersonInput = {
    id?: string
    createdAt?: Date | string
    diaryEntry: DiaryEntryCreateNestedOneWithoutMentionsInput
  }

  export type DiaryMentionUncheckedCreateWithoutPersonInput = {
    id?: string
    diaryEntryId: string
    createdAt?: Date | string
  }

  export type DiaryMentionCreateOrConnectWithoutPersonInput = {
    where: DiaryMentionWhereUniqueInput
    create: XOR<DiaryMentionCreateWithoutPersonInput, DiaryMentionUncheckedCreateWithoutPersonInput>
  }

  export type DiaryMentionCreateManyPersonInputEnvelope = {
    data: DiaryMentionCreateManyPersonInput | DiaryMentionCreateManyPersonInput[]
    skipDuplicates?: boolean
  }

  export type DiaryMentionUpsertWithWhereUniqueWithoutPersonInput = {
    where: DiaryMentionWhereUniqueInput
    update: XOR<DiaryMentionUpdateWithoutPersonInput, DiaryMentionUncheckedUpdateWithoutPersonInput>
    create: XOR<DiaryMentionCreateWithoutPersonInput, DiaryMentionUncheckedCreateWithoutPersonInput>
  }

  export type DiaryMentionUpdateWithWhereUniqueWithoutPersonInput = {
    where: DiaryMentionWhereUniqueInput
    data: XOR<DiaryMentionUpdateWithoutPersonInput, DiaryMentionUncheckedUpdateWithoutPersonInput>
  }

  export type DiaryMentionUpdateManyWithWhereWithoutPersonInput = {
    where: DiaryMentionScalarWhereInput
    data: XOR<DiaryMentionUpdateManyMutationInput, DiaryMentionUncheckedUpdateManyWithoutPersonInput>
  }

  export type DiaryMentionScalarWhereInput = {
    AND?: DiaryMentionScalarWhereInput | DiaryMentionScalarWhereInput[]
    OR?: DiaryMentionScalarWhereInput[]
    NOT?: DiaryMentionScalarWhereInput | DiaryMentionScalarWhereInput[]
    id?: StringFilter<"DiaryMention"> | string
    personId?: StringFilter<"DiaryMention"> | string
    diaryEntryId?: StringFilter<"DiaryMention"> | string
    createdAt?: DateTimeFilter<"DiaryMention"> | Date | string
  }

  export type DiaryMentionCreateWithoutDiaryEntryInput = {
    id?: string
    createdAt?: Date | string
    person: PersonCreateNestedOneWithoutMentionsInput
  }

  export type DiaryMentionUncheckedCreateWithoutDiaryEntryInput = {
    id?: string
    personId: string
    createdAt?: Date | string
  }

  export type DiaryMentionCreateOrConnectWithoutDiaryEntryInput = {
    where: DiaryMentionWhereUniqueInput
    create: XOR<DiaryMentionCreateWithoutDiaryEntryInput, DiaryMentionUncheckedCreateWithoutDiaryEntryInput>
  }

  export type DiaryMentionCreateManyDiaryEntryInputEnvelope = {
    data: DiaryMentionCreateManyDiaryEntryInput | DiaryMentionCreateManyDiaryEntryInput[]
    skipDuplicates?: boolean
  }

  export type DiaryLocationCreateWithoutDiaryEntryInput = {
    id?: string
    name: string
    placeId: string
    lat: number
    lng: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiaryLocationUncheckedCreateWithoutDiaryEntryInput = {
    id?: string
    name: string
    placeId: string
    lat: number
    lng: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiaryLocationCreateOrConnectWithoutDiaryEntryInput = {
    where: DiaryLocationWhereUniqueInput
    create: XOR<DiaryLocationCreateWithoutDiaryEntryInput, DiaryLocationUncheckedCreateWithoutDiaryEntryInput>
  }

  export type DiaryLocationCreateManyDiaryEntryInputEnvelope = {
    data: DiaryLocationCreateManyDiaryEntryInput | DiaryLocationCreateManyDiaryEntryInput[]
    skipDuplicates?: boolean
  }

  export type DiaryMentionUpsertWithWhereUniqueWithoutDiaryEntryInput = {
    where: DiaryMentionWhereUniqueInput
    update: XOR<DiaryMentionUpdateWithoutDiaryEntryInput, DiaryMentionUncheckedUpdateWithoutDiaryEntryInput>
    create: XOR<DiaryMentionCreateWithoutDiaryEntryInput, DiaryMentionUncheckedCreateWithoutDiaryEntryInput>
  }

  export type DiaryMentionUpdateWithWhereUniqueWithoutDiaryEntryInput = {
    where: DiaryMentionWhereUniqueInput
    data: XOR<DiaryMentionUpdateWithoutDiaryEntryInput, DiaryMentionUncheckedUpdateWithoutDiaryEntryInput>
  }

  export type DiaryMentionUpdateManyWithWhereWithoutDiaryEntryInput = {
    where: DiaryMentionScalarWhereInput
    data: XOR<DiaryMentionUpdateManyMutationInput, DiaryMentionUncheckedUpdateManyWithoutDiaryEntryInput>
  }

  export type DiaryLocationUpsertWithWhereUniqueWithoutDiaryEntryInput = {
    where: DiaryLocationWhereUniqueInput
    update: XOR<DiaryLocationUpdateWithoutDiaryEntryInput, DiaryLocationUncheckedUpdateWithoutDiaryEntryInput>
    create: XOR<DiaryLocationCreateWithoutDiaryEntryInput, DiaryLocationUncheckedCreateWithoutDiaryEntryInput>
  }

  export type DiaryLocationUpdateWithWhereUniqueWithoutDiaryEntryInput = {
    where: DiaryLocationWhereUniqueInput
    data: XOR<DiaryLocationUpdateWithoutDiaryEntryInput, DiaryLocationUncheckedUpdateWithoutDiaryEntryInput>
  }

  export type DiaryLocationUpdateManyWithWhereWithoutDiaryEntryInput = {
    where: DiaryLocationScalarWhereInput
    data: XOR<DiaryLocationUpdateManyMutationInput, DiaryLocationUncheckedUpdateManyWithoutDiaryEntryInput>
  }

  export type DiaryLocationScalarWhereInput = {
    AND?: DiaryLocationScalarWhereInput | DiaryLocationScalarWhereInput[]
    OR?: DiaryLocationScalarWhereInput[]
    NOT?: DiaryLocationScalarWhereInput | DiaryLocationScalarWhereInput[]
    id?: StringFilter<"DiaryLocation"> | string
    name?: StringFilter<"DiaryLocation"> | string
    placeId?: StringFilter<"DiaryLocation"> | string
    lat?: FloatFilter<"DiaryLocation"> | number
    lng?: FloatFilter<"DiaryLocation"> | number
    diaryEntryId?: StringFilter<"DiaryLocation"> | string
    createdAt?: DateTimeFilter<"DiaryLocation"> | Date | string
    updatedAt?: DateTimeFilter<"DiaryLocation"> | Date | string
  }

  export type PersonCreateWithoutMentionsInput = {
    id?: string
    name: string
    birthday?: Date | string | null
    howWeMet?: string | null
    interests?: PersonCreateinterestsInput | string[]
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PersonUncheckedCreateWithoutMentionsInput = {
    id?: string
    name: string
    birthday?: Date | string | null
    howWeMet?: string | null
    interests?: PersonCreateinterestsInput | string[]
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PersonCreateOrConnectWithoutMentionsInput = {
    where: PersonWhereUniqueInput
    create: XOR<PersonCreateWithoutMentionsInput, PersonUncheckedCreateWithoutMentionsInput>
  }

  export type DiaryEntryCreateWithoutMentionsInput = {
    id?: string
    content: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: DiaryLocationCreateNestedManyWithoutDiaryEntryInput
  }

  export type DiaryEntryUncheckedCreateWithoutMentionsInput = {
    id?: string
    content: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: DiaryLocationUncheckedCreateNestedManyWithoutDiaryEntryInput
  }

  export type DiaryEntryCreateOrConnectWithoutMentionsInput = {
    where: DiaryEntryWhereUniqueInput
    create: XOR<DiaryEntryCreateWithoutMentionsInput, DiaryEntryUncheckedCreateWithoutMentionsInput>
  }

  export type PersonUpsertWithoutMentionsInput = {
    update: XOR<PersonUpdateWithoutMentionsInput, PersonUncheckedUpdateWithoutMentionsInput>
    create: XOR<PersonCreateWithoutMentionsInput, PersonUncheckedCreateWithoutMentionsInput>
    where?: PersonWhereInput
  }

  export type PersonUpdateToOneWithWhereWithoutMentionsInput = {
    where?: PersonWhereInput
    data: XOR<PersonUpdateWithoutMentionsInput, PersonUncheckedUpdateWithoutMentionsInput>
  }

  export type PersonUpdateWithoutMentionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    howWeMet?: NullableStringFieldUpdateOperationsInput | string | null
    interests?: PersonUpdateinterestsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonUncheckedUpdateWithoutMentionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    birthday?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    howWeMet?: NullableStringFieldUpdateOperationsInput | string | null
    interests?: PersonUpdateinterestsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryEntryUpsertWithoutMentionsInput = {
    update: XOR<DiaryEntryUpdateWithoutMentionsInput, DiaryEntryUncheckedUpdateWithoutMentionsInput>
    create: XOR<DiaryEntryCreateWithoutMentionsInput, DiaryEntryUncheckedCreateWithoutMentionsInput>
    where?: DiaryEntryWhereInput
  }

  export type DiaryEntryUpdateToOneWithWhereWithoutMentionsInput = {
    where?: DiaryEntryWhereInput
    data: XOR<DiaryEntryUpdateWithoutMentionsInput, DiaryEntryUncheckedUpdateWithoutMentionsInput>
  }

  export type DiaryEntryUpdateWithoutMentionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: DiaryLocationUpdateManyWithoutDiaryEntryNestedInput
  }

  export type DiaryEntryUncheckedUpdateWithoutMentionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: DiaryLocationUncheckedUpdateManyWithoutDiaryEntryNestedInput
  }

  export type DiaryEntryCreateWithoutLocationsInput = {
    id?: string
    content: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    mentions?: DiaryMentionCreateNestedManyWithoutDiaryEntryInput
  }

  export type DiaryEntryUncheckedCreateWithoutLocationsInput = {
    id?: string
    content: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    mentions?: DiaryMentionUncheckedCreateNestedManyWithoutDiaryEntryInput
  }

  export type DiaryEntryCreateOrConnectWithoutLocationsInput = {
    where: DiaryEntryWhereUniqueInput
    create: XOR<DiaryEntryCreateWithoutLocationsInput, DiaryEntryUncheckedCreateWithoutLocationsInput>
  }

  export type DiaryEntryUpsertWithoutLocationsInput = {
    update: XOR<DiaryEntryUpdateWithoutLocationsInput, DiaryEntryUncheckedUpdateWithoutLocationsInput>
    create: XOR<DiaryEntryCreateWithoutLocationsInput, DiaryEntryUncheckedCreateWithoutLocationsInput>
    where?: DiaryEntryWhereInput
  }

  export type DiaryEntryUpdateToOneWithWhereWithoutLocationsInput = {
    where?: DiaryEntryWhereInput
    data: XOR<DiaryEntryUpdateWithoutLocationsInput, DiaryEntryUncheckedUpdateWithoutLocationsInput>
  }

  export type DiaryEntryUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mentions?: DiaryMentionUpdateManyWithoutDiaryEntryNestedInput
  }

  export type DiaryEntryUncheckedUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mentions?: DiaryMentionUncheckedUpdateManyWithoutDiaryEntryNestedInput
  }

  export type DiaryMentionCreateManyPersonInput = {
    id?: string
    diaryEntryId: string
    createdAt?: Date | string
  }

  export type DiaryMentionUpdateWithoutPersonInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    diaryEntry?: DiaryEntryUpdateOneRequiredWithoutMentionsNestedInput
  }

  export type DiaryMentionUncheckedUpdateWithoutPersonInput = {
    id?: StringFieldUpdateOperationsInput | string
    diaryEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryMentionUncheckedUpdateManyWithoutPersonInput = {
    id?: StringFieldUpdateOperationsInput | string
    diaryEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryMentionCreateManyDiaryEntryInput = {
    id?: string
    personId: string
    createdAt?: Date | string
  }

  export type DiaryLocationCreateManyDiaryEntryInput = {
    id?: string
    name: string
    placeId: string
    lat: number
    lng: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiaryMentionUpdateWithoutDiaryEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    person?: PersonUpdateOneRequiredWithoutMentionsNestedInput
  }

  export type DiaryMentionUncheckedUpdateWithoutDiaryEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryMentionUncheckedUpdateManyWithoutDiaryEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    personId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryLocationUpdateWithoutDiaryEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    placeId?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryLocationUncheckedUpdateWithoutDiaryEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    placeId?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiaryLocationUncheckedUpdateManyWithoutDiaryEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    placeId?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}