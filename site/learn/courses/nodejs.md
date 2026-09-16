---
id: nodejs
title: Node.js
icon: 🟢
track: Programming
color: #2E7D32
runner: js
libs: 
tagline: Run JavaScript outside the browser to build document pipelines and CLIs.
description: Node.js for automation engineers: the runtime, npm, modules, the file system, streams, buffers, child processes, building CLI tools, Express APIs, environment configuration, testing, and production deployment practices.
---

# LEVEL: Beginner

## What is Node and installing it

**Node.js** is a program that runs JavaScript outside the browser. It bundles Google's V8 engine (the same one inside Chrome) with **libuv**, a C library that provides the event loop, file system access, networking and child processes. The result is a runtime where the JavaScript you already know can read a folder of `.docx` files, call LibreOffice, and write a report, without any browser at all.

Node was created by Ryan Dahl in 2009. Today it is maintained by the OpenJS Foundation, releases a new major version every six months (even numbers become Long Term Support releases), and powers everything from the `docx` and `pptxgenjs` libraries' own build tools to the servers behind most web apps.

### Browser versus Node

Same language, different host. Neither has everything the other has:

| Feature | Browser | Node.js |
|---|---|---|
| `document`, `window`, DOM | yes | no |
| `fs`, `path`, `child_process` | no | yes |
| `fetch`, `URL`, `TextEncoder`, `setTimeout` | yes | yes (fetch since Node 18) |
| Global object | `window` | `global` (both share `globalThis`) |
| Module loading | `<script>` / ESM | CommonJS `require` and ESM `import` |
| Entry point | an HTML page | `node file.js` |

The Try It blocks in this course run in your browser, so they demonstrate ideas with pure JavaScript; the body text shows the real Node code to run locally.

### Installing

- **Windows / macOS**: download the LTS installer from nodejs.org, or use a version manager: `nvm` (macOS/Linux), `nvm-windows`, `fnm` or `volta`. Version managers let you switch between Node 20 and Node 22 per project.
- **Linux**: `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs`, or use `nvm`.

Verify in a terminal:

```bash
node -v      # v22.x.x
npm -v       # 10.x.x
node -p "process.platform + ' ' + process.arch"   # -p evaluates and prints an expression
```

### Running JavaScript with Node

Three ways, mirroring the browser console, script tag and file:

```bash
node                      # REPL: type JavaScript, see results, Ctrl+D to exit
node -e "console.log(2 ** 10)"   # evaluate a string
node hello.js             # run a file
```

A first script that uses something the browser cannot do, listing the current folder:

```js
// hello.js
const fs = require("fs");
console.log("Node", process.version, "on", process.platform);
console.log("Files here:", fs.readdirSync(".").length);
```

Run `node hello.js`. The `require("fs")` line loads Node's built-in file-system module, and `process` is a global object describing the running program. Since Node 18 you can also write `require("node:fs")`; the `node:` prefix makes it explicit that this is a built-in, not an npm package.

### Watch mode and the inspector

`node --watch hello.js` (Node 18.11+) restarts the script whenever a file changes, replacing the old `nodemon` dependency for simple cases. `node --inspect hello.js` opens a debugging port you can attach Chrome DevTools to via `chrome://inspect`, giving you breakpoints and the profiler for server code.

### Where Node fits in a document pipeline

A typical automation job for a 767-page handbook: a Node script reads a JSON manifest, builds the document with `docx`, writes `handbook.docx` with `fs.writeFile`, then spawns `soffice --headless --convert-to pdf` to produce the PDF, and finally logs page counts and file sizes. Each step maps to a chapter of this course.

> **Tip:** Keep one LTS version per project and record it in a `.nvmrc` file (`22`) or the `engines` field of `package.json` so colleagues and CI use the same runtime.

### Try It Yourself

```js
// Detect the host environment with pure JavaScript (works in a browser or in Node).
const isNode = typeof process !== "undefined" && !!process.versions?.node;
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
console.log("Running in:", isNode ? `Node ${process.versions.node}` : isBrowser ? "a browser" : "an unknown host");
console.log("globalThis is the same object everywhere:", typeof globalThis);
const hostGlobals = ["document", "window", "require", "process", "fetch", "setTimeout", "structuredClone"];
for (const name of hostGlobals) console.log(name.padEnd(16), typeof globalThis[name]);
console.log("V8 numbers behave the same in both hosts:", 0.1 + 0.2, 2 ** 53);
```

### Quiz

1. What does Node.js combine to run JavaScript outside the browser?
- [x] The V8 engine and the libuv library
- [ ] A browser without a window
- [ ] A Java virtual machine
> V8 executes JavaScript; libuv provides the event loop, file and network I/O.

2. Which global exists in Node but not in browsers?
- [ ] document
- [x] process
- [ ] window
> `process` describes the running Node program; the DOM globals do not exist in Node.

3. What does `node -p "1 + 1"` do?
- [ ] Opens the REPL
- [x] Evaluates the expression and prints 2
- [ ] Runs a file named 1 + 1
> `-p` evaluates a string and prints the result; `-e` evaluates without printing.

4. Which Node versions become Long Term Support releases?
- [x] Even-numbered majors
- [ ] Odd-numbered majors
- [ ] Every release
> Even majors (18, 20, 22) get LTS status; odd ones are short-lived.

### Exercises

1. **Version check** — Write a script that prints the Node version and exits with code 1 if the major version is below 20.
<details><summary>Solution</summary>

```js
const major = Number(process.versions.node.split(".")[0]);
console.log("Node", process.version);
if (major < 20) { console.error("Need Node 20+"); process.exit(1); }
```

</details>

2. **List a folder** — Using `fs.readdirSync`, print every file name in the current directory on its own line, numbered.
<details><summary>Solution</summary>

```js
const fs = require("node:fs");
fs.readdirSync(".").forEach((name, i) => console.log(`${i + 1}. ${name}`));
```

</details>

### Interview Questions

**Q: What is Node.js and how does it differ from running JavaScript in a browser?**
Node.js is a JavaScript runtime built on V8 plus libuv, giving JavaScript access to the file system, networking, processes and threads through built-in modules. In the browser the host provides the DOM and Web APIs and sandboxes the code; in Node the host provides system access and no DOM. Both share the language, the event loop concept and, since Node 18, a growing set of common APIs such as `fetch`, `URL`, `TextEncoder` and Web Streams. The practical difference for me is that Node can drive tools like LibreOffice and write files directly, which is what document automation needs.

**Q: Why is Node.js single-threaded, and how does it handle many concurrent operations?**
JavaScript execution happens on one main thread, but I/O is delegated to libuv, which uses the operating system's asynchronous primitives (epoll, kqueue, IOCP) for sockets and a thread pool (default size 4, tunable with `UV_THREADPOOL_SIZE`) for file system and DNS work. When an operation completes, its callback is queued and the event loop runs it on the main thread. So a Node process can have thousands of in-flight requests while using one thread for JavaScript, which is efficient for I/O-heavy work and poor for CPU-heavy work, where worker threads or child processes are needed.

