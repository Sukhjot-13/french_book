// tests/manager-integration.test.ts — the Manager integration facade (src/lib/manager/index.ts).
//
// Runs under the repo's single `tsx tests/run-all.test.ts` entry point, in the
// same assert-based idiom as the rest of that file.
//
// The facade reads its environment at MODULE LOAD, so every case re-imports it
// through a cache-busting query string. That is the tsx equivalent of vitest's
// `vi.resetModules()`, and it is the only way to observe the "unconfigured"
// state after another case has configured the environment.

import assert from "assert";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const FACADE = "../src/lib/manager/index.ts";
type Facade = typeof import("../src/lib/manager/index");

const MANAGER_ENV = {
  MANAGER_ENDPOINT: "http://127.0.0.1:3300",
  MANAGER_APP_ID: "french-book",
  MANAGER_LOG_KEY: "mlk_test_key",
  MANAGER_ANALYTICS_KEY: "mak_test_key",
};

const MANAGER_CLIENT_ENV = {
  NEXT_PUBLIC_MANAGER_ENDPOINT: "http://127.0.0.1:3300",
  NEXT_PUBLIC_MANAGER_APP_ID: "french-book",
  NEXT_PUBLIC_MANAGER_CLIENT_KEY: "mck_test_key",
  NEXT_PUBLIC_MANAGER_ANALYTICS_KEY: "mak_test_key",
};

const MANAGER_VARS = [
  "MANAGER_ENDPOINT",
  "MANAGER_APP_ID",
  "MANAGER_LOG_KEY",
  "MANAGER_ANALYTICS_KEY",
  "MANAGER_LOG_SOURCE",
  "NEXT_PUBLIC_MANAGER_ENDPOINT",
  "NEXT_PUBLIC_MANAGER_APP_ID",
  "NEXT_PUBLIC_MANAGER_CLIENT_KEY",
  "NEXT_PUBLIC_MANAGER_ANALYTICS_KEY",
];

