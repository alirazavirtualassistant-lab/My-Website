/* Shared execution engines: sandboxed JS, Pyodide (Python) and sql.js (SQLite). Used by runner.js and practice.js */
(function () {
  'use strict';
  const Engines = window.Engines = {};

  /* ---------- JavaScript in a sandboxed iframe ---------- */
  let seq = 0; const pending = {};
  window.addEventListener('message', function (e) {
    const d = e.data; if (!d || !d.sf || !pending[d.run]) return;
    const h = pending[d.run];
    if (d.type === 'done') { h.done(); delete pending[d.run]; if (h.frame) setTimeout(function () { h.frame.remove(); }, 500); }
    else h.out(d.args.join(' '), d.type);
  });
  Engines.js = function (src, opts) {
    opts = opts || {};
    const run = 'r' + (++seq);
    const libs = (opts.libs || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean).map(function (l) { return App.LIBS[l] || [l]; });
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts allow-downloads allow-modals allow-popups');
    frame.style.display = 'none';
    const doc = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>\n' +
      'const __send=(t,a)=>parent.postMessage({sf:1,run:' + JSON.stringify(run) + ',type:t,args:a},"*");\n' +
      'const __fmt=v=>{try{if(v instanceof Error)return v.stack||String(v);if(typeof v==="object"&&v!==null){return JSON.stringify(v,(k,x)=>typeof x==="bigint"?x.toString()+"n":x,2)}return String(v)}catch(e){return String(v)}};\n' +
      '["log","info","warn","error","table","debug"].forEach(k=>{console[k]=(...a)=>__send(k==="error"||k==="warn"?k:"log",a.map(__fmt))});\n' +
      'window.onerror=(m,s,l,c,e)=>{__send("error",[(e&&e.stack)||String(m)]);};window.onunhandledrejection=e=>__send("error",[__fmt(e.reason)]);\n' +
      'window.download=(blob,name)=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name||"file.bin";document.body.appendChild(a);a.click();__send("log",["⬇ Download started: "+(name||"file")+" ("+blob.size+" bytes)"]);setTimeout(()=>URL.revokeObjectURL(a.href),4000)};\n' +
      'window.saveAs=window.download;\n' +
      'const __libs=' + JSON.stringify(libs) + ';\n' +
      'function __load(c){return new Promise((res,rej)=>{let i=0;(function n(){if(i>=c.length)return rej(new Error("Could not load library "+c[0]+" (check your internet connection)"));const s=document.createElement("script");s.src=c[i++];s.onload=()=>res();s.onerror=()=>{s.remove();n()};document.head.appendChild(s)})()})}\n' +
      '(async()=>{try{for(const c of __libs){await __load(c);}' +
      'const __code=' + JSON.stringify(src) + ';\n' +
      'const __fn=new Function("return (async()=>{\\n"+__code+"\\n})()");await __fn();}catch(e){__send("error",[e&&e.stack?e.stack:String(e)]);}__send("done",[]);})();\n' +
      '<\/script></body></html>';
    return new Promise(function (resolve) {
      pending[run] = { out: opts.onOut || function () {}, done: resolve, frame: frame };
      document.body.appendChild(frame);
      frame.srcdoc = doc;
      setTimeout(function () { if (pending[run]) { pending[run].out('Timed out after 30 s (infinite loop?)', 'error'); pending[run].done(); delete pending[run]; frame.remove(); } }, 30000);
    });
  };

  /* ---------- Python via Pyodide ---------- */
  let pyodide = null, pyLoading = null; const installed = {};
  Engines.loadPython = function (onOut) {
    if (pyodide) return Promise.resolve(pyodide);
    if (pyLoading) return pyLoading;
    onOut && onOut('Loading Python runtime (first time only, ~10 MB)…', 'info');
    pyLoading = (function tryNext(i) {
      if (i >= App.PYODIDE.length) return Promise.reject(new Error('Could not load Pyodide from the CDN. Check your internet connection or firewall.'));
      const base = App.PYODIDE[i];
      return App.loadScript([base + 'pyodide.js']).then(function () { return window.loadPyodide({ indexURL: base }); }).catch(function () { return tryNext(i + 1); });
    })(0).then(function (py) { pyodide = py; return py; }, function (e) { pyLoading = null; throw e; });
    return pyLoading;
  };
  Engines.python = function (src, opts) {
    opts = opts || {}; const onOut = opts.onOut || function () {};
    return Engines.loadPython(onOut).then(function (py) {
      py.setStdout({ batched: function (s) { onOut(s, 'log'); } });
      py.setStderr({ batched: function (s) { onOut(s, 'error'); } });
      const pk = (opts.packages || '').split(',').map(function (s) { return s.trim(); }).filter(function (p) { return p && !installed[p]; });
      let p = Promise.resolve();
      if (pk.length) {
        onOut('Installing ' + pk.join(', ') + '…', 'info');
        p = py.loadPackage('micropip').then(function () {
          const micropip = py.pyimport('micropip');
          return pk.reduce(function (acc, name) { return acc.then(function () { return micropip.install(name).then(function () { installed[name] = true; }, function (e) { onOut('Could not install ' + name + ' in the browser (' + String(e).split('\n')[0] + '). Run this example locally with pip.', 'error'); }); }); }, Promise.resolve());
        });
      }
      return p.then(function () { return py.loadPackagesFromImports(src); }).then(function () { return py.runPythonAsync(src); }).then(function (r) {
        if (r !== undefined && r !== null && String(r) !== 'None' && String(r) !== 'undefined') onOut(String(r), 'info');
      }).catch(function (e) { onOut(String(e && e.message || e), 'error'); });
    });
  };

  /* ---------- SQL via sql.js ---------- */
  let SQL = null, sqlLoading = null;
  Engines.loadSql = function (onOut) {
    if (SQL) return Promise.resolve(SQL);
    if (sqlLoading) return sqlLoading;
    onOut && onOut('Loading SQLite engine…', 'info');
    sqlLoading = (function tryNext(i) {
      if (i >= App.SQLJS.length) return Promise.reject(new Error('Could not load sql.js from the CDN. Check your internet connection.'));
      const base = App.SQLJS[i];
      return App.loadScript([base + 'sql-wasm.js']).then(function () { return window.initSqlJs({ locateFile: function (f) { return base + f; } }); }).catch(function () { return tryNext(i + 1); });
    })(0).then(function (s) { SQL = s; return s; }, function (e) { sqlLoading = null; throw e; });
    return sqlLoading;
  };
  /* returns Promise<[{columns, values}]>, throws on SQL error */
  Engines.sql = function (src, opts) {
    opts = opts || {};
    return Engines.loadSql(opts.onOut).then(function (S) {
      const db = new S.Database();
      try { if (opts.setup) db.exec(opts.setup); const r = db.exec(src); return r; } finally { db.close(); }
    });
  };
  Engines.sqlTable = function (r) {
    let t = '<table><thead><tr>' + r.columns.map(function (c) { return '<th>' + App.esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    r.values.forEach(function (row) { t += '<tr>' + row.map(function (v) { return '<td>' + (v === null ? '<i class="info">NULL</i>' : App.esc(v)) + '</td>'; }).join('') + '</tr>'; });
    return t + '</tbody></table><div class="info">' + r.values.length + ' row(s)</div>';
  };
})();