**Q: What are LTS releases and why do they matter for production?**
Every even-numbered Node major enters Active LTS in October of its release year and receives bug and security fixes for 30 months in total, while odd majors are supported for only about eight months. Production systems pin to an LTS line so that updates are low-risk, and tools like `nvm` and the `engines` field in package.json keep everyone on the same version. When choosing libraries I check they support the current LTS, and I plan a migration each year when a line reaches end of life.

## npm and package.json

**npm** is both the registry where JavaScript packages live (over two million of them, including `docx`, `pptxgenjs`, `pdf-lib`, `commander` and `express`) and the command-line tool that installs them. The file that describes your project to npm is `package.json`.

### Creating a project

```bash
mkdir doc-pipeline && cd doc-pipeline
npm init -y          # creates package.json with defaults
```

The generated file:

```json
{
  "name": "doc-pipeline",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": { "test": "echo \"Error: no test specified\" && exit 1" },
  "license": "ISC"
}
```

`name` and `version` identify the package; `main` is the entry file others get when they `require` it; `scripts` are named commands.

### Installing packages

```bash
npm install docx pptxgenjs        # runtime dependencies
npm install --save-dev eslint     # development-only (-D for short)
npm install commander@12          # a specific major version
npm uninstall pptxgenjs
```

Installing does three things: downloads the package into `node_modules/`, adds it to `dependencies` (or `devDependencies`) in `package.json`, and records the exact resolved version tree in `package-lock.json`. Commit `package.json` and the lock file; never commit `node_modules`, which can be regenerated with `npm install` and is often hundreds of megabytes.

| Field | Contains | Installed in production? |
|---|---|---|
| `dependencies` | code your program needs to run (`docx`, `express`) | yes |
| `devDependencies` | tools for developing (`eslint`, `jest`, `nodemon`) | no with `npm install --omit=dev` |
| `peerDependencies` | packages the user must install themselves (plugins) | user's choice |
| `optionalDependencies` | nice-to-have, install failure is not fatal | attempted |

### Semantic versioning

Versions are `MAJOR.MINOR.PATCH`: breaking change, new feature, bug fix. The range symbols in `package.json` say how far updates may drift:

| Range | Allows | Example with `5.2.1` |
|---|---|---|
| `^5.2.1` (default) | same major | `5.2.2`, `5.9.0`, not `6.0.0` |
| `~5.2.1` | same minor | `5.2.9`, not `5.3.0` |
| `5.2.1` | exactly this | nothing else |
| `>=5 <7` | explicit range | `5.x`, `6.x` |
| `*` or `latest` | anything | dangerous |

For `0.x` versions, `^0.2.1` allows only `0.2.x`, because pre-1.0 minors are treated as breaking. `npm outdated` lists packages behind their range; `npm update` moves within ranges; `npm install pkg@latest` crosses a major.

### The lock file and reproducible installs

`package-lock.json` pins every package and sub-package to an exact version and an integrity hash. `npm install` respects it; `npm ci` (clean install) deletes `node_modules`, installs exactly what the lock says, and fails if the lock and `package.json` disagree. Use `npm ci` in CI and Docker builds so the same tree is installed every time.

### Scripts

```json
"scripts": {
  "start": "node src/index.js",
  "build": "node src/build-handbook.js --out dist",
  "convert": "node src/convert.js dist/*.docx",
  "test": "node --test",
  "lint": "eslint src",
  "prebuild": "npm run lint"
}
```

Run with `npm run build`; `npm start` and `npm test` work without `run`. Scripts can call any binary installed in `node_modules/.bin` by bare name, which is why `eslint src` works without a path. A `pre<name>` or `post<name>` script runs automatically before or after `<name>`.

### npx

`npx cowsay hello` runs a package's binary without installing it globally, downloading it temporarily if needed. `npx eslint --init` scaffolds a config; `npx create-vite` bootstraps a project. For binaries already in your project, `npx jest` is equivalent to `npm run` with the `.bin` path.

### Global installs and alternatives

`npm install -g pm2` puts a command on your PATH for tools you use across projects. Alternative package managers, `pnpm` (disk-efficient, strict) and `yarn`, read the same `package.json`; `corepack enable` (bundled with Node) manages their versions.

> **Warning:** Typos in package names are an attack vector (typosquatting). Check the package page, weekly downloads and repository before installing, and run `npm audit` regularly to catch known vulnerabilities in your tree.

### Try It Yourself

```js
// A pure-JS semver range checker, the logic npm applies when resolving ^ and ~ ranges.
const parse = v => v.split(".").map(Number);
function satisfies(version, range) {
  const op = range.match(/^[\^~]?/)[0];
  const [M, m, p] = parse(range.slice(op.length));
  const [vM, vm, vp] = parse(version);
  const notBelow = vM > M || (vM === M && (vm > m || (vm === m && vp >= p)));
  if (!notBelow) return false;
  if (op === "^") return M > 0 ? vM === M : m > 0 ? vM === 0 && vm === m : version === range.slice(1);
  if (op === "~") return vM === M && vm === m;
  return version === range;
}
const tests = [["5.9.0", "^5.2.1"], ["6.0.0", "^5.2.1"], ["5.2.9", "~5.2.1"], ["5.3.0", "~5.2.1"], ["0.2.7", "^0.2.1"], ["0.3.0", "^0.2.1"], ["5.2.1", "5.2.1"]];
for (const [v, r] of tests) console.log(`${v} satisfies ${r}?`.padEnd(30), satisfies(v, r));

const pkg = { name: "doc-pipeline", version: "1.4.2", dependencies: { docx: "^9.0.0", commander: "~12.1.0" }, devDependencies: { eslint: "^9.0.0" } };
const bump = (v, part) => { const [M, m, p] = parse(v); return part === "major" ? `${M + 1}.0.0` : part === "minor" ? `${M}.${m + 1}.0` : `${M}.${m}.${p + 1}`; };
console.log("Next patch:", bump(pkg.version, "patch"), "| next minor:", bump(pkg.version, "minor"), "| next major:", bump(pkg.version, "major"));
console.log("Production installs:", Object.keys(pkg.dependencies).join(", "), "| dev only:", Object.keys(pkg.devDependencies).join(", "));
```

### Quiz

1. What does `^4.2.0` allow?
- [x] Any 4.x.y version at or above 4.2.0
- [ ] Only 4.2.x
- [ ] Any version including 5.0.0
> The caret keeps the major version fixed.

2. Which file should you commit to git?
- [ ] node_modules
- [x] package-lock.json
- [ ] Neither
> The lock file makes installs reproducible; `node_modules` is regenerated.

3. Which command installs exactly what the lock file specifies and fails on mismatch?
- [ ] npm install
- [x] npm ci
- [ ] npm update
> `npm ci` is designed for CI and containers.

4. Where do development-only tools like ESLint belong?
- [ ] dependencies
- [x] devDependencies
- [ ] peerDependencies
> They are not needed at runtime, so production installs can omit them.

