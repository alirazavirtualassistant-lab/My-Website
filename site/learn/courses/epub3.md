---
id: epub3
title: EPUB3 Ebook Production
icon: 📚
track: Document Engineering
color: #4A235A
runner: html
tagline: Build store-ready reflowable and fixed-layout ebooks that pass EPUBCheck.
description: EPUB3 from the ZIP container to expert production: mimetype and container.xml, the OPF package (metadata, manifest, spine), navigation document, XHTML content documents, CSS for reading systems, fonts and obfuscation, images and covers, fixed-layout (rendition properties, viewport), media overlays, accessibility (EPUB Accessibility 1.1), validation with EPUBCheck, KDP/Apple/Kobo requirements and conversion tooling (Calibre, Sigil, pandoc, ebooklib).
---

# LEVEL: Beginner

## What an EPUB is (ZIP + XHTML)

An EPUB file is not a mysterious binary format. It is a **ZIP archive** with a `.epub` extension that contains ordinary web files: XHTML pages, CSS stylesheets, images, fonts and a few small XML files that tell the reading system how everything fits together. If you can build a simple web page, you already know most of what is inside an ebook.

The format is maintained by the W3C. The versions you will meet in real work are **EPUB 2.0.1** (2010, still produced by old converters), **EPUB 3.0/3.0.1** (2011/2014), **EPUB 3.2** (2019) and **EPUB 3.3**, which became a W3C Recommendation in May 2023 and is what "EPUB3" means today. Every major store (Amazon KDP, Apple Books, Kobo, Google Play Books) accepts EPUB 3.

### Look inside a real ebook

Rename any `.epub` file to `.zip` and extract it. You will see something like this:

```text
policy-manual.epub
├── mimetype
├── META-INF/
│   └── container.xml
└── OEBPS/
    ├── content.opf
    ├── nav.xhtml
    ├── css/style.css
    ├── images/cover.jpg
    ├── ch01.xhtml
    └── ch02.xhtml
```

Each part has one job:

| Part | Job |
|---|---|
| `mimetype` | A one-line text file saying "this ZIP is an EPUB" |
| `META-INF/container.xml` | Points to the package file |
| `content.opf` | The package: metadata, list of files (manifest), reading order (spine) |
| `nav.xhtml` | The table of contents the reader shows |
| `ch01.xhtml` … | The actual chapters, written in XHTML |
| `css/style.css` | Formatting for the chapters |

The folder name `OEBPS` is a convention (it stands for Open eBook Publication Structure). You can call it `EPUB` or `content`; the `container.xml` file tells the reader where to look.

### Reflowable versus fixed layout

A **reflowable** EPUB behaves like a web page: the reader changes font size, the text rewraps, and page numbers are computed on the fly. This is what you want for a novel, an SOP manual or a 300-page policy handbook. A **fixed-layout** (FXL) EPUB locks every page to a fixed size, like a PDF, and is used for children's picture books, comics and design-heavy cookbooks. Both are EPUB 3; the difference is a few metadata flags you will learn in the Advanced level.

### Why XHTML and not HTML

Chapters are written in **XHTML**, which is HTML that follows XML rules: every tag must be closed, tags are lowercase, attributes are quoted, and `&` must be written `&amp;`. Reading systems use strict XML parsers, so a single unclosed `<br>` can make a chapter show up blank. A minimal valid chapter looks like this:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <title>Chapter 1</title>
  <link rel="stylesheet" type="text/css" href="css/style.css"/>
</head>
<body>
  <h1>1. Scope of this manual</h1>
  <p>This manual applies to all data-processing agents.</p>
</body>
</html>
```

Notice `<link … />` with the self-closing slash and the `xmlns` attribute on `<html>`. Both are mandatory in EPUB and both are things a normal browser would forgive.

> **Tip:** When a client sends you a "broken EPUB", the first thing to do is unzip it and open the XHTML files in a browser. Eight times out of ten the error is a malformed tag, not a format problem.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Chapter 1</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.5; margin: 1em; }
    h1 { font-size: 1.6em; text-align: center; page-break-before: always; }
    p { text-indent: 1.2em; margin: 0; }
    p.first { text-indent: 0; }
  </style>
</head>
<body>
  <h1>1. Scope of this manual</h1>
  <p class="first">This manual applies to all data-processing agents in the title-search project.</p>
  <p>Edit the CSS above and watch the chapter re-render exactly as a reading system would.</p>
</body>
</html>
```

### Quiz

1. What kind of file is an EPUB at the byte level?
- [ ] A PDF with an extra header
- [x] A ZIP archive containing XHTML, CSS and XML files
- [ ] A proprietary binary database
> Rename it to `.zip`, extract it, and you will find web files inside.

2. Which EPUB version is the current W3C Recommendation?
- [ ] EPUB 2.0.1
- [ ] EPUB 3.0
- [x] EPUB 3.3
> EPUB 3.3 was published as a W3C Recommendation in May 2023.

3. Why must chapters be XHTML rather than loose HTML?
- [x] Reading systems parse content with strict XML parsers
- [ ] XHTML files are smaller
- [ ] Only XHTML supports CSS
> An unclosed tag that a browser forgives will break an XML parser and blank the chapter.

### Exercises

1. **Inspect an ebook** — Take any `.epub` (for example a free one from Project Gutenberg), rename it to `.zip`, extract it, and list the three files that are not XHTML, CSS or images. Say what each one does.
<details><summary>Solution</summary>

`mimetype` declares the archive as `application/epub+zip`; `META-INF/container.xml` points to the package document; the `.opf` file (often `content.opf`) holds the metadata, manifest and spine. Gutenberg files also include a `toc.ncx`, the EPUB 2 table of contents kept for old readers.

</details>

2. **Fix the XHTML** — The fragment `<p>Fees & charges<br>See table 2<p>` breaks an EPUB. Rewrite it as valid XHTML.
<details><summary>Solution</summary>

```html
<p>Fees &amp; charges<br/>See table 2</p>
```

The ampersand must be escaped, `<br>` must self-close, and the paragraph must be closed with `</p>` rather than opened again.

</details>

### Interview Questions

**Q: In one sentence, what is an EPUB, and what does that imply for how you debug one?**
An EPUB is a ZIP archive of XHTML, CSS, images and a handful of XML files that describe the package, so debugging is mostly web debugging. I unzip it, run EPUBCheck to get exact file and line numbers, then open the offending XHTML in a browser or an XML validator. Because the content is XHTML rather than HTML, the usual suspects are unclosed tags, unescaped ampersands and case mismatches in file names, none of which are visible in a WYSIWYG editor. Knowing it is "just a ZIP" also means I can fix one chapter and rezip without touching the rest of the book.

**Q: What is the difference between reflowable and fixed-layout EPUB, and when would you choose each?**
Reflowable EPUB lets the reading system rewrap text at any font size and screen width, which is right for text-heavy books such as manuals, novels and handbooks. Fixed layout pins every page to a declared viewport so the design is preserved exactly, which suits picture books, comics and heavily illustrated cookbooks. The trade-off is accessibility and device fit: FXL text cannot be resized and small phones show tiny pages, while reflowable books lose precise placement. For a client's 300-page SOP manual I would always go reflowable; for a 24-page illustrated children's book I would go FXL.

**Q: Which EPUB versions do you still encounter and why does it matter?**
EPUB 2.0.1 files still come out of older converters and some publisher backlists; they use an NCX table of contents and lack EPUB 3 features such as media overlays and semantic `epub:type`. EPUB 3.0.1 and 3.2 are what most tooling produced between 2014 and 2023, and EPUB 3.3 is the current Recommendation and what EPUBCheck 5 validates against. It matters because stores and validators judge the file by its declared `version` attribute, and a file claiming 3.0 while containing 3.3-only features such as WebP images will fail validation.

## Container structure (mimetype, META-INF/container.xml, OPF)

The EPUB container is the part of the specification that says how the ZIP itself must be built. Three rules matter, and reading systems reject files that break them.

### Rule 1: the mimetype file

The archive must contain a file named exactly `mimetype` (no extension) whose content is the single ASCII string `application/epub+zip` with no trailing newline. It must be the **first** entry in the ZIP and it must be **stored**, not compressed. This lets any program identify an EPUB by reading the first 60 bytes of the file: bytes 30–57 of a valid EPUB are always the literal text `mimetypeapplication/epub+zip`.

```text
application/epub+zip
```

Create it with a command that does not add a newline:

```bash
printf 'application/epub+zip' > mimetype
```

### Rule 2: META-INF/container.xml

The folder `META-INF` must exist at the root and must contain `container.xml`. This file has one job: to point at the package document (the `.opf` file).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0"
           xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf"
              media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
```

`full-path` is relative to the root of the ZIP, so if you rename the `OEBPS` folder you must change this line. The `media-type` value is fixed. A container may list several `rootfile` elements (for multiple renditions), but reading systems only guarantee to open the first one.

### Rule 3: everything else lives under the package

All other files are referenced from the package document. `META-INF` may also hold optional files:

| File | Purpose |
|---|---|
| `encryption.xml` | Declares obfuscated fonts or DRM-encrypted resources |
| `signatures.xml` | Digital signatures (rarely used) |
| `metadata.xml` | Reserved, unused in practice |
| `com.apple.ibooks.display-options.xml` | Legacy Apple Books options such as `specified-fonts` |

### The package document, in outline

The `.opf` file is XML with the `http://www.idpf.org/2007/opf` namespace and four sections: `metadata`, `manifest`, `spine` and an optional `collection`. The next chapter covers each in depth; here is the skeleton so you can see how the three container pieces chain together:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0"
         unique-identifier="pub-id" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:8f1c2b1e-3a4d-4c5e-9f60-1a2b3c4d5e6f</dc:identifier>
    <dc:title>Data Processing SOP Manual</dc:title>
    <dc:language>en</dc:language>
    <meta property="dcterms:modified">2026-09-15T10:00:00Z</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ch01" href="ch01.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="ch01"/>
  </spine>
</package>
```

If you accidentally leave a stray tag after `</package>` or forget the closing tag, EPUBCheck stops at it with an `RSC-005` parse error and reports the line number. Spotting that kind of mistake quickly is the whole skill.

### File names and paths

Reading systems are picky about names. Use only ASCII letters, digits, hyphens, underscores and dots; keep names under 255 characters; never use spaces; and remember that ZIP paths are case sensitive, so `Images/Cover.jpg` and `images/cover.jpg` are different files. All `href` values in the package are relative to the location of the `.opf` file, not to the ZIP root.

> **Warning:** The most common "my EPUB will not open" problem is a `mimetype` file that was compressed, given a trailing newline, or placed second in the archive because a GUI zip tool sorted entries alphabetically (`META-INF` sorts before `mimetype`). Always build the ZIP with a tool that lets you control entry order.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Container check</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    pre { background: #f4f0f7; padding: .75em; border-left: 4px solid #4A235A; }
    .ok { color: #1b7f3b; } .bad { color: #b00020; }
  </style>
</head>
<body>
  <h2>Is this a valid mimetype entry?</h2>
  <pre id="out"></pre>
  <script>
    const candidates = ["application/epub+zip", "application/epub+zip\n", "application/epub-zip"];
    const out = document.getElementById("out");
    candidates.forEach(c => {
      const ok = c === "application/epub+zip";
      out.innerHTML += `<span class="${ok ? "ok" : "bad"}">${ok ? "OK " : "BAD"}</span> ${JSON.stringify(c)}\n`;
    });
  </script>
</body>
</html>
```

### Quiz

1. Where must the `mimetype` file sit in the ZIP archive?
- [x] First entry, stored uncompressed
- [ ] Anywhere, as long as it is compressed
- [ ] Inside META-INF
> The spec requires it first and uncompressed so the format can be sniffed from the first bytes.

2. What does `META-INF/container.xml` point to?
- [ ] The cover image
- [x] The package (.opf) document
- [ ] The navigation document
> Its `rootfile` element carries the `full-path` of the OPF file.

3. `href` values inside the OPF are relative to what?
- [ ] The ZIP root
- [x] The folder containing the OPF file
- [ ] The META-INF folder
> Paths resolve from the package document's own location.

### Exercises

1. **Write container.xml** — Your package file is at `EPUB/package.opf`. Write the complete `container.xml`.
<details><summary>Solution</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
```

</details>

2. **Diagnose** — A client's EPUB opens in Calibre but fails on an iPad with "the book could not be opened". `unzip -l` shows `META-INF/container.xml` as the first entry. What is wrong?
<details><summary>Solution</summary>

The `mimetype` file is not the first entry (and is probably compressed). Calibre is tolerant; Apple Books is not. Rebuild the ZIP with `mimetype` added first using store mode (`zip -X0 book.epub mimetype`) and then add the rest.

</details>

### Interview Questions

**Q: Why does the specification insist the mimetype entry be first and uncompressed?**
So that any software can identify an EPUB without unzipping it: the ZIP local header for the first entry is 30 bytes plus the 8-byte name, so the literal string `application/epub+zip` always appears at a fixed offset. Stored mode is required because a compressed entry would not contain the literal bytes. This is also why `-X` matters when zipping: extra fields such as Unix timestamps shift the offset and trigger EPUBCheck's `PKG-005` error. I build with `zip -X0` for the mimetype and `zip -Xr9D` for the rest, or with Python's `zipfile` using `ZIP_STORED` for that single entry.

**Q: What files are allowed inside META-INF and which ones do you actually use?**
The reserved names are `container.xml`, `encryption.xml`, `signatures.xml`, `metadata.xml`, `manifest.xml` and `rights.xml`. In production I always write `container.xml`, I write `encryption.xml` when I obfuscate embedded fonts, and I occasionally still add Apple's `com.apple.ibooks.display-options.xml` to force Apple Books to honour embedded fonts in older versions. Signatures and rights are practically never used outside DRM vendors, and a stray unknown file in `META-INF` will make EPUBCheck complain.

**Q: Can a container hold more than one rootfile, and should it?**
Yes, the schema allows multiple `rootfile` elements, and EPUB Multiple-Rendition Publications used it to ship, for example, a reflowable and a fixed-layout rendition in one file. In practice no mainstream reading system selects between renditions; they open the first entry and ignore the rest. So I ship one rendition per file and deliver separate EPUBs when a client needs both formats, which also keeps file size and store validation simple.

## The package document (metadata/manifest/spine)

The package document (`content.opf`) is the brain of the ebook. Reading systems read it before anything else, and EPUBCheck spends most of its time validating it. It has three required sections.

### Metadata: who, what, when

The `metadata` element uses Dublin Core (`dc:`) elements plus `meta` elements. Three DC elements are **required**: `dc:identifier`, `dc:title` and `dc:language`. One `meta` is also required: `dcterms:modified`, a UTC timestamp in the exact form `CCYY-MM-DDThh:mm:ssZ`.

```xml
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="pub-id">urn:isbn:9789692012345</dc:identifier>
  <dc:title id="t1">Title Search Procedures Handbook</dc:title>
  <meta refines="#t1" property="title-type">main</meta>
  <dc:language>en-US</dc:language>
  <dc:creator id="creator1">Ali Raza</dc:creator>
  <meta refines="#creator1" property="role" scheme="marc:relators">aut</meta>
  <meta refines="#creator1" property="file-as">Raza, Ali</meta>
  <dc:publisher>Stewart Title Production Support</dc:publisher>
  <dc:date>2026-09-01</dc:date>
  <dc:description>Step-by-step procedures for US title searches.</dc:description>
  <meta property="dcterms:modified">2026-09-15T10:00:00Z</meta>
</metadata>
```

Points worth remembering:

- The `unique-identifier` attribute on `<package>` must equal the `id` of one `dc:identifier`. Use an ISBN URN when you have one, otherwise `urn:uuid:` with a freshly generated UUID.
- `refines` attaches extra facts to an element: the author's role (`aut`, `edt`, `ill` from the MARC relators list) and sort name (`file-as`).
- `dc:language` uses BCP 47 tags: `en`, `en-GB`, `ur`, `ar`, `zh-Hant`.
- Multiple `dc:creator` elements are fine; order them as they should appear.

### Manifest: every file, exactly once

The manifest lists **every** resource in the publication except `mimetype` and the contents of `META-INF`. Each `item` needs a unique `id`, an `href` and a `media-type`. Some items also need a `properties` attribute.

```xml
<manifest>
  <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  <item id="cover-img" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>
  <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
  <item id="ch01" href="ch01.xhtml" media-type="application/xhtml+xml"/>
  <item id="ch02" href="ch02.xhtml" media-type="application/xhtml+xml" properties="svg"/>
  <item id="css" href="css/style.css" media-type="text/css"/>
  <item id="font1" href="fonts/Literata-Regular.woff2" media-type="font/woff2"/>
  <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
</manifest>
```

| `properties` value | Meaning |
|---|---|
| `nav` | This XHTML file is the navigation document (exactly one item) |
| `cover-image` | This image is the cover (at most one item) |
| `svg` | The XHTML contains inline SVG |
| `mathml` | The XHTML contains MathML |
| `scripted` | The XHTML contains JavaScript or forms |
| `remote-resources` | The document references resources outside the container (audio/video only) |

Declaring a file that is not there gives `RSC-001`; shipping a file that is not declared gives `OPF-003`; using inline SVG without `properties="svg"` gives `OPF-014`. Media types must be the standard ones: `image/jpeg`, `image/png`, `image/svg+xml`, `image/gif`, `image/webp` (EPUB 3.3), `font/woff2`, `font/woff`, `font/otf`, `font/ttf`, `audio/mpeg`, `audio/mp4`, `text/css`, `application/xhtml+xml`, `application/smil+xml`.

### Spine: the reading order

The spine lists the XHTML documents in the order a reader pages through them. Only manifest items of type `application/xhtml+xml` (or SVG) may appear here, and each `itemref` refers to a manifest `id`.

```xml
<spine toc="ncx">
  <itemref idref="cover" linear="no"/>
  <itemref idref="nav"/>
  <itemref idref="ch01"/>
  <itemref idref="ch02"/>
</spine>
```

`linear="no"` marks a page that is reachable by link but should not be part of the main flow (a cover page, a pop-up footnote page). `toc="ncx"` is optional and links the EPUB 2 fallback NCX. The nav document may or may not appear in the spine; if you want readers to page through a visible contents page, include it.

> **Interview note:** Interviewers like to ask "what happens if a file is in the manifest but not in the spine?" Answer: it is a valid resource that can be linked to or used by other files (CSS, images, a glossary page), but a reader will not reach it by paging forward. Every XHTML you want people to read must be in the spine.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Spine preview</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    ol li { margin: .3em 0; }
    .nonlinear { color: #888; font-style: italic; }
  </style>
</head>
<body>
  <h2>Reading order derived from a spine</h2>
  <ol id="spine"></ol>
  <script>
    const manifest = { cover: "cover.xhtml", nav: "nav.xhtml", ch01: "ch01.xhtml", ch02: "ch02.xhtml" };
    const spine = [ { idref: "cover", linear: "no" }, { idref: "nav" }, { idref: "ch01" }, { idref: "ch02" } ];
    const ol = document.getElementById("spine");
    spine.forEach(ref => {
      const li = document.createElement("li");
      li.textContent = manifest[ref.idref] + (ref.linear === "no" ? " (linear=no, skipped when paging)" : "");
      if (ref.linear === "no") li.className = "nonlinear";
      ol.appendChild(li);
    });
  </script>
</body>
</html>
```

### Quiz

1. Which metadata items are required in an EPUB 3 package?
- [ ] dc:title, dc:creator, dc:publisher
- [x] dc:identifier, dc:title, dc:language and dcterms:modified
- [ ] dc:identifier and a cover image
> The three Dublin Core elements plus the modified timestamp are mandatory; everything else is optional.

2. What does `properties="nav"` on a manifest item mean?
- [x] The item is the EPUB navigation document
- [ ] The item is a navigation bar image
- [ ] The item must be excluded from the spine
> Exactly one manifest item must carry `nav`, and it must be an XHTML file.

3. An image file is in the ZIP but not listed in the manifest. What does EPUBCheck report?
- [ ] Nothing, images are optional
- [x] OPF-003: item exists but is not declared in the manifest
- [ ] PKG-006
> Every resource must be declared; undeclared files trigger OPF-003.

### Exercises

1. **Write a manifest** — Files: `nav.xhtml`, `intro.xhtml`, `style.css`, `logo.png`, `cover.jpg` (the cover). Write the manifest and a spine where `intro.xhtml` follows the nav.
<details><summary>Solution</summary>

```xml
<manifest>
  <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  <item id="intro" href="intro.xhtml" media-type="application/xhtml+xml"/>
  <item id="css" href="style.css" media-type="text/css"/>
  <item id="logo" href="logo.png" media-type="image/png"/>
  <item id="cover" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>
</manifest>
<spine>
  <itemref idref="nav"/>
  <itemref idref="intro"/>
</spine>
```

</details>

2. **Add a second author with roles** — Add "Ali Raza" as author and "Sara Khan" as editor with sortable names.
<details><summary>Solution</summary>

```xml
<dc:creator id="c1">Ali Raza</dc:creator>
<meta refines="#c1" property="role" scheme="marc:relators">aut</meta>
<meta refines="#c1" property="file-as">Raza, Ali</meta>
<dc:contributor id="c2">Sara Khan</dc:contributor>
<meta refines="#c2" property="role" scheme="marc:relators">edt</meta>
<meta refines="#c2" property="file-as">Khan, Sara</meta>
```

