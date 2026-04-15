var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { am as ProtocolError, an as TimeoutWaitingForResponseErrorCode, ao as utf8ToBytes, ap as ExternalError, aq as MissingRootKeyErrorCode, ar as Certificate, as as lookupResultToBuffer, at as RequestStatusResponseStatus, au as UnknownError, av as RequestStatusDoneNoReplyErrorCode, aw as RejectError, ax as CertifiedRejectErrorCode, ay as UNREACHABLE_ERROR, az as InputError, aA as InvalidReadStateRequestErrorCode, aB as ReadRequestType, aC as Principal, aD as IDL, aE as MissingCanisterIdErrorCode, aF as HttpAgent, aG as encode, aH as QueryResponseStatus, aI as UncertifiedRejectErrorCode, aJ as isV3ResponseBody, aK as isV2ResponseBody, aL as UncertifiedRejectUpdateErrorCode, aM as UnexpectedErrorCode, aN as decode, aO as Subscribable, aP as pendingThenable, aQ as resolveEnabled, aR as shallowEqualObjects, aS as resolveStaleTime, aT as noop, aU as environmentManager, aV as isValidTimeout, aW as timeUntilStale, aX as timeoutManager, aY as focusManager, aZ as fetchState, a_ as replaceData, a$ as notifyManager, b0 as hashKey, b1 as getDefaultState, j as reactExports, b2 as shouldThrowError, b3 as useQueryClient, K as useInternetIdentity, b4 as createActorWithConfig, b5 as Record, b6 as Variant, b7 as Vec, b8 as Opt, b9 as Service, ba as Func, bb as Text, bc as Nat, bd as Null, be as Bool, bf as Principal$1, bg as Int } from "./index-BMSJKAYU.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor$1(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const MenuCategory = Record({
  "id": Nat,
  "name": Text,
  "description": Text,
  "emoji": Text
});
const DietaryTag$1 = Variant({
  "chefsSpecial": Null,
  "vegan": Null,
  "glutenFree": Null,
  "spicy": Null,
  "vegetarian": Null
});
const MenuItem = Record({
  "id": Nat,
  "categoryId": Nat,
  "calories": Opt(Nat),
  "name": Text,
  "tags": Vec(DietaryTag$1),
  "isAvailable": Bool,
  "description": Text,
  "isPopular": Bool,
  "imageUrl": Text,
  "price": Nat
});
const UserId = Principal$1;
const CustomerProfile = Record({
  "id": UserId,
  "dietaryPreferences": Vec(DietaryTag$1),
  "name": Text,
  "favoriteItems": Vec(Nat),
  "email": Text,
  "phone": Text
});
const Timestamp = Int;
const SenderRole$1 = Variant({
  "customer": Null,
  "chef": Null
});
const ChatMessage = Record({
  "id": Nat,
  "content": Text,
  "isRead": Bool,
  "orderId": Opt(Nat),
  "timestamp": Timestamp,
  "senderRole": SenderRole$1,
  "senderId": UserId,
  "reservationId": Opt(Nat)
});
const ChatThread = Record({
  "id": Nat,
  "messages": Vec(ChatMessage),
  "lastActivity": Timestamp,
  "isOpen": Bool,
  "orderId": Nat,
  "customerId": UserId
});
const OrderStatus$1 = Variant({
  "preparing": Null,
  "cancelled": Null,
  "pending": Null,
  "completed": Null,
  "confirmed": Null,
  "ready": Null
});
const OrderType$1 = Variant({
  "takeout": Null,
  "dineIn": Null
});
const OrderItem = Record({
  "specialInstructions": Text,
  "quantity": Nat,
  "menuItemId": Nat
});
const Order = Record({
  "id": Nat,
  "tax": Nat,
  "status": OrderStatus$1,
  "total": Nat,
  "createdAt": Timestamp,
  "tableNumber": Opt(Nat),
  "orderType": OrderType$1,
  "specialInstructions": Text,
  "customerId": UserId,
  "items": Vec(OrderItem),
  "subtotal": Nat
});
const ReservationStatus$1 = Variant({
  "cancelled": Null,
  "pending": Null,
  "confirmed": Null
});
const Reservation = Record({
  "id": Nat,
  "customerName": Text,
  "status": ReservationStatus$1,
  "specialOccasion": Opt(Text),
  "date": Text,
  "guestCount": Nat,
  "time": Text,
  "tableId": Nat,
  "email": Text,
  "notes": Opt(Text),
  "customerId": UserId,
  "phone": Text
});
const TableStatus$1 = Variant({
  "occupied": Null,
  "reserved": Null,
  "available": Null,
  "maintenance": Null
});
const Table = Record({
  "x": Nat,
  "y": Nat,
  "id": Nat,
  "status": TableStatus$1,
  "number": Nat,
  "capacity": Nat
});
Service({
  "addFavoriteItem": Func([Nat], [Bool], []),
  "addMenuCategory": Func(
    [Text, Text, Text],
    [MenuCategory],
    []
  ),
  "addMenuItem": Func(
    [
      Nat,
      Text,
      Text,
      Nat,
      Text,
      Vec(DietaryTag$1),
      Opt(Nat)
    ],
    [MenuItem],
    []
  ),
  "cancelOrder": Func([Nat], [Bool], []),
  "cancelReservation": Func([Nat], [Bool], []),
  "deleteMenuItem": Func([Nat], [Bool], []),
  "getAllCustomers": Func([], [Vec(CustomerProfile)], []),
  "getAllOpenThreads": Func([], [Vec(ChatThread)], []),
  "getAllOrders": Func([], [Vec(Order)], []),
  "getAllReservations": Func([], [Vec(Reservation)], []),
  "getAllTables": Func([], [Vec(Table)], ["query"]),
  "getAvailableTables": Func(
    [Text, Text, Nat],
    [Vec(Table)],
    ["query"]
  ),
  "getCustomerOrders": Func([], [Vec(Order)], []),
  "getCustomerReservations": Func([], [Vec(Reservation)], []),
  "getMenuCategories": Func([], [Vec(MenuCategory)], ["query"]),
  "getMenuItem": Func([Nat], [Opt(MenuItem)], ["query"]),
  "getMenuItems": Func([], [Vec(MenuItem)], ["query"]),
  "getMenuItemsByCategory": Func(
    [Nat],
    [Vec(MenuItem)],
    ["query"]
  ),
  "getMyProfile": Func([], [Opt(CustomerProfile)], []),
  "getNewMessages": Func(
    [Nat, Nat],
    [Vec(ChatMessage)],
    ["query"]
  ),
  "getOrder": Func([Nat], [Opt(Order)], ["query"]),
  "getOrdersByStatus": Func([OrderStatus$1], [Vec(Order)], []),
  "getReservation": Func([Nat], [Opt(Reservation)], ["query"]),
  "getThread": Func([Nat], [Opt(ChatThread)], ["query"]),
  "getThreadByOrder": Func([Nat], [Opt(ChatThread)], ["query"]),
  "makeReservation": Func(
    [
      Nat,
      Nat,
      Text,
      Text,
      Text,
      Text,
      Text,
      Opt(Text),
      Opt(Text)
    ],
    [Reservation],
    []
  ),
  "markMessagesRead": Func([Nat], [Bool], []),
  "modifyReservation": Func([Reservation], [Bool], []),
  "placeOrder": Func(
    [Vec(OrderItem), OrderType$1, Text, Opt(Nat)],
    [Order],
    []
  ),
  "removeFavoriteItem": Func([Nat], [Bool], []),
  "searchMenuItems": Func([Text], [Vec(MenuItem)], ["query"]),
  "sendChefMessage": Func([Nat, Text], [ChatMessage], []),
  "sendMessage": Func([Nat, Text], [ChatMessage], []),
  "toggleItemAvailability": Func([Nat], [Bool], []),
  "updateMenuItem": Func([MenuItem], [Bool], []),
  "updateOrderStatus": Func([Nat, OrderStatus$1], [Bool], []),
  "updateProfile": Func(
    [Text, Text, Text, Vec(DietaryTag$1)],
    [CustomerProfile],
    []
  ),
  "updateReservationStatus": Func(
    [Nat, ReservationStatus$1],
    [Bool],
    []
  ),
  "updateTableStatus": Func([Nat, TableStatus$1], [Bool], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const MenuCategory2 = IDL2.Record({
    "id": IDL2.Nat,
    "name": IDL2.Text,
    "description": IDL2.Text,
    "emoji": IDL2.Text
  });
  const DietaryTag2 = IDL2.Variant({
    "chefsSpecial": IDL2.Null,
    "vegan": IDL2.Null,
    "glutenFree": IDL2.Null,
    "spicy": IDL2.Null,
    "vegetarian": IDL2.Null
  });
  const MenuItem2 = IDL2.Record({
    "id": IDL2.Nat,
    "categoryId": IDL2.Nat,
    "calories": IDL2.Opt(IDL2.Nat),
    "name": IDL2.Text,
    "tags": IDL2.Vec(DietaryTag2),
    "isAvailable": IDL2.Bool,
    "description": IDL2.Text,
    "isPopular": IDL2.Bool,
    "imageUrl": IDL2.Text,
    "price": IDL2.Nat
  });
  const UserId2 = IDL2.Principal;
  const CustomerProfile2 = IDL2.Record({
    "id": UserId2,
    "dietaryPreferences": IDL2.Vec(DietaryTag2),
    "name": IDL2.Text,
    "favoriteItems": IDL2.Vec(IDL2.Nat),
    "email": IDL2.Text,
    "phone": IDL2.Text
  });
  const Timestamp2 = IDL2.Int;
  const SenderRole2 = IDL2.Variant({ "customer": IDL2.Null, "chef": IDL2.Null });
  const ChatMessage2 = IDL2.Record({
    "id": IDL2.Nat,
    "content": IDL2.Text,
    "isRead": IDL2.Bool,
    "orderId": IDL2.Opt(IDL2.Nat),
    "timestamp": Timestamp2,
    "senderRole": SenderRole2,
    "senderId": UserId2,
    "reservationId": IDL2.Opt(IDL2.Nat)
  });
  const ChatThread2 = IDL2.Record({
    "id": IDL2.Nat,
    "messages": IDL2.Vec(ChatMessage2),
    "lastActivity": Timestamp2,
    "isOpen": IDL2.Bool,
    "orderId": IDL2.Nat,
    "customerId": UserId2
  });
  const OrderStatus2 = IDL2.Variant({
    "preparing": IDL2.Null,
    "cancelled": IDL2.Null,
    "pending": IDL2.Null,
    "completed": IDL2.Null,
    "confirmed": IDL2.Null,
    "ready": IDL2.Null
  });
  const OrderType2 = IDL2.Variant({ "takeout": IDL2.Null, "dineIn": IDL2.Null });
  const OrderItem2 = IDL2.Record({
    "specialInstructions": IDL2.Text,
    "quantity": IDL2.Nat,
    "menuItemId": IDL2.Nat
  });
  const Order2 = IDL2.Record({
    "id": IDL2.Nat,
    "tax": IDL2.Nat,
    "status": OrderStatus2,
    "total": IDL2.Nat,
    "createdAt": Timestamp2,
    "tableNumber": IDL2.Opt(IDL2.Nat),
    "orderType": OrderType2,
    "specialInstructions": IDL2.Text,
    "customerId": UserId2,
    "items": IDL2.Vec(OrderItem2),
    "subtotal": IDL2.Nat
  });
  const ReservationStatus2 = IDL2.Variant({
    "cancelled": IDL2.Null,
    "pending": IDL2.Null,
    "confirmed": IDL2.Null
  });
  const Reservation2 = IDL2.Record({
    "id": IDL2.Nat,
    "customerName": IDL2.Text,
    "status": ReservationStatus2,
    "specialOccasion": IDL2.Opt(IDL2.Text),
    "date": IDL2.Text,
    "guestCount": IDL2.Nat,
    "time": IDL2.Text,
    "tableId": IDL2.Nat,
    "email": IDL2.Text,
    "notes": IDL2.Opt(IDL2.Text),
    "customerId": UserId2,
    "phone": IDL2.Text
  });
  const TableStatus2 = IDL2.Variant({
    "occupied": IDL2.Null,
    "reserved": IDL2.Null,
    "available": IDL2.Null,
    "maintenance": IDL2.Null
  });
  const Table2 = IDL2.Record({
    "x": IDL2.Nat,
    "y": IDL2.Nat,
    "id": IDL2.Nat,
    "status": TableStatus2,
    "number": IDL2.Nat,
    "capacity": IDL2.Nat
  });
  return IDL2.Service({
    "addFavoriteItem": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "addMenuCategory": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text],
      [MenuCategory2],
      []
    ),
    "addMenuItem": IDL2.Func(
      [
        IDL2.Nat,
        IDL2.Text,
        IDL2.Text,
        IDL2.Nat,
        IDL2.Text,
        IDL2.Vec(DietaryTag2),
        IDL2.Opt(IDL2.Nat)
      ],
      [MenuItem2],
      []
    ),
    "cancelOrder": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "cancelReservation": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "deleteMenuItem": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "getAllCustomers": IDL2.Func([], [IDL2.Vec(CustomerProfile2)], []),
    "getAllOpenThreads": IDL2.Func([], [IDL2.Vec(ChatThread2)], []),
    "getAllOrders": IDL2.Func([], [IDL2.Vec(Order2)], []),
    "getAllReservations": IDL2.Func([], [IDL2.Vec(Reservation2)], []),
    "getAllTables": IDL2.Func([], [IDL2.Vec(Table2)], ["query"]),
    "getAvailableTables": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Nat],
      [IDL2.Vec(Table2)],
      ["query"]
    ),
    "getCustomerOrders": IDL2.Func([], [IDL2.Vec(Order2)], []),
    "getCustomerReservations": IDL2.Func([], [IDL2.Vec(Reservation2)], []),
    "getMenuCategories": IDL2.Func([], [IDL2.Vec(MenuCategory2)], ["query"]),
    "getMenuItem": IDL2.Func([IDL2.Nat], [IDL2.Opt(MenuItem2)], ["query"]),
    "getMenuItems": IDL2.Func([], [IDL2.Vec(MenuItem2)], ["query"]),
    "getMenuItemsByCategory": IDL2.Func(
      [IDL2.Nat],
      [IDL2.Vec(MenuItem2)],
      ["query"]
    ),
    "getMyProfile": IDL2.Func([], [IDL2.Opt(CustomerProfile2)], []),
    "getNewMessages": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(ChatMessage2)],
      ["query"]
    ),
    "getOrder": IDL2.Func([IDL2.Nat], [IDL2.Opt(Order2)], ["query"]),
    "getOrdersByStatus": IDL2.Func([OrderStatus2], [IDL2.Vec(Order2)], []),
    "getReservation": IDL2.Func([IDL2.Nat], [IDL2.Opt(Reservation2)], ["query"]),
    "getThread": IDL2.Func([IDL2.Nat], [IDL2.Opt(ChatThread2)], ["query"]),
    "getThreadByOrder": IDL2.Func([IDL2.Nat], [IDL2.Opt(ChatThread2)], ["query"]),
    "makeReservation": IDL2.Func(
      [
        IDL2.Nat,
        IDL2.Nat,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Text)
      ],
      [Reservation2],
      []
    ),
    "markMessagesRead": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "modifyReservation": IDL2.Func([Reservation2], [IDL2.Bool], []),
    "placeOrder": IDL2.Func(
      [IDL2.Vec(OrderItem2), OrderType2, IDL2.Text, IDL2.Opt(IDL2.Nat)],
      [Order2],
      []
    ),
    "removeFavoriteItem": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "searchMenuItems": IDL2.Func([IDL2.Text], [IDL2.Vec(MenuItem2)], ["query"]),
    "sendChefMessage": IDL2.Func([IDL2.Nat, IDL2.Text], [ChatMessage2], []),
    "sendMessage": IDL2.Func([IDL2.Nat, IDL2.Text], [ChatMessage2], []),
    "toggleItemAvailability": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "updateMenuItem": IDL2.Func([MenuItem2], [IDL2.Bool], []),
    "updateOrderStatus": IDL2.Func([IDL2.Nat, OrderStatus2], [IDL2.Bool], []),
    "updateProfile": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Vec(DietaryTag2)],
      [CustomerProfile2],
      []
    ),
    "updateReservationStatus": IDL2.Func(
      [IDL2.Nat, ReservationStatus2],
      [IDL2.Bool],
      []
    ),
    "updateTableStatus": IDL2.Func([IDL2.Nat, TableStatus2], [IDL2.Bool], [])
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var DietaryTag = /* @__PURE__ */ ((DietaryTag2) => {
  DietaryTag2["chefsSpecial"] = "chefsSpecial";
  DietaryTag2["vegan"] = "vegan";
  DietaryTag2["glutenFree"] = "glutenFree";
  DietaryTag2["spicy"] = "spicy";
  DietaryTag2["vegetarian"] = "vegetarian";
  return DietaryTag2;
})(DietaryTag || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["preparing"] = "preparing";
  OrderStatus2["cancelled"] = "cancelled";
  OrderStatus2["pending"] = "pending";
  OrderStatus2["completed"] = "completed";
  OrderStatus2["confirmed"] = "confirmed";
  OrderStatus2["ready"] = "ready";
  return OrderStatus2;
})(OrderStatus || {});
var OrderType = /* @__PURE__ */ ((OrderType2) => {
  OrderType2["takeout"] = "takeout";
  OrderType2["dineIn"] = "dineIn";
  return OrderType2;
})(OrderType || {});
var ReservationStatus = /* @__PURE__ */ ((ReservationStatus2) => {
  ReservationStatus2["cancelled"] = "cancelled";
  ReservationStatus2["pending"] = "pending";
  ReservationStatus2["confirmed"] = "confirmed";
  return ReservationStatus2;
})(ReservationStatus || {});
var SenderRole = /* @__PURE__ */ ((SenderRole2) => {
  SenderRole2["customer"] = "customer";
  SenderRole2["chef"] = "chef";
  return SenderRole2;
})(SenderRole || {});
var TableStatus = /* @__PURE__ */ ((TableStatus2) => {
  TableStatus2["occupied"] = "occupied";
  TableStatus2["reserved"] = "reserved";
  TableStatus2["available"] = "available";
  TableStatus2["maintenance"] = "maintenance";
  return TableStatus2;
})(TableStatus || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addFavoriteItem(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addFavoriteItem(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addFavoriteItem(arg0);
      return result;
    }
  }
  async addMenuCategory(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.addMenuCategory(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addMenuCategory(arg0, arg1, arg2);
      return result;
    }
  }
  async addMenuItem(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    if (this.processError) {
      try {
        const result = await this.actor.addMenuItem(arg0, arg1, arg2, arg3, arg4, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg5), to_candid_opt_n4(this._uploadFile, this._downloadFile, arg6));
        return from_candid_MenuItem_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addMenuItem(arg0, arg1, arg2, arg3, arg4, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg5), to_candid_opt_n4(this._uploadFile, this._downloadFile, arg6));
      return from_candid_MenuItem_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async cancelOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelOrder(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelOrder(arg0);
      return result;
    }
  }
  async cancelReservation(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelReservation(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelReservation(arg0);
      return result;
    }
  }
  async deleteMenuItem(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteMenuItem(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteMenuItem(arg0);
      return result;
    }
  }
  async getAllCustomers() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllCustomers();
        return from_candid_vec_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllCustomers();
      return from_candid_vec_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllOpenThreads() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllOpenThreads();
        return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllOpenThreads();
      return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllOrders();
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllOrders();
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllReservations() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllReservations();
        return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllReservations();
      return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllTables() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllTables();
        return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllTables();
      return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAvailableTables(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.getAvailableTables(arg0, arg1, arg2);
        return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAvailableTables(arg0, arg1, arg2);
      return from_candid_vec_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCustomerOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.getCustomerOrders();
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCustomerOrders();
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCustomerReservations() {
    if (this.processError) {
      try {
        const result = await this.actor.getCustomerReservations();
        return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCustomerReservations();
      return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMenuCategories() {
    if (this.processError) {
      try {
        const result = await this.actor.getMenuCategories();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMenuCategories();
      return result;
    }
  }
  async getMenuItem(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMenuItem(arg0);
        return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMenuItem(arg0);
      return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMenuItems() {
    if (this.processError) {
      try {
        const result = await this.actor.getMenuItems();
        return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMenuItems();
      return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMenuItemsByCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMenuItemsByCategory(arg0);
        return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMenuItemsByCategory(arg0);
      return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyProfile();
        return from_candid_opt_n42(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyProfile();
      return from_candid_opt_n42(this._uploadFile, this._downloadFile, result);
    }
  }
  async getNewMessages(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getNewMessages(arg0, arg1);
        return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNewMessages(arg0, arg1);
      return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getOrder(arg0);
        return from_candid_opt_n43(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrder(arg0);
      return from_candid_opt_n43(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrdersByStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getOrdersByStatus(to_candid_OrderStatus_n44(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrdersByStatus(to_candid_OrderStatus_n44(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReservation(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReservation(arg0);
        return from_candid_opt_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReservation(arg0);
      return from_candid_opt_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async getThread(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getThread(arg0);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getThread(arg0);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async getThreadByOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getThreadByOrder(arg0);
        return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getThreadByOrder(arg0);
      return from_candid_opt_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async makeReservation(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    if (this.processError) {
      try {
        const result = await this.actor.makeReservation(arg0, arg1, arg2, arg3, arg4, arg5, arg6, to_candid_opt_n48(this._uploadFile, this._downloadFile, arg7), to_candid_opt_n48(this._uploadFile, this._downloadFile, arg8));
        return from_candid_Reservation_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.makeReservation(arg0, arg1, arg2, arg3, arg4, arg5, arg6, to_candid_opt_n48(this._uploadFile, this._downloadFile, arg7), to_candid_opt_n48(this._uploadFile, this._downloadFile, arg8));
      return from_candid_Reservation_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async markMessagesRead(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.markMessagesRead(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markMessagesRead(arg0);
      return result;
    }
  }
  async modifyReservation(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.modifyReservation(to_candid_Reservation_n49(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.modifyReservation(to_candid_Reservation_n49(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async placeOrder(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.placeOrder(arg0, to_candid_OrderType_n53(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_opt_n4(this._uploadFile, this._downloadFile, arg3));
        return from_candid_Order_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.placeOrder(arg0, to_candid_OrderType_n53(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_opt_n4(this._uploadFile, this._downloadFile, arg3));
      return from_candid_Order_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeFavoriteItem(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeFavoriteItem(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeFavoriteItem(arg0);
      return result;
    }
  }
  async searchMenuItems(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchMenuItems(arg0);
        return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchMenuItems(arg0);
      return from_candid_vec_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async sendChefMessage(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.sendChefMessage(arg0, arg1);
        return from_candid_ChatMessage_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.sendChefMessage(arg0, arg1);
      return from_candid_ChatMessage_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async sendMessage(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.sendMessage(arg0, arg1);
        return from_candid_ChatMessage_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.sendMessage(arg0, arg1);
      return from_candid_ChatMessage_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async toggleItemAvailability(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.toggleItemAvailability(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.toggleItemAvailability(arg0);
      return result;
    }
  }
  async updateMenuItem(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMenuItem(to_candid_MenuItem_n55(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMenuItem(to_candid_MenuItem_n55(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async updateOrderStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateOrderStatus(arg0, to_candid_OrderStatus_n44(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateOrderStatus(arg0, to_candid_OrderStatus_n44(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async updateProfile(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.updateProfile(arg0, arg1, arg2, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg3));
        return from_candid_CustomerProfile_n12(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateProfile(arg0, arg1, arg2, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg3));
      return from_candid_CustomerProfile_n12(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateReservationStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateReservationStatus(arg0, to_candid_ReservationStatus_n51(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateReservationStatus(arg0, to_candid_ReservationStatus_n51(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async updateTableStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateTableStatus(arg0, to_candid_TableStatus_n57(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateTableStatus(arg0, to_candid_TableStatus_n57(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
}
function from_candid_ChatMessage_n18(_uploadFile, _downloadFile, value) {
  return from_candid_record_n19(_uploadFile, _downloadFile, value);
}
function from_candid_ChatThread_n15(_uploadFile, _downloadFile, value) {
  return from_candid_record_n16(_uploadFile, _downloadFile, value);
}
function from_candid_CustomerProfile_n12(_uploadFile, _downloadFile, value) {
  return from_candid_record_n13(_uploadFile, _downloadFile, value);
}
function from_candid_DietaryTag_n9(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_MenuItem_n5(_uploadFile, _downloadFile, value) {
  return from_candid_record_n6(_uploadFile, _downloadFile, value);
}
function from_candid_OrderStatus_n25(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n26(_uploadFile, _downloadFile, value);
}
function from_candid_OrderType_n27(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n28(_uploadFile, _downloadFile, value);
}
function from_candid_Order_n23(_uploadFile, _downloadFile, value) {
  return from_candid_record_n24(_uploadFile, _downloadFile, value);
}
function from_candid_ReservationStatus_n32(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n33(_uploadFile, _downloadFile, value);
}
function from_candid_Reservation_n30(_uploadFile, _downloadFile, value) {
  return from_candid_record_n31(_uploadFile, _downloadFile, value);
}
function from_candid_SenderRole_n20(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n21(_uploadFile, _downloadFile, value);
}
function from_candid_TableStatus_n38(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n39(_uploadFile, _downloadFile, value);
}
function from_candid_Table_n36(_uploadFile, _downloadFile, value) {
  return from_candid_record_n37(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n34(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_MenuItem_n5(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n42(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_CustomerProfile_n12(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n43(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Order_n23(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n46(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Reservation_n30(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n47(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ChatThread_n15(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n13(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    dietaryPreferences: from_candid_vec_n8(_uploadFile, _downloadFile, value.dietaryPreferences),
    name: value.name,
    favoriteItems: value.favoriteItems,
    email: value.email,
    phone: value.phone
  };
}
function from_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    messages: from_candid_vec_n17(_uploadFile, _downloadFile, value.messages),
    lastActivity: value.lastActivity,
    isOpen: value.isOpen,
    orderId: value.orderId,
    customerId: value.customerId
  };
}
function from_candid_record_n19(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    content: value.content,
    isRead: value.isRead,
    orderId: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.orderId)),
    timestamp: value.timestamp,
    senderRole: from_candid_SenderRole_n20(_uploadFile, _downloadFile, value.senderRole),
    senderId: value.senderId,
    reservationId: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.reservationId))
  };
}
function from_candid_record_n24(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    tax: value.tax,
    status: from_candid_OrderStatus_n25(_uploadFile, _downloadFile, value.status),
    total: value.total,
    createdAt: value.createdAt,
    tableNumber: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.tableNumber)),
    orderType: from_candid_OrderType_n27(_uploadFile, _downloadFile, value.orderType),
    specialInstructions: value.specialInstructions,
    customerId: value.customerId,
    items: value.items,
    subtotal: value.subtotal
  };
}
function from_candid_record_n31(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    customerName: value.customerName,
    status: from_candid_ReservationStatus_n32(_uploadFile, _downloadFile, value.status),
    specialOccasion: record_opt_to_undefined(from_candid_opt_n34(_uploadFile, _downloadFile, value.specialOccasion)),
    date: value.date,
    guestCount: value.guestCount,
    time: value.time,
    tableId: value.tableId,
    email: value.email,
    notes: record_opt_to_undefined(from_candid_opt_n34(_uploadFile, _downloadFile, value.notes)),
    customerId: value.customerId,
    phone: value.phone
  };
}
function from_candid_record_n37(_uploadFile, _downloadFile, value) {
  return {
    x: value.x,
    y: value.y,
    id: value.id,
    status: from_candid_TableStatus_n38(_uploadFile, _downloadFile, value.status),
    number: value.number,
    capacity: value.capacity
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    categoryId: value.categoryId,
    calories: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.calories)),
    name: value.name,
    tags: from_candid_vec_n8(_uploadFile, _downloadFile, value.tags),
    isAvailable: value.isAvailable,
    description: value.description,
    isPopular: value.isPopular,
    imageUrl: value.imageUrl,
    price: value.price
  };
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
  return "chefsSpecial" in value ? "chefsSpecial" : "vegan" in value ? "vegan" : "glutenFree" in value ? "glutenFree" : "spicy" in value ? "spicy" : "vegetarian" in value ? "vegetarian" : value;
}
function from_candid_variant_n21(_uploadFile, _downloadFile, value) {
  return "customer" in value ? "customer" : "chef" in value ? "chef" : value;
}
function from_candid_variant_n26(_uploadFile, _downloadFile, value) {
  return "preparing" in value ? "preparing" : "cancelled" in value ? "cancelled" : "pending" in value ? "pending" : "completed" in value ? "completed" : "confirmed" in value ? "confirmed" : "ready" in value ? "ready" : value;
}
function from_candid_variant_n28(_uploadFile, _downloadFile, value) {
  return "takeout" in value ? "takeout" : "dineIn" in value ? "dineIn" : value;
}
function from_candid_variant_n33(_uploadFile, _downloadFile, value) {
  return "cancelled" in value ? "cancelled" : "pending" in value ? "pending" : "confirmed" in value ? "confirmed" : value;
}
function from_candid_variant_n39(_uploadFile, _downloadFile, value) {
  return "occupied" in value ? "occupied" : "reserved" in value ? "reserved" : "available" in value ? "available" : "maintenance" in value ? "maintenance" : value;
}
function from_candid_vec_n11(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CustomerProfile_n12(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n14(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ChatThread_n15(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n17(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ChatMessage_n18(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n22(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Order_n23(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n29(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Reservation_n30(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n35(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Table_n36(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n41(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_MenuItem_n5(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n8(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_DietaryTag_n9(_uploadFile, _downloadFile, x));
}
function to_candid_DietaryTag_n2(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n3(_uploadFile, _downloadFile, value);
}
function to_candid_MenuItem_n55(_uploadFile, _downloadFile, value) {
  return to_candid_record_n56(_uploadFile, _downloadFile, value);
}
function to_candid_OrderStatus_n44(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n45(_uploadFile, _downloadFile, value);
}
function to_candid_OrderType_n53(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n54(_uploadFile, _downloadFile, value);
}
function to_candid_ReservationStatus_n51(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n52(_uploadFile, _downloadFile, value);
}
function to_candid_Reservation_n49(_uploadFile, _downloadFile, value) {
  return to_candid_record_n50(_uploadFile, _downloadFile, value);
}
function to_candid_TableStatus_n57(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n58(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n4(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n48(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n50(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    customerName: value.customerName,
    status: to_candid_ReservationStatus_n51(_uploadFile, _downloadFile, value.status),
    specialOccasion: value.specialOccasion ? candid_some(value.specialOccasion) : candid_none(),
    date: value.date,
    guestCount: value.guestCount,
    time: value.time,
    tableId: value.tableId,
    email: value.email,
    notes: value.notes ? candid_some(value.notes) : candid_none(),
    customerId: value.customerId,
    phone: value.phone
  };
}
function to_candid_record_n56(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    categoryId: value.categoryId,
    calories: value.calories ? candid_some(value.calories) : candid_none(),
    name: value.name,
    tags: to_candid_vec_n1(_uploadFile, _downloadFile, value.tags),
    isAvailable: value.isAvailable,
    description: value.description,
    isPopular: value.isPopular,
    imageUrl: value.imageUrl,
    price: value.price
  };
}
function to_candid_variant_n3(_uploadFile, _downloadFile, value) {
  return value == "chefsSpecial" ? {
    chefsSpecial: null
  } : value == "vegan" ? {
    vegan: null
  } : value == "glutenFree" ? {
    glutenFree: null
  } : value == "spicy" ? {
    spicy: null
  } : value == "vegetarian" ? {
    vegetarian: null
  } : value;
}
function to_candid_variant_n45(_uploadFile, _downloadFile, value) {
  return value == "preparing" ? {
    preparing: null
  } : value == "cancelled" ? {
    cancelled: null
  } : value == "pending" ? {
    pending: null
  } : value == "completed" ? {
    completed: null
  } : value == "confirmed" ? {
    confirmed: null
  } : value == "ready" ? {
    ready: null
  } : value;
}
function to_candid_variant_n52(_uploadFile, _downloadFile, value) {
  return value == "cancelled" ? {
    cancelled: null
  } : value == "pending" ? {
    pending: null
  } : value == "confirmed" ? {
    confirmed: null
  } : value;
}
function to_candid_variant_n54(_uploadFile, _downloadFile, value) {
  return value == "takeout" ? {
    takeout: null
  } : value == "dineIn" ? {
    dineIn: null
  } : value;
}
function to_candid_variant_n58(_uploadFile, _downloadFile, value) {
  return value == "occupied" ? {
    occupied: null
  } : value == "reserved" ? {
    reserved: null
  } : value == "available" ? {
    available: null
  } : value == "maintenance" ? {
    maintenance: null
  } : value;
}
function to_candid_vec_n1(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_DietaryTag_n2(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useActor() {
  const { actor, isFetching } = useActor$1(createActor);
  return { actor, isFetching };
}
function useMenuCategories() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menuCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuCategories();
    },
    enabled: !!actor && !isFetching
  });
}
function useMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching
  });
}
function useCustomerOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["customerOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerOrders();
    },
    enabled: !!actor && !isFetching
  });
}
function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching
  });
}
function useOrder(id) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["order", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching
  });
}
function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      items,
      orderType,
      specialInstructions,
      tableNumber
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(
        items,
        orderType,
        specialInstructions,
        tableNumber
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerOrders"] });
    }
  });
}
function useCancelOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelOrder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerOrders"] });
    }
  });
}
function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allOrders"] });
    }
  });
}
function useCustomerReservations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["customerReservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerReservations();
    },
    enabled: !!actor && !isFetching
  });
}
function useAllReservations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allReservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReservations();
    },
    enabled: !!actor && !isFetching
  });
}
function useAvailableTables(date, time, guestCount) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["availableTables", date, time, guestCount.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableTables(date, time, guestCount);
    },
    enabled: !!actor && !isFetching && !!date && !!time && guestCount > 0n
  });
}
function useMakeReservation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Not connected");
      return actor.makeReservation(
        params.tableId,
        params.guestCount,
        params.date,
        params.time,
        params.customerName,
        params.phone,
        params.email,
        params.specialOccasion,
        params.notes
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerReservations"] });
      qc.invalidateQueries({ queryKey: ["availableTables"] });
    }
  });
}
function useCancelReservation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelReservation(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerReservations"] });
    }
  });
}
function useUpdateReservationStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateReservationStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allReservations"] });
    }
  });
}
function useThread(orderId) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["thread", orderId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getThreadByOrder(orderId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e3
  });
}
function useAllOpenThreads() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allOpenThreads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOpenThreads();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e3
  });
}
function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      content
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(orderId, content);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["thread", vars.orderId.toString()] });
    }
  });
}
function useSendChefMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      content
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendChefMessage(orderId, content);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["thread", vars.orderId.toString()] });
      qc.invalidateQueries({ queryKey: ["allOpenThreads"] });
    }
  });
}
function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching
  });
}
function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      email,
      dietaryPreferences
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProfile(name, phone, email, dietaryPreferences);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    }
  });
}
function useRemoveFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (menuItemId) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFavoriteItem(menuItemId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    }
  });
}
function useAddMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMenuItem(
        params.categoryId,
        params.name,
        params.description,
        params.price,
        params.imageUrl,
        params.tags,
        params.calories
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    }
  });
}
function useUpdateMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMenuItem(item);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    }
  });
}
function useDeleteMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    }
  });
}
function useToggleItemAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleItemAvailability(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    }
  });
}
export {
  useUpdateReservationStatus as A,
  DietaryTag as D,
  OrderType as O,
  ReservationStatus as R,
  SenderRole as S,
  TableStatus as T,
  useMenuItems as a,
  useCustomerOrders as b,
  usePlaceOrder as c,
  useCancelOrder as d,
  useAvailableTables as e,
  useMakeReservation as f,
  useCancelReservation as g,
  useCustomerReservations as h,
  useThread as i,
  useOrder as j,
  useSendMessage as k,
  useActor as l,
  OrderStatus as m,
  useMyProfile as n,
  useUpdateProfile as o,
  useRemoveFavorite as p,
  useAllOrders as q,
  useAllReservations as r,
  useAllOpenThreads as s,
  useSendChefMessage as t,
  useMenuCategories as u,
  useAddMenuItem as v,
  useUpdateMenuItem as w,
  useDeleteMenuItem as x,
  useToggleItemAvailability as y,
  useUpdateOrderStatus as z
};