### Exercises

1. **Add scripts** — Write the `scripts` block for a project with `start` (runs `src/index.js`), `test` (runs `node --test`) and a `pretest` that runs ESLint.
<details><summary>Solution</summary>

```json
"scripts": {
  "start": "node src/index.js",
  "pretest": "eslint src",
  "test": "node --test"
}
```

</details>

2. **Range reasoning** — Given `"docx": "^8.5.0"`, list which of 8.5.1, 8.9.0, 9.0.0 would be installed by `npm update`.
<details><summary>Solution</summary>

```text
8.5.1  yes (patch within ^8)
8.9.0  yes (minor within ^8)
9.0.0  no  (new major; requires npm install docx@9)
```

</details>

3. **Version bump** — Show the npm commands that bump a package from 1.4.2 to 1.5.0 and tag the commit.
<details><summary>Solution</summary>

```bash
npm version minor      # updates package.json to 1.5.0, commits, creates tag v1.5.0
git push --follow-tags
```

</details>

### Interview Questions

**Q: What is the difference between dependencies and devDependencies?**
`dependencies` are packages the program needs at runtime, such as `express` or `docx`, and they are installed everywhere including production. `devDependencies` are tools used only while developing, such as test runners, linters and bundlers, and `npm install --omit=dev` (or `NODE_ENV=production`) skips them, which keeps Docker images and deploy times small. Getting this wrong in either direction causes real bugs: a runtime package in devDependencies crashes production, and a giant toolchain in dependencies bloats every install. For libraries, `peerDependencies` express "the host app must provide this", which prevents duplicate copies of frameworks.

**Q: Why does package-lock.json exist and what is the difference between npm install and npm ci?**
Ranges in `package.json` allow drift, so two installs a week apart can produce different trees, and transitive dependencies are not listed at all. The lock file records the exact version and integrity hash of every package in the tree, making installs reproducible. `npm install` reads the lock but will update it if `package.json` changed, whereas `npm ci` requires the lock to match, deletes `node_modules`, installs exactly the locked tree, and is faster because it skips resolution. I use `npm install` on my machine and `npm ci` in CI pipelines and Dockerfiles.

**Q: Explain semantic versioning and how the caret and tilde ranges work.**
SemVer is `MAJOR.MINOR.PATCH`: bump major for breaking changes, minor for backward-compatible features, patch for fixes. `^1.2.3` accepts anything below `2.0.0`, trusting that minors and patches are safe; `~1.2.3` accepts only patches below `1.3.0`. Below 1.0.0 the rules tighten so `^0.2.3` stays within `0.2.x`, since pre-release APIs change often. The trade-off is that caret ranges pick up fixes automatically but rely on maintainers honoring SemVer, which is why the lock file and tests exist; for critical build tooling I sometimes pin exact versions.

## CommonJS versus ESM modules

Node has two module systems. **CommonJS** (CJS) is the original: `require()` and `module.exports`. **ECMAScript modules** (ESM) are the standard `import`/`export` syntax that browsers also use. Every Node project must choose, and you will read both in the wild, so you need to be fluent in each and know how they interoperate.

### CommonJS

```js
// rates.js
const DEFAULT_RATE = 5.75;
function premium(amount, rate = DEFAULT_RATE) { return (amount / 1000) * rate; }
module.exports = { DEFAULT_RATE, premium };

// app.js
const { premium } = require("./rates");        // extension optional for CJS
const fs = require("node:fs");
const docx = require("docx");                   // from node_modules
console.log(premium(250000));
```

`require` is synchronous: it reads the file, wraps it in a function `(exports, require, module, __filename, __dirname) => { ... }`, runs it, caches the result in `require.cache`, and returns `module.exports`. Because of the wrapper, every CJS file gets `__dirname` and `__filename` for free, and top-level variables stay private to the file.

`exports` is a shorthand alias for `module.exports`; `exports.premium = fn` works, but `exports = { ... }` breaks the link and exports nothing. Assign to `module.exports` when replacing the whole object.

### ES modules

```js
// rates.mjs
export const DEFAULT_RATE = 5.75;
export function premium(amount, rate = DEFAULT_RATE) { return (amount / 1000) * rate; }
export default class RateTable {}

// app.mjs
import RateTable, { premium } from "./rates.mjs";   // extension required
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import { Document, Packer } from "docx";
const config = JSON.parse(await readFile("./config.json", "utf8"));   // top-level await
```

Node treats a file as ESM when it ends in `.mjs`, or when it ends in `.js` and the nearest `package.json` has `"type": "module"`. `.cjs` forces CommonJS. Imports are resolved and linked before any code runs, so `import` must sit at the top level, relative paths need the extension, and there is no `__dirname`:

```js
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Node 20.11+: import.meta.dirname and import.meta.filename exist directly
```

### Side-by-side

| | CommonJS | ESM |
|---|---|---|
| Syntax | `require`, `module.exports` | `import`, `export` |
| Loading | synchronous, at call time | asynchronous, resolved before execution |
| Exports | a copied value (snapshot of the object) | live bindings |
| Top-level `await` | no | yes |
| `__dirname` | yes | `import.meta.dirname` (20.11+) |
| Strict mode | opt in | always |
| JSON import | `require("./x.json")` | `import x from "./x.json" with { type: "json" }` |
| Dynamic load | `require(variable)` | `await import(variable)` |
| Tree-shaking by bundlers | no | yes |

### Interoperability

- ESM can `import` a CommonJS module; the whole `module.exports` becomes the default import, and named imports work only for statically detectable properties.
- CommonJS can load ESM with `await import("./x.mjs")`. Since Node 22.12 (and 20.17 with a flag), `require()` of an ESM file also works when the module has no top-level `await`.
- Packages declare both entry points with the `exports` field: `{ "exports": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } }`, which is how `docx` ships a build for each system.

### Which to choose

New projects: ESM (`"type": "module"`). It is the standard, works in browsers unchanged, supports top-level `await`, and every major library now ships ESM. Choose CommonJS only when a critical dependency or tool (some older Jest setups, certain serverless platforms) requires it. Do not mix styles within a file: `require` is undefined in ESM, and `import` is a syntax error in CJS.

### The module cache

Both systems evaluate a module once and cache it. Importing `./config.js` from ten files runs it once, which makes modules a natural place for singletons such as a database connection or a loaded rate matrix. To reload a CJS module deliberately, delete its entry from `require.cache`; ESM has no supported way, so restart the process (`node --watch`).

> **Interview note:** "Why do imports need to be at the top level?" Because ESM resolution happens before execution so the engine can build the dependency graph, detect cycles and enable static analysis; conditional loading uses dynamic `import()` instead.

### Try It Yourself