</details>

### Interview Questions

**Q: Explain the difference between the manifest and the spine.**
The manifest is the complete inventory: every file in the publication with its id, path and media type, so the reading system knows what exists and how to interpret it. The spine is the ordered subset of XHTML documents that defines the default reading order. CSS, fonts and images are only in the manifest; chapters are in both. A common bug is a chapter that is in the manifest but forgotten in the spine, which is valid EPUB but means readers can never page to it, so I diff the two lists as part of QA on long books such as a 40-chapter handbook.

**Q: How do you choose and format the unique identifier?**
If the client has bought an ISBN for the ebook edition I use `urn:isbn:` followed by the 13 digits without hyphens; otherwise I generate a UUID and use `urn:uuid:`. The `<package unique-identifier>` attribute must reference that element's id. The identifier combined with `dcterms:modified` forms the release identifier, which is how reading systems detect that an updated file is a new version of the same book, so I never reuse the same pair for a changed file and I always bump the modified timestamp on every rebuild.

**Q: What is `dcterms:modified` and why does EPUBCheck care about its format?**
It is the last-modification timestamp of the publication and it must be in the exact UTC form `CCYY-MM-DDThh:mm:ssZ`, for example `2026-09-15T10:00:00Z`. A timezone offset such as `+05:00` or a missing seconds field fails validation. In my build scripts I generate it with `datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')` so it is always correct and always changes with each build.

## Navigation document (nav.xhtml, toc, landmarks)

Every EPUB 3 must have exactly one **navigation document**: an XHTML file flagged with `properties="nav"` in the manifest. It replaces the EPUB 2 `toc.ncx` and is what the reading system displays when the user taps "Contents". Because it is ordinary XHTML you can also put it in the spine as a visible contents page.

### The toc nav

The heart of the file is a `<nav>` element with `epub:type="toc"`. The `epub` prefix must be declared on the root element. Inside it there is a single `<ol>`; each `<li>` holds an `<a>` link (or a `<span>` for headings that have no target) and, optionally, a nested `<ol>` for sub-sections.

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
  <title>Contents</title>
  <link rel="stylesheet" type="text/css" href="css/style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc" role="doc-toc">
    <h1>Contents</h1>
    <ol>
      <li><a href="ch01.xhtml">1. Purpose and scope</a></li>
      <li><a href="ch02.xhtml">2. Search procedure</a>
        <ol>
          <li><a href="ch02.xhtml#s2-1">2.1 Grantor/grantee index</a></li>
          <li><a href="ch02.xhtml#s2-2">2.2 Tract index</a></li>
        </ol>
      </li>
      <li><a href="ch03.xhtml">3. Quality checks</a></li>
    </ol>
  </nav>
</body>
</html>
```

Rules the validator enforces:

- Every `<li>` must contain either an `<a>` or a `<span>` as its first child, followed optionally by an `<ol>`.
- Link text must not be empty; an `<a>` with only an image needs `alt` text or the reader shows a blank entry.
- Links must point at files in the manifest, and fragment ids (`#s2-1`) must exist in the target file or you get `RSC-012`.
- An `<ol>` must not be empty.

### The landmarks nav

A second, optional `<nav>` with `epub:type="landmarks"` tells the reader where the important structural parts are. Reading systems use it for "go to beginning" and Kindle uses it to decide where the book opens.

```html
<nav epub:type="landmarks" hidden="">
  <h2>Guide</h2>
  <ol>
    <li><a epub:type="cover" href="cover.xhtml">Cover</a></li>
    <li><a epub:type="toc" href="nav.xhtml">Table of Contents</a></li>
    <li><a epub:type="bodymatter" href="ch01.xhtml">Start of Content</a></li>
  </ol>
</nav>
```

The `hidden=""` attribute hides the landmarks from view when the nav file is displayed as a page, while still letting reading systems read it. Each `<a>` in a landmarks list must carry an `epub:type` value such as `cover`, `titlepage`, `toc`, `bodymatter`, `bibliography`, `glossary`, `index`.

### The page-list nav

If your ebook corresponds to a printed edition (the 767-page handbook, for example), a `page-list` nav maps print page numbers to locations. This is an accessibility requirement for textbooks and pairs with `epub:type="pagebreak"` markers in the content:

```html
<nav epub:type="page-list" hidden="">
  <ol>
    <li><a href="ch01.xhtml#pg1">1</a></li>
    <li><a href="ch01.xhtml#pg2">2</a></li>
  </ol>
</nav>
```

### NCX for old readers

EPUB 3 no longer requires `toc.ncx`, but Amazon's older Kindle apps and some library readers still use it, so most production tools generate both. The NCX lists `navPoint` elements with `playOrder`, and is linked from the spine's `toc` attribute. Sigil, Calibre and pandoc all write it automatically; if you hand-build, keep the two files in sync or EPUBCheck emits `NCX-001` mismatches for the identifier.

| Feature | nav.xhtml | toc.ncx |
|---|---|---|
| Required in EPUB 3 | Yes | No (compatibility) |
| Nested sections | Nested `<ol>` | Nested `navPoint` |
| Landmarks / page list | Yes | `pageList` only |
| Can be a visible page | Yes | No |