function setEnv(values: Record<string, string | undefined>): void {
  for (const key of MANAGER_VARS) delete process.env[key];
  for (const [key, value] of Object.entries(values ?? {})) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

// `tsx` compiles this repo to CJS (there is no "type": "module"), so the facade
// is re-required with its own cache entry deleted rather than imported with a
// cache-busting query string — that is the tsx equivalent of vitest's
// `vi.resetModules()`, and it is the only way to observe the "unconfigured"
// state after another case has configured the environment.
const requireFacade = createRequire(__filename);

function loadManager(): Facade {
  delete requireFacade.cache[requireFacade.resolve(FACADE)];
  delete (globalThis as Record<string, unknown>).__managerServerLogger;
  return requireFacade(FACADE) as Facade;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function runManagerIntegrationTests(): Promise<number> {
  let checks = 0;
  const ok = (message: string): void => {
    checks += 1;
    console.log(`   - ${message}`);
  };

  // 1. Fully disabled (no-ops) when nothing is configured.
  setEnv({});
  {
    const m = loadManager();
    assert.strictEqual(m.managerConfig.enabled, false, "no MANAGER_* means disabled");
    m.logServerEvent("noop_event", { a: 1 });
    m.logServerError("noop_error", new Error("x"));
    assert.strictEqual(m.managerTrackerScript(), null, "no tracker without config");
    const log = m.getManagerLogger();
    for (const level of ["trace", "debug", "info", "warn", "error", "fatal"] as const) {
      log[level]("message", { a: 1 });
    }
    log.child({ requestId: "r1" }).info("child");
    assert.strictEqual(log.timeEnd("timer"), 0, "no-op timer end is 0");
    await log.flush();
    assert.strictEqual(m.getManagerDroppedCount(), 0, "no drops when unconfigured");
    ok("disabled-when-unconfigured: every entry point is a safe no-op");
  }

  // 2. Enables itself when endpoint, app id and key are present.
  setEnv(MANAGER_ENV);
  {
    const m = loadManager();
    assert.strictEqual(m.managerConfig.enabled, true, "server block enables the integration");
    assert.strictEqual(m.managerConfig.appId, "french-book", "app id is read");
    assert.strictEqual(m.managerConfig.analyticsKey, "mak_test_key", "analytics key is read");
    ok("server enablement: endpoint + app id + log key all present");
  }

  // 3. Stays disabled when only the analytics key is set.
  setEnv({ MANAGER_ANALYTICS_KEY: "mak_test_key" });
  {
    const m = loadManager();
    assert.strictEqual(m.managerConfig.enabled, false, "analytics key alone does not enable logs");
    ok("partial config: the analytics key alone never enables log shipping");
  }

  // 4. Blank values are treated as unconfigured.
  setEnv({ ...MANAGER_ENV, MANAGER_LOG_KEY: "   " });
  {
    const m = loadManager();
    assert.strictEqual(m.managerConfig.enabled, false, "whitespace-only key is unconfigured");
    ok("blank value: a whitespace-only key does not enable the integration");
  }

  // 5. The CLIENT half stays disabled without the NEXT_PUBLIC_ block, even when
  //    the server half is fully configured. This is the trap that makes a
  //    'use client' module silently dead in a production build.
  setEnv(MANAGER_ENV);
  {
    const m = loadManager();
    assert.strictEqual(m.managerClientConfig.enabled, false, "server vars do not reach the browser");
    assert.strictEqual(m.managerClientConfig.apiKey, null, "no client key leaks from the server block");
    assert.strictEqual(m.managerTrackerScript(), null, "no tracker from the server block");
    ok("client split: the server MANAGER_* block never enables the browser half");
  }

  // 6. The client half enables itself from NEXT_PUBLIC_* alone.
  setEnv({ ...MANAGER_ENV, ...MANAGER_CLIENT_ENV });
  {
    const m = loadManager();
    assert.strictEqual(m.managerClientConfig.enabled, true, "NEXT_PUBLIC_ block enables the browser half");
    assert.strictEqual(m.managerClientConfig.apiKey, "mck_test_key", "client key is read from NEXT_PUBLIC_");
    assert.deepStrictEqual(
      m.managerTrackerScript(),
      { src: "http://127.0.0.1:3300/t.js?v=1", appId: "french-book", key: "mak_test_key" },
      "tracker tag is versioned and carries the app id + analytics key"
    );
    ok("client enablement: NEXT_PUBLIC_ endpoint + app id + client key");
  }

  // 7. Tracker is omitted when the client analytics key is missing.
  setEnv({ ...MANAGER_CLIENT_ENV, NEXT_PUBLIC_MANAGER_ANALYTICS_KEY: undefined });
  {
    const m = loadManager();
    assert.strictEqual(m.managerTrackerScript(), null, "no analytics key, no tracker");
    ok("tracker omitted without a client analytics key (logs still work)");
  }

  // 8. STATIC-ACCESS GUARD. Next.js only inlines a literal
  //    `process.env.NEXT_PUBLIC_FOO` member expression into the client bundle;
  //    a dynamic index (process.env[name]) compiles to a runtime lookup into an
  //    empty object and is therefore always undefined in the browser. This test
  //    reads the facade source and fails if any client value stops being static.
  {
    const source = fs.readFileSync(path.resolve(process.cwd(), "src/lib/manager/index.ts"), "utf-8");
    for (const name of [
      "NEXT_PUBLIC_MANAGER_ENDPOINT",
      "NEXT_PUBLIC_MANAGER_APP_ID",
      "NEXT_PUBLIC_MANAGER_CLIENT_KEY",
      "NEXT_PUBLIC_MANAGER_ANALYTICS_KEY",
    ]) {
      assert.ok(
        source.includes(`process.env.${name}`),
        `${name} must be read as a static process.env member expression, or Next.js will not inline it`
      );
    }
    const clientBlock = source.slice(source.indexOf("const CLIENT_ENDPOINT"), source.indexOf("export const managerClientConfig"));
    assert.ok(
      !/process\.env\s*\[/.test(clientBlock),
      "the client config block must not index process.env dynamically — that compiles to a browser-side lookup that always yields undefined"
    );
    assert.ok(
      !/env\(['"]NEXT_PUBLIC/.test(source),
      "the server `env()` helper must never be used for a NEXT_PUBLIC_ name"
    );
    ok("static access: every NEXT_PUBLIC_ value is a literal member expression, none dynamically indexed");
  }

  // 9. managerLog is a safe no-op when unconfigured, even with a bad level.
  setEnv({});
  {
    const m = loadManager();
    m.managerLog("info", "x", { a: 1 });
    m.managerLog("nonsense_level", "x");
    m.managerLog("error", "x", { error: new Error("boom") });
    ok("managerLog never throws when unconfigured, at any level");
  }

  // 10. Routine levels ride the batch window; error/fatal leading-edge flush.
  setEnv(MANAGER_ENV);
  {
    const m = loadManager();
    const calls: { info: string[]; error: string[]; flush: number } = { info: [], error: [], flush: 0 };
    (globalThis as Record<string, unknown>).__managerServerLogger = {
      info: (msg: string) => calls.info.push(msg),
      error: (msg: string) => calls.error.push(msg),
      flush: () => {
        calls.flush += 1;
        return Promise.resolve();
      },
    };

    m.managerLog("info", "routine_1");
    m.managerLog("info", "routine_2");
    assert.strictEqual(calls.flush, 0, "routine levels must NOT flush — the SDK batches them");

    m.managerLog("error", "urgent_1");
    assert.deepStrictEqual(calls.error, ["urgent_1"], "error is emitted");
    assert.strictEqual(calls.flush, 1, "error leading-edge flushes immediately");

    // A second error inside the gap must not start another request on its own.
    m.managerLog("error", "urgent_2");
    assert.strictEqual(calls.flush, 1, "a second error inside the 100ms gap does not re-flush");
    await sleep(150);
    assert.strictEqual(calls.flush, 2, "the trailing flush fires at the end of the gap");
    ok("batching: info rides the 250ms window, error leading-edge flushes with a 100ms floor");
  }

  // 11. Unknown level falls back to info.
  setEnv(MANAGER_ENV);
  {
    const m = loadManager();
    const seen: string[] = [];
    (globalThis as Record<string, unknown>).__managerServerLogger = {
      info: (msg: string) => seen.push(msg),
      flush: () => Promise.resolve(),
    };
    m.managerLog("not_a_level", "x");
    assert.deepStrictEqual(seen, ["x"], "unknown level is logged at info");
    ok("unknown level falls back to info rather than being dropped");
  }

  // 12. Drop count accessor.
  setEnv(MANAGER_ENV);
  {
    const m = loadManager();
    assert.strictEqual(m.getManagerDroppedCount(), 0, "no drops before the logger exists");
    (globalThis as Record<string, unknown>).__managerServerLogger = { droppedCount: () => 42 };
    assert.strictEqual(m.getManagerDroppedCount(), 42, "drop count is read from the SDK");
    ok("getManagerDroppedCount surfaces the SDK's client-side discards");
  }

  // 13. One logger instance is shared across module instances via globalThis.
  setEnv(MANAGER_ENV);
  {
    const m = loadManager();
    const first = m.startManagerLogger();
    const second = m.getManagerLogger();
    assert.strictEqual(second, first, "getManagerLogger returns the cached instance");
    assert.strictEqual(
      (globalThis as Record<string, unknown>).__managerServerLogger,
      first,
      "the instance is cached on globalThis so every module copy shares one queue"
    );
    ok("globalThis sharing: one queue per process, not one per module instance");
  }

  // 14. The real SDK surface exists when configured.
  setEnv(MANAGER_ENV);
  {
    const m = loadManager();
    const log = m.startManagerLogger();
    for (const level of ["trace", "debug", "info", "warn", "error", "fatal"] as const) {
      assert.strictEqual(typeof log[level], "function", `${level} must exist on the SDK logger`);
    }
    assert.strictEqual(typeof log.child, "function", "child must exist");
    assert.strictEqual(typeof log.flush, "function", "flush must exist");
    assert.strictEqual(typeof log.droppedCount, "function", "droppedCount must exist");
    ok("SDK surface: every level the facade relies on is present on the real logger");
  }

  setEnv({});
  delete (globalThis as Record<string, unknown>).__managerServerLogger;
  return checks;
}