```js
// A miniature CommonJS loader in pure JavaScript: shows the wrapper, module.exports and the cache.
const files = {
  "/app/rates.js": `const DEFAULT_RATE = 5.75;
    let loads = (globalThis.__loads = (globalThis.__loads || 0) + 1);
    exports.DEFAULT_RATE = DEFAULT_RATE;
    exports.premium = (amount, rate = DEFAULT_RATE) => (amount / 1000) * rate;
    exports.loadedTimes = loads;`,
  "/app/report.js": `const { premium } = require("/app/rates.js");
    module.exports = amount => "Premium: " + premium(amount).toFixed(2) + " (dir " + __dirname + ")";`,
};
const cache = {};
function requireFrom(path) {
  if (cache[path]) return cache[path].exports;
  const module = { exports: {} };
  cache[path] = module;
  const wrapper = new Function("exports", "require", "module", "__filename", "__dirname", files[path]);
  wrapper(module.exports, requireFrom, module, path, path.slice(0, path.lastIndexOf("/")));
  return module.exports;
}
const report = requireFrom("/app/report.js");
console.log(report(250000));
const rates = requireFrom("/app/rates.js");
console.log("Cached (same object)?", rates === cache["/app/rates.js"].exports, "| evaluated", rates.loadedTimes, "time(s)");
console.log("Exported keys:", Object.keys(rates));
console.log("ESM equivalent would be: import { premium } from './rates.js' with live bindings and no __dirname.");
```

### Quiz

1. Which setting makes `.js` files load as ES modules?
- [ ] `"module": true` in package.json
- [x] `"type": "module"` in package.json
- [ ] A `use esm` directive
> The `type` field (or the `.mjs` extension) selects ESM.

2. What is wrong with `exports = { a: 1 }` in CommonJS?
- [x] It reassigns the local alias and exports nothing
- [ ] It is a syntax error
- [ ] It exports `a` twice
> `exports` is only a reference to `module.exports`; replace the whole object via `module.exports`.

3. How does ESM get the current directory?
- [ ] `__dirname` works the same
- [x] From `import.meta.url` (or `import.meta.dirname` in Node 20.11+)
- [ ] `process.dirname()`
> ESM has no wrapper function, so the URL of the module is the source of truth.

4. Which feature does ESM support that CommonJS does not?
- [ ] Synchronous loading
- [x] Top-level await
- [ ] The `require.cache` object
> ESM loading is asynchronous, which makes top-level `await` possible.

### Exercises

1. **Convert** — Rewrite this CommonJS file as ESM: `const path = require("path"); module.exports = { ext: f => path.extname(f) };`
<details><summary>Solution</summary>

```js
import path from "node:path";
export const ext = f => path.extname(f);
```

</details>

2. **Dirname in ESM** — Write the two lines that recreate `__dirname` in an ES module on Node 18.
<details><summary>Solution</summary>

```js
import { fileURLToPath } from "node:url";
const __dirname = new URL(".", import.meta.url).pathname;   // or dirname(fileURLToPath(import.meta.url))
```

</details>

3. **Conditional load** — Load `./heavy-pdf.js` only when a `--pdf` flag is present, in ESM.
<details><summary>Solution</summary>

```js
if (process.argv.includes("--pdf")) {
  const { toPdf } = await import("./heavy-pdf.js");
  await toPdf("handbook.docx");
}
```

</details>

### Interview Questions

**Q: How does require() work under the hood?**
`require` resolves the specifier (core module, relative path with extension guessing `.js`, `.json`, `.node`, or a `node_modules` walk up the directory tree), checks `require.cache`, and if the module is not cached reads the file and wraps its source in a function with parameters `exports`, `require`, `module`, `__filename` and `__dirname`. It executes that function synchronously, stores the module object in the cache keyed by absolute path, and returns `module.exports`. Because it is synchronous and cached, the first `require` of a large library is slow and subsequent ones are instant, and circular requires return a partially filled `exports` object, which is a classic bug source.

**Q: What are live bindings and why do they matter?**
In ESM, an import is a read-only view of the exporting module's variable, so if the exporter reassigns `export let count`, importers see the new value. CommonJS copies the value of `module.exports` at require time, so destructured primitives never update. This matters for things like a mutable configuration or a counter shared between modules, and it explains why mocking works differently: Jest can replace CJS exports in the cache, but ESM bindings need loader hooks or dependency injection. It is also what enables bundlers to tree-shake, since the graph is static.

**Q: What problems come up when mixing ESM and CommonJS, and how do you handle them?**
Named imports from a CJS package may fail because Node can only detect statically assigned properties, so you import the default and destructure. `__dirname`, `__filename` and `require` do not exist in ESM, so you derive paths from `import.meta.url` or use `createRequire`. JSON imports need an import attribute. Tools such as older Jest, ts-node or some serverless runtimes assume CJS, which forces configuration. When publishing a library I ship both formats through the `exports` map with `import` and `require` conditions, and I test each entry point, because the "dual package hazard" of two copies of the same module can break `instanceof` checks.

## The fs and path modules

Document automation is file work: read a manifest, write a `.docx`, move PDFs into dated folders. Node's built-in `fs` module does the reading and writing, and `path` builds file paths that work on Windows (`C:\Jobs\deed.pdf`) and Linux (`/jobs/deed.pdf`) alike.

### Three flavours of fs

```js
const fs = require("node:fs");                 // callback and sync APIs
const fsp = require("node:fs/promises");       // promise API (preferred)

// 1. Synchronous: blocks the process; fine for scripts and startup
const text = fs.readFileSync("manifest.json", "utf8");

// 2. Callback: error-first style, the original API
fs.readFile("manifest.json", "utf8", (err, data) => { if (err) throw err; console.log(data.length); });

// 3. Promises: use with async/await
const data = await fsp.readFile("manifest.json", "utf8");
```

Pass an encoding (`"utf8"`) to get a string; omit it to get a `Buffer` of raw bytes, which is what you want for `.docx` and `.pdf`. In a CLI script `readFileSync` is acceptable; in a server, never block the event loop with sync calls.

### Writing, appending and creating folders

```js
await fsp.writeFile("out/report.txt", "Week 37\n");             // creates or overwrites
await fsp.appendFile("out/report.txt", "412 files processed\n");
await fsp.mkdir("out/2026/09", { recursive: true });            // like mkdir -p, no error if exists
await fsp.writeFile("out/handbook.docx", await Packer.toBuffer(doc));   // Buffer from docx
await fsp.copyFile("out/handbook.docx", "archive/handbook-v3.docx");
await fsp.rename("out/tmp.pdf", "out/final.pdf");               // also moves across folders
await fsp.rm("out/tmp", { recursive: true, force: true });      // rm -rf
```

`writeFile` fails if the parent folder is missing, so `mkdir` first. Writes are not atomic: for a file others may read while you write, write to `final.pdf.tmp` and `rename` it over the target.

### Listing and inspecting

```js
const entries = await fsp.readdir("jobs", { withFileTypes: true });
for (const e of entries) {
  if (e.isFile() && e.name.endsWith(".docx")) console.log("document:", e.name);
  if (e.isDirectory()) console.log("folder:", e.name);
}
const st = await fsp.stat("jobs/deed.pdf");
console.log(st.size, "bytes, modified", st.mtime.toISOString(), st.isFile());
try { await fsp.access("jobs/missing.pdf"); } catch { console.log("does not exist"); }
```