> **Tip:** Keep the toc nav depth to what a reader can use. A three-level TOC with 400 entries is faithful to a handbook's print TOC but unusable on a phone; put the deep TOC in a spine page and keep the nav to two levels.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Contents</title>
  <style>
    body { font-family: Georgia, serif; margin: 1.5em; }
    nav ol { list-style: none; padding-left: 0; }
    nav ol ol { padding-left: 1.5em; font-size: .95em; }
    nav a { text-decoration: none; color: #4A235A; }
    nav li { margin: .4em 0; }
  </style>
</head>
<body>
  <nav id="toc" role="doc-toc">
    <h1>Contents</h1>
    <ol>
      <li><a href="#ch01">1. Purpose and scope</a></li>
      <li><a href="#ch02">2. Search procedure</a>
        <ol>
          <li><a href="#s2-1">2.1 Grantor/grantee index</a></li>
          <li><a href="#s2-2">2.2 Tract index</a></li>
        </ol>
      </li>
      <li><a href="#ch03">3. Quality checks</a></li>
    </ol>
  </nav>
</body>
</html>
```

### Quiz

1. How many navigation documents may an EPUB 3 contain?
- [x] Exactly one
- [ ] One per chapter
- [ ] Zero or more
> One manifest item with `properties="nav"` is required and only one is allowed.

2. What does `hidden=""` on a landmarks nav do?
- [ ] Removes it from validation
- [x] Hides it when the nav file is displayed as a page but keeps it machine-readable
- [ ] Prevents Kindle from using it
> Reading systems still read hidden navs for their own menus.

3. A TOC link points to `ch02.xhtml#s2-9` but that id does not exist. Which EPUBCheck error appears?
- [ ] OPF-003
- [x] RSC-012
- [ ] PKG-006
> RSC-012 means a fragment identifier was not found in the target document.

### Exercises

1. **Write a toc nav** — Produce a `toc` nav for chapters Cover, Introduction, Part I with sections 1 and 2, Appendix.
<details><summary>Solution</summary>

```html
<nav epub:type="toc" role="doc-toc">
  <h1>Contents</h1>
  <ol>
    <li><a href="cover.xhtml">Cover</a></li>
    <li><a href="intro.xhtml">Introduction</a></li>
    <li><span>Part I</span>
      <ol>
        <li><a href="ch01.xhtml">1. Section one</a></li>
        <li><a href="ch02.xhtml">2. Section two</a></li>
      </ol>
    </li>
    <li><a href="appendix.xhtml">Appendix</a></li>
  </ol>
</nav>
```

A `<span>` is used for "Part I" because it has no page of its own.

</details>

2. **Add landmarks** — Add a landmarks nav that marks the cover, the contents and where the body starts (`intro.xhtml`).
<details><summary>Solution</summary>

```html
<nav epub:type="landmarks" hidden="">
  <h2>Guide</h2>
  <ol>
    <li><a epub:type="cover" href="cover.xhtml">Cover</a></li>
    <li><a epub:type="toc" href="nav.xhtml">Contents</a></li>
    <li><a epub:type="bodymatter" href="intro.xhtml">Start reading</a></li>
  </ol>
</nav>
```

</details>

### Interview Questions

**Q: Why does EPUB 3 use an XHTML navigation document instead of the NCX?**
Because XHTML is the same language as the content, so the TOC can be styled, displayed as a page, made accessible with ARIA, and validated with the same parser. NCX was an XML dialect borrowed from DAISY talking books and could only be consumed by the reader's menu. The nav document also carries landmarks and a page list in one file. I still generate an NCX for backwards compatibility with older Kindle apps and library readers, but the nav document is the source of truth and the NCX is derived from it in my build script.

**Q: What are landmarks and how do they affect the Kindle experience?**
Landmarks are a hidden nav list that tags structural entry points with `epub:type` values such as `cover`, `toc` and `bodymatter`. Kindle Previewer reads the `bodymatter` landmark to decide the "Start Reading Location", so without it a book may open on the copyright page. Apple Books and Kobo use `toc` and `cover` for their menus. For a client handbook I always include at least cover, toc and bodymatter, and for reference works I add `glossary` and `index` so screen readers can jump there.

**Q: How do you keep a 400-entry TOC usable and valid?**
I generate the nav from the same heading list that produces the chapters, so ids always exist and RSC-012 never appears. I limit the nav to two levels for phone usability and put the full three-level TOC into a spine page that readers can scroll. Every entry gets meaningful link text rather than a bare number, which is both an accessibility requirement and a store requirement. Finally, I run EPUBCheck and Ace to confirm every link resolves and headings are in a logical order.

## Your first content document (XHTML rules)

Content documents are the chapters. EPUB 3 content documents are **XHTML5**: HTML5 elements serialised as well-formed XML. This chapter gives you the exact skeleton, the rules that differ from everyday HTML, and the structural elements that make an ebook behave well.

### The skeleton

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops"
      lang="en" xml:lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Chapter 2: Search procedure</title>
  <link rel="stylesheet" type="text/css" href="css/style.css"/>
</head>
<body>
  <section epub:type="chapter" role="doc-chapter" id="ch02">
    <h1>2. Search procedure</h1>
    <p>Every order begins with a legal description …</p>
    <section id="s2-1">
      <h2>2.1 Grantor/grantee index</h2>
      <p>…</p>
    </section>
  </section>
</body>
</html>
```

Every line does something: the XML declaration is optional but recommended; `<!DOCTYPE html>` must be exactly that (an old XHTML 1.1 DOCTYPE with a public identifier triggers `HTM-004`/`OPF-073`); the `xmlns` on `<html>` is mandatory; `<title>` is required and should match the chapter heading; `<section epub:type="chapter">` tells reading systems and screen readers what this document is.

### The XML rules that bite

| Everyday HTML | Required in XHTML |
|---|---|
| `<br>`, `<img src="a.png">`, `<hr>` | `<br/>`, `<img src="a.png" alt="…"/>`, `<hr/>` |
| `<p>Fees & charges` | `<p>Fees &amp; charges</p>` |
| `<input disabled>` | `<input disabled="disabled"/>` |
| `<P CLASS=note>` | `<p class="note">` |
| `&nbsp;` | `&#160;` (named entities other than the five XML ones are not defined) |
| `<script>if (a < b)…</script>` | Wrap in `<![CDATA[ … ]]>` or escape `&lt;` |

Only `&amp;`, `&lt;`, `&gt;`, `&quot;` and `&apos;` are predefined. Use numeric references (`&#8217;` for a curly apostrophe, `&#160;` for a non-breaking space) or, better, type the real UTF-8 characters.

### Structure that reading systems understand

Use one `<h1>` per document, then `<h2>`, `<h3>` in order without skipping. Wrap logical blocks in `<section>`; wrap sidebars in `<aside>`; use `<figure>`/`<figcaption>` for captioned images and tables. Give every heading an `id` so the nav can link to it. Semantic `epub:type` values you will use constantly:

- `cover`, `titlepage`, `copyright-page`, `toc` in the front matter
- `chapter`, `part`, `subchapter` in the body
- `footnote`, `endnote`, `noteref` for notes
- `frontmatter`, `bodymatter`, `backmatter` on `<body>` or the outer `<section>`

### Images and links

Images use `<img>` with a required `alt` attribute and a relative path. A link to another chapter is a plain `<a href="ch03.xhtml#qc">`. External links (`https://…`) are allowed and open in the device browser; anything else referenced from a content document (image, CSS, font) must live inside the container.

```html
<figure>
  <img src="images/rate-matrix.png" alt="Rate matrix for Wyoming owner's policies, 2026" />
  <figcaption>Figure 2.1: Wyoming rate matrix</figcaption>
</figure>
<p>Continue with <a href="ch03.xhtml#qc">quality checks</a>.</p>
```

### One chapter per file

Split the book so each XHTML file is well under 300 KB. Amazon's guidelines recommend it, Apple Books and Adobe RMSDK paginate a huge file slowly, and some older readers refuse files above about 300 KB. For a 767-page handbook that means one file per chapter or even per major section, with the nav linking to fragments.

> **Warning:** Do not put `<style>` blocks with `@import` or JavaScript into content documents unless you have declared `properties="scripted"`. Most stores strip or forbid scripts anyway, so keep chapters static.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Chapter 2: Search procedure</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.5; margin: 1.2em; }
    h1 { font-size: 1.5em; margin-bottom: .2em; }
    h2 { font-size: 1.15em; margin-top: 1.2em; }
    p { margin: 0 0 .6em 0; }
    figure { margin: 1em 0; text-align: center; }
    figcaption { font-size: .85em; color: #555; }
    aside { border-left: 3px solid #4A235A; padding: .5em .8em; background: #f7f3fa; }
  </style>
</head>
<body>
  <section id="ch02">
    <h1>2. Search procedure</h1>
    <p>Every order begins with a legal description &amp; the last vesting deed.</p>
    <section id="s2-1">
      <h2>2.1 Grantor/grantee index</h2>
      <p>Search backwards from the current owner until the required chain period is covered.</p>
      <aside><p><strong>QA rule:</strong> a chain gap longer than 30 days must be flagged.</p></aside>
    </section>
    <figure>
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60" role="img" aria-label="sample figure">
        <rect width="200" height="60" fill="#4A235A"/><text x="100" y="36" fill="#fff" text-anchor="middle" font-size="16">Figure 2.1</text>
      </svg>
      <figcaption>Figure 2.1: Wyoming rate matrix</figcaption>
    </figure>
  </section>
</body>
</html>
```

### Quiz

1. Which DOCTYPE is correct for an EPUB 3 content document?
- [x] `<!DOCTYPE html>`
- [ ] `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" …>`
- [ ] No DOCTYPE is allowed
> The HTML5 DOCTYPE is required; external identifiers trigger EPUBCheck errors.

2. Which entity is safe to use in XHTML without declaring it?
- [ ] `&nbsp;`
- [x] `&amp;`
- [ ] `&copy;`
> Only the five XML entities are predefined; use `&#160;` and `&#169;` or the real characters.

3. Why split a long book into many XHTML files?
- [ ] EPUBCheck limits file count
- [x] Large files paginate slowly and some readers refuse files above about 300 KB
- [ ] The spine allows only ten items
> Reading systems load one spine item at a time; keeping each small keeps page turns fast.

### Exercises

1. **Convert HTML to XHTML** — Fix: `<h1>Fees & Charges<h1><p>See <a href=ch3.xhtml>chapter 3<br>now</p><img src="a.png">`.
<details><summary>Solution</summary>

```html
<h1>Fees &amp; Charges</h1>
<p>See <a href="ch3.xhtml">chapter 3</a><br/>now</p>
<img src="a.png" alt="Fee table"/>
```

Closed the heading and anchor, quoted the href, self-closed `br` and `img`, escaped the ampersand and added `alt`.

</details>

2. **Semantic chapter** — Write the body of a copyright page with the right `epub:type`.
<details><summary>Solution</summary>

```html
<body epub:type="frontmatter">
  <section epub:type="copyright-page" role="doc-credits">
    <h1>Copyright</h1>
    <p>&#169; 2026 Ali Raza. All rights reserved.</p>
  </section>
</body>
```

</details>

### Interview Questions

**Q: A chapter renders blank in Apple Books but fine in a browser. What do you check?**
Browsers use a forgiving HTML parser, while Apple Books parses content documents as XML, so the first thing I check is well-formedness: an unclosed `<br>` or `<img>`, an unescaped `&` in a URL query string, a stray `&nbsp;`, or mismatched nesting. I run the file through `xmllint --noout` or EPUBCheck to get the exact line. The second suspect is a media-type mismatch, such as an `.html` file declared as `text/html` instead of `application/xhtml+xml`. The third is a CSS rule like `display: none` on `body` inherited from a Word-to-HTML export.

**Q: What is `epub:type` and how is it different from ARIA roles?**
`epub:type` is the EPUB structural semantics vocabulary; it labels what a part of the document is (chapter, footnote, cover) for reading systems, which use it for behaviours like pop-up footnotes and start-reading locations. ARIA roles from the DPUB-ARIA module (`doc-chapter`, `doc-footnote`, `doc-noteref`) carry the same meaning to assistive technology through the browser's accessibility tree. Best practice since EPUB 3.2 is to use both on the same element where a DPUB role exists, because screen readers do not see `epub:type`, and reading systems like iBooks key their footnote pop-ups on `epub:type` rather than on role.

**Q: How do you decide where to split a long document into content files?**
I split at every top-level chapter and, for chapters longer than about 250 KB of XHTML, at the next heading level, because reading systems load one spine item at a time and Kindle and Apple both recommend keeping files small. The split points become the spine order, and the nav links to fragment ids inside those files for sub-sections. I keep ids stable across builds (derived from the heading numbering, not from a counter) so cross-references and the nav do not break when a chapter is inserted, which happened repeatedly on a 767-page handbook where the client added sections mid-project.

# LEVEL: Intermediate

## CSS for reflowable ebooks (what reading systems support)

Ebook CSS is web CSS with the confidence removed. Reading systems (Apple Books, Kindle, Kobo, Adobe RMSDK, Thorium, Google Play) each implement a different subset, override some of your rules with user settings, and paginate rather than scroll. Good ebook CSS therefore does less, uses relative units, and never fights the reader.

### The reliable core

Everything in this list works everywhere that matters, including Kindle's Enhanced Typesetting:

```css
body { margin: 0; padding: 0; line-height: 1.4; }
h1 { font-size: 1.6em; text-align: center; margin: 1.5em 0 1em; page-break-before: always; }
h2 { font-size: 1.25em; margin: 1.2em 0 .5em; page-break-after: avoid; }
p  { margin: 0; text-indent: 1.2em; text-align: justify; }
p.first, h1 + p, h2 + p { text-indent: 0; }
blockquote { margin: 1em 2em; font-style: italic; }
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; width: 100%; font-size: .9em; }
td, th { border: 1px solid #999; padding: .25em .4em; vertical-align: top; }
.small-caps { font-variant: small-caps; }
```

Note what is absent: no `font-family` on `body` (readers replace it anyway), no `px` font sizes, no fixed widths, no `position`, no `float` on anything wider than an image thumbnail.

### Units and sizes

Use `em` for font size and spacing, `%` for widths, and `em` or `%` for margins. A reader who sets 24 pt type on a phone must still get a readable layout. `px` is acceptable only for hairline borders. Never set `font-size` on `body` or `p` in absolute units; Kindle ignores it and Apple Books lets users override it, which makes your carefully tuned headings look wrong relative to the text.

### Page breaks

Reading systems paginate, so page-break control is the property that most affects perceived quality. Use both the legacy and modern spellings because support is split:

```css
h1 { page-break-before: always; break-before: page; }
h2, h3 { page-break-after: avoid; break-after: avoid; }
figure, table { page-break-inside: avoid; break-inside: avoid; }
```

`widows` and `orphans` default to 2 in most engines; setting them explicitly is harmless. Do not rely on `page-break-before: right` or on `@page` margins: Kindle and Kobo ignore `@page` entirely.

### What varies between readers

| Feature | Apple Books | Kindle (KFX) | Kobo | Adobe RMSDK |
|---|---|---|---|---|
| Embedded fonts | Yes (user can override) | Yes, if not obfuscated with Adobe scheme | Yes | Yes |
| `@font-face` with WOFF2 | Yes | Yes | Yes | No (use OTF/TTF) |
| Flexbox / grid | Yes | Partial | Partial | No |
| `text-align: justify` + hyphens | Yes | Yes (own engine) | Yes | Yes |
| JavaScript | Yes | No | No | No |
| `-webkit-hyphens: auto` | Yes | Ignored | Yes | No |

The safe strategy is called **progressive enhancement**: write the reliable core first, then add features that are harmless when ignored.

### Namespaced selectors for epub:type

You can style by structural semantics using a namespace declaration at the top of the stylesheet:

```css
@namespace epub "http://www.idpf.org/2007/ops";
[epub|type~="footnote"] { font-size: .85em; }
aside[epub|type~="sidebar"] { border: 1px solid #ccc; padding: .5em; }
```

Kindle does not support the `epub|type` selector, so always add a class as well.

### Dark mode and night reading

Never hard-code `color: #000` or `background: #fff` on `body`; Apple Books, Kobo and Kindle invert colours in night mode and hard-coded values produce black-on-black text. Use colour only for accents (a heading tint, a table border) and test in dark mode on at least one device.

> **Tip:** Keep one stylesheet for the whole book and put it first in every content document. If a chapter needs exceptions, add a second, smaller stylesheet after it rather than inline `style=""` attributes, which Kindle Previewer flags and which are impossible to maintain across a 40-chapter manual.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Reflowable CSS</title>
  <style>
    body { margin: 1em; line-height: 1.4; font-family: Georgia, serif; }
    h1 { font-size: 1.6em; text-align: center; margin: 1em 0; }
    p { margin: 0; text-indent: 1.2em; text-align: justify; }
    h1 + p { text-indent: 0; }
    blockquote { margin: 1em 2em; font-style: italic; }
    .controls { position: sticky; top: 0; background: #eee; padding: .4em; font-family: sans-serif; font-size: 14px; }
  </style>
</head>
<body>
  <div class="controls">
    Reader font size:
    <button onclick="document.body.style.fontSize='14px'">Small</button>
    <button onclick="document.body.style.fontSize='20px'">Medium</button>
    <button onclick="document.body.style.fontSize='28px'">Large</button>
  </div>
  <h1>3. Quality checks</h1>
  <p>Because every size above uses em units, the heading, indent and quote scale together, exactly as they would when a reader changes the font size on a Kobo or in Apple Books.</p>
  <p>A second paragraph shows the first-line indent that replaces paragraph spacing in book typography.</p>
  <blockquote>Chain gaps longer than thirty days must be escalated to the QC lead.</blockquote>
</body>
</html>
```

### Quiz

1. Which unit should you use for font sizes in a reflowable EPUB?
- [ ] px
- [x] em (or rem/%)
- [ ] pt
> Relative units scale with the reader's chosen base size; absolute units are ignored or overridden.

2. Why should you avoid `background: #fff; color: #000` on body?
- [x] Night mode inverts colours and can produce unreadable text
- [ ] It is invalid CSS in EPUB
- [ ] It doubles file size
> Let the reading system control base colours; use colour only for accents.

3. Which property forces a chapter to start on a new screen in most readers?
- [ ] `margin-top: 100%`
- [x] `page-break-before: always` (plus `break-before: page`)
- [ ] `display: block`
> Both spellings are needed because engines differ; `@page` is not reliable.

### Exercises

1. **Write a stylesheet** — Style an SOP manual: centered chapter headings that start a new page, justified indented paragraphs, tables with thin borders, and a `.note` box.
<details><summary>Solution</summary>

```css
h1 { text-align: center; font-size: 1.6em; page-break-before: always; break-before: page; }
p { text-indent: 1.2em; text-align: justify; margin: 0; }
h1 + p, h2 + p, .first { text-indent: 0; }
table { border-collapse: collapse; width: 100%; page-break-inside: avoid; }
td, th { border: 1px solid #999; padding: .25em .4em; }
.note { border-left: 3px solid #4A235A; padding: .5em .8em; margin: 1em 0; }
```

</details>

2. **Spot the problem** — A client's converted EPUB has `p { font-size: 12px; font-family: "Calibri"; color: #000; }`. List three things wrong and fix them.
<details><summary>Solution</summary>

Absolute px size prevents reader scaling; Calibri is not embedded so the declaration does nothing or triggers a fallback; hard-coded black breaks night mode. Replace with `p { margin: 0; text-indent: 1.2em; }` and omit font-family and color entirely, or embed a licensed font via `@font-face`.

</details>

### Interview Questions

**Q: How does writing CSS for an EPUB differ from writing it for a website?**
The reading system, not you, owns the viewport, the base font, the font size, the colours and the pagination, so ebook CSS has to be relative, defensive and minimal. I use em units, avoid fixed widths and positioning, add both `page-break-*` and `break-*` properties, never hard-code body colours, and test in at least Apple Books, Kindle Previewer and Kobo because each supports a different subset. A concrete example: a float-based two-column layout that looks fine in Chrome collapses on Kindle, so for a rate matrix I use a plain table with `width: 100%` and let it reflow.

**Q: What is your approach when a client insists on a specific font and layout that Kindle will not honour?**
I explain the reflowable contract: the reader controls presentation, and the store may strip the styling. Then I offer options with trade-offs. Embedding a licensed font gives the intended look on Apple Books and Kobo and, with Enhanced Typesetting, on modern Kindles, but the user can still switch it off. If pixel fidelity really is the requirement, the right deliverable is a fixed-layout EPUB or a PDF, at the cost of accessibility and phone readability. For a design-heavy cover or a certificate page I sometimes do a single fixed SVG page inside an otherwise reflowable book.

**Q: How do you handle tables wider than a phone screen?**
First I try to reduce the table: fewer columns, abbreviated headers, `font-size: .85em`, and `word-wrap` on long cells. If the table is inherently wide, like a 12-column title-insurance rate matrix, I render it as an image with a descriptive `alt` and a text summary, or rotate it into a landscape SVG page, and I add a linked accessible HTML version in the back matter. I never set fixed pixel widths on cells, because Kindle then clips the table and Apple Books shows a horizontal scroll that many readers do not discover.

## Fonts (@font-face, licensing, obfuscation)

Embedding fonts is how you keep a brand typeface, an Urdu Nastaliq face or a maths font consistent across devices. It is also the area where production teams most often break licences or validation, so learn the rules.

### Which formats to embed

EPUB 3.3 core media types for fonts are OpenType/TrueType (`font/otf`, `font/ttf`), WOFF (`font/woff`) and WOFF2 (`font/woff2`). WOFF2 gives 30 to 50 percent smaller files, which matters for CJK and Nastaliq fonts that run to several megabytes. Older readers on Adobe RMSDK do not understand WOFF, so publishers who target library apps ship OTF/TTF instead. Never ship both TTF and WOFF2 of the same face; that doubles the file size for no benefit.

### The @font-face rule

```css
@font-face {
  font-family: "Literata";
  font-weight: normal;
  font-style: normal;
  src: url("../fonts/Literata-Regular.woff2") format("woff2");
}
@font-face {
  font-family: "Literata";
  font-weight: bold;
  font-style: normal;
  src: url("../fonts/Literata-Bold.woff2") format("woff2");
}
body { font-family: "Literata", Georgia, serif; }
```

Declare one `@font-face` per weight and style combination and give them the same `font-family` name; the engine picks the right file when it sees `<strong>` or `<em>`. Always list a generic fallback. Paths are relative to the CSS file, so a stylesheet in `css/` reaches `fonts/` with `../fonts/`.

Each font file must be in the manifest:

```xml
<item id="f-reg" href="fonts/Literata-Regular.woff2" media-type="font/woff2"/>
<item id="f-bold" href="fonts/Literata-Bold.woff2" media-type="font/woff2"/>
```

### Licensing

Fonts are software and most desktop licences forbid embedding in ebooks. Before shipping a client's brand font, check:

| Source | Ebook embedding |
|---|---|
| SIL Open Font License (Literata, Noto, Crimson, Amiri, Noto Nastaliq Urdu) | Allowed, free |
| Google Fonts | Almost all OFL or Apache; check each family |
| Adobe Fonts (Typekit) | Not licensed for ebook embedding |
| Microsoft fonts shipped with Windows/Office (Calibri, Cambria, Arial) | Not licensed for redistribution |
| Commercial foundry (Monotype, Hoefler) | Requires a separate ePub licence per title |

When a client asks for Calibri, the professional answer is Carlito, the metric-compatible OFL font, or a different OFL face that matches the brand's feel.

### Obfuscation

Because an EPUB is a ZIP, an embedded font can be extracted and reused. The specification provides **font obfuscation**: XOR the first 1040 bytes of the font file with a 20-byte key derived from the publication's unique identifier (SHA-1 of the identifier with whitespace removed). The obfuscated file is unusable outside this EPUB, but reading systems can reverse it because they know the identifier. You declare it in `META-INF/encryption.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<encryption xmlns="urn:oasis:names:tc:opendocument:xmlns:container"
            xmlns:enc="http://www.w3.org/2001/04/xmlenc#">
  <enc:EncryptedData>
    <enc:EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/>
    <enc:CipherData>
      <enc:CipherReference URI="OEBPS/fonts/Literata-Regular.woff2"/>
    </enc:CipherData>
  </enc:EncryptedData>
</encryption>
```

Sigil and InDesign do this automatically; Calibre and pandoc do not. Only the IDPF algorithm above is safe for stores; the older Adobe algorithm (`http://ns.adobe.com/pdf/enc#RC`) breaks Kindle conversion. Obfuscation is not DRM: it satisfies most foundry licences that require the font to be "protected", nothing more.

### Apple's opt-in

Older Apple Books versions ignore embedded fonts unless the book says it uses them. Adding `META-INF/com.apple.ibooks.display-options.xml` is still common practice for backlist compatibility:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<display_options>
  <platform name="*"><option name="specified-fonts">true</option></platform>
</display_options>
```

> **Warning:** Kindle Previewer will accept a book with an unobfuscated font but will silently use its own fonts when a font is obfuscated with the Adobe scheme. When a client reports "the Urdu text is in the wrong font on Kindle", check `encryption.xml` first.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Font fallback</title>
  <style>
    @font-face {
      font-family: "BrandSerif";
      src: url("../fonts/does-not-exist.woff2") format("woff2");
    }
    body { margin: 1em; line-height: 1.5; }
    .brand { font-family: "BrandSerif", Georgia, "Times New Roman", serif; }
    .nofallback { font-family: "BrandSerif"; }
    code { background: #eee; padding: 0 .2em; }
  </style>
</head>
<body>
  <p class="brand">This paragraph names a missing font but lists Georgia as a fallback, so it renders in a serif face.</p>
  <p class="nofallback">This paragraph names only the missing font, so the browser uses its default and the design intent is lost.</p>
  <p>Lesson: every <code>font-family</code> in an EPUB ends with a generic family.</p>
</body>
</html>
```

### Quiz

1. Which font format gives the smallest files and is a core media type in EPUB 3.3?
- [ ] TTF
- [x] WOFF2
- [ ] EOT
> WOFF2 uses Brotli compression and is supported by all modern reading systems.

2. What does IDPF font obfuscation do?
- [x] XORs the first 1040 bytes with a key derived from the unique identifier
- [ ] Encrypts the whole font with the store's DRM key
- [ ] Converts the font to outlines
> It prevents casual extraction while letting readers reverse it using the identifier.

3. Can you embed Calibri from your Windows installation in a client ebook?
- [ ] Yes, it ships with Windows so it is free
- [x] No, Microsoft's licence does not permit redistribution; use Carlito instead
- [ ] Only if obfuscated
> Obfuscation does not change licensing; use an OFL metric-compatible font.

### Exercises

1. **Declare an Urdu font** — Write `@font-face` and a body rule for Noto Nastaliq Urdu with an appropriate line height.
<details><summary>Solution</summary>

```css
@font-face {
  font-family: "Noto Nastaliq Urdu";
  src: url("../fonts/NotoNastaliqUrdu-Regular.woff2") format("woff2");
}
body { font-family: "Noto Nastaliq Urdu", serif; line-height: 2.1; direction: rtl; }
```

Nastaliq glyphs stack diagonally, so a line height around 2 prevents descenders colliding with the next line.

</details>

2. **Write encryption.xml** — Two files need obfuscation: `EPUB/fonts/A.otf` and `EPUB/fonts/B.otf`.
<details><summary>Solution</summary>

```xml
<encryption xmlns="urn:oasis:names:tc:opendocument:xmlns:container" xmlns:enc="http://www.w3.org/2001/04/xmlenc#">
  <enc:EncryptedData><enc:EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/>
    <enc:CipherData><enc:CipherReference URI="EPUB/fonts/A.otf"/></enc:CipherData></enc:EncryptedData>
  <enc:EncryptedData><enc:EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/>
    <enc:CipherData><enc:CipherReference URI="EPUB/fonts/B.otf"/></enc:CipherData></enc:EncryptedData>
</encryption>
```

URIs are relative to the container root, not to the OPF.

</details>

### Interview Questions

**Q: Walk me through embedding a font in an EPUB from start to finish.**
First I confirm the licence allows ebook embedding and pick WOFF2 for size unless the client targets Adobe RMSDK library apps, in which case OTF. I add the files under `fonts/`, declare each in the manifest with the right media type, write one `@font-face` per weight and style with a generic fallback, and reference the family in CSS. If the licence requires protection I obfuscate with the IDPF algorithm and write `META-INF/encryption.xml`, and I add Apple's display-options file for older Apple Books. Finally I run EPUBCheck and open the book in Kindle Previewer and Apple Books, because Kindle silently discards Adobe-obfuscated fonts.

**Q: A foundry says their font is "not licensed for ePub". What do you tell the client?**
That embedding it would be a licence violation that could get the book removed from stores, and that the options are to buy an ePub licence from the foundry (typically priced per title), substitute an open font with similar design, or use the brand font only in the cover image and chapter-opener images where it is rasterised and not redistributed as a font file. I usually prepare a side-by-side of two OFL candidates so the client can decide quickly. For body text, most readers will override the font anyway, so the practical impact of substitution is smaller than clients expect.

**Q: How is font obfuscation implemented, and is it security?**
The key is the SHA-1 hash of the package's unique identifier with whitespace removed, and the first 1040 bytes of the font are XORed with that 20-byte key repeated. It is trivially reversible by anyone who reads the OPF, so it is not security or DRM; it exists so that the raw file is not a directly installable font, which satisfies the "must be protected" clause in many foundry licences. In Python the transform is about ten lines with `hashlib.sha1` and a bytes XOR loop, and the same function both obfuscates and de-obfuscates.

## Images & the cover (cover-image property, sizes)

Images make or break an ebook's file size, its store acceptance and its accessibility. This chapter covers formats, sizing, the cover, and the cover page pattern that works across reading systems.

### Formats

Core image media types are JPEG, PNG, GIF, SVG and, since EPUB 3.3, WebP. Use JPEG for photographs and covers (quality 80 to 85), PNG for screenshots and diagrams with flat colour or text, and SVG for line art and charts that should scale. Avoid WebP unless you know the target reader supports 3.3; Kindle converts it but older Apple Books versions show nothing.

### Sizing rules that matter

| Constraint | Value | Source |
|---|---|---|
| Cover ideal size | 2560 × 1600 px (1.6:1) | Amazon KDP |
| Cover minimum | 1000 px on the shortest side (KDP); 1400 px (Apple) | KDP, Apple Books |
| Cover recommended for Apple/Kobo | 1600 × 2400 px | Apple Books Asset Guide, Kobo |
| Interior image max | 5 MB per image and 4 million pixels for KDP; keep under 1 MB in practice | KDP guidelines |
| Reflowable interior width | 1200 to 1600 px wide | Practical: sharp on retina, small file |

Export images at 72 to 150 ppi with real pixel dimensions; readers ignore the ppi metadata and scale to the screen. Strip EXIF and colour profiles except when a photo book needs sRGB.

### The cover image

Mark the cover with the `cover-image` property in the manifest. This is what stores, library apps and Calibre display in their bookshelf:

```xml
<item id="cover-img" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>
```

For EPUB 2 compatibility many tools also add `<meta name="cover" content="cover-img"/>` in the metadata; EPUBCheck allows it.

### The cover page

Stores also want a cover page inside the book, the first spine item, so readers see the cover when they open it. The reliable pattern wraps the image in an SVG so it scales to any screen without cropping:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
  <title>Cover</title>
  <style type="text/css">
    body { margin: 0; padding: 0; text-align: center; }
    svg { max-height: 100%; }
  </style>
</head>
<body epub:type="cover">
  <section epub:type="cover" role="doc-cover" id="cover">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
         version="1.1" viewBox="0 0 1600 2400" preserveAspectRatio="xMidYMid meet"
         width="100%" height="100%" role="img" aria-label="Cover: Title Search Procedures Handbook">
      <image width="1600" height="2400" xlink:href="images/cover.jpg"/>
    </svg>
  </section>
</body>
</html>
```

Because the document contains inline SVG, its manifest item needs `properties="svg"`. The `viewBox` must match the pixel size of the image. Set `linear="no"` on the cover page in the spine for Kindle, which shows the cover from the `cover-image` item and would otherwise duplicate it.

### Interior images

```html
<figure>
  <img src="images/fig-2-1.png" alt="Flowchart of the title search escalation path"/>
  <figcaption>Figure 2.1 Escalation path</figcaption>
</figure>
```

CSS `img { max-width: 100%; height: auto; }` keeps images inside the screen. To control size relative to the screen use percentages on a wrapper (`figure { width: 60%; margin: 1em auto; }`) rather than pixel widths on the `img`. Every `<img>` needs `alt`; purely decorative images use `alt=""` plus `role="presentation"`.

### File size budget

Stores set limits (KDP 650 MB, Apple 2 GB) but delivery cost and download time punish big files: Amazon charges a delivery fee on the 70 percent royalty plan per megabyte. A 300-page manual with 40 screenshots should come in under 5 MB. Batch-optimise with `mozjpeg`, `pngquant`, `oxipng` or ImageMagick's `mogrify -resize 1400x -quality 82`.

> **Tip:** Keep the cover art as a separate file for the store upload as well as inside the EPUB. KDP, Apple and Kobo all want a standalone JPEG at upload time, and it need not be identical to the internal cover (the internal one can be smaller).

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Cover</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { text-align: center; background: #222; }
    svg { max-height: 100%; }
  </style>
</head>
<body>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 2400" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" role="img" aria-label="Cover">
    <rect width="1600" height="2400" fill="#4A235A"/>
    <rect x="120" y="120" width="1360" height="2160" fill="none" stroke="#d4b8e0" stroke-width="12"/>
    <text x="800" y="1000" fill="#fff" font-size="150" font-family="Georgia, serif" text-anchor="middle">Title Search</text>
    <text x="800" y="1200" fill="#fff" font-size="150" font-family="Georgia, serif" text-anchor="middle">Procedures</text>
    <text x="800" y="2100" fill="#d4b8e0" font-size="80" font-family="sans-serif" text-anchor="middle">Ali Raza</text>
  </svg>
</body>
</html>
```

### Quiz

1. Which manifest property identifies the cover image?
- [ ] `properties="cover"`
- [x] `properties="cover-image"`
- [ ] `role="cover"`
> The `cover-image` property marks the raster image stores and shelves display.

2. Why wrap the cover image in an SVG on the cover page?
- [x] It scales to any screen with `preserveAspectRatio` and no cropping
- [ ] SVG is the only format Kindle accepts
- [ ] It makes the file smaller
> The `viewBox` plus `xMidYMid meet` fits the whole image inside the viewport.

3. What is Amazon's recommended cover size?
- [ ] 800 × 600 px
- [x] 2560 × 1600 px, ratio 1.6:1
- [ ] 300 dpi A4
> KDP recommends 2560 × 1600 with at least 1000 px on the shortest side.

### Exercises

1. **Fix an oversized image** — A client supplies a 4200 × 6300 px, 9 MB scan of a rate table. Write the ImageMagick command and the XHTML figure.
<details><summary>Solution</summary>

```bash
magick rate-table.png -resize 1400x -strip -quality 85 images/rate-table.jpg
```

```html
<figure>
  <img src="images/rate-table.jpg" alt="Wyoming owner's policy rate table, coverage amounts against premiums"/>
  <figcaption>Table 4.2 Owner's policy rates</figcaption>
</figure>
```

</details>

2. **Manifest and spine for a cover** — Add the manifest items and spine entry for `cover.xhtml` (contains inline SVG) and `images/cover.jpg`.
<details><summary>Solution</summary>

```xml
<item id="cover-img" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>
<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" properties="svg"/>
...
<spine>
  <itemref idref="cover" linear="no"/>
```

</details>

### Interview Questions

**Q: How do you decide between JPEG, PNG and SVG for interior graphics?**
Photographs and anything with gradients go to JPEG at quality 80 to 85, which gives roughly a tenth of the PNG size. Screenshots, flowcharts and tables rendered as images go to PNG, quantised with pngquant to 8-bit when there are fewer than 256 colours, because JPEG artefacts blur text. Charts and line art that I can export as vectors go to SVG so they stay crisp at any zoom, with `properties="svg"` on the containing document if inline. I avoid WebP for now because older Apple Books builds render nothing, and I keep every interior image under about 1 MB and 1600 px wide.

**Q: Why do stores want both a cover-image manifest item and a cover page?**
The `cover-image` item is metadata: it is what the bookshelf thumbnail, the store listing generator and Calibre read, and it has to be a raster file. The cover page is content: it is what the reader sees when the book opens, and it is an XHTML spine item. Kindle generates its own cover display from the `cover-image` item and can show two covers if the page is linear, which is why I set `linear="no"` on the cover page. Apple Books and Kobo show the spine cover page. Having both, wired correctly, satisfies every store's checker.

**Q: What accessibility rules apply to images in an ebook?**
Every meaningful image needs an `alt` that conveys its purpose in one or two sentences, and complex images such as a rate matrix need a longer description, either in the surrounding text, a `<figcaption>`, or a linked description page, with `aria-describedby` pointing at it. Decorative images get `alt=""` and `role="presentation"`. Text must never exist only inside an image, so a scanned table always gets a real HTML table version somewhere. These are requirements of EPUB Accessibility 1.1 and WCAG 2 Level AA, and Ace by DAISY reports missing alt text as an error.

## Chapters, sections & the spine order

Structure is what separates a book from a pile of pages. This chapter shows how to model front matter, parts, chapters and back matter as files, how the spine expresses that order, and how cross-references and footnotes are wired so they survive reflow.

### The standard book skeleton

| Section | File(s) | epub:type | In spine |
|---|---|---|---|
| Cover | `cover.xhtml` | `cover` | yes, `linear="no"` |
| Title page | `title.xhtml` | `titlepage` | yes |
| Copyright | `copyright.xhtml` | `copyright-page` | yes |
| Contents | `nav.xhtml` | `toc` | yes (optional) |
| Preface | `preface.xhtml` | `preface` | yes |
| Parts and chapters | `part1.xhtml`, `ch01.xhtml` … | `part`, `chapter` | yes |
| Appendices | `app-a.xhtml` | `appendix` | yes |
| Glossary, index | `glossary.xhtml`, `index.xhtml` | `glossary`, `index` | yes |
| Notes | `notes.xhtml` | `endnotes` | yes or `linear="no"` |

Mark the front, body and back matter on `<body>`:

```html
<body epub:type="bodymatter">
  <section epub:type="chapter" role="doc-chapter" id="ch04">
    <h1><span class="num">4.</span> Rate calculation</h1>
```

Reading systems use `bodymatter` to decide where "start reading" lands and page-count estimates begin.

### Parts

A part is a page of its own that groups chapters. It gets its own file, `epub:type="part"`, and in the nav it becomes a parent `<li>` whose nested `<ol>` holds its chapters:

```html
<li><a href="part2.xhtml">Part II: Production</a>
  <ol>
    <li><a href="ch04.xhtml">4. Rate calculation</a></li>
    <li><a href="ch05.xhtml">5. Status reports</a></li>
  </ol>
</li>
```

### Spine order and linear

The spine is the exact order of files. The rule of thumb: everything a reader should page through is `linear="yes"` (the default); anything reached only by a link is `linear="no"`. Pop-up footnote pages, a large legal notice, and image-only description pages are typical non-linear items.

```xml
<spine toc="ncx">
  <itemref idref="cover" linear="no"/>
  <itemref idref="title"/>
  <itemref idref="copyright"/>
  <itemref idref="nav"/>
  <itemref idref="preface"/>
  <itemref idref="part1"/>
  <itemref idref="ch01"/>
  <itemref idref="ch02"/>
  <itemref idref="notes" linear="no"/>
</spine>
```

### Cross-references

Links between chapters use the file name plus a fragment: `<a href="ch02.xhtml#s2-1">section 2.1</a>`. Both the file and the id must exist or EPUBCheck raises `RSC-007` (missing file) or `RSC-012` (missing fragment). Use stable ids based on numbering, not generated ones like `_Toc12345`, which Word exports produce and which change on every save.

### Footnotes and pop-ups

EPUB 3 has a footnote pattern that Apple Books, Kobo and Thorium display as pop-ups:

```html
<p>The premium is computed on the full coverage amount.<a href="#fn1" epub:type="noteref" role="doc-noteref" id="ref1">1</a></p>

<aside id="fn1" epub:type="footnote" role="doc-footnote">
  <p><a href="#ref1">1.</a> Except in simultaneous-issue cases; see chapter 6.</p>
</aside>
```

Readers that support pop-ups hide the `aside` from the main flow and show it on tap; readers that do not simply render it in place, so put footnotes at the end of the chapter file. Kindle shows pop-ups only when the note is in the same file as the reference.

### Numbering and running heads

Ebooks have no page headers, so put the chapter number in the heading text. If you want the number styled separately, wrap it in a `<span>` as above rather than generating it with CSS counters, which several readers ignore and which screen readers do not announce.

> **Interview note:** Be ready to explain why you would not generate chapter numbers with CSS `counter-increment`: Kindle ignores generated content, and the number then disappears in the nav and for screen readers. Put real text in the document.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Footnote pattern</title>
  <style>
    body { font-family: Georgia, serif; margin: 1.2em; line-height: 1.5; }
    a[role="doc-noteref"] { vertical-align: super; font-size: .75em; text-decoration: none; }
    aside[role="doc-footnote"] { font-size: .9em; border-top: 1px solid #aaa; margin-top: 2em; padding-top: .5em; }
    aside:target { background: #f3e9f7; }
  </style>
</head>
<body>
  <section id="ch04">
    <h1><span class="num">4.</span> Rate calculation</h1>
    <p>The premium is computed on the full coverage amount.<a href="#fn1" role="doc-noteref" id="ref1">1</a></p>
    <p>Reissue credits apply when a prior policy is presented.<a href="#fn2" role="doc-noteref" id="ref2">2</a></p>
  </section>
  <aside id="fn1" role="doc-footnote"><p><a href="#ref1">1.</a> Except in simultaneous-issue cases; see chapter 6.</p></aside>
  <aside id="fn2" role="doc-footnote"><p><a href="#ref2">2.</a> Credits vary by state; consult the rate matrix.</p></aside>
</body>
</html>
```

### Quiz

1. What does `linear="no"` mean on a spine item?
- [x] The item is reachable by link but skipped when paging through
- [ ] The item is not in the manifest
- [ ] The item is hidden from the table of contents
> Non-linear items are auxiliary content such as pop-up notes or the cover page.

2. Which epub:type marks where the main text begins?
- [ ] `frontmatter`
- [x] `bodymatter`
- [ ] `chapter`
> Reading systems use `bodymatter` to set the start-reading location.

3. For Kindle pop-up footnotes to work, where must the note live?
- [x] In the same content file as the reference
- [ ] In a separate notes file
- [ ] In the nav document
> Kindle only pops notes that are in the same document as the `noteref`.

### Exercises

1. **Build a spine** — Files: cover, title, copyright, nav, ch01–ch03, appendix, notes. Write the spine with sensible linear values.
<details><summary>Solution</summary>

```xml
<spine>
  <itemref idref="cover" linear="no"/>
  <itemref idref="title"/>
  <itemref idref="copyright"/>
  <itemref idref="nav"/>
  <itemref idref="ch01"/>
  <itemref idref="ch02"/>
  <itemref idref="ch03"/>
  <itemref idref="appendix"/>
  <itemref idref="notes" linear="no"/>
</spine>
```

</details>

2. **Convert a Word footnote** — Word exported `<a href="#_ftn3">[3]</a>` and a `<div id="ftn3">` at the end. Rewrite as an EPUB 3 footnote pair.
<details><summary>Solution</summary>

```html
<a href="#fn3" id="ref3" epub:type="noteref" role="doc-noteref">3</a>
...
<aside id="fn3" epub:type="footnote" role="doc-footnote">
  <p><a href="#ref3">3.</a> Note text here.</p>
</aside>
```

Stable ids, semantic types, and a back-link so keyboard users can return.

</details>

### Interview Questions

**Q: How do you structure a 767-page handbook as an EPUB so it stays navigable and fast?**
One file per chapter, split further at H2 for any file over about 250 KB, with ids derived from section numbers so links are stable. Parts get their own pages and appear as parent entries in a two-level nav; the full TOC is also rendered as a spine page. Front matter and back matter are tagged with `epub:type` so the book opens at chapter 1 and screen readers can jump to the glossary. Footnotes stay in the chapter file as `aside` elements for pop-up support. The result on one project was 62 spine items, none larger than 200 KB, with page turns instant even on an older Kindle Paperwhite.

**Q: What breaks when Word-generated ids are kept in an EPUB?**
Word emits ids such as `_Toc41234567` and `_ftnref12` that change every time the TOC is regenerated, so any nav or cross-reference built on them breaks on the next revision and EPUBCheck floods you with `RSC-012`. They are also not meaningful to screen readers or to anyone maintaining the book. In my conversion script I rewrite ids to a scheme like `ch04-s2` and `fn04-3`, and I rewrite every `href` that pointed at the old id in the same pass, then verify with EPUBCheck that zero fragment errors remain.

**Q: Explain the EPUB 3 footnote pattern and its trade-offs.**
A `noteref` link points at an `aside` with `epub:type="footnote"`; readers that support the pattern show the note as a pop-up and hide the aside from the flow, and readers that do not simply render the aside where it sits. The trade-off is placement: for pop-ups on Kindle the note must be in the same file, which means chapter-end notes rather than a consolidated notes file, and the aside appears at the chapter end on readers without pop-up support. For academic books with hundreds of notes I keep chapter-end asides and add a consolidated notes page as a non-linear spine item for readers who prefer to browse them.

## Building & zipping correctly (mimetype first, stored)

You can hand-write every file perfectly and still ship a broken book if the ZIP is built wrong. This chapter gives you three reliable ways to build the archive and a checklist to run before you send anything to a client or a store.

### Method 1: the zip command (macOS, Linux, Git Bash)

Run from the folder that contains `mimetype`, `META-INF` and `OEBPS`:

```bash
rm -f ../manual.epub
zip -X0 ../manual.epub mimetype
zip -Xr9D ../manual.epub META-INF OEBPS
```

The flags matter: `-X` strips extra file attributes (which would move the mimetype bytes and cause `PKG-005`), `-0` stores the mimetype uncompressed, `-r` recurses, `-9` compresses the rest maximally, and `-D` omits directory entries, which some readers reject. Two commands are needed because the mimetype must be added first and with different compression.

### Method 2: Python zipfile (Windows-friendly, scriptable)

```python
import os, zipfile

def build_epub(src_dir, out_path):
    with zipfile.ZipFile(out_path, "w") as zf:
        zf.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip",
                    compress_type=zipfile.ZIP_STORED)
        for root, _, files in os.walk(src_dir):
            for name in sorted(files):
                full = os.path.join(root, name)
                rel = os.path.relpath(full, src_dir).replace(os.sep, "/")
                if rel == "mimetype":
                    continue
                zf.write(full, rel, compress_type=zipfile.ZIP_DEFLATED)

build_epub("build/manual", "dist/manual.epub")
```

Using `ZipInfo("mimetype")` with no date gives a fixed timestamp and no extra fields, so the bytes at offset 30 are exactly right. Everything else is deflated.

### Method 3: let a tool do it

Sigil (File > Save), Calibre's `ebook-edit` and pandoc all write correct archives. Use them when you are not scripting; script when the book is rebuilt repeatedly.

### Verify the archive

```bash
unzip -l manual.epub | head -5
head -c 60 manual.epub | od -c | head -3
```

The first listing line must be `mimetype` with size 20; the byte dump must show `mimetypeapplication/epub+zip` starting at byte 30. Then run EPUBCheck:

```bash
java -jar epubcheck.jar manual.epub
```

A clean run prints `No errors or warnings detected`. EPUBCheck 5 requires Java 11 or newer.

### Pre-delivery checklist

| Check | How |
|---|---|
| mimetype first, stored, no newline | `unzip -lv` shows `Stored` and size 20 |
| No `.DS_Store`, `Thumbs.db`, `__MACOSX` | `unzip -l` and delete before zipping |
| No directory entries | `-D` flag, or Python method |
| Every file in manifest and vice versa | EPUBCheck `OPF-003` / `RSC-001` |
| `dcterms:modified` updated | Script sets it on every build |
| Opens in Thorium, Apple Books, Kindle Previewer, Calibre | Manual test |
| File under store limits | KDP 650 MB, Kobo 100 MB recommended |

### Unzipping for edits

To edit a delivered EPUB by hand: `unzip -o book.epub -d book/`, edit, then rebuild with Method 1 or 2. Never re-zip with a right-click "Compress" in Finder or Explorer; both add junk entries and compress the mimetype.

> **Warning:** Windows Explorer's "Send to > Compressed folder" always produces an invalid EPUB. On Windows use 7-Zip's command line (`7z a -tzip -mx0 book.epub mimetype` then `7z a -tzip -mx9 book.epub META-INF OEBPS`) or the Python script above.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>ZIP header check</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    input { margin: .5em 0; }
    pre { background: #f4f0f7; padding: .75em; }
  </style>
</head>
<body>
  <h2>Check the first 60 bytes of an .epub</h2>
  <p>Pick any .epub file; nothing is uploaded, the check runs in your browser.</p>
  <input type="file" id="f" accept=".epub,.zip"/>
  <pre id="out">Waiting for a file…</pre>
  <script>
    document.getElementById("f").addEventListener("change", async e => {
      const file = e.target.files[0];
      const buf = new Uint8Array(await file.slice(0, 60).arrayBuffer());
      const txt = Array.from(buf).map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : ".").join("");
      const ok = txt.slice(30, 58) === "mimetypeapplication/epub+zip";
      const method = buf[8] | (buf[9] << 8);
      document.getElementById("out").textContent =
        txt + "\n\n" + (ok ? "OK: mimetype is first and at the right offset" : "BAD: mimetype not first or has extra fields") +
        "\nCompression method: " + (method === 0 ? "0 (stored, correct)" : method + " (must be 0)");
    });
  </script>
</body>
</html>
```

### Quiz

1. Which zip flags add the mimetype correctly?
- [x] `zip -X0 book.epub mimetype`
- [ ] `zip -r9 book.epub mimetype`
- [ ] `zip -j book.epub mimetype`
> `-X` removes extra fields and `-0` stores without compression.

2. Why must the mimetype be added in a separate command?
- [ ] zip cannot add text files with folders
- [x] It needs a different compression level and must be the first entry
- [ ] EPUBCheck requires two ZIP comments
> Entry order and per-file compression are only controllable this way.

3. What does EPUBCheck print for a fully valid book?
- [ ] `Validation complete`
- [x] `No errors or warnings detected`
- [ ] `PASS`
> That exact phrase is what clients and store checkers look for.

### Exercises

1. **PowerShell build** — Write a PowerShell script using 7-Zip to build `manual.epub` correctly.
<details><summary>Solution</summary>

```powershell
Set-Location build\manual
Remove-Item ..\manual.epub -ErrorAction SilentlyContinue
& "C:\Program Files\7-Zip\7z.exe" a -tzip -mx0 ..\manual.epub mimetype
& "C:\Program Files\7-Zip\7z.exe" a -tzip -mx9 -r ..\manual.epub META-INF OEBPS
java -jar ..\..\tools\epubcheck.jar ..\manual.epub
```

</details>

2. **Diagnose PKG-005** — EPUBCheck says `PKG-005: The mimetype file has an extra field of length 28`. What caused it and how do you fix it?
<details><summary>Solution</summary>

The archive tool stored Unix timestamps or macOS metadata in the mimetype entry's extra field, shifting the bytes. Rebuild with `zip -X0` (the `-X` flag) or the Python `ZipInfo` method, which writes no extra fields.

</details>

### Interview Questions

**Q: A client says the EPUB you sent will not open on their iPad but opens on your laptop. What is your first hypothesis?**
That the ZIP container is malformed, most often a compressed or misplaced mimetype, because Apple Books validates the container strictly while Calibre and many desktop readers are lenient. I check with `unzip -lv` that `mimetype` is first, stored and 20 bytes, and I look for junk entries such as `__MACOSX` or directory records. If the container is fine, the next suspects are an XHTML well-formedness error in the first spine item or a font encryption declaration Apple cannot resolve. I keep EPUBCheck in the pipeline precisely so that this class of bug never reaches a client.

**Q: Why do you script the build instead of saving from Sigil?**
Because a handbook is rebuilt dozens of times as the client sends revisions, and every rebuild must update `dcterms:modified`, regenerate the nav from the headings, optimise new images, and produce an archive with the mimetype first. A Python script does all of that deterministically and runs EPUBCheck at the end, so a rebuild takes seconds and cannot forget a step. Sigil is excellent for inspecting and hand-fixing a specific file, and I use it for that, but manual saves introduced the kind of inconsistencies that cost me a store rejection early on.

**Q: What does the `-D` flag do and why does it matter?**
`-D` tells zip not to create entries for directories themselves, only for files. Directory entries are legal in ZIP but some reading systems and older EPUBCheck versions treat them as undeclared resources, and the specification says the container should not contain them. Python's `zipfile.write` on files only never creates them, which is another reason I prefer the scripted build. It is a small flag, but it is the difference between a clean EPUBCheck run and a page of `OPF-003` warnings.

# LEVEL: Advanced

## Fixed-layout EPUB (rendition:layout, viewport meta, page-spread)

A fixed-layout (FXL) EPUB tells the reading system "do not reflow; each content document is a page of exactly this size". Under the hood it is the same container, package and XHTML, plus a few `rendition:` metadata properties defined in the EPUB 3 Fixed Layout specification (now part of EPUB 3.3) and a `viewport` meta in every page.

### Package metadata

```xml
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id"
         prefix="rendition: http://www.idpf.org/vocab/rendition/#">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    …
    <meta property="rendition:layout">pre-paginated</meta>
    <meta property="rendition:orientation">landscape</meta>
    <meta property="rendition:spread">both</meta>
  </metadata>
```

| Property | Values | Meaning |
|---|---|---|
| `rendition:layout` | `reflowable` (default), `pre-paginated` | Turns FXL on for the whole book |
| `rendition:orientation` | `auto`, `portrait`, `landscape` | Preferred device orientation |
| `rendition:spread` | `none`, `landscape`, `portrait`, `both`, `auto` | When to show two pages side by side |
| `rendition:flow` | `paginated`, `scrolled-continuous`, `scrolled-doc`, `auto` | How pages are presented |

The `prefix` attribute on `<package>` is required for the `rendition:` vocabulary in EPUB 3.0; in 3.1 and later it is reserved and declared automatically, but including it never hurts and keeps EPUBCheck quiet across versions.

### The viewport meta

Every pre-paginated content document must declare its page size in CSS pixels:

```html
<head>
  <title>Page 4</title>
  <meta name="viewport" content="width=1200, height=1600"/>
  <link rel="stylesheet" type="text/css" href="css/fxl.css"/>
</head>
```

All pages in a spread should share the same dimensions. Common choices are 1200 × 1600 (portrait 3:4) and 1600 × 1200 (landscape). Apple's guidelines prefer matching the iPad's aspect ratio; Kindle accepts any size and scales.

### Page spreads

For a two-page spread (a children's book with an illustration across both pages), mark each spine item with its side:

```xml
<spine>
  <itemref idref="cover" properties="rendition:page-spread-center"/>
  <itemref idref="p02" properties="page-spread-left"/>
  <itemref idref="p03" properties="page-spread-right"/>
  <itemref idref="p04" properties="page-spread-left"/>
  <itemref idref="p05" properties="page-spread-right"/>
</spine>
```

`page-spread-left` and `page-spread-right` are core spine properties; `rendition:page-spread-center` needs the rendition prefix. You can also override layout per item with `rendition:layout-reflowable` or `rendition:layout-pre-paginated`, which is how a mostly reflowable cookbook can contain one fixed map page.

### Page content

An FXL page is usually a full-bleed image with absolutely positioned live text on top, or an SVG:

```html
<body>
  <div class="page">
    <img class="bg" src="images/p04.jpg" alt="Rate matrix diagram"/>
    <p class="caption" style="top: 1420px; left: 100px;">Figure 4: Wyoming rates</p>
  </div>
</body>
```

```css
html, body { margin: 0; padding: 0; width: 1200px; height: 1600px; overflow: hidden; }
.page { position: relative; width: 1200px; height: 1600px; }
.bg { position: absolute; top: 0; left: 0; width: 1200px; height: 1600px; }
.caption { position: absolute; margin: 0; font-size: 36px; color: #fff; }
```

In FXL, pixel units are correct: the reading system scales the whole 1200 × 1600 canvas to fit the screen, so proportions hold. Keep text live (real characters) rather than flattened into the image whenever possible so it is searchable and readable by assistive technology.

### When FXL is the wrong choice

FXL text cannot be resized, does not reflow on phones, and is rejected by many library accessibility requirements. For anything text-heavy, clients are better served by reflowable EPUB plus a PDF for print. Amazon converts FXL into a "Print Replica"-like experience with limited features, and Kobo and Google Play support it but do not promote it.

> **Tip:** Export the page images at exactly the viewport size (1200 × 1600) and set JPEG quality 80; a 32-page picture book then lands around 8 to 12 MB. Do not embed 4000-px art; readers downscale it anyway and the delivery fee on Amazon scales with file size.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Page 4</title>
  <meta name="viewport" content="width=600, height=800"/>
  <style>
    html, body { margin: 0; padding: 0; }
    .page { position: relative; width: 600px; height: 800px; overflow: hidden; background: linear-gradient(#e9d8f0, #4A235A); }
    .title { position: absolute; top: 80px; left: 0; width: 600px; text-align: center; color: #fff; font: bold 48px Georgia, serif; margin: 0; }
    .caption { position: absolute; top: 700px; left: 40px; width: 520px; color: #fff; font: 22px sans-serif; margin: 0; }
    .box { position: absolute; top: 200px; left: 100px; width: 400px; height: 400px; background: #fff; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="page">
    <p class="title">Page 4</p>
    <div class="box"></div>
    <p class="caption">Every element is absolutely positioned inside a 600 × 800 canvas that the reader scales to fit.</p>
  </div>
</body>
</html>
```

### Quiz

1. Which metadata turns on fixed layout for the whole publication?
- [ ] `<meta property="rendition:flow">paginated</meta>`
- [x] `<meta property="rendition:layout">pre-paginated</meta>`
- [ ] `<meta name="fixed" content="true"/>`
> `pre-paginated` is the layout value; `flow` only controls scrolling.

2. What must every FXL content document contain in its head?
- [x] A `viewport` meta with width and height
- [ ] A `<base>` element
- [ ] `rendition:spread`
> The viewport tells the reader the page's canvas size in CSS pixels.

3. Which spine property places a page on the right of a spread?
- [ ] `rendition:spread-right`
- [x] `page-spread-right`
- [ ] `linear="right"`
> `page-spread-left/right` are spine itemref properties.

### Exercises

1. **Mixed book** — A reflowable manual needs one fixed-layout org-chart page (`orgchart.xhtml`, 1600 × 1200). Write the spine entry and the head of that page.
<details><summary>Solution</summary>

```xml
<itemref idref="orgchart" properties="rendition:layout-pre-paginated rendition:orientation-landscape"/>
```

```html
<head>
  <title>Org chart</title>
  <meta name="viewport" content="width=1600, height=1200"/>
</head>
```

The package must declare the `rendition:` prefix (or be EPUB 3.2+).

</details>

2. **Spread map** — Pages 2–5 form two spreads with page 1 a centred cover. Write the spine.
<details><summary>Solution</summary>

```xml
<spine>
  <itemref idref="p1" properties="rendition:page-spread-center"/>
  <itemref idref="p2" properties="page-spread-left"/>
  <itemref idref="p3" properties="page-spread-right"/>
  <itemref idref="p4" properties="page-spread-left"/>
  <itemref idref="p5" properties="page-spread-right"/>
</spine>
```

</details>

### Interview Questions

**Q: When does a client actually need fixed layout, and how do you push back when they do not?**
They need it when the page design is the content: picture books, comics, cookbooks with plated layouts, coffee-table books, and occasionally a certificate or form page. They do not need it for manuals, reports or novels, even if they love their InDesign layout, because FXL text cannot be resized, phones show it at postage-stamp size, and accessibility reviewers reject it. I show the client their own book on a phone in both formats; that usually settles it. When a few pages genuinely need fixed design, I use per-item `rendition:layout-pre-paginated` overrides inside a reflowable book.

**Q: How are FXL pages rendered, and what does that mean for units?**
The reading system creates a canvas of the size declared in the viewport meta, renders the XHTML into it, and scales the whole canvas uniformly to fit the screen or half of a spread. That means pixel units are correct and stable in FXL, unlike reflowable, and absolutely positioned elements keep their relationships at any zoom. The consequence is that all pages of a spread must share the same viewport size or the spread looks mismatched, and images should be exported at the canvas size to avoid wasted bytes.

**Q: What are the accessibility implications of FXL and how do you mitigate them?**
Text cannot be resized and reading order can be arbitrary if elements are positioned freely, so screen readers may read captions before headings. I keep text live rather than flattened into images, order the DOM in logical reading order regardless of visual position, give every image an alt, and add a reflowable alternative or an accessibility summary in the metadata stating the limitations. EPUB Accessibility 1.1 allows FXL but requires this honesty, and Ace by DAISY will flag missing alt text and hazards regardless of layout.

## Media overlays & audio/video

Media overlays synchronise recorded narration with the text so that a reading system highlights each sentence as it is spoken. They are the technology behind read-aloud children's books and DAISY-style accessible textbooks. Audio and video can also be embedded directly with HTML5 elements; both topics share the same core media types.

### Core audio and video types

EPUB 3.3 core audio types are MP3 (`audio/mpeg`) and AAC in MP4 (`audio/mp4`). Video has no core type; H.264 in MP4 and VP8/VP9 in WebM are the practical choices, and because they are not core you must supply a fallback or accept that some readers will not play them. Apple Books plays MP4 video; Kindle strips video entirely (KDP rejects files with `<video>`); Kobo and Thorium support MP4 and WebM.

```html
<audio controls="controls" src="audio/ch01.mp3">
  <p>Your reader does not support audio. <a href="audio/ch01.mp3">Download the narration.</a></p>
</audio>
<video controls="controls" width="640" height="360" poster="images/demo-poster.jpg">
  <source src="video/demo.mp4" type="video/mp4"/>
  <p>Video unavailable in this reader.</p>
</video>
```

Media files go in the manifest with their media type; remote media (an `https://` URL) requires `properties="remote-resources"` on the content document.

### The SMIL overlay file

A media overlay is a SMIL 3.0 document that pairs text fragments with audio clips:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<smil xmlns="http://www.w3.org/ns/SMIL" xmlns:epub="http://www.idpf.org/2007/ops" version="3.0">
  <body>
    <seq id="seq1" epub:textref="ch01.xhtml" epub:type="bodymatter chapter">
      <par id="par1">
        <text src="ch01.xhtml#s1"/>
        <audio src="audio/ch01.mp3" clipBegin="0:00:00.000" clipEnd="0:00:03.480"/>
      </par>
      <par id="par2">
        <text src="ch01.xhtml#s2"/>
        <audio src="audio/ch01.mp3" clipBegin="0:00:03.480" clipEnd="0:00:07.910"/>
      </par>
    </seq>
  </body>
</smil>
```

Each `par` links one element id in the content document (a sentence `<span id="s1">`, a paragraph, or a heading) to a clip range in the audio. Clip times are in SMIL clock values. The content document therefore needs an id on every synchronised element, which is usually generated by a script that splits paragraphs into sentence spans.

### Wiring it into the package

```xml
<manifest>
  <item id="ch01" href="ch01.xhtml" media-type="application/xhtml+xml" media-overlay="ch01_smil"/>
  <item id="ch01_smil" href="ch01.smil" media-type="application/smil+xml"/>
  <item id="ch01_audio" href="audio/ch01.mp3" media-type="audio/mpeg"/>
</manifest>
<metadata>
  <meta property="media:duration" refines="#ch01_smil">0:04:12.500</meta>
  <meta property="media:duration">0:04:12.500</meta>
  <meta property="media:active-class">-epub-media-overlay-active</meta>
  <meta property="media:playback-active-class">-epub-media-overlay-playing</meta>
</metadata>
```

The content item points at its overlay with `media-overlay`. Metadata must give the duration of each overlay and of the whole publication, and EPUBCheck verifies that they are well-formed clock values and that the sum matches. The active class is applied by the reader to the element currently being spoken so you can style the highlight:

```css
.-epub-media-overlay-active { background-color: #fff3a0; }
```

### Producing the timings

Manual timing is impractical beyond a few pages. Production teams use forced alignment: **aeneas** (Python, open source) takes the text and the audio and produces a SMIL or JSON with sentence boundaries; commercial tools such as Hindenburg and the DAISY Pipeline do the same. A typical pipeline is: split text into sentence spans with ids, record narration per chapter, run aeneas to align, generate SMIL, compute durations with `ffprobe`, write metadata.

```bash
python -m aeneas.tools.execute_task ch01.mp3 ch01.txt \
  "task_language=eng|is_text_type=plain|os_task_file_format=smil|os_task_file_smil_audio_ref=audio/ch01.mp3|os_task_file_smil_page_ref=ch01.xhtml" \
  ch01.smil
```

### Reading system support

Apple Books, Thorium, Colibrio and most education platforms play overlays. Kindle and Google Play ignore them, and Kobo has partial support. The book still works everywhere; the narration simply is not available where unsupported.

> **Warning:** Audio dominates file size. A 4-hour narration at 64 kbps mono MP3 is about 110 MB, which is fine for Apple but over Kobo's recommended limit and expensive under KDP delivery fees. Encode at 48 to 64 kbps mono for speech and never ship WAV.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Overlay highlight simulation</title>
  <style>
    body { font-family: Georgia, serif; margin: 1.2em; line-height: 1.6; }
    .-epub-media-overlay-active { background: #fff3a0; }
    button { font-family: sans-serif; margin-bottom: 1em; }
  </style>
</head>
<body>
  <button onclick="play()">Simulate read-aloud</button>
  <p>
    <span id="s1">Every order begins with a legal description.</span>
    <span id="s2">The searcher locates the last vesting deed.</span>
    <span id="s3">Chain gaps longer than thirty days are flagged.</span>
  </p>
  <script>
    const pars = [ ["s1", 0, 2200], ["s2", 2200, 4300], ["s3", 4300, 6600] ];
    function play() {
      pars.forEach(([id, begin, end]) => {
        setTimeout(() => document.getElementById(id).classList.add("-epub-media-overlay-active"), begin);
        setTimeout(() => document.getElementById(id).classList.remove("-epub-media-overlay-active"), end);
      });
    }
  </script>
</body>
</html>
```

### Quiz

1. Which file format describes a media overlay?
- [ ] WebVTT
- [x] SMIL
- [ ] JSON
> EPUB media overlays are SMIL 3.0 documents with `par` elements pairing text and audio.

2. How does a content document declare its overlay?
- [x] With a `media-overlay` attribute on its manifest item
- [ ] With a `<link>` in its head
- [ ] Via `epub:type="overlay"`
> The manifest item for the XHTML points at the SMIL item id.

3. Which audio formats are core media types in EPUB 3.3?
- [ ] WAV and FLAC
- [x] MP3 and AAC in MP4
- [ ] Ogg Vorbis only
> Only MP3 and MP4/AAC are guaranteed; others need fallbacks.

### Exercises

1. **Write a par** — Sentence `<span id="s7">` runs from 12.4 s to 15.9 s in `audio/ch02.mp3`. Write the SMIL `par`.
<details><summary>Solution</summary>

```xml
<par id="par7">
  <text src="ch02.xhtml#s7"/>
  <audio src="audio/ch02.mp3" clipBegin="0:00:12.400" clipEnd="0:00:15.900"/>
</par>
```

</details>

2. **Compute durations** — Chapter overlays last 3:10.000, 4:05.500 and 2:44.500. Write the metadata.
<details><summary>Solution</summary>

```xml
<meta property="media:duration" refines="#ch01_smil">0:03:10.000</meta>
<meta property="media:duration" refines="#ch02_smil">0:04:05.500</meta>
<meta property="media:duration" refines="#ch03_smil">0:02:44.500</meta>
<meta property="media:duration">0:10:00.000</meta>
```

</details>

### Interview Questions

**Q: Describe the pipeline for producing a read-aloud EPUB.**
I start from the final reflowable EPUB and split every paragraph into sentence spans with stable ids using a script. The narrator records one file per chapter; I normalise loudness and encode to 64 kbps mono MP3. I run aeneas forced alignment per chapter to get sentence timings, generate SMIL files from that output, compute durations with ffprobe, and write the `media:duration` and active-class metadata into the OPF. I then test in Thorium and Apple Books, checking that highlights track the audio and that page turns follow playback. EPUBCheck validates clock values and duration sums, which catches most wiring mistakes.

**Q: What happens on readers that do not support media overlays?**
Nothing breaks: the SMIL and audio files are ignored, the text reads normally, and the file still validates. The costs are file size and, on Amazon, delivery fees for audio the Kindle user cannot hear, so for a KDP-only edition I strip the overlay in the build. If the client wants an audible option on Kindle, that is a separate audiobook product via ACX, not an EPUB feature.

**Q: Can you embed video in an EPUB and would you?**
Technically yes with the HTML5 `<video>` element, H.264 MP4 for Apple and WebM as a second source for open readers, plus a poster image and a text fallback. In practice I discourage it: Kindle rejects the file, the video multiplies file size, and support is inconsistent. A better pattern for training manuals is a poster image linking to a hosted video, which works on every reader, keeps the EPUB small, and can be updated without re-releasing the book.

## Accessibility (semantics, epub:type, ARIA, schema.org accessibility metadata)

Accessible ebooks are a legal requirement in the EU (European Accessibility Act, in force June 2025), a purchasing requirement for universities and libraries, and simply better books. EPUB Accessibility 1.1 (W3C, 2023) defines what "accessible EPUB" means: content conforms to WCAG 2 Level AA and the package carries discovery metadata describing the book's accessibility.

### Structure and semantics

Most of accessibility is good structure: one `h1` per document, headings in order, real lists and tables, `lang` attributes, `alt` text, and structural semantics that let assistive technology and reading systems understand the parts of the book. Use both vocabularies where they overlap:

| Purpose | `epub:type` | ARIA role |
|---|---|---|
| Chapter | `chapter` | `doc-chapter` |
| Footnote reference | `noteref` | `doc-noteref` |
| Footnote | `footnote` | `doc-footnote` |
| Table of contents | `toc` | `doc-toc` |
| Page break marker | `pagebreak` | `doc-pagebreak` |
| Glossary | `glossary` | `doc-glossary` |
| Cover | `cover` | `doc-cover` |

Page break markers let a student with a print copy and a screen-reader user talk about the same page:

```html
<span epub:type="pagebreak" role="doc-pagebreak" id="pg127" aria-label="127"></span>
```

Pair them with a `page-list` nav and the `dc:source` metadata giving the print ISBN.

### Tables and images

Tables need `<th scope="col">` headers and, if complex, a `<caption>`. Data must never be an image only. Images need `alt`; complex ones need an extended description via `aria-describedby` or a linked `<details>`.

```html
<table>
  <caption>Table 4.2 Owner's policy premium by coverage amount</caption>
  <thead><tr><th scope="col">Coverage (USD)</th><th scope="col">Premium (USD)</th></tr></thead>
  <tbody><tr><td>100,000</td><td>575</td></tr></tbody>
</table>
```

### Language and reading order

Set `xml:lang` and `lang` on `<html>`, and mark inline language changes: `<span lang="ur">عنوان</span>`. Screen readers switch voices on `lang`. Ensure DOM order equals reading order; CSS must not reorder content.

### Accessibility metadata

The package must state what the book offers using schema.org properties:

```xml
<meta property="schema:accessMode">textual</meta>
<meta property="schema:accessMode">visual</meta>
<meta property="schema:accessModeSufficient">textual</meta>
<meta property="schema:accessibilityFeature">structuralNavigation</meta>
<meta property="schema:accessibilityFeature">tableOfContents</meta>
<meta property="schema:accessibilityFeature">readingOrder</meta>
<meta property="schema:accessibilityFeature">alternativeText</meta>
<meta property="schema:accessibilityFeature">displayTransformability</meta>
<meta property="schema:accessibilityFeature">pageNavigation</meta>
<meta property="schema:accessibilityHazard">none</meta>
<meta property="schema:accessibilitySummary">This publication conforms to WCAG 2.1 Level AA. All images have alternative text; tables are marked up with headers; page numbers match the 2026 print edition.</meta>
<link rel="dcterms:conformsTo" href="EPUB-A11Y-11_WCAG-21-AA"/>
<meta property="a11y:certifiedBy">Ali Raza Document Services</meta>
```

`accessMode` lists the senses needed to consume the content; `accessModeSufficient` lists combinations that suffice (a text-only book is sufficient with `textual`, so it works for blind readers). The conformance link uses the 1.1 identifiers: `EPUB-A11Y-11_WCAG-20-A`, `EPUB-A11Y-11_WCAG-20-AA`, `EPUB-A11Y-11_WCAG-21-AA` and so on. Stores such as Apple and Kobo display this metadata on the product page.

### Testing tools

- **Ace by DAISY** (`npm install -g @daisy/ace`; `ace book.epub -o report`) runs axe rules across every content document and reports missing alt, heading order, colour contrast and metadata, with an HTML report.
- **SMART** (DAISY's online tool) walks you through the WCAG checklist and generates the metadata block.
- **EPUBCheck** with `-u` shows accessibility usage messages (`ACC-*`).
- Manual test: open in Thorium with NVDA or VoiceOver and navigate by heading.

> **Interview note:** Interviewers ask "what makes an EPUB accessible?" The strong answer covers three layers: structure (headings, alt, lang, tables), semantics (`epub:type` plus DPUB-ARIA), and discovery metadata (schema.org properties plus a `dcterms:conformsTo` claim), verified with Ace.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Accessible table and page break</title>
  <style>
    body { font-family: Georgia, serif; margin: 1.2em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #999; padding: .3em .5em; text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    caption { font-weight: bold; text-align: left; margin-bottom: .4em; }
    [role="doc-pagebreak"] { display: block; text-align: right; color: #888; font-size: .8em; }
    [role="doc-pagebreak"]::before { content: "p. " attr(aria-label); }
  </style>
</head>
<body>
  <span role="doc-pagebreak" id="pg127" aria-label="127"></span>
  <h1>4. Rate calculation</h1>
  <table>
    <caption>Table 4.2 Owner's policy premium by coverage amount</caption>
    <thead><tr><th scope="col">Coverage (USD)</th><th scope="col">Premium (USD)</th></tr></thead>
    <tbody>
      <tr><td>100,000</td><td>575</td></tr>
      <tr><td>250,000</td><td>1,050</td></tr>
      <tr><td>500,000</td><td>1,725</td></tr>
    </tbody>
  </table>
  <p lang="ur" dir="rtl">یہ جملہ اردو میں ہے۔</p>
</body>
</html>
```

### Quiz

1. Which metadata property declares the senses needed to read the book?
- [ ] `schema:accessibilityFeature`
- [x] `schema:accessMode`
- [ ] `dcterms:conformsTo`
> `accessMode` lists textual, visual, auditory or tactile as applicable.

2. What is Ace by DAISY?
- [x] A command-line accessibility checker for EPUB producing an HTML report
- [ ] A DRM tool
- [ ] Apple's cover validator
> `ace book.epub` runs axe rules across every document and checks metadata.

3. What conformance string claims EPUB Accessibility 1.1 with WCAG 2.1 AA?
- [ ] `WCAG2.1AA`
- [x] `EPUB-A11Y-11_WCAG-21-AA`
- [ ] `http://www.idpf.org/epub/a11y/accessibility.html#wcag-aa`
> That is the 1.1 identifier; the URL form was used by version 1.0.

### Exercises

1. **Metadata block** — Write minimal accessibility metadata for a text-only SOP manual with no images, claiming WCAG 2.0 AA.
<details><summary>Solution</summary>

```xml
<meta property="schema:accessMode">textual</meta>
<meta property="schema:accessModeSufficient">textual</meta>
<meta property="schema:accessibilityFeature">structuralNavigation</meta>
<meta property="schema:accessibilityFeature">tableOfContents</meta>
<meta property="schema:accessibilityFeature">readingOrder</meta>
<meta property="schema:accessibilityFeature">displayTransformability</meta>
<meta property="schema:accessibilityHazard">none</meta>
<meta property="schema:accessibilitySummary">Text-only manual with structured headings and a full table of contents.</meta>
<link rel="dcterms:conformsTo" href="EPUB-A11Y-11_WCAG-20-AA"/>
```

</details>

2. **Fix the image** — `<img src="chart.png">` shows premium trends by year. Make it accessible.
<details><summary>Solution</summary>

```html
<figure>
  <img src="chart.png" alt="Line chart of average owner's policy premium, 2019 to 2026" aria-describedby="chart-desc"/>
  <figcaption id="chart-desc">Premiums rose from 540 USD in 2019 to 610 USD in 2026, with the steepest increase in 2022.</figcaption>
</figure>
```

</details>

### Interview Questions

**Q: What are the three layers of an accessible EPUB?**
Content structure, semantics and discovery metadata. Structure means proper headings in order, real lists and tables with header cells, alt text, language tags and a DOM that matches reading order. Semantics means `epub:type` and DPUB-ARIA roles so readers and screen readers know a chapter from a footnote, plus page-break markers linked to a page-list nav. Discovery metadata means schema.org `accessMode`, `accessModeSufficient`, `accessibilityFeature`, `accessibilityHazard` and `accessibilitySummary`, plus a `dcterms:conformsTo` claim. I verify all three with Ace by DAISY and a manual VoiceOver pass, and I do not claim conformance I have not tested.

**Q: Why does the European Accessibility Act matter to an ebook producer in Pakistan?**
Because it applies to ebooks sold in the EU regardless of where they were produced, and from June 2025 publishers selling there must supply accessible files with the metadata to prove it. Clients on Fiverr and Upwork who publish to Apple Books or Kobo in Europe now ask for "EAA-compliant EPUB", which in practice means EPUB Accessibility 1.1 with WCAG 2.1 AA, Ace-clean, with the schema.org block filled in. Being able to deliver that is a differentiator, and it also improves Kindle and Google Play discoverability because the same metadata surfaces on product pages.

**Q: How do you handle a scanned 767-page handbook that arrives as images?**
Images of text are not accessible, so I OCR with ABBYY FineReader or Tesseract, proof the text, and rebuild it as real XHTML with headings, lists and tables; the scans are discarded or kept only for figures with alt text. I insert `pagebreak` markers matching the print pages and build a page-list nav so references to print page numbers still work. It is more work than wrapping images in an FXL, but the FXL version would fail Ace, fail library procurement, and be unreadable on phones, so I quote the rebuild and explain why.

## EPUBCheck errors & how to fix them

EPUBCheck is the reference validator maintained by the W3C EPUB 3 Community Group and used by Apple, Kobo, Google Play and most distributors before they accept a file. Learning to read its messages is the fastest way to become the person who fixes rejected books.

### Running it

```bash
java -jar epubcheck.jar book.epub                 # validate a packaged file
java -jar epubcheck.jar book_dir -mode exp        # validate an unzipped folder
java -jar epubcheck.jar book_dir -mode exp -save  # and write book_dir.epub
java -jar epubcheck.jar book.epub -u              # include usage (best-practice) messages
java -jar epubcheck.jar book.epub --json report.json
java -jar epubcheck.jar book.epub -e              # errors only, quiet warnings
```

EPUBCheck 5.x validates EPUB 3.3 and needs Java 11+. Sigil (via its plugin menu) and Calibre's editor (Check Book) bundle it, but the command line gives the exact output stores see.

### Reading a message

```text
ERROR(RSC-005): book.epub/OEBPS/ch03.xhtml(41,12): Error while parsing file: element "p" not allowed here; expected the element end-tag or element "a", "abbr", …
```

Each line has a severity, a message id, the file with line and column, and a description. Fix the first error in a file first; parse errors cascade and later messages often vanish.

### The errors you will meet every week

| ID | Message gist | Cause and fix |
|---|---|---|
| `PKG-006` | Mimetype entry missing or not first | Rebuild ZIP with `zip -X0` mimetype first |
| `PKG-007` | Mimetype contains wrong type | File must be exactly `application/epub+zip`, no newline |
| `PKG-005` | Mimetype has extra field | Use `-X` or Python `ZipInfo` |
| `RSC-005` | Schema error at line/col | Invalid nesting, unknown attribute, block inside inline; fix the XHTML |
| `RSC-001` | Referenced file not found | Path or case mismatch between manifest and ZIP |
| `RSC-007` | Referenced resource could not be found | Broken `href`/`src` in content |
| `RSC-012` | Fragment identifier not defined | Nav or link points at a missing id |
| `RSC-006` | Remote resource reference not allowed | Image/CSS from `https://`; copy it into the container |
| `OPF-003` | Item exists in container, not declared in manifest | Add to manifest or delete file |
| `OPF-014` / `OPF-015` | Property `svg`/`mathml`/`scripted` should (not) be declared | Add or remove the manifest `properties` |
| `OPF-030` | `unique-identifier` not found | The attribute must match a `dc:identifier` id |
| `OPF-054` / `OPF-073` | Bad date value / external DTD in DOCTYPE | Use `dcterms:modified` format; use `<!DOCTYPE html>` |
| `HTM-004` | Irregular DOCTYPE | Replace legacy XHTML 1.1 DOCTYPE |
| `NAV-003` | Page list missing while pagebreaks present | Add `page-list` nav (usage in 3.2, error in some profiles) |
| `CSS-008` | Error while parsing CSS | Unclosed brace or invalid value; run a CSS linter |
| `MED-003` | Non-core media type without fallback | Add a `fallback` attribute or convert the file |

### Warnings that stores treat as errors

Apple rejects books with `OPF-003`. Kobo and Google Play warn but publish. Amazon's Kindle Previewer has its own checks and ignores EPUBCheck warnings but fails on any container error. The safe policy is zero errors and zero warnings.

### A fixing workflow

1. Run EPUBCheck with `--json` and sort messages by file.
2. Fix container and package errors first (`PKG-*`, `OPF-*`); they block everything else.
3. Fix parse errors (`RSC-005`) top to bottom in each file with an XML-aware editor.
4. Fix references (`RSC-007`, `RSC-012`) by grepping for the broken target.
5. Re-run. Repeat until `No errors or warnings detected`.

Automate step 1 in a build script so a broken build never gets sent:

```python
import subprocess, sys
r = subprocess.run(["java", "-jar", "epubcheck.jar", "dist/manual.epub", "-e"], capture_output=True, text=True)
print(r.stdout)
if "No errors" not in r.stdout:
    sys.exit("EPUBCheck failed; see above")
```

> **Tip:** `RSC-005` with the text "attribute 'x' not allowed here" usually comes from Word or InDesign exports that leave `xmlns:o`, `style=""` or `epub:type` on elements where it is illegal. A regex clean-up pass over the export removes hundreds of them at once.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Message triage</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    input { width: 100%; padding: .5em; font-family: monospace; }
    pre { background: #f4f0f7; padding: .75em; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h2>Paste an EPUBCheck line to get the likely fix</h2>
  <input id="line" value="ERROR(RSC-012): book.epub/OEBPS/nav.xhtml(18,42): Fragment identifier is not defined."/>
  <pre id="out"></pre>
  <script>
    const fixes = {
      "PKG-006": "Rebuild the ZIP: add mimetype first with zip -X0.",
      "PKG-007": "mimetype must contain exactly application/epub+zip with no newline.",
      "RSC-005": "XHTML/XML schema error: open the file at the given line/column and fix nesting or attributes.",
      "RSC-007": "A src/href points to a file that does not exist; check path and case.",
      "RSC-012": "A link targets an id that does not exist; add the id or fix the href.",
      "OPF-003": "A file in the ZIP is not in the manifest; add an <item> or delete it.",
      "OPF-014": "The document uses inline SVG/MathML/script; add properties= on its manifest item.",
      "RSC-006": "Remote resource: copy the file into the EPUB and reference it locally."
    };
    function triage() {
      const m = document.getElementById("line").value.match(/\(([A-Z]{3}-\d{3})\)/);
      const id = m ? m[1] : null;
      document.getElementById("out").textContent = id ? (id + ": " + (fixes[id] || "Look up this id in the EPUBCheck message list.")) : "No message id found.";
    }
    document.getElementById("line").addEventListener("input", triage);
    triage();
  </script>
</body>
</html>
```

### Quiz

1. Which EPUBCheck option validates an unzipped folder?
- [ ] `-dir`
- [x] `-mode exp`
- [ ] `--folder`
> Expanded mode validates a directory; add `-save` to package it.

2. `RSC-012` refers to what kind of problem?
- [ ] A missing file
- [x] A fragment identifier (id) that does not exist
- [ ] A bad ZIP header
> It is the classic broken TOC link.

3. What should you fix first when a file shows twenty errors?
- [x] The first parse error, since later errors often cascade from it
- [ ] The last error
- [ ] The warnings
> One unclosed tag can produce a page of consequent messages.

### Exercises

1. **Diagnose** — EPUBCheck reports `OPF-014: The property "svg" should be declared in the OPF file` for `cover.xhtml`. Write the fix.
<details><summary>Solution</summary>

Add the property to the manifest item:

```xml
<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" properties="svg"/>
```

</details>

2. **Batch fix ids** — A nav has 60 `RSC-012` errors because Word ids changed. Describe a script approach.
<details><summary>Solution</summary>

```python
import re, pathlib
ids = set()
for f in pathlib.Path("OEBPS").glob("*.xhtml"):
    ids |= set(re.findall(r'id="([^"]+)"', f.read_text(encoding="utf-8")))
nav = pathlib.Path("OEBPS/nav.xhtml").read_text(encoding="utf-8")
for href in re.findall(r'href="([^"#]+)#([^"]+)"', nav):
    if href[1] not in ids:
        print("missing:", href)
```

Then regenerate the nav from the current headings rather than patching each link.

</details>

### Interview Questions

**Q: A distributor rejects a file with "EPUBCheck errors" but gives no detail. What do you do?**
I run the current EPUBCheck 5 locally with `--json` so I have the same messages the distributor's pipeline saw, then group by message id. Container and package errors are fixed first because they block everything downstream; then I fix parse errors top-down per file; then broken references. I re-run until the output is clean, including warnings, because Apple treats some warnings as fatal. Finally I open the book in Thorium and Kindle Previewer, since validity is not the same as looking right. On a recent job the whole rejection came down to a single `OPF-003` caused by a stray `.DS_Store` file.

**Q: What is the difference between EPUBCheck errors, warnings and usage messages?**
Errors are specification violations that make the file non-conformant; a store can refuse it. Warnings are things that are allowed but likely mistakes, such as a duplicate manifest entry or an unused resource. Usage messages, shown only with `-u`, are best-practice hints including many accessibility checks. My policy is zero errors and zero warnings before delivery and reviewing usage messages for accessibility jobs. I explain to clients that "passes EPUBCheck" is a floor, not a guarantee that the book renders well on every device.

**Q: Which EPUBCheck error did you find hardest to track down and how did you solve it?**
`RSC-005` on a file where the line and column pointed at a perfectly normal `<p>`, because the real problem was an unclosed `<span>` three hundred lines earlier that made the parser think everything after it was inline content. The lesson was to fix the first error in a file and re-run, and to use an XML-aware editor that shows tag balance. I now run `xmllint --noout` on every content file before EPUBCheck, which reports unbalanced tags with a clearer message.

## Tooling: Sigil, Calibre, pandoc, ebooklib (Python)

Nobody hand-writes an entire EPUB. You will use a small set of tools, each good at one part of the job, and glue them together with scripts.

### Sigil: the editor

Sigil (free, GPL, Windows/macOS/Linux) opens an EPUB as a project, shows the book browser, and lets you edit XHTML and CSS with live preview. Key features: the **Book Browser** (right-click to add semantics such as cover, toc, chapter), **Tools > Table of Contents > Generate Table of Contents** (builds nav and NCX from headings), **Tools > Reports** (lists unused files, image sizes, links), **F7 / Plugins > EpubCheck** to validate, **Tools > Add Cover**, and the **Split at cursor** command for breaking large chapters. Sigil keeps the mimetype and container correct on save. It also obfuscates fonts (Tools > Manage Fonts). Use it for inspection, targeted fixes and one-off books.

### Calibre: conversion and polishing

Calibre is a library manager, but its command line is a serious production tool:

```bash
ebook-convert manual.docx manual.epub --epub-version=3 \
  --chapter="//h:h1" --level1-toc="//h:h1" --level2-toc="//h:h2" \
  --cover=cover.jpg --authors="Ali Raza" --title="Title Search Procedures" \
  --extra-css="p{text-indent:1.2em;margin:0}"
ebook-polish --subset-fonts --compress-images --add-soft-hyphens manual.epub manual-polished.epub
ebook-edit manual.epub
```

`ebook-convert` reads DOCX, HTML, Markdown, ODT and PDF (badly) and writes EPUB 2 or 3. Its DOCX importer maps Word styles to CSS and keeps footnotes. `ebook-polish` subsets embedded fonts (cutting a 4 MB Urdu font to a few hundred KB), compresses images and can update metadata and the cover without a full conversion. Calibre's output is verbose and needs a clean-up pass for stores, but it is the fastest path from DOCX to a working draft.

### pandoc: from Markdown or DOCX with control

pandoc writes clean EPUB 3 from Markdown, DOCX, HTML or LaTeX:

```bash
pandoc manual.md -o manual.epub --toc --toc-depth=2 --split-level=1 \
  --epub-cover-image=cover.jpg --css=style.css \
  --metadata title="Title Search Procedures" --metadata author="Ali Raza" \
  --metadata lang=en-US --epub-metadata=meta.xml
```

`--split-level` (called `--epub-chapter-level` before pandoc 3.0) decides which heading level starts a new file. `--epub-metadata` takes a file of extra `dc:` and `meta` elements, which is where the accessibility block goes. Because pandoc's output is minimal and clean, it passes EPUBCheck without a clean-up pass, so I use it as the default engine for text-heavy books, converting DOCX to Markdown first (`pandoc in.docx -t gfm -o in.md --extract-media=media`) so the content can be version-controlled.

### ebooklib: full control in Python

When the book is generated from data (a rate handbook per state, a report per client), ebooklib builds it programmatically:

```python
from ebooklib import epub

book = epub.EpubBook()
book.set_identifier("urn:uuid:8f1c2b1e-3a4d-4c5e-9f60-1a2b3c4d5e6f")
book.set_title("Title Search Procedures")
book.set_language("en")
book.add_author("Ali Raza")
book.set_cover("cover.jpg", open("cover.jpg", "rb").read())

css = epub.EpubItem(uid="style", file_name="css/style.css", media_type="text/css",
                    content=open("style.css", "rb").read())
book.add_item(css)

chapters = []
for n, (title, html) in enumerate([("1. Scope", "<h1>1. Scope</h1><p>…</p>")], start=1):
    c = epub.EpubHtml(title=title, file_name=f"ch{n:02d}.xhtml", lang="en")
    c.content = html
    c.add_item(css)
    book.add_item(c)
    chapters.append(c)

book.toc = chapters
book.add_item(epub.EpubNcx())
book.add_item(epub.EpubNav())
book.spine = ["nav"] + chapters
epub.write_epub("manual.epub", book, {})
```

ebooklib writes a correct container, nav and NCX; you supply XHTML fragments. Its output needs `dcterms:modified` (added automatically) and passes EPUBCheck when your fragments are well-formed, so generate them with a proper HTML library or from Markdown via `markdown`/`pandoc`, not string concatenation.

### Choosing

| Task | Tool |
|---|---|
| Inspect or hand-fix a client file | Sigil |
| Quick DOCX to EPUB draft, font subsetting, image compression | Calibre |
| Clean EPUB from Markdown/DOCX with version control | pandoc |
| Generated or data-driven books, batch production | ebooklib or a custom builder |
| Validate | EPUBCheck, Ace |

> **Tip:** Whatever the tool, keep the source (Markdown or DOCX), the build script and the stylesheet in a Git repository per client. Rebuilding a 300-page manual after a "small change" then takes one command instead of an afternoon in an editor.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Markdown to XHTML fragment</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    textarea { width: 100%; height: 8em; font-family: monospace; }
    .preview { border: 1px solid #ccc; padding: 1em; font-family: Georgia, serif; }
    pre { background: #f4f0f7; padding: .5em; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h2>A tiny Markdown converter (what pandoc does, simplified)</h2>
  <textarea id="src"># 1. Scope
This manual applies to all **data-processing** agents.

## 1.1 Audience
Team leads &amp; quality checkers.</textarea>
  <h3>XHTML</h3><pre id="code"></pre>
  <h3>Preview</h3><div class="preview" id="prev"></div>
  <script>
    function convert(md) {
      return md.split(/\n\n+/).map(block => {
        block = block.trim();
        if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
        if (block.startsWith("# ")) return `<h1>${block.slice(2)}</h1>`;
        return `<p>${block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
      }).join("\n");
    }
    function run() {
      const x = convert(document.getElementById("src").value);
      document.getElementById("code").textContent = x;
      document.getElementById("prev").innerHTML = x;
    }
    document.getElementById("src").addEventListener("input", run); run();
  </script>
</body>
</html>
```

### Quiz

1. Which Calibre tool subsets embedded fonts and compresses images without reconverting?
- [ ] `ebook-convert`
- [x] `ebook-polish`
- [ ] `ebook-meta`
> `ebook-polish` edits the existing EPUB in place for fonts, images and metadata.

2. What pandoc option controls which heading level starts a new XHTML file?
- [x] `--split-level` (formerly `--epub-chapter-level`)
- [ ] `--toc-depth`
- [ ] `--chapter`
> `--toc-depth` only affects the nav; `--split-level` affects file splitting.

3. In ebooklib, which two items must be added for a valid TOC?
- [ ] `EpubCover` and `EpubCss`
- [x] `EpubNav` and `EpubNcx`
- [ ] `EpubToc` only
> `EpubNav` writes nav.xhtml; `EpubNcx` writes the EPUB 2 NCX for compatibility.

### Exercises

1. **pandoc build** — Write a pandoc command that produces EPUB 3 from `handbook.md`, splits at H1, uses `book.css`, includes `cover.jpg` and reads extra metadata from `a11y.xml`.
<details><summary>Solution</summary>

```bash
pandoc handbook.md -o handbook.epub --toc --toc-depth=2 --split-level=1 \
  --css=book.css --epub-cover-image=cover.jpg --epub-metadata=a11y.xml \
  --metadata lang=en-US
java -jar epubcheck.jar handbook.epub
```

</details>

2. **ebooklib chapter loop** — Given a dict `{"Wyoming": "<h1>Wyoming</h1>…", "Utah": "<h1>Utah</h1>…"}`, add each as a chapter and build the spine.
<details><summary>Solution</summary>

```python
chapters = []
for i, (state, html) in enumerate(states.items(), start=1):
    c = epub.EpubHtml(title=state, file_name=f"state-{i:02d}.xhtml", lang="en")
    c.content = html
    book.add_item(c)
    chapters.append(c)
book.toc = chapters
book.spine = ["nav"] + chapters
```

</details>

### Interview Questions

**Q: Compare Calibre and pandoc for converting a DOCX manual to EPUB.**
Calibre's `ebook-convert` gets a working EPUB in one command and handles Word footnotes, images and tables reasonably, but its output carries Calibre-specific classes and inline styles that stores dislike and that make later edits painful. pandoc produces minimal, semantic XHTML with a clean stylesheet and predictable file splitting, and it lets me keep the source as Markdown under version control, but it drops some Word formatting such as text boxes and complex tables. For client handbooks I convert DOCX to Markdown with pandoc, clean the Markdown once, and then every rebuild is pandoc plus EPUBCheck. I use Calibre's `ebook-polish` afterwards for font subsetting and image compression, which pandoc does not do.

**Q: When do you write your own builder with ebooklib instead of using a converter?**
When the book is data-driven or repeated: a rate handbook with one chapter per state generated from a spreadsheet, a monthly production report delivered as EPUB, or a series of 30 client manuals with the same structure. The content comes from templates rendered with Jinja2 into XHTML fragments, ebooklib assembles the package, nav and NCX, and my script adds accessibility metadata, obfuscates fonts and runs EPUBCheck. The first book takes longer than a Calibre conversion; the thirtieth takes seconds and is identical in quality.

**Q: What does Sigil do better than any command-line tool?**
Looking. Sigil shows the book tree, lets me click a chapter, see the rendered preview next to the code, jump from an EPUBCheck message to the exact line, and try a CSS change live. Its Reports tool finds unused images and oversized files in one screen, and its TOC generator is the quickest way to rebuild a nav from headings on a one-off job. I do not use it as the source of truth for scripted projects, but for a client who sends "here is my EPUB, something is wrong", Sigil plus EPUBCheck is where I start.

# LEVEL: Expert

## Store requirements (KDP/Kindle Previewer, Apple Books, Kobo, Google Play)

A valid EPUB is necessary but not sufficient. Each store runs its own ingestion pipeline with its own rules on covers, metadata, file size, fonts and content, and each converts or re-packages your file. Knowing these rules is what lets you promise a client "it will be accepted first time".

### Amazon KDP and Kindle

KDP accepts EPUB (recommended), DOCX and KPF (from Kindle Create). MOBI upload was retired in 2021 and KindleGen in 2020; the tool now is **Kindle Previewer 3**, which converts your EPUB to KFX, shows it on simulated devices (Kindle E-reader, Fire tablet, Kindle app on phone), reports conversion errors and warnings, and exports a `.kpf`. Key rules from the Kindle Publishing Guidelines:

- Cover: JPEG or TIFF, ideal 2560 × 1600, ratio 1.6:1, minimum 1000 px on the short side, under 50 MB, RGB.
- Inside the EPUB, mark the cover with `cover-image`; do not also put it as a linear page or Kindle shows it twice.
- Provide a `toc` nav and a `bodymatter` landmark so the start reading location is correct; Kindle also honours the NCX.
- No `<video>`, no scripts; forms and JavaScript are rejected.
- Maximum file 650 MB; the delivery fee on the 70 percent plan is charged per MB after conversion, so images are money.
- Enhanced Typesetting (KFX) supports embedded fonts, drop caps, hyphenation and pop-up footnotes when the note is in the same file.
- Amazon flags "spelling errors" and "typos" via its quality checker; run a spell check before upload to avoid the warning email.

### Apple Books

Apple requires EPUB (reflowable or FXL), ingested through Apple Books for Authors, iTunes Producer or an aggregator. Apple runs EPUBCheck and rejects on any error and some warnings (notably `OPF-003`). Cover: standalone JPEG/PNG with the short side at least 1400 px, recommended 1600 × 2400. Apple also requires a `dc:title` that matches the store listing exactly, and honours the accessibility metadata on the product page. Apple Books is the strictest reading system on XHTML well-formedness and font declarations, so it is the first device test.

### Kobo

Kobo Writing Life accepts EPUB 2 and 3 and converts every file to **KEPUB**, its internal format, by wrapping each sentence in a `<span class="koboSpan">` so the reader can track position. This means heavy inline styling or unusual nesting can break; keep markup simple. Cover recommendation 1600 × 2400; file size should stay under 100 MB. Kobo supports embedded fonts, FXL and the `page-progression-direction` attribute for RTL books, which makes it a good target for Urdu titles.

### Google Play Books

Google accepts EPUB through the Partner Center and requires EPUBCheck-clean files; it also accepts a PDF alongside for the print-replica version. Cover 1600 × 2560 recommended. Google supports FXL and media overlays partially; JavaScript is stripped. Google is the most tolerant on warnings but the strictest on ISBN metadata: a `dc:identifier` that claims `urn:isbn:` must be a valid 13-digit ISBN with a correct check digit.

### Comparison

| Requirement | KDP | Apple Books | Kobo | Google Play |
|---|---|---|---|---|
| Validator | Kindle Previewer + own checks | EPUBCheck, strict | EPUBCheck | EPUBCheck |
| Cover ideal | 2560 × 1600 (1.6:1) | 1600 × 2400 | 1600 × 2400 | 1600 × 2560 |
| Max size | 650 MB | 2 GB | 100 MB recommended | 2 GB |
| Embedded fonts | Yes (KFX) | Yes | Yes | Yes |
| Video | No | Yes | Limited | Limited |
| JavaScript | No | Yes | No | No |
| FXL | Yes | Yes | Yes | Yes |
| Media overlays | No | Yes | Partial | Partial |
| ISBN required | No (ASIN) | No | No | No, but validated if present |

### One file or several

Aim for a single master EPUB that passes everywhere, then derive variants only when a store forces it: strip video and overlays for KDP, and keep Apple's display-options file out of the KDP build if Kindle Previewer complains. Generate the variants from the same source with build flags, never by hand-editing copies.

> **Warning:** Do not include `<meta name="cover" content="…">` alone without `properties="cover-image"`. KDP accepts the old EPUB 2 meta, Apple ignores it, and Kobo needs the property. Use the property and keep the meta only for backward compatibility.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Cover size checker</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    label { display: inline-block; width: 6em; }
    input { width: 6em; }
    table { border-collapse: collapse; margin-top: 1em; }
    td, th { border: 1px solid #aaa; padding: .3em .6em; }
    .ok { color: #1b7f3b; } .bad { color: #b00020; }
  </style>
</head>
<body>
  <h2>Does this cover meet each store's minimum?</h2>
  <p><label>Width px</label><input id="w" type="number" value="1600"/> <label>Height px</label><input id="h" type="number" value="2400"/></p>
  <table><thead><tr><th>Store</th><th>Rule</th><th>Result</th></tr></thead><tbody id="rows"></tbody></table>
  <script>
    const rules = [
      ["KDP", "short side ≥ 1000 px, ratio near 1.6:1", (w,h) => Math.min(w,h) >= 1000 && Math.abs(h/w - 1.6) < 0.15],
      ["Apple Books", "short side ≥ 1400 px", (w,h) => Math.min(w,h) >= 1400],
      ["Kobo", "recommended 1600 × 2400 or larger", (w,h) => w >= 1600 && h >= 2400],
      ["Google Play", "recommended 1600 × 2560 or larger", (w,h) => w >= 1600 && h >= 2560]
    ];
    function check() {
      const w = +document.getElementById("w").value, h = +document.getElementById("h").value;
      document.getElementById("rows").innerHTML = rules.map(([s, r, f]) =>
        `<tr><td>${s}</td><td>${r}</td><td class="${f(w,h) ? "ok" : "bad"}">${f(w,h) ? "pass" : "below recommendation"}</td></tr>`).join("");
    }
    document.querySelectorAll("input").forEach(i => i.addEventListener("input", check)); check();
  </script>
</body>
</html>
```

### Quiz

1. Which tool does Amazon provide to preview and convert an EPUB for Kindle?
- [ ] KindleGen
- [x] Kindle Previewer 3
- [ ] Kindle Create only
> KindleGen was retired in 2020; Kindle Previewer 3 converts to KFX and simulates devices.

2. What does Kobo do to every uploaded EPUB?
- [x] Converts it to KEPUB by wrapping sentences in `koboSpan` elements
- [ ] Rejects EPUB 2 files
- [ ] Strips the cover
> The KEPUB conversion is why simple, clean markup matters for Kobo.

3. Which store is strictest about EPUBCheck warnings?
- [ ] Google Play
- [x] Apple Books
- [ ] KDP
> Apple rejects on errors and on warnings such as OPF-003.

### Exercises

1. **Build variants** — Describe the build flags you would implement for a master EPUB delivered to KDP and Apple.
<details><summary>Solution</summary>

A `--target` flag: `kdp` strips `<video>`, SMIL overlays and the Apple display-options file, keeps fonts unobfuscated or IDPF-obfuscated, and adds an EPUB 2 `meta name="cover"`; `apple` keeps overlays and video, adds `com.apple.ibooks.display-options.xml`, and fails the build on any EPUBCheck warning. Both share the same source, stylesheet and nav generator.

</details>

2. **ISBN check** — Write Python that validates a 13-digit ISBN check digit before writing `urn:isbn:` metadata.
<details><summary>Solution</summary>

```python
def isbn13_ok(s):
    d = [int(c) for c in s if c.isdigit()]
    if len(d) != 13: return False
    total = sum(x * (1 if i % 2 == 0 else 3) for i, x in enumerate(d[:12]))
    return (10 - total % 10) % 10 == d[12]

print(isbn13_ok("9780306406157"))  # True
```

</details>

### Interview Questions

**Q: A client wants the same book on KDP, Apple, Kobo and Google. How do you plan the deliverables?**
One master EPUB 3 built from a single source, validated with EPUBCheck to zero errors and warnings, and tested in Apple Books, Kindle Previewer and Kobo's desktop app. From that master a script derives a KDP variant without video or overlays, because Kindle rejects video and ignores overlays but charges delivery fees for their bytes. Cover art is delivered as a separate 1600 × 2400 JPEG plus a 2560 × 1600 crop for KDP. Metadata is filled once in a spreadsheet and injected into the OPF and into the store upload forms so titles and contributor names match exactly, which avoids Apple's metadata-mismatch rejections.

**Q: Why does Kindle sometimes show the cover twice and how do you prevent it?**
Kindle generates the cover display from the manifest item with `properties="cover-image"` and then, if the cover XHTML page is a linear spine item, it also renders that page, so the reader sees two covers. The fix is to keep the cover page in the spine with `linear="no"`, or to omit it for the KDP build. Apple Books, by contrast, shows the spine cover page and uses the cover-image item only for the bookshelf, so both must exist in the master.

**Q: What are Amazon's delivery fees and how do they change your production choices?**
On the 70 percent royalty plan Amazon charges a per-megabyte delivery fee for the converted file on every sale, so a 30 MB illustrated manual can lose a significant share of a low-priced book's royalty. That is why I resize interior images to at most 1600 px wide, use JPEG quality 80 to 85, subset fonts with `ebook-polish`, and strip audio for the KDP edition. I show clients the file size before and after optimisation together with the estimated fee at their price point, which makes the trade-off concrete.

## Converting from DOCX/InDesign & cleaning generated markup

Most client books arrive as Word documents or InDesign packages, not as clean XHTML. Converters produce working but ugly markup, and the difference between an amateur and a professional EPUB is the clean-up pass.

### What Word exports look like

Word's "Save as Web Page, Filtered" and most DOCX converters emit markup like this:

```html
<p class="MsoNormal" style="margin-bottom:0cm;text-align:justify;line-height:normal">
  <span style="font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif">Every order begins</span>
  <span style="font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;font-weight:bold"> with </span>
  <span style="font-size:11.0pt">a legal description.</span>
</p>
<h1><a name="_Toc41234567"></a>2. Search procedure</h1>
```

Problems: inline styles on every run, named entities, meaningless `MsoNormal` classes, anchor elements with Word-generated names, sequences of spans that should be one paragraph, headings that are actually bold paragraphs, and manual line breaks used for spacing.

### A cleaning pipeline

1. **Convert with a style-aware tool.** pandoc (`pandoc in.docx -t html5 --wrap=none --extract-media=media -o out.html`) or Calibre map Word paragraph styles to elements: "Heading 1" becomes `<h1>`, "Quote" becomes `<blockquote>`. Direct formatting is lost, which is what you want.
2. **Fix the source first.** Before conversion, in Word: apply real heading styles to headings, convert manual numbering to list styles, replace spaces used for indentation, and put every image inline (not floating). Ten minutes in Word saves an hour in XHTML.
3. **Regex passes** for what remains: strip `style=""` and `class="Mso…"`, remove empty `<span>`, collapse consecutive `<br/>`, rename `_Toc` ids to stable ids, replace `&nbsp;` with `&#160;` or a real space.
4. **Structure**: wrap chapters in `<section epub:type="chapter">`, add ids to headings, split into files at H1.
5. **Validate** with `xmllint` then EPUBCheck.

```python
import re
html = open("out.html", encoding="utf-8").read()
html = re.sub(r'\s(style|lang|class)="[^"]*"', "", html)          # drop inline styling
html = re.sub(r"<span>(.*?)</span>", r"\1", html, flags=re.S)      # unwrap bare spans
html = re.sub(r"<p>\s*(&#160;|&nbsp;|\s)*</p>", "", html)          # empty paragraphs
html = re.sub(r'<a name="_Toc\d+"></a>', "", html)                # Word TOC anchors
html = re.sub(r"(<br\s*/>\s*){2,}", "<br/>", html)                # runs of breaks
open("clean.html", "w", encoding="utf-8").write(html)
```

Run the class-stripping regex only after you have converted the classes you need (for example `class="Note"` to `<aside class="note">`).

### Word features that need special handling

| Word feature | What converters do | What to do |
|---|---|---|
| Footnotes | pandoc: `<a href="#fn1" class="footnote-ref">`, notes in a `<section class="footnotes">` | Rewrite to `epub:type="noteref"`/`footnote` pattern per chapter |
| Tables with merged cells | Usually preserved with `rowspan`/`colspan` | Add `<th scope>` and `<caption>`; check width on phone |
| Text boxes and shapes | Dropped or rendered as images | Recreate as `<aside>` with real text |
| Fields (page refs, TOC) | Static text | Delete Word TOC; regenerate nav |
| Tracked changes | May export deleted text | Accept all changes before converting |
| Equations | OMML lost or images | Convert to MathML with pandoc (`--mathml`) and add `properties="mathml"` |
| Drop caps, columns | Lost | Reimplement with CSS `::first-letter` if wanted |

### InDesign exports

InDesign's File > Export > EPUB (Reflowable) is better than Word when the designer used paragraph and character styles with the Export Tagging panel set (each style mapped to a tag and class). Enable "Split Document" at a paragraph style, "Use Existing Image" for optimised assets, and check "Include Document Metadata". The output still needs clean-up: InDesign writes classes like `Basic-Paragraph`, embeds fonts obfuscated with its own choice (choose IDPF), and generates one CSS file per document. InDesign's FXL export is very good and is the standard route for picture books.

### Verifying nothing was lost

Compare the text of the source and the EPUB: `pandoc in.docx -t plain` versus the concatenated XHTML text through `lynx -dump` or a BeautifulSoup script, then `diff`. Count headings, footnotes, tables and images in both and reconcile. On a 767-page handbook this comparison caught 14 missing footnotes that a converter had silently dropped from a table cell.

> **Tip:** Keep the cleaned HTML or Markdown as the new source of truth and ask the client for future changes as a change list rather than a new DOCX. Reconverting a fresh DOCX every round repeats the whole clean-up.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Word markup cleaner</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    textarea { width: 100%; height: 9em; font-family: monospace; font-size: 12px; }
    pre { background: #f4f0f7; padding: .5em; white-space: pre-wrap; font-size: 12px; }
  </style>
</head>
<body>
  <h2>Strip Word cruft with regular expressions</h2>
  <textarea id="src">&lt;p class="MsoNormal" style="margin-bottom:0cm"&gt;&lt;span style="font-size:11.0pt"&gt;Every order begins&lt;/span&gt;&lt;span&gt; with a legal description.&lt;/span&gt;&lt;/p&gt;
&lt;p class="MsoNormal"&gt;&amp;nbsp;&lt;/p&gt;
&lt;h1&gt;&lt;a name="_Toc41234567"&gt;&lt;/a&gt;2. Search procedure&lt;/h1&gt;</textarea>
  <pre id="out"></pre>
  <script>
    function clean(h) {
      return h.replace(/\s(style|class|lang)="[^"]*"/g, "")
              .replace(/<span>([\s\S]*?)<\/span>/g, "$1")
              .replace(/<p>\s*(&nbsp;|&#160;|\s)*<\/p>\n?/g, "")
              .replace(/<a name="_Toc\d+"><\/a>/g, "")
              .replace(/&nbsp;/g, "&#160;");
    }
    const ta = document.getElementById("src");
    function run() { document.getElementById("out").textContent = clean(ta.value); }
    ta.addEventListener("input", run); run();
  </script>
</body>
</html>
```

### Quiz

1. What should you do in Word before converting to EPUB?
- [x] Apply real heading and list styles and accept all tracked changes
- [ ] Save as PDF first
- [ ] Convert all text to Calibri
> Style-aware converters map Word styles to elements; direct formatting is lost anyway.

2. Which pandoc option keeps Word equations as MathML?
- [ ] `--epub-math`
- [x] `--mathml`
- [ ] `--latex`
> MathML output then needs `properties="mathml"` on the manifest item.

3. How do you verify that no text was lost in conversion?
- [ ] Trust EPUBCheck
- [x] Extract plain text from both source and EPUB and diff them, plus count headings, notes and images
> EPUBCheck validates structure, not completeness.

### Exercises

1. **Rewrite a pandoc footnote** — pandoc produced `<a href="#fn1" class="footnote-ref" id="fnref1"><sup>1</sup></a>` and `<li id="fn1"><p>Note text<a href="#fnref1">↩</a></p></li>`. Rewrite as EPUB 3 footnotes.
<details><summary>Solution</summary>

```html
<a href="#fn1" id="fnref1" epub:type="noteref" role="doc-noteref">1</a>
...
<aside id="fn1" epub:type="footnote" role="doc-footnote">
  <p><a href="#fnref1">1.</a> Note text</p>
</aside>
```

A script can do this with two regexes per note, keeping the numbering.

</details>

2. **Text comparison script** — Write Python that compares the plain text of a DOCX and an EPUB and prints the number of differing lines.
<details><summary>Solution</summary>

```python
import subprocess, zipfile, re, difflib
src = subprocess.run(["pandoc", "in.docx", "-t", "plain", "--wrap=none"], capture_output=True, text=True).stdout.splitlines()
out = []
with zipfile.ZipFile("out.epub") as z:
    for n in sorted(z.namelist()):
        if n.endswith(".xhtml") and "nav" not in n:
            t = re.sub(r"<[^>]+>", "", z.read(n).decode("utf-8"))
            out += [l.strip() for l in t.splitlines() if l.strip()]
src = [l.strip() for l in src if l.strip()]
diff = [l for l in difflib.unified_diff(src, out, lineterm="") if l.startswith(("+", "-")) and not l.startswith(("+++", "---"))]
print(len(diff), "differing lines")
```

</details>

### Interview Questions

**Q: Walk me through converting a 300-page Word policy manual into a store-ready EPUB.**
I begin in Word: accept tracked changes, apply true heading styles, convert manual numbering to list styles, inline the images and delete the Word TOC. I convert with pandoc to Markdown with extracted media, clean the Markdown once (footnotes, tables, ids), and commit it to Git. The build script runs pandoc to EPUB 3 with the house stylesheet and split at H1, post-processes footnotes into the `noteref`/`aside` pattern, injects accessibility metadata, optimises images, and runs EPUBCheck and Ace. I compare extracted text against the DOCX to confirm nothing was lost, then test in Apple Books, Kindle Previewer and Kobo. Client revisions arrive as change lists that I apply to the Markdown, so a rebuild is one command.

**Q: What Word content is most often lost or mangled in conversion, and how do you catch it?**
Text boxes, floating shapes, footnotes inside tables, equations, and content inside fields such as cross-references and captions. Text boxes vanish or become images, table-cell footnotes are dropped by some converters, and OMML equations become blank spaces. I catch these with counts: number of footnotes, tables, images, equations and headings in the source versus the EPUB, plus a plain-text diff. When I see a mismatch I fix the source in Word (move the text box into the flow) rather than patching the output, so the fix survives the next conversion.

**Q: InDesign or Word as a source: which gives a better EPUB and why?**
InDesign, if the designer used styles and set Export Tagging, because each paragraph and character style maps to a chosen element and class, images are pre-optimised, and the exporter splits files and writes a nav. Word is fine when styles are used consistently, but designers rarely get consistent styling in Word and clients apply direct formatting everywhere. Either way the output needs a clean-up pass; the difference is that a well-tagged InDesign export needs an hour of work and a typical Word file needs a day. For FXL, InDesign is the only serious choice.

## Typography & CJK/RTL (Urdu/Arabic) considerations

Good typography is what makes readers forget they are on a screen. Adding Urdu, Arabic, Chinese or Japanese brings script-specific rules that reading systems handle unevenly, so this chapter combines general typographic practice with the specific settings needed for right-to-left and CJK books.

### Typographic basics for reflowable books

- Use real typographic characters: curly quotes (’ “ ”), en dash for ranges (2019–2026), em dash for breaks, ellipsis (…), non-breaking space (`&#160;`) between a number and its unit.
- Paragraphs: first-line indent (`text-indent: 1.2em`) with zero space between, or space between with no indent, never both. Suppress the indent after headings and on the first paragraph of a section.
- Justification: `text-align: justify` reads well only with hyphenation; enable `-webkit-hyphens: auto; hyphens: auto;` and set `lang` correctly so the engine uses the right dictionary. Kindle hyphenates on its own.
- Widows and orphans: set `widows: 2; orphans: 2;`. Keep headings with the next paragraph via `page-break-after: avoid`.
- Small caps and old-style figures via `font-variant` and `font-feature-settings` work on Apple and Kobo; treat them as enhancements.
- Drop caps: `p.first::first-letter { font-size: 3em; float: left; line-height: .8; margin: 0 .1em 0 0; }` works on Apple, Kobo and KFX; older readers render a large letter inline, which is acceptable.

### Right-to-left: Urdu and Arabic

Three settings are required, and missing any one produces the familiar "page turns backwards" bug reports:

```xml
<dc:language>ur</dc:language>
<spine page-progression-direction="rtl">
```

```html
<html xmlns="http://www.w3.org/1999/xhtml" lang="ur" xml:lang="ur" dir="rtl">
```

`page-progression-direction="rtl"` on the spine makes readers turn pages from right to left; `dir="rtl"` on `html` makes text and layout flow right to left; `lang` selects fonts, hyphenation (none for Arabic script) and screen-reader voices. For mixed-direction content, use `dir="ltr"` on English spans and `<bdi>` around isolated numbers or names so the Unicode bidi algorithm does not scramble punctuation. Use logical CSS properties (`margin-inline-start`) where supported, or mirror margins manually.

Fonts are the other half. Naskh faces (Noto Naskh Arabic, Amiri, Scheherazade) work for Arabic and formal Urdu; Nastaliq (Noto Nastaliq Urdu, Jameel Noori Nastaleeq with licence, Mehr Nastaliq) is expected by Urdu readers. Nastaliq needs generous leading:

```css
@font-face { font-family: "Noto Nastaliq Urdu"; src: url("../fonts/NotoNastaliqUrdu-Regular.woff2") format("woff2"); }
body { font-family: "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif; line-height: 2.2; text-align: right; }
p { text-indent: 0; margin-bottom: .6em; }
```

Kindle supports Arabic and Urdu but substitutes its own Naskh font for Urdu when the embedded font is missing or obfuscated with the wrong scheme; Apple Books and Kobo render Nastaliq correctly with the embedded font. Justification of Arabic script uses kashida in print; on screen, leave `text-align: right` for Nastaliq, because justified Nastaliq stretches badly.

### CJK: Chinese, Japanese, Korean

Vertical writing for Japanese and Traditional Chinese uses `writing-mode: vertical-rl` (with the legacy `-epub-writing-mode` for older readers) and `page-progression-direction="rtl"`. Other CJK features:

```css
html { -epub-writing-mode: vertical-rl; writing-mode: vertical-rl; }
.tcy { -epub-text-combine: horizontal; text-combine-upright: all; }   /* 2-digit numbers upright */
em { -epub-text-emphasis: filled sesame; text-emphasis: filled sesame; font-style: normal; }
ruby rt { font-size: .5em; }
```

Ruby annotations (`<ruby>漢<rt>かん</rt></ruby>`) are HTML and work in Apple, Kobo and Kindle. CJK fonts are 5 to 20 MB; always subset them with `ebook-polish --subset-fonts` or `pyftsubset` to the characters used. Line breaking needs `lang="ja"` or `lang="zh-Hant"` so the engine applies kinsoku rules (no line starting with a closing bracket or full stop).

### Testing multilingual books

| Check | Apple Books | Kindle Previewer | Kobo | Thorium |
|---|---|---|---|---|
| RTL page turn | Yes | Yes | Yes | Yes |
| Nastaliq embedded font | Yes | Substituted (Naskh) | Yes | Yes |
| Vertical CJK | Yes | Yes | Yes | Yes |
| Mixed bidi with numbers | Good | Good | Good | Good |
| Arabic hyphenation | n/a | n/a | n/a | n/a |

> **Interview note:** "What do you set for an Urdu ebook?" has a three-part answer: `dc:language` ur, spine `page-progression-direction="rtl"`, `dir="rtl"` on `html`; plus an embedded Nastaliq font with line-height around 2 and no justification.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ur" dir="rtl">
<head>
  <title>Urdu with mixed direction</title>
  <style>
    body { margin: 1.2em; font-family: "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Noto Naskh Arabic", serif; line-height: 2.2; text-align: right; }
    h1 { font-size: 1.5em; text-align: center; line-height: 2; }
    .en { direction: ltr; unicode-bidi: isolate; font-family: Georgia, serif; }
    .ltr-block { direction: ltr; text-align: left; font-family: sans-serif; line-height: 1.5; border: 1px solid #ccc; padding: .5em; }
  </style>
</head>
<body>
  <h1>باب ۲: تلاش کا طریقہ کار</h1>
  <p>ہر آرڈر قانونی تفصیل سے شروع ہوتا ہے۔ آخری <span class="en">vesting deed</span> تلاش کریں اور <bdi>30</bdi> دن سے زیادہ کے وقفے کو نشان زد کریں۔</p>
  <div class="ltr-block">This English block is explicitly left-to-right inside an RTL document, exactly as a bilingual SOP would need.</div>
</body>
</html>
```

### Quiz

1. Which attribute makes pages turn from right to left?
- [ ] `dir="rtl"` on `body`
- [x] `page-progression-direction="rtl"` on the spine
- [ ] `rendition:orientation="rtl"`
> Page order is a spine property; `dir` only controls text direction.

2. Why does Nastaliq need a larger line height than Latin text?
- [x] Its glyphs stack diagonally and descend deeply, colliding with the next line
- [ ] Kindle requires it
- [ ] It is a monospace script
> A line-height around 2 keeps stacked ligatures from overlapping.

3. Which CSS keeps two-digit numbers upright in vertical Japanese text?
- [ ] `writing-mode: horizontal-tb`
- [x] `text-combine-upright: all`
- [ ] `text-orientation: mixed`
> Tate-chu-yoko combines short runs horizontally within vertical lines.

### Exercises

1. **RTL package** — Write the metadata and spine opening for an Urdu EPUB.
<details><summary>Solution</summary>

```xml
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="pub-id">urn:uuid:…</dc:identifier>
  <dc:title>ٹائٹل سرچ کا طریقہ کار</dc:title>
  <dc:language>ur</dc:language>
  <meta property="dcterms:modified">2026-09-15T10:00:00Z</meta>
</metadata>
...
<spine page-progression-direction="rtl">
```

Each XHTML root also gets `lang="ur" xml:lang="ur" dir="rtl"`.

</details>

2. **Subset a font** — Give the command to subset Noto Nastaliq Urdu to the characters used in `book.txt`.
<details><summary>Solution</summary>

```bash
pip install fonttools brotli
pyftsubset NotoNastaliqUrdu-Regular.ttf --text-file=book.txt --flavor=woff2 \
  --layout-features='*' --output-file=NotoNastaliqUrdu-subset.woff2
```

Keeping all layout features is essential for Nastaliq shaping.

</details>

### Interview Questions

**Q: A client reports that their Urdu EPUB "reads backwards" on Kobo but fine on Apple. What is wrong?**
Almost certainly the spine lacks `page-progression-direction="rtl"`, so Kobo pages forward left to right while the text itself is right to left; Apple sometimes infers direction from `dc:language` and `dir`, masking the omission. I add the attribute, confirm `dir="rtl"` on every `html` element and `dc:language` is `ur`, and re-test on Kobo, Apple and Kindle Previewer. If English fragments inside the Urdu look scrambled, I wrap them in `dir="ltr"` spans and isolate numbers with `<bdi>`.

**Q: How do you keep a CJK or Nastaliq font from ballooning the file?**
By subsetting to the characters actually used with `pyftsubset` or Calibre's `ebook-polish --subset-fonts`, and by shipping WOFF2. A full Noto Nastaliq Urdu is about 1.5 MB and Noto Sans CJK is over 15 MB; a subset for a typical book is a few hundred KB. The caveat is that subsetting must keep all OpenType layout features, otherwise Nastaliq ligatures and CJK vertical forms break, so I pass `--layout-features='*'` and test rendering afterwards. I also re-subset on every rebuild because new text may introduce new characters.

**Q: What typographic details do you always fix in a client's text before building?**
Straight quotes to curly, hyphens to en dashes in ranges, double spaces after full stops, non-breaking spaces between numbers and units and before em dashes where the style demands it, and consistent ellipsis characters. In an SOP manual I also normalise list punctuation and capitalisation. These are all scripted with regular expressions on the Markdown source, reviewed with a diff, so they do not have to be redone when the client sends a revision. It sounds minor, but stores' quality checkers and reviewers notice, and a clean text passes Amazon's typo scan without the warning email.

## QA workflow & device testing matrix

Validation says the file is well formed; QA says the book is right. A professional QA workflow is documented, repeatable and produces evidence the client can see. This chapter gives a workflow and a device matrix that fits a freelance or small-publisher operation.

### The QA layers

| Layer | Tool | What it catches |
|---|---|---|
| 1. Well-formedness | `xmllint --noout` per file | Unclosed tags, bad entities |
| 2. Conformance | EPUBCheck 5, zero errors and warnings | Container, package, references |
| 3. Accessibility | Ace by DAISY | Missing alt, heading order, metadata, contrast |
| 4. Completeness | Text diff and element counts vs source | Lost footnotes, tables, images |
| 5. Rendering | Device matrix | Layout, fonts, page breaks, night mode |
| 6. Store simulation | Kindle Previewer, Apple Books, Kobo app | Store-specific behaviour |
| 7. Editorial read | Human read of first, last and sample chapters on a device | Typos, broken cross-references, wrong ordering |

Layers 1 to 4 are automated in the build script and block delivery on failure. Layers 5 to 7 are manual and produce a checklist with screenshots.

### The device matrix

You cannot own every device. This matrix covers the rendering engines that matter:

| Engine | Device or app | Why |
|---|---|---|
| Apple Books (WebKit) | iPad or iPhone, macOS Books | Strictest parser, largest premium market |
| Kindle KFX | Kindle Previewer 3 (desktop) plus one Paperwhite via Send to Kindle | Largest market; Previewer shows phone, tablet, e-ink |
| Kobo (KEPUB engine) | Kobo desktop app or a Clara device | KEPUB wrapping issues, RTL |
| Readium | Thorium Reader (Windows/macOS/Linux) | Reference implementation, overlays, accessibility |
| Adobe RMSDK | Adobe Digital Editions | Library apps and older readers; no WOFF |
| Google Play Books | Android or web app | Google's ingestion behaviour |

Test on at least one e-ink device: grey levels, slow refresh and the absence of colour reveal contrast problems that tablets hide.

### The rendering checklist

For every device in the matrix:

- Cover shows on shelf and as first page (once, not twice).
- Book opens at the intended start location.
- TOC entries all work; nested entries display.
- Chapter openers start on a new page; no blank pages before them.
- Fonts: embedded font appears; fallback acceptable when user overrides.
- Font size small, default and largest: no clipped tables, no overflowing images.
- Night mode: no hard-coded colours, images with transparent backgrounds still visible.
- Footnotes pop up or link and return.
- Images sharp at default zoom, no image wider than the screen.
- Tables readable on phone width.
- Search finds a known phrase (proves text is live).
- RTL or vertical mode pages in the correct direction.
- Landscape and portrait both acceptable.

### Recording results

Keep a QA sheet per title: rows are checklist items, columns are devices, cells are pass/fail with a screenshot link. Deliver it with the EPUB. On Fiverr and Upwork this sheet reduces revision requests dramatically because the client sees the book on devices they do not own.

### Automating what can be automated

```bash
#!/usr/bin/env bash
set -euo pipefail
book=dist/manual.epub
for f in build/manual/OEBPS/*.xhtml; do xmllint --noout "$f"; done
java -jar tools/epubcheck.jar "$book" -e
ace "$book" -o qa/ace --silent
python3 tools/text_diff.py source/manual.docx "$book"
python3 tools/counts.py source/manual.docx "$book"   # headings, notes, tables, images
echo "Automated QA passed for $book"
```

Add a size guard (`stat -c %s`) and a font-subset check (no font file over 500 KB) for store economics.

> **Tip:** Send the book to a real Kindle with Send to Kindle as a final step. Kindle Previewer is accurate but not perfect, and a client who sees the book on their own Paperwhite is a client who approves the delivery.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>QA matrix</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #bbb; padding: .3em .5em; text-align: center; }
    td:first-child { text-align: left; }
    td.cell { cursor: pointer; user-select: none; }
    .pass { background: #d9f2df; } .fail { background: #f8d7da; }
    #summary { margin-top: 1em; font-weight: bold; }
  </style>
</head>
<body>
  <h2>Click cells to mark pass/fail</h2>
  <table id="m"></table>
  <div id="summary"></div>
  <script>
    const devices = ["Apple Books", "Kindle Previewer", "Kobo", "Thorium", "ADE"];
    const checks = ["Cover once", "Start location", "TOC links", "Chapter breaks", "Largest font", "Night mode", "Footnotes", "Search works"];
    const t = document.getElementById("m");
    t.innerHTML = "<tr><th>Check</th>" + devices.map(d => `<th>${d}</th>`).join("") + "</tr>" +
      checks.map(c => `<tr><td>${c}</td>` + devices.map(() => `<td class="cell">–</td>`).join("") + "</tr>").join("");
    const states = ["–", "pass", "fail"];
    t.querySelectorAll("td.cell").forEach(td => td.addEventListener("click", () => {
      const next = states[(states.indexOf(td.textContent) + 1) % 3];
      td.textContent = next; td.className = "cell " + (next === "–" ? "" : next); summarise();
    }));
    function summarise() {
      const cells = [...t.querySelectorAll("td.cell")];
      const f = cells.filter(c => c.textContent === "fail").length, p = cells.filter(c => c.textContent === "pass").length;
      document.getElementById("summary").textContent = `${p} passed, ${f} failed, ${cells.length - p - f} untested`;
    }
    summarise();
  </script>
</body>
</html>
```

### Quiz

1. Which QA layer catches a footnote silently dropped during conversion?
- [ ] EPUBCheck
- [x] Completeness checks: text diff and element counts against the source
- [ ] Night-mode test
> EPUBCheck cannot know what the source contained.

2. Why include an e-ink device in the matrix?
- [x] Grey levels and slow refresh reveal contrast and image issues tablets hide
- [ ] E-ink devices use a different EPUB version
- [ ] Stores require an e-ink screenshot
> Colour-coded tables and light-grey text often fail only on e-ink.

3. What does Thorium Reader represent in the matrix?
- [ ] Amazon's engine
- [x] The Readium reference implementation used by many library apps
- [ ] A PDF viewer
> Thorium is open source, supports overlays and accessibility features, and mirrors library readers.

### Exercises

1. **Counts script** — Write Python that counts headings, images, tables and footnote references in an EPUB.
<details><summary>Solution</summary>

```python
import zipfile, re
counts = {"h1": 0, "h2": 0, "img": 0, "table": 0, "noteref": 0}
with zipfile.ZipFile("dist/manual.epub") as z:
    for n in z.namelist():
        if n.endswith(".xhtml") and not n.endswith("nav.xhtml"):
            t = z.read(n).decode("utf-8")
            counts["h1"] += len(re.findall(r"<h1[\s>]", t))
            counts["h2"] += len(re.findall(r"<h2[\s>]", t))
            counts["img"] += len(re.findall(r"<img[\s>]", t))
            counts["table"] += len(re.findall(r"<table[\s>]", t))
            counts["noteref"] += t.count('epub:type="noteref"')
print(counts)
```

Compare with the same counts from the DOCX (via pandoc HTML output).

</details>

2. **Write a QA sheet header** — List the columns and the first five rows you would deliver to a client.
<details><summary>Solution</summary>

Columns: Check, Apple Books (iPad), Kindle Previewer (Paperwhite), Kindle Previewer (Phone), Kobo Clara, Thorium, Notes/Screenshot. Rows: Cover displays once; Opens at chapter 1; All TOC links resolve; Chapter openers start new page; Largest font size has no clipped tables.

</details>

### Interview Questions

**Q: Describe your EPUB QA process from build to delivery.**
The build script runs xmllint on every content file, EPUBCheck with errors and warnings as blockers, Ace for accessibility, and completeness checks that diff extracted text and compare element counts against the source. If any step fails the build stops. Then I run the device matrix: Apple Books on iPad, Kindle Previewer on all three simulated devices plus a real Paperwhite via Send to Kindle, Kobo, Thorium and Adobe Digital Editions, checking a fixed list of rendering items at small, default and largest font sizes and in night mode. Results go into a QA sheet with screenshots that ships with the file. Finally a human reads the first chapter, the last chapter and a random middle chapter on a device.

**Q: What rendering problems only show up on devices, never in validators?**
Blank pages before chapter openers caused by margins plus page breaks, tables clipped at large font sizes, images with transparent backgrounds vanishing in night mode, light-grey secondary text unreadable on e-ink, drop caps misaligned on older engines, footnote pop-ups not appearing on Kindle because the note was in another file, and Nastaliq lines colliding when line-height is too small. None of these are specification violations, so EPUBCheck is silent; they only appear in the device matrix, which is why I never deliver on validation alone.

**Q: How do you keep QA affordable on a fixed-price freelance job?**
Automate everything that can be automated so the human time goes only to rendering and reading. The scripted layers run in under a minute and catch the majority of defects. The device pass takes about an hour for a standard reflowable book because the checklist is fixed and the screenshots are captured as I go. I scope QA explicitly in the proposal, including the device list, so clients understand what they are paying for, and I reuse the QA sheet template across jobs. The result is fewer revision rounds, which is where fixed-price jobs actually lose money.

## EPUB interview questions

This chapter is a rehearsal room. The questions below are the ones asked for ebook production, digital publishing and document engineering roles, from basic screening to senior discussions about pipelines and standards. Practise saying each answer aloud in under ninety seconds with one concrete example from your own work.

### Screening questions

These check that you know the format at all: what an EPUB is, the required files, reflowable versus fixed layout, why XHTML, what EPUBCheck does. Answer briefly and correctly; do not over-explain.

### Production questions

These probe hands-on experience: how you convert from Word, how you handle fonts and licensing, how you build the nav, what breaks on Kindle, how you split files, how you optimise images. Bring numbers: file sizes before and after, number of spine items, how long a rebuild takes.

### Standards and accessibility questions

Senior roles ask about EPUB 3.3 versus 3.2, EPUB Accessibility 1.1, WCAG levels, the European Accessibility Act, schema.org metadata and Ace. Know the vocabulary and the current version numbers.

### Pipeline and judgement questions

The strongest candidates are asked "how would you set up production for 200 backlist titles?" or "a store rejected the file with no details, what now?" Structure your answer: source of truth, automation, validation gates, device QA, and how you handle exceptions.

### A quick self-test

| Topic | Can you explain it in two sentences? |
|---|---|
| mimetype rules | first, stored, exactly `application/epub+zip` |
| Required metadata | identifier, title, language, dcterms:modified |
| Manifest properties | nav, cover-image, svg, mathml, scripted, remote-resources |
| Spine linear | main flow vs reachable-only |
| Footnote pattern | noteref → aside footnote, same file for Kindle |
| FXL flags | rendition:layout pre-paginated, viewport meta, page-spread-* |
| Overlays | SMIL par text/audio, media-overlay attribute, media:duration |
| A11y metadata | accessMode, accessModeSufficient, accessibilityFeature, hazard, summary, conformsTo |
| Store covers | KDP 2560×1600, Apple/Kobo 1600×2400, Google 1600×2560 |
| RTL | dc:language, page-progression-direction, dir="rtl", font and line-height |

### Sample build script to talk through

Interviewers often ask you to describe your build. Having a short script in your head helps:

```python
# build.py: DOCX -> EPUB 3, validated
import subprocess, datetime, pathlib
src, out = "source/manual.md", "dist/manual.epub"
meta = pathlib.Path("build/meta.xml")
meta.write_text(f'<meta property="dcterms:modified">{datetime.datetime.now(datetime.timezone.utc):%Y-%m-%dT%H:%M:%SZ}</meta>\n' + pathlib.Path("source/a11y.xml").read_text())
subprocess.run(["pandoc", src, "-o", out, "--toc", "--toc-depth=2", "--split-level=1",
                "--css=source/book.css", "--epub-cover-image=source/cover.jpg", f"--epub-metadata={meta}"], check=True)
subprocess.run(["ebook-polish", "--subset-fonts", "--compress-images", out, out], check=True)
subprocess.run(["java", "-jar", "tools/epubcheck.jar", out, "-e"], check=True)
subprocess.run(["ace", out, "-o", "qa/ace", "--silent"], check=True)
```

Be ready to say what each line does, what fails it, and what you would change for FXL or for a KDP-only build.

> **Interview note:** The single most common follow-up is "why?" Every answer should include a reason grounded in reading-system behaviour or a store rule, not "because the spec says so". "Kindle pops footnotes only from the same file" is a reason; "EPUB 3 recommends aside" is not.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Flashcards</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1em; max-width: 40em; }
    .card { border: 1px solid #bbb; border-radius: 8px; padding: 1.2em; min-height: 6em; cursor: pointer; background: #faf7fc; }
    .q { font-weight: bold; } .a { margin-top: .8em; color: #333; display: none; }
    .card.open .a { display: block; }
    button { margin-top: 1em; }
  </style>
</head>
<body>
  <h2>EPUB interview flashcards (click a card to reveal)</h2>
  <div class="card" id="card"><div class="q"></div><div class="a"></div></div>
  <button onclick="next()">Next question</button>
  <script>
    const cards = [
      ["What three files must every EPUB contain besides content?", "mimetype (first, stored), META-INF/container.xml, and the package (.opf) document."],
      ["Why keep Kindle footnotes in the same file as the reference?", "Kindle only shows pop-up notes when the noteref and the aside are in the same content document."],
      ["What turns on fixed layout?", "<meta property=\"rendition:layout\">pre-paginated</meta> plus a viewport meta in every page."],
      ["Which metadata is required?", "dc:identifier, dc:title, dc:language and dcterms:modified in CCYY-MM-DDThh:mm:ssZ form."],
      ["What does RSC-012 mean?", "A link's fragment identifier (#id) does not exist in the target document."],
      ["Three settings for an Urdu book?", "dc:language ur, spine page-progression-direction=rtl, dir=rtl on html; plus a Nastaliq font with line-height about 2."]
    ];
    let i = -1;
    const card = document.getElementById("card");
    function next() { i = (i + 1) % cards.length; card.classList.remove("open"); card.querySelector(".q").textContent = cards[i][0]; card.querySelector(".a").textContent = cards[i][1]; }
    card.addEventListener("click", () => card.classList.toggle("open"));
    next();
  </script>
</body>
</html>
```

### Quiz

1. An interviewer asks why the mimetype must be stored. The best answer is:
- [ ] Because ZIP cannot compress small files
- [x] So the literal string can be read at a fixed byte offset to identify the file without unzipping
- [ ] Because EPUBCheck was written that way
> Give the mechanism, not the rule.

2. Which answer best explains why you use both `epub:type` and ARIA roles?
- [x] Reading systems key behaviours on epub:type while screen readers only see ARIA roles
- [ ] ARIA is required by EPUBCheck
- [ ] epub:type is deprecated
> Each vocabulary reaches a different consumer.

3. When asked about a store rejection with no details, what should your answer start with?
- [ ] Emailing the store
- [x] Running the current EPUBCheck locally with JSON output and fixing container and package errors first
- [ ] Rebuilding from scratch
> Reproduce the store's check, then fix in dependency order.

### Exercises

1. **Ninety-second answer** — Write your answer to "Tell me about a difficult EPUB project" using a real project structure: context, problem, action, result.
<details><summary>Solution</summary>

Context: a 767-page handbook delivered as DOCX with 400 footnotes and 60 tables. Problem: converters dropped footnotes inside tables and Word ids broke 300 TOC links. Action: cleaned the source styles, converted to Markdown, wrote a build script with stable ids and a footnote rewriter, added completeness checks that count notes and tables. Result: zero EPUBCheck errors, all 400 notes present, accepted by Apple and KDP first time, and revisions rebuilt in under a minute.

</details>

2. **Explain a trade-off** — In three sentences, explain to a client why you recommend reflowable over FXL for their illustrated training manual.
<details><summary>Solution</summary>

Reflowable lets readers resize text and works on phones, which is where most of your staff will read it, and it passes accessibility requirements that FXL cannot meet. FXL would preserve your InDesign layout exactly but shows tiny, unreadable pages on phones and cannot be resized. I will keep the illustrations at full quality and use one fixed-layout page only for the fold-out org chart.

</details>

### Interview Questions

**Q: What is the difference between EPUB 3.2 and EPUB 3.3?**
EPUB 3.3 is the W3C Recommendation from May 2023 that consolidated the 3.2 community-group specification into three documents: EPUB 3.3 (the format), EPUB Reading Systems 3.3 and EPUB Accessibility 1.1. Practical changes are small: WebP became a core image type, obsolete features such as `epub:switch` and the bindings element were removed, and the specification language was tightened so EPUBCheck 5 enforces things that were only recommended before. A valid 3.2 file is almost always a valid 3.3 file; the `version` attribute still says `3.0`.

**Q: How would you set up production for 200 backlist titles arriving as PDFs and DOCX files?**
I would triage first: DOCX titles go through the pandoc-based pipeline; PDF-only titles need text extraction or OCR and a human structuring pass, which I would price separately. I would define one house stylesheet and one metadata spreadsheet feeding the OPF and store forms. The pipeline is a script per title with source in Git, running conversion, clean-up rules, EPUBCheck, Ace and completeness checks, producing a QA sheet automatically. A sample of ten titles goes through the full device matrix to tune the stylesheet; the remaining titles get automated checks plus a spot check. The key is that every fix becomes a rule in the pipeline rather than a manual edit.

**Q: What do you think most ebook producers get wrong?**
Treating validation as the finish line. A file can pass EPUBCheck and still open on the copyright page, show the cover twice on Kindle, clip tables at large font sizes and go black-on-black in night mode. The second mistake is hand-editing output files, so every revision reintroduces old bugs; the fix is a source of truth plus a scripted build. The third is ignoring accessibility metadata, which is now a legal and commercial requirement in the EU and a product-page feature on Apple and Kobo. I built my process around those three failures because each one cost me a revision round early on.

**Q: Which reading system do you test first and why?**
Apple Books, because it has the strictest XML parser and font handling, so anything that renders there is likely to render elsewhere, and because its users are the premium segment for most clients. Kindle Previewer is second because Amazon is the largest market and its conversion is the most opinionated. Thorium is third as the Readium reference, especially for overlays and accessibility. I finish with Kobo and Adobe Digital Editions for the KEPUB wrapping and the legacy engine. Testing in that order finds the most defects earliest.