`readdir` with `{ recursive: true }` (Node 20+) walks subfolders. Prefer trying the operation and catching `ENOENT` over checking existence first; the file can vanish between the check and the use.

### Error codes

| `err.code` | Meaning |
|---|---|
| `ENOENT` | no such file or directory |
| `EEXIST` | already exists (mkdir without recursive) |
| `EACCES` / `EPERM` | permission denied |
| `EISDIR` / `ENOTDIR` | expected a file / expected a directory |
| `EBUSY` | file locked (Word has it open) |
| `EMFILE` | too many open files (raise the limit or throttle) |

Always branch on `err.code`, not on the message text, which varies by platform.

### The path module

Never build paths with string concatenation. `path` knows the platform separator and normalizes `..` segments:

```js
const path = require("node:path");
path.join("jobs", "2026", "..", "deed.pdf");      // "jobs/deed.pdf" (or jobs\deed.pdf on Windows)
path.resolve("out", "report.pdf");                // absolute, from the current working directory
path.basename("/jobs/TX-2026-00123.docx");        // "TX-2026-00123.docx"
path.basename("/jobs/TX-2026-00123.docx", ".docx"); // "TX-2026-00123"
path.extname("deed.final.PDF");                   // ".PDF"
path.dirname("/jobs/a/b.pdf");                    // "/jobs/a"
path.parse("/jobs/deed.pdf");                     // { root: "/", dir: "/jobs", base: "deed.pdf", ext: ".pdf", name: "deed" }
path.format({ dir: "/out", name: "deed", ext: ".pdf" });   // "/out/deed.pdf"
path.relative("/jobs", "/jobs/2026/deed.pdf");    // "2026/deed.pdf"
path.sep; path.delimiter;                          // "/" or "\\"; ":" or ";" (PATH separator)
```

`path.posix` and `path.win32` force one platform's rules, useful when generating paths for a config file that another OS will read. To change an extension: `path.format({ ...path.parse(f), base: undefined, ext: ".pdf" })`.

### Putting it together

```js
import fsp from "node:fs/promises";
import path from "node:path";
const src = "jobs", out = "out/pdf";
await fsp.mkdir(out, { recursive: true });
for (const e of await fsp.readdir(src, { withFileTypes: true })) {
  if (!e.isFile() || path.extname(e.name).toLowerCase() !== ".docx") continue;
  const target = path.join(out, path.basename(e.name, ".docx") + ".pdf");
  console.log(`${path.join(src, e.name)} -> ${target}`);
}
```

> **Warning:** `path.join(base, userInput)` does not stop `../../etc/passwd`. When a path comes from outside, resolve it and verify it still starts with the allowed folder; the security chapter covers this.

### Try It Yourself

```js
// Pure-JS versions of the path helpers, to see exactly what they compute.
const posix = {
  normalize(p) { const out = []; for (const seg of p.split("/")) { if (!seg || seg === ".") continue; if (seg === "..") out.pop(); else out.push(seg); } return (p.startsWith("/") ? "/" : "") + out.join("/"); },
  join(...parts) { return this.normalize(parts.join("/")); },
  basename(p, ext) { const b = p.slice(p.lastIndexOf("/") + 1); return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b; },
  extname(p) { const b = this.basename(p); const i = b.lastIndexOf("."); return i > 0 ? b.slice(i) : ""; },
  dirname(p) { const i = p.lastIndexOf("/"); return i <= 0 ? (i === 0 ? "/" : ".") : p.slice(0, i); },
  parse(p) { const base = this.basename(p), ext = this.extname(p); return { dir: this.dirname(p), base, ext, name: ext ? base.slice(0, -ext.length) : base }; },
};
console.log(posix.join("jobs", "2026", "..", "deed.pdf"));
console.log(posix.basename("/jobs/TX-2026-00123.docx", ".docx"), "|", posix.extname("deed.final.PDF"), "|", posix.extname(".gitignore"));
console.log(posix.parse("/jobs/2026/handbook.v3.docx"));
const files = ["deed.docx", "survey.DOCX", "notes.txt", "policy.docx", "README"];
const plan = files.filter(f => posix.extname(f).toLowerCase() === ".docx").map(f => `${posix.join("jobs", f)} -> ${posix.join("out/pdf", posix.parse(f).name + ".pdf")}`);
console.log(plan.join("\n"));
const errs = { ENOENT: "no such file", EACCES: "permission denied", EBUSY: "file is locked (close it in Word)" };
for (const code of ["ENOENT", "EBUSY", "EIO"]) console.log(code, "->", errs[code] ?? "unexpected error, rethrow");
```

### Quiz

1. What does `fs.readFileSync("x.docx")` return without an encoding argument?
- [ ] A string
- [x] A Buffer of raw bytes
- [ ] An array of lines
> Only when you pass an encoding does Node decode the bytes into a string.

2. Which option makes `mkdir` create parent folders and ignore an existing folder?
- [x] `{ recursive: true }`
- [ ] `{ force: true }`
- [ ] `{ parents: true }`
> `recursive: true` behaves like `mkdir -p`.

3. What does `path.basename("/jobs/deed.pdf", ".pdf")` return?
- [ ] "/jobs/deed"
- [x] "deed"
- [ ] "deed.pdf"
> The second argument strips a matching extension.

4. Which error code means the file does not exist?
- [ ] EACCES
- [x] ENOENT
- [ ] EEXIST
> ENOENT is "Error NO ENTry"; branch on `err.code` rather than the message.

### Exercises

1. **Change extension** — Write `withExt(file, ext)` using `path.parse` and `path.format` so `withExt("a/b.docx", ".pdf")` gives `a/b.pdf`.
<details><summary>Solution</summary>

```js
const path = require("node:path");
const withExt = (f, ext) => path.format({ ...path.parse(f), base: undefined, ext });
console.log(withExt("a/b.docx", ".pdf")); // a/b.pdf
```

</details>

2. **Safe read** — Write `readJson(file)` that returns the parsed object, or `null` if the file is missing, but rethrows any other error.
<details><summary>Solution</summary>

```js
const fsp = require("node:fs/promises");
async function readJson(file) {
  try { return JSON.parse(await fsp.readFile(file, "utf8")); }
  catch (e) { if (e.code === "ENOENT") return null; throw e; }
}
```

</details>

3. **Folder size** — Sum the sizes of all files directly inside a folder using `readdir` and `stat`.
<details><summary>Solution</summary>

```js
const fsp = require("node:fs/promises"), path = require("node:path");
async function folderSize(dir) {
  let total = 0;
  for (const e of await fsp.readdir(dir, { withFileTypes: true }))
    if (e.isFile()) total += (await fsp.stat(path.join(dir, e.name))).size;
  return total;
}
folderSize(".").then(n => console.log(n, "bytes"));
```

</details>

### Interview Questions

**Q: When is it acceptable to use the synchronous fs methods?**
In short-lived scripts and CLI tools, and during application startup before the server accepts traffic, where blocking for a few milliseconds costs nothing and the code is simpler. In a server or any long-running process, sync calls stall the event loop for every concurrent request while the disk responds, which under load turns a 5 ms read into seconds of latency for everyone. My rule is: `readFileSync` for config at boot, `fs/promises` everywhere else, and streams for anything bigger than a few megabytes.

**Q: Why should you avoid checking whether a file exists before opening it?**
Because of the time-of-check to time-of-use race: the file can be created, deleted or replaced between `existsSync` and the actual `open`, and an attacker can exploit that window to swap a symlink. It also doubles the system calls. The idiomatic approach is to attempt the operation and handle `ENOENT` (or `EEXIST` for creation with the `wx` flag), which is atomic from the program's point of view. `fs.access` exists mainly for permission diagnostics, not as a guard.

**Q: How do you make a file write safe against crashes or concurrent readers?**
Write to a temporary file in the same directory, flush it, then `rename` it over the destination; on POSIX systems `rename` is atomic, so readers see either the old or the new complete file, never a half-written one. For durability call `fileHandle.sync()` before the rename so the data is on disk, not just in the OS cache. If several processes might write, add a lock file created with the exclusive `wx` flag or use a queue so only one writer exists. This pattern is standard in tools that regenerate a report every hour while a dashboard keeps reading it.

## Command-line arguments and process

Every Node script has a global `process` object: the bridge between your code and the operating system. It gives you the command-line arguments, environment variables, standard input and output, the exit code and the signals that tell your program to stop. A script that reads its inputs from `process.argv` instead of hard-coded values becomes a reusable tool.

### process.argv

```bash
node convert.js jobs/deed.docx --format pdf --verbose
```

```js
console.log(process.argv);
// [ "/usr/bin/node", "/home/ali/convert.js", "jobs/deed.docx", "--format", "pdf", "--verbose" ]
const args = process.argv.slice(2);   // drop the node binary and the script path
```

Everything is a string. `"--verbose"` is a flag; `"--format pdf"` is an option with a value; `"jobs/deed.docx"` is a positional argument. Parsing these by hand is tedious, so Node 18.3 added `util.parseArgs`:

```js
import { parseArgs } from "node:util";
const { values, positionals } = parseArgs({
  options: {
    format:  { type: "string", short: "f", default: "pdf" },
    verbose: { type: "boolean", short: "v", default: false },
    out:     { type: "string" },
  },
  allowPositionals: true,
});
console.log(values.format, values.verbose, positionals);   // "pdf" true ["jobs/deed.docx"]
```

Unknown options throw, so typos are caught early. For sub-commands, help text and validation, the CLI chapter introduces `commander`.

### Environment variables

```js
const port = Number(process.env.PORT ?? 3000);
const soffice = process.env.SOFFICE_PATH || "soffice";
if (process.env.NODE_ENV === "production") console.log("prod mode");
```

`process.env` is a plain object of strings, read once at startup. Set variables per run (`PORT=8080 node server.js` on Unix, `set PORT=8080 && node server.js` in cmd, `$env:PORT=8080; node server.js` in PowerShell) or load them from a `.env` file with `node --env-file=.env server.js` (Node 20.6+). The config chapter goes deeper.

### Standard streams

`process.stdout` and `process.stderr` are writable streams; `console.log` writes to stdout and `console.error` to stderr. Keep them separate so `node report.js > report.csv` captures only data while errors still show on screen:

```js
process.stdout.write("file,pages\n");           // no newline added, unlike console.log
console.error("warning: 2 files skipped");      // goes to stderr
```

`process.stdin` lets a script accept piped input (`cat files.txt | node count.js`):

```js
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => (input += chunk));
process.stdin.on("end", () => console.log(input.split("\n").filter(Boolean).length, "lines"));
```

For interactive prompts use `node:readline/promises`: `const rl = createInterface({ input, output }); const name = await rl.question("Client? ");`.

### Exit codes

A process ends with a number: 0 means success, anything else means failure. Shell scripts, CI pipelines and pm2 read it.

```js
if (!positionals.length) {
  console.error("usage: convert <file> [--format pdf]");
  process.exit(2);                 // conventional: 2 = misuse, 1 = general error
}
process.exitCode = 1;              // preferred: set the code, let pending output flush, exit naturally
```

`process.exit()` kills the process immediately, which can truncate a file still being written to stdout. Prefer `process.exitCode` unless you must stop right now.

### Signals and lifecycle events

```js
process.on("SIGINT", () => { console.log("\nCtrl+C: cleaning up"); process.exit(130); });
process.on("SIGTERM", () => shutdown());          // sent by pm2, Docker, kill
process.on("exit", code => console.log("exiting with", code));   // sync only, no async work here
process.on("uncaughtException", err => { console.error(err); process.exit(1); });
process.on("unhandledRejection", err => { throw err; });
```

`SIGTERM` handling is what makes graceful shutdown possible: stop accepting work, finish the current conversion, then exit.

### Other useful members

| Member | Gives |
|---|---|
| `process.cwd()` | current working directory (where the user ran the command) |
| `process.chdir(dir)` | change it |
| `process.platform`, `process.arch` | `"win32"`, `"linux"`, `"darwin"`; `"x64"`, `"arm64"` |
| `process.pid`, `process.ppid` | process IDs |
| `process.memoryUsage()` | `rss`, `heapUsed` in bytes |
| `process.hrtime.bigint()` | nanosecond timer for benchmarks |
| `process.nextTick(fn)` | run before any other queued work |
| `process.title` | name shown in `ps` / Task Manager |

> **Tip:** `process.cwd()` is where the user typed the command; `__dirname` (or `import.meta.dirname`) is where your script lives. Resolve user-supplied paths against `cwd` and bundled assets (templates, fonts) against the script directory.

### Try It Yourself

```js
// A pure-JS argv parser modelled on util.parseArgs: flags, options with values, short aliases, positionals.
function parseArgs(argv, options) {
  const values = {}, positionals = [];
  for (const [name, o] of Object.entries(options)) if ("default" in o) values[name] = o.default;
  const byShort = Object.fromEntries(Object.entries(options).filter(([, o]) => o.short).map(([n, o]) => [o.short, n]));
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") { positionals.push(...argv.slice(i + 1)); break; }
    if (!a.startsWith("-")) { positionals.push(a); continue; }
    let [key, inline] = a.replace(/^--?/, "").split("=");
    const name = a.startsWith("--") ? key : byShort[key];
    const opt = options[name];
    if (!opt) throw new Error(`Unknown option '${a}'`);
    if (opt.type === "boolean") values[name] = true;
    else values[name] = inline ?? argv[++i] ?? (() => { throw new Error(`Option '--${name}' requires a value`); })();
  }
  return { values, positionals };
}
const options = { format: { type: "string", short: "f", default: "pdf" }, verbose: { type: "boolean", short: "v", default: false }, out: { type: "string", short: "o" } };
const cases = [
  ["jobs/deed.docx", "--format", "pdf", "--verbose"],
  ["-v", "-o=out/2026", "jobs/a.docx", "jobs/b.docx"],
  ["--", "--not-an-option.docx"],
  ["--fromat", "pdf"],
  ["--out"],
];
for (const argv of cases) {
  try { const r = parseArgs(argv, options); console.log(JSON.stringify(argv).padEnd(52), "->", JSON.stringify(r)); }
  catch (e) { console.log(JSON.stringify(argv).padEnd(52), "-> error:", e.message, "(exit code 2)"); }
}
```

### Quiz

1. What are the first two elements of `process.argv`?
- [x] The Node executable path and the script path
- [ ] The script name and the first argument
- [ ] The current directory and the user name
> Real arguments start at index 2, hence `process.argv.slice(2)`.

2. What type are values in `process.env`?
- [ ] Whatever type was set
- [x] Always strings (or undefined)
- [ ] Numbers for numeric values
> Environment variables are text; convert with `Number()` or compare to `"true"`.

3. Which exit code signals success?
- [x] 0
- [ ] 1
- [ ] -1
> Zero means success; non-zero codes are read as failure by shells and CI.

4. Why prefer `process.exitCode = 1` over `process.exit(1)`?
- [ ] It is faster
- [x] It lets pending output and async work finish before exiting
- [ ] It works in browsers
> `process.exit` terminates immediately and can cut off buffered stdout writes.

### Exercises

1. **Usage message** — Print a usage line to stderr and exit with code 2 when no positional argument is given.
<details><summary>Solution</summary>

```js
const files = process.argv.slice(2).filter(a => !a.startsWith("-"));
if (files.length === 0) { console.error("usage: node convert.js <file...> [--format pdf]"); process.exitCode = 2; }
```

</details>

2. **Line counter** — Write a script that counts non-empty lines from stdin so that `type list.txt | node count.js` works on Windows.
<details><summary>Solution</summary>

```js
let buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", c => (buf += c));
process.stdin.on("end", () => console.log(buf.split(/\r?\n/).filter(l => l.trim()).length));
```

</details>

3. **Graceful Ctrl+C** — Handle SIGINT so a running batch prints "stopping after current file" and exits with 130 once a flag is set.
<details><summary>Solution</summary>

```js
let stopping = false;
process.on("SIGINT", () => { stopping = true; console.error("stopping after current file"); });
async function run(files) {
  for (const f of files) { if (stopping) { process.exitCode = 130; return; } await convert(f); }
}
```

</details>

### Interview Questions

**Q: How do you write a Node script that behaves well inside shell pipelines?**
Read input from `process.stdin` when no file argument is given, write data to stdout and diagnostics to stderr so redirection captures only data, and set a non-zero `process.exitCode` on failure so `&&` chains and CI stop. Avoid `process.exit()` right after writing large output because stdout to a pipe is asynchronous and can be truncated. Handle `SIGPIPE`/`EPIPE` gracefully when the consumer closes early (`node report.js | head`), and respect `NO_COLOR` or detect `process.stdout.isTTY` before printing colours or progress bars.

**Q: What is the difference between process.nextTick and setImmediate?**
`process.nextTick` callbacks run right after the current operation completes, before the event loop continues and before promise microtasks, which makes them the highest-priority deferral and a way to starve the loop if abused. `setImmediate` runs in the check phase of the next loop iteration, after I/O callbacks, and is the correct way to yield "after I/O". A common interview twist is that `setTimeout(fn, 0)` versus `setImmediate(fn)` order is non-deterministic from the main module but always timeout-first-then-immediate... actually `setImmediate` always runs first when both are scheduled inside an I/O callback, because the check phase follows the poll phase directly.

**Q: How should a long-running Node process handle SIGTERM?**
Register a `SIGTERM` handler that flips a shutting-down flag, stops accepting new work (call `server.close()` or stop pulling from the queue), waits for in-flight operations to finish with a timeout, closes database and file handles, and then exits with 0. Without a handler Node exits immediately on SIGTERM, which is what pm2, Docker and Kubernetes send before killing the process, so half-written PDFs and dropped requests are the symptom. I also log the shutdown steps, because "why did the container restart" is usually answered by those logs.

# LEVEL: Intermediate

## Async patterns in Node

Node's entire design rests on non-blocking I/O: start an operation, do other work, handle the result when it arrives. Over the years the way that "later" is expressed has evolved through three styles, all of which you will meet in real code and documentation.

### Style 1: error-first callbacks

The original Node convention: the last argument is a function whose first parameter is an error (or `null`), followed by the result.

```js
const fs = require("node:fs");
fs.readFile("manifest.json", "utf8", (err, text) => {
  if (err) return console.error("read failed:", err.code);
  fs.writeFile("copy.json", text, err => {
    if (err) return console.error("write failed:", err.code);
    console.log("done");
  });
});
```

Every step nests one level deeper and every step repeats the error check. Forgetting `return` after handling an error is a classic bug: execution continues with `text` undefined.

### Style 2: promises and util.promisify

`util.promisify` converts any error-first-callback function into one that returns a promise, and most core modules already ship promise versions (`fs/promises`, `stream/promises`, `timers/promises`, `dns/promises`, `readline/promises`).

```js
const { promisify } = require("node:util");
const { exec } = require("node:child_process");
const execAsync = promisify(exec);
const { stdout } = await execAsync("soffice --version");

const { setTimeout: sleep } = require("node:timers/promises");
await sleep(500);                      // promise-based delay, no callback
```

`promisify` follows the error-first convention exactly; functions with different signatures (like `fs.exists`, which has no error argument) need a custom wrapper or a `util.promisify.custom` symbol. `util.callbackify` goes the other direction for legacy APIs that demand a callback.

### Style 3: async/await

```js
import { readFile, writeFile } from "node:fs/promises";
async function copyManifest() {
  try {
    const text = await readFile("manifest.json", "utf8");
    await writeFile("copy.json", text);
    console.log("done");
  } catch (err) {
    console.error("copy failed:", err.code ?? err.message);
    throw err;                          // let the caller decide
  }
}
```

This is the style to write today. ESM files support top-level `await`, so scripts no longer need a `main().catch(...)` wrapper, though it remains the pattern in CommonJS.

### Sequential versus parallel

```js
// Sequential: one file at a time (safe for a single LibreOffice instance)
for (const f of files) await convert(f);

// Parallel: all at once (fine for small I/O, dangerous for 500 conversions)
await Promise.all(files.map(convert));

// Bounded concurrency: at most N at a time
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) { const i = next++; results[i] = await fn(items[i], i); }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
await mapLimit(files, 4, convert);
```

Bounded concurrency is the pattern for batch document work: enough parallelism to use the CPU, not so much that you exhaust file descriptors or memory. The `p-limit` and `p-map` packages implement it with more features.

### The Node event loop phases

Node's loop (from libuv) runs phases in order: **timers** (`setTimeout`, `setInterval`), **pending callbacks**, **poll** (I/O callbacks, waits here when idle), **check** (`setImmediate`), **close callbacks**. Between every phase, and after every callback, Node drains `process.nextTick` callbacks and then promise microtasks.

```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
console.log("sync");
// sync, nextTick, promise, then timeout/immediate (order of these two varies from the main module)
```

Inside an I/O callback, `setImmediate` always fires before a `setTimeout(0)` because the check phase follows poll directly.

### Errors in async code

- Callback style: check `err` in every callback; errors thrown inside a callback cannot be caught by the caller's `try`.
- Promises: attach `.catch` or `await` inside `try`; an unhandled rejection crashes Node 15+ by default (`--unhandled-rejections=strict` is now the default behaviour).
- Async iteration over streams and `events.once` bring event-based APIs into `await` land: `for await (const line of rl)`.

### AbortController for cancellation

```js
const ac = new AbortController();
setTimeout(() => ac.abort(), 5000);
try {
  const text = await readFile("huge.csv", { encoding: "utf8", signal: ac.signal });
} catch (e) {
  if (e.name === "AbortError") console.log("cancelled");
}
```

Most core async APIs accept `signal`, including `fetch`, `fs/promises`, `timers/promises` and `child_process`.

> **Interview note:** Be able to write `mapLimit` (or `promisePool`) from memory on a whiteboard. It combines closures, `Promise.all`, a shared index and `async` workers, and it is the single most common Node coding exercise.

### Try It Yourself

```js
// promisify and a bounded-concurrency mapper, both in pure JavaScript.
function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => fn(...args, (err, result) => (err ? reject(err) : resolve(result))));
}
function legacyConvert(file, cb) {            // error-first callback API, like old fs functions
  setTimeout(() => (file.endsWith(".corrupt") ? cb(new Error(`cannot open ${file}`)) : cb(null, file.replace(/\.docx$/, ".pdf"))), 40 + Math.random() * 80);
}
const convert = promisify(legacyConvert);

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length); let next = 0, active = 0, peak = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++; active++; peak = Math.max(peak, active);
      try { results[i] = { ok: true, value: await fn(items[i]) }; } catch (e) { results[i] = { ok: false, error: e.message }; }
      active--;
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return { results, peak };
}
(async () => {
  const files = Array.from({ length: 9 }, (_, i) => `jobs/file-${i + 1}${i === 4 ? ".corrupt" : ".docx"}`);
  const t0 = Date.now();
  const { results, peak } = await mapLimit(files, 3, convert);
  results.forEach((r, i) => console.log(files[i].padEnd(22), r.ok ? "-> " + r.value : "FAILED: " + r.error));
  console.log(`9 files, limit 3, peak concurrency ${peak}, ${Date.now() - t0} ms (sequential would be ~700 ms)`);
  setTimeout(() => console.log("timeout")); Promise.resolve().then(() => console.log("promise microtask")); console.log("sync");
})();
```

### Quiz

1. In the error-first callback convention, what is the first argument?
- [x] The error, or null when there was none
- [ ] The result
- [ ] The file name
> Every callback checks `err` first; the result follows.

2. What does `util.promisify(fs.readFile)` return?
- [ ] The file contents
- [x] A function that returns a promise
- [ ] A stream
> `promisify` wraps a callback-style function so it can be awaited.

3. Which runs first: `process.nextTick` or a resolved promise's `then`?
- [x] process.nextTick
- [ ] The promise callback
- [ ] They alternate
> Node drains the nextTick queue before the promise microtask queue.

4. Why use bounded concurrency instead of `Promise.all` on 500 conversions?
- [ ] Promise.all cannot handle more than 100 promises
- [x] To avoid exhausting memory, file descriptors or the external tool
- [ ] Bounded concurrency is always faster
> Unlimited parallelism can overwhelm the system; a pool keeps N tasks in flight.

### Exercises

1. **Promisify by hand** — Without `util`, write `promisify(fn)` and use it on a fake `(x, cb)` function that calls back with `x * 2`.
<details><summary>Solution</summary>

```js
const promisify = fn => (...a) => new Promise((res, rej) => fn(...a, (e, r) => (e ? rej(e) : res(r))));
const doubleCb = (x, cb) => setTimeout(() => cb(null, x * 2), 10);
promisify(doubleCb)(21).then(console.log); // 42
```

</details>

2. **Sequential with results** — Write `series(tasks)` that runs an array of async functions one after another and returns their results in order.
<details><summary>Solution</summary>

```js
async function series(tasks) {
  const out = [];
  for (const t of tasks) out.push(await t());
  return out;
}
series([() => Promise.resolve(1), async () => 2]).then(console.log); // [1, 2]
```

</details>

3. **Timeout with AbortSignal** — Use `AbortSignal.timeout(100)` to cancel a 500 ms sleep from `timers/promises` and report the error name.
<details><summary>Solution</summary>

```js
// Node-only: run locally
const { setTimeout: sleep } = require("node:timers/promises");
sleep(500, null, { signal: AbortSignal.timeout(100) }).catch(e => console.log(e.name)); // AbortError
```

</details>

### Interview Questions

**Q: What is callback hell and how did Node move past it?**
Callback hell is deeply nested error-first callbacks where each async step lives inside the previous one, producing a rightward drift, repeated error checks and no way to compose or reuse steps. Promises flattened chains and centralized error handling with `catch`; `util.promisify` and the `fs/promises` family made the core API promise-based; `async/await` in Node 8 gave synchronous-looking control flow with ordinary `try/catch` and loops. The remaining discipline is choosing between sequential `await`, `Promise.all` and bounded concurrency, and never mixing callbacks with promises in the same function.

**Q: Describe the phases of the Node event loop.**
Each iteration runs timers (expired `setTimeout`/`setInterval` callbacks), pending callbacks (deferred system errors), poll (retrieve new I/O events and run their callbacks, blocking here when nothing else is due), check (`setImmediate` callbacks), and close callbacks (`socket.on("close")`). After every callback Node drains the `process.nextTick` queue and then the promise microtask queue before moving on. The practical consequences: `nextTick` beats promises, `setImmediate` beats `setTimeout(0)` inside I/O callbacks, and a long synchronous callback in any phase delays everything else.

**Q: How would you process 10,000 files without running out of resources?**
Never `Promise.all` over all of them; use a bounded pool such as `mapLimit` or `p-limit` with a concurrency chosen by measuring (typically 4 to 16 for disk I/O, 1 to 2 per CPU for LibreOffice conversions). Stream file contents instead of loading them fully, collect results as `{ ok, value }` or `{ ok, error }` so one failure does not abort the batch, and write a manifest of completed items so the job can resume. I also watch `EMFILE` errors as the signal that the concurrency is too high for the OS file-descriptor limit.
