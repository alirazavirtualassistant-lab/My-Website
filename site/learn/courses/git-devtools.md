---
id: git-devtools
title: Git, GitHub & Developer Tools
icon: 🔧
track: Programming
color: #F05032
runner: none
tagline: Version control, collaboration and the command line every developer is expected to know.
description: Git and the developer toolchain from scratch: the terminal, Git fundamentals, branching and merging, remotes and GitHub, pull requests and code review, rebasing, resolving conflicts, GitHub Actions and Pages, VS Code productivity, and the Git questions asked in interviews.
---

# LEVEL: Beginner

## The terminal & shell basics (bash/PowerShell)

Every developer tool you will meet in this course, Git included, is at heart a command-line program. Graphical clients such as GitHub Desktop and the VS Code Source Control panel are wrappers around the same commands, so once you can read a terminal you can read any of them. The terminal is a window where you type a command, press Enter, and a program prints its result. The **shell** is the program inside that window that interprets what you typed. On Linux and macOS the default shell is **bash** or **zsh**; on Windows you have **PowerShell**, the older **Command Prompt**, and, once Git is installed, **Git Bash**, which gives you a bash shell on Windows. This course uses bash syntax because Git Bash makes it work everywhere.

### Where am I?

A shell always has a **current working directory**. Every relative path you type is resolved against it.

```bash
pwd                 # print working directory, e.g. /c/Users/Ali/Documents
ls                  # list files here
ls -la              # long listing, including hidden files (names starting with .)
cd Projects         # move into a folder
cd ..               # go up one level
cd ~                # go to your home folder
```

`pwd` answers "where am I", `ls` answers "what is here", and `cd` moves you. The `-la` flags mean *long* and *all*; hidden files matter because Git stores its whole database in a hidden folder called `.git`.

### Making and inspecting files

```bash
mkdir policy-manual            # create a folder
cd policy-manual
touch README.md                # create an empty file
echo "Policy Manual v1" > README.md    # overwrite the file with a line of text
echo "Second line" >> README.md        # append instead of overwrite
cat README.md                  # print the file
cp README.md backup.md         # copy
mv backup.md notes.md          # rename or move
rm notes.md                    # delete (there is no recycle bin)
```

The `>` and `>>` symbols are **redirection**: they send a command's output into a file. One arrow replaces, two arrows append. This distinction will bite you once and then you will never forget it.

### PowerShell equivalents

PowerShell has its own verbs, but it ships aliases so most bash muscle memory works.

| Task | bash | PowerShell native | Alias that works in PowerShell |
|---|---|---|---|
| List files | `ls -la` | `Get-ChildItem -Force` | `ls`, `dir` |
| Print file | `cat file` | `Get-Content file` | `cat`, `type` |
| Copy | `cp a b` | `Copy-Item a b` | `cp` |
| Remove | `rm file` | `Remove-Item file` | `rm`, `del` |
| Find text | `grep -n "Rate" *.csv` | `Select-String -Pattern "Rate" *.csv` | `sls` |
| Clear screen | `clear` | `Clear-Host` | `cls` |

### Reading a command

A command has three parts: the program name, **flags** (options starting with `-` or `--`), and **arguments** (the things to act on). In `git log --oneline -n 5 main`, the program is `git`, the sub-command is `log`, `--oneline` and `-n 5` are flags, and `main` is an argument. Short flags can be combined (`ls -la` is `ls -l -a`). Long flags spell the option out and are what you should use in scripts so other people can read them.

### Paths, quoting and tab completion

Spaces separate arguments, so a path containing a space must be quoted: `cd "Rate Matrices"`. Press **Tab** to auto-complete a file or folder name; press it twice to see every possibility. Press the **up arrow** to recall previous commands, and `Ctrl+R` to search your history. `Ctrl+C` interrupts a running program. These four shortcuts save more time than any other tip in this chapter.

### Getting help

```bash
git --version          # confirm Git is installed
git help commit        # opens the manual page for a command
git commit -h          # short usage summary
man ls                 # manual for any Unix command (not on Windows)
```

> **Tip:** Install Git from git-scm.com on Windows and tick "Git Bash Here" in the installer. Right-clicking any folder in Explorer then gives you a bash terminal already in that folder, which is exactly where you want to be when you start version-controlling a client deliverable.

### Environment variables and PATH

When you type `git`, the shell searches each folder listed in the `PATH` environment variable for a program with that name. If you see `command not found` or `'git' is not recognized`, Git is either not installed or its folder is not on `PATH`. Check with `echo $PATH` in bash or `$env:Path` in PowerShell. Other useful variables are `HOME` (your home directory) and `EDITOR` (the editor Git opens for commit messages).

### Try It Yourself

```bash
mkdir -p ~/Projects/title-reports && cd ~/Projects/title-reports
echo "# Weekly Status Report" > README.md
echo "Week 37: 412 files closed, 3 escalations" >> README.md
cat README.md
ls -la
pwd
```

### Quiz

1. What does `cd ..` do?
- [ ] Deletes the current folder
- [x] Moves to the parent folder
- [ ] Creates a hidden folder
> Two dots always mean "the folder above this one"; a single dot means "this folder".

2. Which operator appends to a file instead of replacing it?
- [ ] `>`
- [x] `>>`
- [ ] `|`
> A single `>` truncates the file first; `>>` opens it in append mode.

3. In `git log --oneline -n 5`, what is `--oneline`?
- [ ] An argument
- [x] A long flag
- [ ] A sub-command
> Options beginning with two dashes are long flags; `log` is the sub-command.

4. Why might `git` print "command not found" right after installing it?
- [ ] Git only works in PowerShell
- [x] Its folder is not on the PATH of the open terminal
- [ ] Git needs a repository first
> The shell searches PATH for executables; a terminal opened before installation has a stale PATH.

### Exercises

1. **Folder skeleton** — From your home folder, create `Clients/Acme/drafts` and `Clients/Acme/final` in one command, then list them.
<details><summary>Solution</summary>

```bash
mkdir -p ~/Clients/Acme/drafts ~/Clients/Acme/final
ls -R ~/Clients
```

`-p` creates missing parents and does not complain if the folder exists; `ls -R` lists recursively.

</details>

2. **Count lines** — Create a file with three lines using `echo` and `>>`, then count its lines.
<details><summary>Solution</summary>

```bash
echo "line one" > agents.txt
echo "line two" >> agents.txt
echo "line three" >> agents.txt
wc -l agents.txt      # prints: 3 agents.txt
```

In PowerShell: `(Get-Content agents.txt).Count`.

</details>

3. **Find text** — Search every `.csv` file in a folder for the word `Wyoming` and show line numbers.
<details><summary>Solution</summary>

```bash
grep -n "Wyoming" *.csv
# PowerShell: Select-String -Pattern "Wyoming" -Path *.csv
```

</details>

### Interview Questions

**Q: What is the difference between a terminal and a shell?**
The terminal is the window that displays text and captures keystrokes; the shell is the interpreter running inside it that parses your command, resolves the program on PATH, expands wildcards and runs it. Windows Terminal, iTerm2 and the VS Code integrated terminal are terminals; bash, zsh and PowerShell are shells. You can run any shell in any terminal, which is why Git Bash can live inside Windows Terminal. Interviewers ask this to check you understand that Git commands are shell-independent: `git status` behaves identically in bash and PowerShell, only the surrounding syntax (quoting, variables, pipes) changes.

**Q: How would you find which files in a project mention a specific rate code?**
On any Unix-like shell I use `grep -rn "WY-0421" .` for a recursive, line-numbered search, adding `--include="*.xml"` to restrict file types. In PowerShell the equivalent is `Get-ChildItem -Recurse -Filter *.xml | Select-String "WY-0421"`. If the project is a Git repository I prefer `git grep -n "WY-0421"` because it ignores untracked build output and is faster on large trees. For a one-off audit of 700 rate files I would pipe the result to `wc -l` to get a count and to a file for the client.

**Q: What does PATH do and why does it matter for tooling?**
PATH is an ordered list of directories the shell searches when you type a bare program name. If two versions of a tool exist, the one in the earlier directory wins, which is the usual cause of "I installed Python 3.12 but `python` still runs 3.9". After installing Git, Node or Python you must open a new terminal so it re-reads PATH, and on Windows the installer's "Add to PATH" tick-box is what makes the command available. `which git` (bash) or `Get-Command git` (PowerShell) shows which executable will actually run.

## What is version control

Imagine a 767-page employee handbook that six people edit over four months. Without a system you end up with `Handbook_v3_final_FINAL_clientedits2.docx`, nobody knows which version went to print, and a paragraph someone deleted in March cannot be recovered in June. **Version control** solves this by recording every meaningful change to a set of files as a numbered, described, attributed snapshot that you can revisit, compare and restore. Git is the version control system used by almost every software team, and it works just as well on Markdown, XML, LaTeX and configuration files as it does on code.

### Three generations of version control

| Generation | Example | How it works | Weakness |
|---|---|---|---|
| Local | RCS, "Save As v2" | History stored on one machine | No collaboration, no backup |
| Centralised | Subversion (SVN), TFS | One server holds history; clients check out a working copy | Server down means no history; every commit needs the network |
| Distributed | **Git**, Mercurial | Every clone holds the *entire* history | Larger initial clone; merge discipline required |

Git is distributed: when you clone a repository you receive every commit ever made, so you can commit, branch, diff and search history on an aeroplane. The server (GitHub, GitLab, Bitbucket, Azure DevOps) is just another copy that the team agrees to treat as the shared source of truth.

### Snapshots, not differences

Most people assume Git stores "what changed" in each version. It does not. Each **commit** is a snapshot of the whole project tree at that moment, plus metadata: author, date, a message, and a pointer to the previous commit (its **parent**). Files that did not change are not copied again; the new snapshot simply points at the same stored content. This is why switching between versions is instant even in a repository with thousands of files.

```text
commit c3  "Add Wyoming rate table"      parent: c2
commit c2  "Fix header numbering"        parent: c1
commit c1  "Initial import of handbook"  parent: (none)
```

Because each commit points backwards, the history forms a chain, and because a commit may have two parents (a merge) the chain becomes a **directed acyclic graph**. Every advanced Git feature is a way of walking or rewriting that graph.

### The three areas

Git separates your work into three places, and every beginner confusion comes from mixing them up.

1. **Working directory**: the actual files on disk that you edit in Word, VS Code or a text editor.
2. **Staging area** (also called the *index*): a holding list of exactly which changes will go into the next commit.
3. **Repository** (`.git` folder): the permanent database of commits.

```text
edit file  ──git add──▶  staging area  ──git commit──▶  repository
```

The staging area is Git's most misunderstood idea. It exists so you can edit ten files but commit them as three separate, well-described commits. A commit that says "Update rate matrix for Texas and fix typo in cover letter" should be two commits, and staging is how you split them.

### What Git is good and bad at

Git tracks text line by line. A Markdown SOP, a `.tex` thesis, a CSV rate matrix, a Python script or a `document.xml` inside an unzipped DOCX all diff beautifully. Binary files such as `.docx`, `.pdf`, `.xlsx` and images are stored fine but cannot be meaningfully diffed or merged, and every edit stores a fresh copy, so a repository of 200 MB PDFs bloats quickly. For binaries you either accept that, use **Git LFS** (Large File Storage), or keep the *source* (Markdown, XML, templates) in Git and generate the binary output.

> **Interview note:** "Git is a content-addressable filesystem with a VCS on top" is the phrase from the official book. It means every object is stored under the SHA-1 hash of its content, so identical content is stored once and any corruption is detectable. Say this and follow it with the three-areas explanation; it signals you understand the model rather than memorised commands.

### Git versus GitHub

Git is the program on your computer. **GitHub** is a company (owned by Microsoft) that hosts Git repositories and adds pull requests, issues, Actions, Pages, code review and access control on top. You can use Git without GitHub, and you can use other hosts. Interviewers often ask candidates to make exactly this distinction.

### Installing and identifying yourself

After installing Git, tell it who you are once. Every commit will be stamped with this identity.

```bash
git config --global user.name "Ali Raza"
git config --global user.email "ali@example.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true      # Windows: convert CRLF to LF in the repo
git config --list --show-origin             # see every setting and which file it came from
```

`--global` writes to `~/.gitconfig` and applies to every repository on the machine; without it the setting goes into the current repository's `.git/config` only.

### Try It Yourself

```bash
git --version
git config --global user.name "Ali Raza"
git config --global user.email "ali@example.com"
git config --global init.defaultBranch main
git config --global --list
```

### Quiz

1. What does each Git commit store?
- [ ] Only the lines that changed
- [x] A snapshot of the entire tree plus metadata and a parent pointer
- [ ] A ZIP of the changed files
> Git stores snapshots; unchanged files are shared between snapshots by pointing at the same object.

2. Which area decides what goes into the next commit?
- [ ] Working directory
- [x] Staging area (index)
- [ ] Remote
> `git add` copies a file's current state into the index; `git commit` records the index.

3. Git is best described as which kind of version control?
- [ ] Centralised
- [x] Distributed
- [ ] Local only
> Every clone contains the full history, so no single server is required to work.

4. Which statement about Git and GitHub is correct?
- [x] Git is a local tool; GitHub is a hosting service built around it
- [ ] GitHub is required to use Git
- [ ] They are two names for the same product
> You can use Git entirely offline or with GitLab, Bitbucket or a bare folder on a USB stick.

### Exercises

1. **Identity check** — Show the name and email Git will stamp on your commits, and where that setting is stored.
<details><summary>Solution</summary>

```bash
git config user.name
git config user.email
git config --show-origin user.email     # file:/home/ali/.gitconfig  ali@example.com
```

</details>

2. **Decide what to track** — For a Fiverr project folder containing `manual.md`, `manual.docx`, `cover.psd`, `build.py` and `client-brief.pdf`, list which files belong in Git and why.
<details><summary>Solution</summary>

Track `manual.md` and `build.py` (text, diffable, the true source). Track `client-brief.pdf` only if it is a small, rarely changing input. Do not track `manual.docx` if `build.py` generates it from the Markdown; generated output belongs in releases, not history. `cover.psd` is large and binary: keep it in Git LFS or cloud storage and link to it from the README.

</details>

### Interview Questions

**Q: Explain the three areas of Git.**
The working directory holds the files I edit; the staging area (index) is a prepared list of the exact content that will go into the next commit; the repository is the immutable history of commits inside `.git`. `git add` moves content from working directory to index, `git commit` moves it from index to repository, and `git restore` moves it back. The index is what lets me commit only the rate-matrix change now and leave a half-finished script uncommitted, or split one file's changes with `git add -p`. A candidate who says "add puts the file in Git" without mentioning the index usually does not understand partial commits.

**Q: Why is Git called distributed, and what practical difference does it make?**
Every clone is a complete repository with full history and all branches, not a checkout of a central copy. Practically that means I can commit, branch, diff, bisect and view history with no network, commits are fast because they touch only local disk, and there is no single point of failure: if GitHub vanished, any developer's clone could be pushed to a new host and nothing would be lost. It also changes workflow: you commit locally many times and synchronise with the team explicitly through push and pull, which is why concepts like remotes and tracking branches exist at all.

**Q: Should binary documents like DOCX and PDF go in Git?**
They can, but with limits. Git stores them fine and versions them, but it cannot show a readable diff or merge two people's edits, and every change stores a fresh compressed copy, so a 20 MB handbook edited fifty times adds hundreds of megabytes to every clone. My rule: keep the source that generates the document (Markdown, templates, XML, scripts) in Git, treat the binary as a build artefact attached to a release or tag, and if a binary genuinely must be versioned, enable Git LFS so the repository stores a pointer and the large file lives in separate storage.

## git init/add/commit

This chapter creates your first repository and records your first commits. Everything later in the course builds on the three commands in the title, so type them rather than read them. We will version a small SOP project: a Markdown procedure document and a script that converts it.

### Creating a repository

```bash
mkdir sop-qa-checklist && cd sop-qa-checklist
git init
ls -la          # notice the new .git folder
git status
```

`git init` creates the hidden `.git` folder, which is the entire repository: objects, refs, configuration and hooks. Delete that folder and the project is no longer under version control. `git status` is the command you will run more than any other; right now it says `On branch main` and `No commits yet`.

### Adding files to the staging area

```bash
echo "# QA Checklist for Title Search" > checklist.md
echo "- Verify legal description matches deed" >> checklist.md
git status        # checklist.md is listed under "Untracked files"
git add checklist.md
git status        # now under "Changes to be committed"
```

An **untracked** file is one Git has never been told about. `git add` does two things: it starts tracking the file and it copies its current content into the index. If you edit the file again after `git add`, the new edit is *not* staged; `git status` will show the file in both "staged" and "not staged" lists and you must `git add` again.

### Committing

```bash
git commit -m "Add QA checklist with legal description check"
git log
```

A commit needs a message. The `-m` flag supplies it inline; without `-m` Git opens your configured editor. The output looks like `[main (root-commit) 4f2a9c1] Add QA checklist ...` where `4f2a9c1` is the abbreviated SHA-1 hash that uniquely identifies the commit. `git log` shows the full hash, author, date and message.

### The edit-add-commit loop

```bash
echo "- Confirm vesting matches application" >> checklist.md
git status                     # "modified: checklist.md"
git diff                       # shows the added line with a + sign
git add checklist.md
git commit -m "Add vesting check to QA checklist"
```

Repeat this loop many times a day. Small commits with clear messages are the single habit that separates people who can use Git's history from people who cannot.

### Useful shortcuts and their dangers

| Command | What it does | Caution |
|---|---|---|
| `git add .` | Stage everything in the current folder and below | Stages junk too; check `git status` first |
| `git add -A` | Stage all changes in the whole repository including deletions | Same |
| `git add -p` | Interactively choose hunks to stage | Slower but produces clean commits |
| `git commit -am "msg"` | Stage all *tracked* modified files and commit | Does not add new files |
| `git commit --amend` | Replace the last commit with a new one | Never amend a commit you have already pushed |

### Writing a good commit message

The convention used by the Git project itself and most teams: a short imperative summary line of 50 characters or fewer ("Add", "Fix", "Remove", not "Added" or "Fixes"), a blank line, then an optional body wrapped at 72 characters explaining *why*. The summary is what `git log --oneline` and GitHub show, so make it specific: "Fix TOC page numbers after section 4 renumbering" beats "updates".

```text
Correct Wyoming simultaneous-issue rate rounding

The rate matrix rounded to the nearest dollar before applying the
simultaneous-issue discount, which under-charged by up to $0.50 on
loan policies. Round after the discount, matching the filed manual.
```

> **Warning:** `git commit` records only what is staged. A common beginner mistake is to create a new file, run `git commit -am`, and believe it was committed. `-a` only covers files Git already tracks. Always read `git status` before and after committing until the habit is automatic.

### Removing and renaming tracked files

```bash
git rm old-checklist.md                 # delete from disk and stage the deletion
git mv checklist.md qa-checklist.md     # rename and stage
git commit -m "Rename checklist and drop obsolete version"
```

If you delete or rename with the file explorer instead, Git sees a deletion plus an untracked file; `git add -A` reconciles it and Git detects the rename automatically when the content is similar.

### Try It Yourself

```bash
mkdir sop-qa-checklist && cd sop-qa-checklist
git init
echo "# QA Checklist for Title Search" > checklist.md
git add checklist.md
git commit -m "Add QA checklist"
echo "- Verify legal description matches deed" >> checklist.md
git diff
git commit -am "Add legal description check"
git log --oneline
```

### Quiz

1. After `git add file.md` you edit `file.md` again. What does `git commit -m "x"` record?
- [x] The version at the moment of `git add`
- [ ] The newest edit
- [ ] Both versions
> The commit records the index, and the second edit was never staged.

2. Which folder holds the whole repository?
- [ ] `.gitignore`
- [x] `.git`
- [ ] `.github`
> `.git` contains objects, refs, config and hooks; `.github` is only for GitHub features.

3. What does `git commit -am "msg"` skip?
- [ ] Modified tracked files
- [x] New untracked files
- [ ] Deleted files
> `-a` stages modifications and deletions of tracked files only.

4. What should the first line of a commit message be?
- [ ] A paragraph describing every change
- [x] A short imperative summary
- [ ] The author's name
> Tools truncate long summaries; the body carries the detail.

### Exercises

1. **Two clean commits** — In one file, add a heading and a bullet, but commit them as two separate commits with meaningful messages.
<details><summary>Solution</summary>

```bash
echo "## Escalation rules" > rules.md
git add rules.md && git commit -m "Add escalation rules heading"
echo "- Escalate any file idle over 48 hours" >> rules.md
git add rules.md && git commit -m "Add 48-hour idle escalation rule"
git log --oneline    # two entries
```

</details>

2. **Fix the last message** — You committed with the message "stuff". Replace it with a proper message without changing the content.
<details><summary>Solution</summary>

```bash
git commit --amend -m "Add rate matrix validation script"
```

`--amend` creates a new commit object replacing the previous one; it is safe only if the commit has not been pushed.

</details>

3. **Rename safely** — Rename `checklist.md` to `docs/qa-checklist.md` so Git records it as a rename.
<details><summary>Solution</summary>

```bash
mkdir docs
git mv checklist.md docs/qa-checklist.md
git commit -m "Move QA checklist into docs folder"
git log --oneline --follow docs/qa-checklist.md   # history follows the rename
```

</details>

### Interview Questions

**Q: What actually happens when you run `git commit`?**
Git takes the current index, writes a tree object describing every path and blob hash, then writes a commit object containing that tree's hash, the parent commit hash, author and committer identity with timestamps, and the message. It hashes that commit object to produce the commit ID and moves the current branch reference to point at it. Nothing in the working directory is read at commit time; only the index matters, which is why unstaged edits are excluded. If any pre-commit or commit-msg hooks are installed they run first and can abort the commit.

**Q: When is `git commit --amend` safe and when is it dangerous?**
Amend replaces the tip commit with a brand-new commit that has a different hash. On a local-only commit it is the right tool for fixing a typo in the message or adding a file you forgot. Once the commit has been pushed and someone else may have based work on it, amending rewrites shared history: your next push is rejected as non-fast-forward, and if you force-push, collaborators' clones diverge. My rule is amend freely before push, and after push create a follow-up commit instead, unless it is my own feature branch and I coordinate with the reviewer.

**Q: How do you make sure a commit contains only related changes?**
I review `git status` and `git diff` before staging, then stage selectively with `git add <file>` or `git add -p` to pick individual hunks. If I have already staged too much, `git restore --staged <file>` pulls it back out of the index. On a documentation project this means the commit that fixes cross-references does not also carry the unrelated table restyle, so a reviewer can reason about each and a bad change can be reverted alone. The commit message then describes one intention, which keeps `git log` useful as a changelog.

## Viewing history & diffs

A repository is only useful if you can read it. This chapter covers the commands that answer "what changed, when, by whom and why": `git log`, `git diff`, `git show` and `git blame`. If you have ever compared two versions of a contract in Word's Compare feature, `git diff` is the same idea for any text file, and `git log` is the change history Word never had.

### git log

```bash
git log                       # full details, newest first
git log --oneline             # one line per commit: short hash + summary
git log --oneline -n 10       # last ten
git log --oneline --graph --all --decorate   # ASCII branch graph
git log --stat                # which files changed and how many lines
git log -p                    # full patch of every commit
git log --author="Ali"        # filter by author
git log --since="2 weeks ago" --until="yesterday"
git log --grep="rate"         # commits whose message mentions rate
git log -- docs/manual.md     # history of one file
git log -S "SIMULTANEOUS"     # commits that added or removed this string
```

`--oneline --graph --all --decorate` is worth an alias; it shows every branch and tag as a picture. `-S` (the "pickaxe") is the fastest way to find when a specific line of a rate matrix appeared or disappeared.

### Formatting the log

```bash
git log --pretty=format:"%h %ad %an %s" --date=short
# 4f2a9c1 2026-09-01 Ali Raza Add QA checklist
```

Common placeholders: `%H` full hash, `%h` short hash, `%an` author name, `%ad` author date, `%s` subject, `%b` body, `%d` ref names. This is what you use to generate a changelog for a client release.

### git diff: three comparisons

The same command compares different pairs of the three areas depending on its flags.

| Command | Compares |
|---|---|
| `git diff` | Working directory vs index (unstaged changes) |
| `git diff --staged` (or `--cached`) | Index vs last commit (what will be committed) |
| `git diff HEAD` | Working directory vs last commit (everything not yet committed) |
| `git diff a1b2c3 d4e5f6` | Two commits |
| `git diff main..feature` | Tip of `feature` vs tip of `main` |
| `git diff main...feature` | `feature` vs the common ancestor (what the branch added) |
| `git diff -- rates.csv` | Restrict any of the above to one path |

Reading a diff:

```diff
diff --git a/rates.csv b/rates.csv
index 3e1f2a0..9c8b7d1 100644
--- a/rates.csv
+++ b/rates.csv
@@ -12,3 +12,3 @@ WY,OWNER,100000,575
-WY,OWNER,150000,725
+WY,OWNER,150000,750
 WY,OWNER,200000,875
```

`@@ -12,3 +12,3 @@` is a **hunk header**: the old file's lines 12–14 and the new file's lines 12–14. Lines starting with `-` were removed, `+` added, and a space is unchanged context. A modified line always appears as one removal plus one addition.

### Word-level and whitespace diffs

```bash
git diff --word-diff          # highlight changed words inside a line, ideal for prose
git diff -w                   # ignore whitespace changes
git diff --stat               # just a summary per file
git diff --color-words        # like --word-diff but colour only
```

For Markdown manuals `--word-diff` is essential; a re-flowed paragraph otherwise looks like the whole thing changed.

### git show

```bash
git show 4f2a9c1              # metadata + full patch of one commit
git show HEAD~2               # two commits before the current one
git show main:rates.csv       # print a file as it was at the tip of main
git show 4f2a9c1 --stat
```

`HEAD` is the commit you currently have checked out. `HEAD~1` is its first parent, `HEAD~3` three generations back. `HEAD^2` is the *second* parent of a merge commit. The `ref:path` syntax lets you read any historical file without checking it out.

### git blame

```bash
git blame rates.csv
git blame -L 10,20 rates.csv        # only lines 10–20
git blame -w -M -C rates.csv        # ignore whitespace, detect moved/copied lines
```

Each line is prefixed with the commit that last touched it, the author and the date. Blame answers "who changed this rate and in which commit", and then `git show <hash>` gives the reason from the commit message. Despite the name, the intended use is archaeology, not accusation.

> **Tip:** Create aliases for the commands you type daily: `git config --global alias.lg "log --oneline --graph --all --decorate"` and `git config --global alias.st "status -sb"`. Now `git lg` draws the graph and `git st` gives a compact status. Aliases live in `~/.gitconfig` and travel with your dotfiles.

### Try It Yourself

```bash
git log --oneline --graph --all --decorate
git log --pretty=format:"%h %ad %an %s" --date=short -n 5
git diff HEAD~1 HEAD --stat
git show HEAD --word-diff
git blame -L 1,5 checklist.md
```

### Quiz

1. Which command shows changes that are staged but not yet committed?
- [ ] `git diff`
- [x] `git diff --staged`
- [ ] `git diff HEAD`
> `git diff` alone compares the working directory to the index; `--staged` compares the index to HEAD.

2. In a hunk header `@@ -12,3 +12,3 @@`, what does `-12,3` mean?
- [x] Three lines starting at line 12 in the old file
- [ ] Twelve lines removed, three added
- [ ] Line 12 became line 3
> The minus side describes the old file, the plus side the new file.

3. Which command finds the commit that introduced the string `SIMULTANEOUS`?
- [ ] `git grep SIMULTANEOUS`
- [x] `git log -S SIMULTANEOUS`
- [ ] `git blame SIMULTANEOUS`
> `-S` searches history for commits that changed the number of occurrences; `git grep` searches the current tree only.

4. What does `HEAD~2` refer to?
- [ ] The second branch
- [x] The grandparent of the current commit
- [ ] The second parent of a merge
> `~n` walks first parents n times; `^2` selects the second parent of a merge.

### Exercises

1. **Changelog** — Print every commit from the last 30 days as `date hash subject`, oldest first.
<details><summary>Solution</summary>

```bash
git log --since="30 days ago" --reverse --pretty=format:"%ad %h %s" --date=short
```

</details>

2. **Historical file** — Print `rates.csv` as it existed three commits ago without checking anything out.
<details><summary>Solution</summary>

```bash
git show HEAD~3:rates.csv
# save it for comparison:
git show HEAD~3:rates.csv > rates-old.csv
```

</details>

3. **Prose diff** — Compare the last two versions of `manual.md` showing changed words, ignoring whitespace.
<details><summary>Solution</summary>

```bash
git diff -w --word-diff HEAD~1 HEAD -- manual.md
```

</details>

### Interview Questions

**Q: What is the difference between `git diff main..feature` and `git diff main...feature`?**
Two dots compare the tips: everything that differs between the current state of `main` and the current state of `feature`, including changes that landed on `main` after the branch was created, which show up as if `feature` removed them. Three dots compare `feature` against the merge base, the common ancestor, so you see only what the feature branch itself introduced. For code review the three-dot form is what you want and it is what GitHub's pull request diff uses. `git log` reverses the intuition: `main..feature` lists commits reachable from feature but not main, which is the useful one there.

**Q: How would you find out why a particular line in a config file was changed?**
`git blame -w path` on the line gives the commit hash and author; `git show <hash>` shows the full commit with its message and the other files changed alongside it, which is usually enough context. If the blame points at a formatting or bulk-rename commit, I re-run blame at the parent of that commit with `git blame <hash>^ -- path` to walk past it, or use `git log -S "the text" -- path` to jump straight to the commit that introduced the text. On GitHub the same thing is the Blame view with the "View blame prior to this change" button.

**Q: Explain `HEAD`, `HEAD~1` and `HEAD^2`.**
`HEAD` is a symbolic reference to the commit currently checked out, normally via a branch name. `HEAD~1` is its first parent and `HEAD~n` follows first parents n times, so it walks straight back down the branch you are on. `HEAD^2` selects the second parent of a merge commit, the branch that was merged in, so `HEAD^2~3` means "three commits back along the merged-in branch". Knowing this lets you write revisions like `git diff HEAD~5 HEAD -- docs/` in a code review without needing hashes.

## .gitignore

Every project produces files that should never be committed: editor backups, compiled output, virtual environments, generated PDFs, `node_modules` with 40 000 files, and secrets such as API keys. A `.gitignore` file lists patterns for paths Git should treat as invisible. Without it, `git add .` will drag everything into history, the repository swells, and one day a `.env` containing a client's SharePoint password is on GitHub forever.

### Creating one

```bash
cat > .gitignore <<'EOF'
# Python
__pycache__/
*.pyc
.venv/

# Office temp and generated output
~$*.docx
~$*.xlsx
*.tmp
build/
output/*.pdf

# Editors and OS
.vscode/
.idea/
.DS_Store
Thumbs.db

# Secrets
.env
*.pem
EOF
git add .gitignore
git commit -m "Add gitignore for Python and Office temp files"
```

The `.gitignore` file itself is committed so every collaborator shares the same rules. The `~$*.docx` pattern matters in a document shop: Word creates lock files named `~$Handbook.docx` while a file is open and they must never be committed.

### Pattern rules

| Pattern | Matches |
|---|---|
| `*.log` | Any file ending in `.log`, in any folder |
| `build/` | A directory named `build` anywhere (trailing slash means directory only) |
| `/build` | Only `build` at the repository root |
| `docs/*.pdf` | PDFs directly inside `docs`, not in sub-folders |
| `docs/**/*.pdf` | PDFs anywhere under `docs` |
| `!keep.pdf` | Negation: re-include a file a previous pattern excluded |
| `# comment` | Ignored line |
| `\#file` | A file whose name really starts with `#` |

Patterns are matched relative to the location of the `.gitignore` file, and a repository can have several: one at the root plus, say, `tests/.gitignore` with rules local to tests. Later rules override earlier ones, so `*.pdf` followed by `!samples/demo.pdf` keeps one example PDF. Note that you cannot re-include a file if its parent directory is excluded.

### Already-tracked files are not ignored

`.gitignore` only affects untracked files. If `output/report.pdf` was committed last week, adding `output/` to `.gitignore` changes nothing; Git keeps tracking it. To stop tracking without deleting the local copy:

```bash
git rm --cached output/report.pdf
git commit -m "Stop tracking generated report"
```

`--cached` removes the path from the index only. For a whole folder use `git rm -r --cached output/`.

### Debugging why a file is ignored

```bash
git check-ignore -v output/report.pdf
# .gitignore:9:output/*.pdf    output/report.pdf
git status --ignored             # list ignored files
git add -f important.pdf         # force-add despite the rules (rarely wise)
```

`check-ignore -v` prints the file, line number and pattern responsible, which ends every "why won't Git see my file" argument in seconds.

### Global and per-clone ignores

Editor and OS junk is personal, not project-specific, so many developers keep it out of every project's `.gitignore` and put it in a global file instead:

```bash
git config --global core.excludesFile ~/.gitignore_global
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
```

A third location, `.git/info/exclude`, holds rules for one clone only and is never committed; use it for a scratch folder you alone keep inside the project.

### Templates

GitHub's `github/gitignore` repository has maintained templates for Python, Node, LaTeX, Unity and hundreds more, and the "Add .gitignore" dropdown when creating a repository on GitHub uses them. The gitignore.io service (now at toptal.com/developers/gitignore) generates a combined file from a list of tools, for example `python,visualstudiocode,windows,macos`.

> **Warning:** Ignoring a file does not remove it from history. If a secret was committed even once, rotate the secret immediately and then scrub history (covered in the Expert level). Adding `.env` to `.gitignore` after the fact only stops future commits.

### Empty folders and `.gitkeep`

Git tracks files, not directories, so an empty `output/` folder cannot be committed. The convention is to add an empty placeholder file, usually named `.gitkeep`, and a rule such as `output/*` followed by `!output/.gitkeep` so the folder exists in every clone but its contents stay ignored.

### Try It Yourself

```bash
printf '%s\n' '__pycache__/' '*.pyc' '.venv/' '~$*.docx' 'output/*' '!output/.gitkeep' '.env' > .gitignore
mkdir -p output && touch output/.gitkeep
touch output/report.pdf .env
git status --short          # .gitignore and output/.gitkeep appear; report.pdf and .env do not
git check-ignore -v output/report.pdf .env
```

### Quiz

1. You add `*.pdf` to `.gitignore`, but `git status` still shows `report.pdf` as modified. Why?
- [ ] The pattern needs a leading slash
- [x] The file is already tracked; ignore rules only affect untracked files
- [ ] `.gitignore` must be committed first
> Use `git rm --cached report.pdf` to stop tracking it.

2. What does a trailing slash in `build/` mean?
- [x] Match only directories named build
- [ ] Match files named build
- [ ] Match build at the root only
> A leading slash anchors to the root; a trailing slash restricts to directories.

3. Which command explains why a path is ignored?
- [ ] `git status -v`
- [x] `git check-ignore -v path`
- [ ] `git ignore --why path`
> It prints the file, line and pattern that matched.

4. Where do personal editor-junk patterns belong?
- [ ] In every project's `.gitignore`
- [x] In a global excludes file configured via `core.excludesFile`
- [ ] Nowhere; commit them
> Project files should describe the project, not your editor.

### Exercises

1. **Untrack a folder** — `node_modules/` was committed by mistake. Stop tracking it, keep it on disk, and prevent it coming back.
<details><summary>Solution</summary>

```bash
echo "node_modules/" >> .gitignore
git rm -r --cached node_modules
git add .gitignore
git commit -m "Remove node_modules from version control"
```

</details>

2. **Keep one sample** — Ignore every `.docx` under `deliverables/` except `deliverables/sample-letterhead.docx`.
<details><summary>Solution</summary>

```text
deliverables/**/*.docx
!deliverables/sample-letterhead.docx
```

The negation must come after the exclusion and the parent folder must not itself be ignored.

</details>

3. **Diagnose** — A colleague says `git add docs/spec.md` reports "The following paths are ignored". Find the rule and force-add if appropriate.
<details><summary>Solution</summary>

```bash
git check-ignore -v docs/spec.md     # e.g. .gitignore:4:docs/   docs/spec.md
# Either fix the rule (docs/*.pdf instead of docs/) or:
git add -f docs/spec.md
```

Fixing the rule is better than force-adding; forced files stay tracked but the confusing rule remains for the next person.

</details>

### Interview Questions

**Q: A secret was committed and pushed. What do you do?**
First rotate the secret immediately, because the moment it hit a remote you must assume it was scraped; adding it to `.gitignore` or deleting it in a new commit does nothing for history. Then remove it from history with `git filter-repo --path .env --invert-paths` (or the BFG Repo-Cleaner), force-push every branch and tag, ask collaborators to re-clone, and on GitHub contact support to purge cached views. Finally add the pattern to `.gitignore`, enable secret scanning and push protection in the repository settings, and consider a pre-commit hook such as gitleaks so it cannot happen again.

**Q: Why does adding a pattern to `.gitignore` not stop Git tracking a file?**
Ignore rules are consulted only when Git decides whether to list or add *untracked* paths. Once a path is in the index, Git already knows about it and will report modifications regardless of `.gitignore`. To untrack it you remove it from the index with `git rm --cached`, commit that removal, and then the ignore rule takes effect for future additions. This is a common source of confusion when generated files like `dist/` or `*.pbix` were committed early in a project's life.

**Q: What is the difference between `.gitignore`, `.git/info/exclude` and a global excludes file?**
All three use the same pattern syntax but differ in scope and sharing. `.gitignore` is committed, so it is shared with the whole team and should describe the project's build outputs and tooling. `.git/info/exclude` is local to one clone, never committed, and suits personal scratch files inside a project. The global file set with `core.excludesFile` applies to every repository on your machine and is the right place for `.DS_Store`, `Thumbs.db` and editor folders, keeping project files free of personal noise.

# LEVEL: Intermediate

## Branching & merging

A **branch** is a movable pointer to a commit. That is the whole definition, and it explains why Git branches cost nothing: creating one writes a 41-byte file containing a commit hash. When you commit on a branch, the pointer moves forward to the new commit. `HEAD` is a pointer to the branch you are currently on, so committing moves both. Branches let you work on the Texas rate-matrix update while the main line stays shippable, and let three people work on three features without treading on each other.

### Creating and switching

```bash
git branch                       # list local branches, * marks current
git branch texas-rates           # create a branch at the current commit
git switch texas-rates           # move HEAD to it (Git 2.23+)
git switch -c ohio-rates         # create and switch in one step
git checkout -b ohio-rates       # older equivalent still widely used
git switch main                  # go back
git branch -d texas-rates        # delete a merged branch
git branch -D texas-rates        # force delete an unmerged branch
```

`git switch` and `git restore` were introduced in Git 2.23 (2019) to split the overloaded `git checkout` into two clear commands. Both forms work; new tutorials use `switch`.

### What happens on switch

Switching a branch rewrites the working directory and index to match that branch's snapshot. Files that differ are replaced; files that are identical on both branches are untouched. If you have uncommitted changes that would be overwritten, Git refuses with "Please commit your changes or stash them before you switch". That refusal protects you; the Stash chapter shows the escape hatch.

### Fast-forward merges

```bash
git switch main
git merge texas-rates
# Updating 4f2a9c1..9e8d7c6
# Fast-forward
```

If `main` has not moved since `texas-rates` was created, `main` is a direct ancestor of the branch tip. Git simply moves the `main` pointer forward to the same commit; no new commit is created. History stays a straight line.

```text
before:  main ──▶ A
                   \
        texas-rates ──▶ B ──▶ C

after:   main, texas-rates ──▶ A ──▶ B ──▶ C
```

### Three-way merges

If both branches have new commits, Git finds the **merge base** (nearest common ancestor), computes what each side changed relative to it, combines them, and records a **merge commit** with two parents.

```text
          A ──▶ D ──▶ E   (main)
           \           \
            B ──▶ C ────▶ M   (merge commit, parents E and C)
```

```bash
git switch main
git merge texas-rates
# Merge made by the 'ort' strategy.
git log --oneline --graph
```

`ort` is the default merge strategy since Git 2.34 (2021), replacing `recursive`; it is faster and handles renames better. When both sides changed the same lines Git cannot decide and stops with a conflict, which has its own chapter in Advanced.

### Merge options you will actually use

| Flag | Effect |
|---|---|
| `--no-ff` | Always create a merge commit even when fast-forward is possible, so the feature is visible as a unit in history |
| `--ff-only` | Refuse to merge unless it is a fast-forward; used to keep `main` linear |
| `--squash` | Combine all branch commits into staged changes; you then make one commit (no merge parent recorded) |
| `--abort` | Stop a conflicted merge and restore the pre-merge state |
| `-m "msg"` | Supply the merge commit message |

Teams usually pick one convention: merge commits with `--no-ff` (history shows features as bubbles), squash merges (one commit per feature, tidy but loses granular history), or rebase-then-fast-forward (linear history, covered in Advanced).

### Seeing branch relationships

```bash
git branch --merged           # branches already merged into current; safe to delete
git branch --no-merged        # branches with unmerged work
git log main..texas-rates     # commits on texas-rates not yet in main
git merge-base main texas-rates   # the common ancestor hash
git branch -vv                # each branch with its tracking remote and last commit
```

> **Tip:** Name branches by purpose with a prefix: `feature/ohio-rates`, `fix/toc-page-numbers`, `docs/sop-escalation`. Slashes create a visual hierarchy in most tools and hint at what a branch is for months later. Delete branches as soon as they are merged; a repository with 200 stale branches is a repository nobody can navigate.

### Detached HEAD

`git switch --detach 4f2a9c1` or `git checkout 4f2a9c1` puts HEAD directly on a commit rather than a branch. You can look around and even commit, but those commits belong to no branch and will be garbage-collected once you switch away, unless you run `git switch -c rescue-branch` to give them a name. Git warns loudly when you enter this state; read the warning.

### Try It Yourself

```bash
git switch -c feature/ohio-rates
echo "OH,OWNER,100000,610" >> rates.csv
git commit -am "Add Ohio owner policy rates"
git switch main
git merge --no-ff feature/ohio-rates -m "Merge Ohio rates"
git log --oneline --graph --decorate
git branch -d feature/ohio-rates
```

### Quiz

1. What is a Git branch, physically?
- [ ] A copy of the project folder
- [x] A file containing a commit hash
- [ ] A list of diffs
> Branches are 41-byte pointer files under `.git/refs/heads/`, which is why they are instant to create.

2. When does a fast-forward merge happen?
- [x] When the target branch has no new commits since the feature branch diverged
- [ ] When there are no conflicts
- [ ] When `--no-ff` is given
> If `main` is an ancestor of the feature tip, Git just moves the pointer.

3. What does `git merge --squash feature` produce?
- [ ] A merge commit with two parents
- [x] Staged changes for a single new commit with one parent
- [ ] A rebased branch
> Squash flattens the branch's work into the index; you then commit normally and no merge relationship is recorded.

4. You are in detached HEAD and made two commits. How do you keep them?
- [ ] `git merge HEAD`
- [x] `git switch -c some-branch`
- [ ] They are kept automatically
> Creating a branch at the current commit gives the commits a reference so they will not be pruned.

### Exercises

1. **Diverged merge** — Create a branch, commit on it, commit a different file on `main`, merge, and show the graph.
<details><summary>Solution</summary>

```bash
git switch -c fix/header
echo "header fix" >> header.md && git add header.md && git commit -m "Fix header"
git switch main
echo "footer" >> footer.md && git add footer.md && git commit -m "Add footer"
git merge fix/header          # three-way merge, creates merge commit
git log --oneline --graph
```

</details>

2. **Safe cleanup** — List branches that are fully merged into `main` and delete all of them except `main`.
<details><summary>Solution</summary>

```bash
git switch main
git branch --merged | grep -v "^\*" | grep -v "main" | xargs -r git branch -d
```

</details>

3. **What is on the branch?** — Show only the commits that `feature/ohio-rates` adds on top of `main`, with file stats.
<details><summary>Solution</summary>

```bash
git log --oneline --stat main..feature/ohio-rates
```

</details>

### Interview Questions

**Q: What is the difference between a fast-forward merge and a three-way merge?**
A fast-forward occurs when the branch being merged into has not diverged: its tip is an ancestor of the incoming branch, so Git just moves the pointer and no merge commit exists. A three-way merge happens when both sides have new commits; Git uses the merge base and the two tips as the three inputs, applies both sets of changes, and records a merge commit with two parents. The trade-off is history shape: fast-forwards keep it linear but hide that a feature branch existed, while `--no-ff` merges preserve the grouping at the cost of a busier graph. On our team we require `--no-ff` for release merges so a revert of a whole feature is a single `git revert -m 1`.

**Q: Why are branches cheap in Git but expensive in older systems like Subversion?**
In Subversion a branch is a copy of the directory tree in the repository, and switching or merging involves the server and directory comparisons. In Git a branch is a reference file pointing at a commit; commits already store complete snapshots, so nothing is copied and switching just checks out a different snapshot, touching only files that differ. Because branching is a sub-millisecond operation, Git workflows encourage a branch per task and frequent merges, which would be impractical if each branch cost a full copy.

**Q: When would you use `git merge --squash` and what do you lose?**
Squash merging is right when a feature branch has messy incremental commits ("wip", "fix typo") that add noise to `main`, and the team wants exactly one commit per feature for a clean changelog and easy revert. What you lose is the individual commits and, importantly, the merge relationship: Git does not record that the branch was merged, so `git branch --merged` will not list it and merging the same branch again later re-applies everything. GitHub's "Squash and merge" button does this; I use it for small PRs and prefer rebase-and-merge when the commit history itself is valuable.

## Remotes, push/pull/fetch & GitHub

Everything so far lived on one machine. A **remote** is a named URL pointing at another copy of the repository, typically on GitHub. You upload commits with `push`, download them with `fetch`, and `pull` is fetch followed by merge. This chapter connects your local repository to GitHub and explains the tracking-branch model that makes `git status` say "your branch is ahead by 2 commits".

### Cloning versus adding a remote

```bash
# Start from GitHub: creates folder, sets remote "origin", checks out default branch
git clone https://github.com/aliraza/rate-tools.git
cd rate-tools
git remote -v
# origin  https://github.com/aliraza/rate-tools.git (fetch)
# origin  https://github.com/aliraza/rate-tools.git (push)

# Start locally: create an empty repo on GitHub first, then connect
git remote add origin git@github.com:aliraza/rate-tools.git
git push -u origin main
```

`origin` is just the conventional name for the remote you cloned from; you can have several (`upstream` for the original project when you fork, for example). `-u` (`--set-upstream`) records that local `main` tracks `origin/main`, so future `git push` and `git pull` need no arguments.

### HTTPS versus SSH

| | HTTPS | SSH |
|---|---|---|
| URL | `https://github.com/user/repo.git` | `git@github.com:user/repo.git` |
| Auth | Personal access token (passwords no longer accepted since August 2021), cached by Git Credential Manager | Key pair; public key added under Settings → SSH and GPG keys |
| Works through corporate proxies | Usually | Sometimes blocked on port 22 |
| Setup | `gh auth login` or token prompt | `ssh-keygen -t ed25519 -C "ali@example.com"` then `ssh -T git@github.com` |

Either is fine. Git Credential Manager ships with Git for Windows and stores the token securely after the first prompt.

### Remote-tracking branches

After a clone or fetch, your repository contains `origin/main`, `origin/feature-x` and so on. These are **remote-tracking branches**: read-only local bookmarks of where the remote's branches were the last time you talked to it. They are not the remote itself and they only move when you fetch or push.

```bash
git branch -r          # remote-tracking branches
git branch -a          # local + remote
git fetch origin       # update all origin/* bookmarks, touch nothing else
git log main..origin/main      # what others pushed that I do not have
git log origin/main..main      # what I have that is not pushed yet
```

### fetch, pull and the difference

`git fetch` downloads new objects and moves `origin/*` pointers. It never changes your branches or files, so it is always safe. `git pull` is `git fetch` followed by `git merge origin/<branch>` into your current branch (or a rebase if configured). Because the merge can produce a merge commit or a conflict, `pull` is the one to be deliberate about.

```bash
git pull                     # fetch + merge (creates "Merge branch 'main' of ..." commits when diverged)
git pull --rebase            # fetch + rebase your local commits on top; linear history
git pull --ff-only           # refuse if a merge would be needed
git config --global pull.rebase true    # make --rebase the default
```

Since Git 2.27, running `git pull` on a diverged branch without a configured preference prints a warning asking you to choose; set `pull.rebase` or `pull.ff` once and it goes away.

### push and its rejections

```bash
git push                     # push current branch to its upstream
git push origin feature/ohio-rates      # push a branch by name
git push -u origin feature/ohio-rates   # and set upstream the first time
git push origin --delete feature/ohio-rates   # delete remote branch
git push --tags              # push tags (not pushed by default)
```

A push is rejected as `! [rejected] main -> main (non-fast-forward)` when the remote has commits you do not have. The fix is never `--force`; it is `git pull` (or `git pull --rebase`), resolve anything needed, then push again. `--force-with-lease` exists for the case where you deliberately rewrote your own feature branch and want to overwrite the remote *only if* nobody else pushed in the meantime.

> **Warning:** `git push --force` overwrites the remote branch with yours and discards any commits others pushed. On a shared branch this destroys colleagues' work. Prefer `--force-with-lease`, and on GitHub protect `main` so force-pushes are refused outright (Settings → Branches → Branch protection rules or the newer Rulesets).

### The GitHub side

A GitHub repository page gives you: the file browser at the default branch, a commit list, branches and tags, Issues, Pull requests, Actions, Wiki and Settings. Create a repository with the **New** button or from the command line with the GitHub CLI:

```bash
gh auth login
gh repo create rate-tools --private --source=. --push
gh repo view --web
```

The `gh` CLI wraps the GitHub API; `gh pr`, `gh issue` and `gh run` appear in later chapters. Private repositories are free for unlimited collaborators on personal accounts.

### A typical day

```bash
git switch main && git pull --ff-only          # start from the latest main
git switch -c fix/rounding
# ...edit, commit...
git push -u origin fix/rounding                # publish the branch
# open a pull request on GitHub (next chapter)
```

### Try It Yourself

```bash
git remote -v
git fetch origin
git status -sb                      # ## main...origin/main [ahead 1]
git log --oneline origin/main..main
git push -u origin main
git branch -vv
```

### Quiz

1. What does `git fetch` change?
- [ ] Your current branch
- [x] Remote-tracking branches such as `origin/main`
- [ ] Your working directory files
> Fetch only downloads objects and updates the `origin/*` bookmarks; it is always safe.

2. `git pull` is equivalent to which sequence by default?
- [ ] `git fetch` then `git rebase`
- [x] `git fetch` then `git merge`
- [ ] `git clone` then `git merge`
> Set `pull.rebase true` to make it fetch-then-rebase instead.

3. Your push is rejected as non-fast-forward. What is the correct response?
- [ ] `git push --force`
- [x] `git pull` (or `--rebase`), resolve, then push
- [ ] Delete the remote branch and push again
> The remote has commits you lack; integrate them first.

4. What does `-u` do in `git push -u origin main`?
- [ ] Updates the remote URL
- [x] Sets `origin/main` as the upstream for local `main`
- [ ] Uploads untracked files
> With an upstream set, plain `git push`, `git pull` and `git status` know which remote branch to compare with.

### Exercises

1. **Connect an existing project** — You have a local repository with commits and an empty GitHub repo. Connect and publish it.
<details><summary>Solution</summary>

```bash
git remote add origin git@github.com:aliraza/sop-library.git
git push -u origin main
git remote -v
```

</details>

2. **Inspect divergence** — Without changing anything, show how many commits your `main` is ahead of and behind `origin/main`.
<details><summary>Solution</summary>

```bash
git fetch origin
git rev-list --left-right --count main...origin/main    # "2  1" = ahead 2, behind 1
git status -sb
```

</details>

3. **Rename the default branch** — The repo still uses `master`. Rename it to `main` locally and on GitHub.
<details><summary>Solution</summary>

```bash
git branch -m master main
git push -u origin main
# On GitHub: Settings → General → Default branch → switch to main, then:
git push origin --delete master
```

</details>

### Interview Questions

**Q: What is the difference between `git fetch` and `git pull`, and which do you prefer?**
Fetch downloads new commits and updates remote-tracking branches without touching my branch or working files, so I can inspect `git log main..origin/main` and decide how to integrate. Pull does the fetch and then immediately merges (or rebases, if `pull.rebase` is set) into my current branch, which can create a merge commit or a conflict at a moment I did not choose. I prefer `git fetch` followed by an explicit `git rebase origin/main` on feature branches and `git pull --ff-only` on `main`, so `main` can never silently gain a merge commit. Setting `pull.ff only` globally enforces that.

**Q: What is `origin/main` exactly?**
It is a remote-tracking branch: a local, read-only reference under `.git/refs/remotes/origin/main` recording where `main` on the remote named `origin` pointed the last time I fetched or pushed. It is not live; if a colleague pushes, `origin/main` does not move until I fetch. It is also not the remote's branch itself, so I cannot commit to it. Its purpose is to let Git compute "ahead by 2, behind by 1" and to give merges and rebases a local target without a network round trip.

**Q: When is force-pushing acceptable?**
Only on a branch I own and that nobody else builds on, typically my own feature branch after an interactive rebase to clean up commits before review, and even then with `--force-with-lease` so the push fails if someone else has pushed to that branch since my last fetch. Never on `main`, release branches or any branch a pull request from someone else targets; those should be protected on the server so the question cannot arise. If shared history genuinely must be rewritten, for example to purge a leaked secret, it is announced, done once, and everyone re-clones.

## Pull requests & code review

A **pull request** (PR) is GitHub's mechanism for proposing that the commits on one branch be merged into another, with a discussion thread, line-by-line review, automated checks and an audit trail. GitLab calls the same thing a merge request. In professional teams nothing reaches `main` except through a PR, which is how you get a second pair of eyes on every change, a searchable record of why a change was made, and CI results before the merge, not after.

### Creating a pull request

```bash
git switch -c fix/toc-page-numbers
# edit, commit
git push -u origin fix/toc-page-numbers
gh pr create --base main --title "Fix TOC page numbers after section 4 renumbering" \
  --body "Closes #42. Regenerates the TOC field after the renumbering script runs."
gh pr view --web
```

On the website the same thing is the **Compare & pull request** banner that appears after a push, or Pull requests → New pull request. You choose the **base** branch (where the change goes) and the **compare** branch (your work). GitHub shows the three-dot diff and the commit list, and you write a title and description.

### What a good PR looks like

| Element | Guidance |
|---|---|
| Size | Under ~400 changed lines; reviewers' attention drops sharply beyond that |
| Title | Imperative, specific, like a commit subject |
| Description | What and why, how to test, screenshots for visual changes, links to the issue (`Closes #42` auto-closes it on merge) |
| Commits | Logical, each building; squash "fix typo" noise before requesting review |
| Checks | CI green, or an explanation of why a failure is unrelated |
| Draft | Open as a **Draft PR** when you want early feedback but it is not ready to merge |

Repositories can supply a `.github/PULL_REQUEST_TEMPLATE.md` so every PR opens with the same checklist, and a `CODEOWNERS` file so the right people are auto-requested as reviewers for paths they own.

### Reviewing

A reviewer opens **Files changed**, reads the diff, and clicks a line to leave a comment. Comments can be batched into a single review, submitted as **Comment**, **Approve** or **Request changes**. GitHub's **suggestion** feature lets a reviewer propose an exact replacement that the author can apply with one click:

````text
```suggestion
    rate = round(base * (1 - discount), 2)
```
````

Good review comments distinguish severity: prefix with *nit:* for style, *question:* for something you do not understand, *blocking:* for a defect. Review the logic, the tests, the naming and the error handling; leave formatting to a linter. Respond to every comment, resolve threads when addressed, and push follow-up commits rather than force-pushing during review so the reviewer can see only what changed since their last look.

### Branch protection and merge queue

Under Settings → Branches (or Rules → Rulesets), require: pull request before merging, at least one approval, review from code owners, status checks to pass, branches up to date before merging, and no force pushes. With these on, nobody, including admins if you tick it, can push straight to `main`. Large repositories add a **merge queue**, which rebases and tests each approved PR in order before merging so `main` never breaks.

### Merging: three buttons

| Button | Result on `main` | Use when |
|---|---|---|
| **Create a merge commit** | A merge commit with two parents; branch commits preserved | You want the exact history and a single revertable merge node |
| **Squash and merge** | One new commit containing all changes; PR commits discarded | Many noisy commits; one logical change per PR |
| **Rebase and merge** | Branch commits replayed onto `main` individually, no merge commit | Clean, linear history with meaningful commits |

Most teams standardise on one, enforced in Settings → General → Pull Requests. After merging, delete the branch (GitHub can do this automatically) and `git pull` on `main` locally.

### Forks

For a repository you cannot push to, click **Fork** to copy it into your account, clone your fork, add the original as `upstream`, branch, push to your fork, and open a PR from `yourname:branch` to `original:main`. Keep the fork current with `git fetch upstream && git rebase upstream/main`.

```bash
gh repo fork owner/project --clone
cd project
git remote -v        # origin = your fork, upstream = original
```

> **Interview note:** Interviewers love "walk me through your PR process". Have a concrete answer: branch from fresh `main`, small commits, self-review the diff on GitHub before requesting review, link the issue, respond to every comment, squash-merge, delete the branch. Mention that you review others' PRs promptly because review latency is the biggest throughput killer on most teams.

### Reviewing locally

```bash
gh pr list
gh pr checkout 57            # fetches the PR branch and switches to it
gh pr diff 57
gh pr review 57 --approve --body "Verified the TOC regenerates on the 767-page handbook."
gh pr merge 57 --squash --delete-branch
```

### Try It Yourself

```bash
git switch -c docs/escalation-sop
echo "## Escalation SOP" >> sop.md
git add sop.md && git commit -m "Add escalation SOP section"
git push -u origin docs/escalation-sop
gh pr create --fill --base main
gh pr status
```

### Quiz

1. Which merge button discards the individual commits of the PR branch?
- [ ] Create a merge commit
- [x] Squash and merge
- [ ] Rebase and merge
> Squash produces one new commit; the branch's commits are not part of `main`'s history.

2. What does `Closes #42` in a PR description do?
- [ ] Deletes issue 42
- [x] Automatically closes issue 42 when the PR is merged into the default branch
- [ ] Assigns the reviewer of issue 42
> Keywords `close`, `fix` and `resolve` (and their variants) link and auto-close issues.

3. Why should authors avoid force-pushing during an active review?
- [ ] GitHub forbids it
- [x] The reviewer loses the ability to see only what changed since their last review
- [ ] It closes the PR
> Follow-up commits keep the incremental review view intact; squash at the end instead.

4. What file auto-assigns reviewers by path?
- [ ] `.github/REVIEWERS`
- [x] `CODEOWNERS`
- [ ] `PULL_REQUEST_TEMPLATE.md`
> CODEOWNERS maps glob patterns to users or teams; branch protection can require their approval.

### Exercises

1. **Draft to ready** — Open a PR as a draft from the CLI, then mark it ready for review.
<details><summary>Solution</summary>

```bash
gh pr create --draft --title "WIP: Texas rate matrix" --body "Early look, not ready"
gh pr ready          # converts the current branch's draft PR to ready
```

</details>

2. **Write a PR template** — Create a template that asks for a summary, test steps and a checklist.
<details><summary>Solution</summary>

```text
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## Summary
<!-- What changed and why -->

## How to test
1.

## Checklist
- [ ] Linked issue
- [ ] Tests or sample documents added/updated
- [ ] No secrets or generated files committed
```

</details>

3. **Review a colleague's PR locally** — Check out PR 12, run the project's tests, and approve from the terminal.
<details><summary>Solution</summary>

```bash
gh pr checkout 12
python -m pytest
gh pr review 12 --approve --body "Tests pass locally; rounding matches filed manual."
```

</details>

### Interview Questions

**Q: What do you look for when reviewing a pull request?**
First whether the change does what the linked issue asks and nothing else; scope creep is the most common problem. Then correctness: edge cases, error handling, off-by-one in loops, rounding in money calculations, and whether tests actually exercise the change. Then maintainability: names, duplication, whether a future reader understands it without the PR description. I leave formatting to the linter and CI. I distinguish blocking issues from nits so the author knows what must change, and I try to review within a few hours because a PR waiting two days costs more than any style problem.

**Q: Merge commit, squash or rebase: which merge strategy would you choose for a team?**
For most product teams I choose squash-and-merge: each PR becomes one well-titled commit on `main`, the changelog is readable, `git bisect` steps through whole features, and reverting a feature is one command. The cost is losing intra-PR history, which is acceptable if PRs are small. Rebase-and-merge suits teams that craft their commits carefully and want them preserved in a linear line. Merge commits preserve everything and make the branch visible in the graph but produce a noisy history. Whichever we pick, it is enforced in repository settings so the graph stays consistent.

**Q: How do you keep pull requests small?**
I split work vertically: one PR for the data-model change, one for the calculation, one for the report layout, each shippable behind a flag if necessary. Refactors and reformatting go in their own PR before the feature so the feature diff is only the feature. I open a draft PR early so reviewers see direction before I sink days into it, and I use stacked branches when a later change depends on an earlier one under review. A good heuristic is that a reviewer should finish in under twenty minutes; if not, the PR is too large.

## Undoing things (restore/reset/revert)

Git offers several ways to undo, and choosing the wrong one is how people lose work or rewrite shared history by accident. The rule of thumb: `restore` undoes changes in the working directory or index, `reset` moves the branch pointer (and optionally index and files), and `revert` creates a *new* commit that cancels an old one. Only `revert` is safe on history that has been pushed.

### Discarding working-directory changes

```bash
git restore rates.csv              # throw away unstaged edits to one file
git restore .                      # ...to everything (cannot be undone!)
git restore --staged rates.csv     # unstage: copy HEAD's version back into the index, keep edits
git restore --source=HEAD~2 rates.csv     # replace the file with an older version (unstaged)
git checkout -- rates.csv          # pre-2.23 form of the first command
```

`git restore` (2.23+) took over the file-restoring half of `git checkout`. Unstaged edits that you `restore` are gone; Git never saw them, so there is nothing to recover.

### Removing untracked files

```bash
git clean -n         # dry run: list what would be deleted
git clean -f         # delete untracked files
git clean -fd        # ...and untracked directories
git clean -fdx       # ...and ignored files too (build output, .venv)
```

Always run `-n` first. `clean -fdx` on a documents project will delete the generated PDFs and any client file you forgot to add.

### git reset: three modes

`git reset <commit>` moves the current branch to that commit. What happens to the index and working directory depends on the mode.

| Mode | Branch pointer | Index | Working directory | Typical use |
|---|---|---|---|---|
| `--soft` | Moves | Unchanged | Unchanged | Combine the last N commits into one: `reset --soft HEAD~3` then commit |
| `--mixed` (default) | Moves | Reset to commit | Unchanged | Un-commit but keep edits to re-stage differently |
| `--hard` | Moves | Reset | Reset | Throw away commits *and* edits; destructive |

```bash
git reset --soft HEAD~1       # undo last commit, keep everything staged
git reset HEAD~1              # undo last commit, keep edits unstaged
git reset --hard HEAD~1       # undo last commit and discard its changes
git reset --hard origin/main  # make local main identical to the remote
```

`git reset <file>` with no mode and a path is the old way to unstage; `git restore --staged` is clearer.

> **Warning:** `git reset --hard` and `git restore .` both discard uncommitted work with no confirmation. Committed work is recoverable via the reflog (Expert level); uncommitted work is not. Before any hard reset, run `git stash` or commit to a temporary branch. Thirty seconds of caution versus an afternoon of retyping a rate matrix.

### git revert: the safe undo

```bash
git revert 9e8d7c6            # new commit that applies the inverse of 9e8d7c6
git revert HEAD~2..HEAD       # revert a range, newest first, one commit each
git revert --no-commit 9e8d7c6   # stage the inverse without committing yet
git revert -m 1 <merge-hash>  # revert a merge commit, keeping parent 1's side
```

Revert does not delete history; it adds to it. The original commit stays, and a "Revert 'Add Ohio rates'" commit follows. That is why it is the only correct way to undo something on `main` after it has been pushed: nobody else's clone is invalidated, and the audit trail shows both the mistake and the fix. Reverting a merge needs `-m 1` to say which parent is the mainline; note that re-merging the same branch later will not bring the changes back unless you first revert the revert.

### Choosing the right tool

```text
Uncommitted, unstaged edit I do not want   ──▶ git restore <file>
Staged by mistake                          ──▶ git restore --staged <file>
Untracked junk                             ──▶ git clean -fd (after -n)
Last commit is wrong, not pushed           ──▶ git commit --amend  or  git reset --soft HEAD~1
Several local commits should be one        ──▶ git reset --soft HEAD~N && git commit
Commit already pushed to shared branch     ──▶ git revert <hash>
Local branch is a mess, remote is fine     ──▶ git reset --hard origin/<branch>
```

### Recovering a deleted file

```bash
git log --oneline --diff-filter=D -- path/to/file.md    # find the commit that deleted it
git restore --source=<that-hash>~1 path/to/file.md      # bring it back from the parent
git add path/to/file.md && git commit -m "Restore file.md"
```

`--diff-filter=D` lists only commits where the path was deleted; the version before that commit is the one you want.

### Try It Yourself

```bash
echo "bad edit" >> rates.csv
git restore rates.csv                     # edit gone
echo "temp" > scratch.txt
git clean -n && git clean -f              # scratch.txt gone
git commit --allow-empty -m "Oops commit"
git reset --soft HEAD~1                   # commit gone, nothing lost
git revert --no-edit HEAD                 # adds an inverse commit of the current tip
git log --oneline -n 3
```

### Quiz

1. Which command undoes a pushed commit without rewriting history?
- [ ] `git reset --hard HEAD~1`
- [x] `git revert <hash>`
- [ ] `git restore --source=HEAD~1 .`
> Revert adds an inverse commit; the original stays and other clones remain valid.

2. After `git reset --soft HEAD~1`, where are the changes from the undone commit?
- [x] Staged in the index
- [ ] Discarded
- [ ] Unstaged in the working directory
> Soft leaves both index and working tree untouched, so the changes remain staged.

3. What does `git restore --staged file` do?
- [ ] Discards edits to file
- [x] Removes file's changes from the index but keeps them on disk
- [ ] Restores file from the remote
> It copies the HEAD version into the index only; the working file is untouched.

4. Why does `git revert <merge-hash>` need `-m 1`?
- [ ] To revert only the first file
- [x] To tell Git which parent is the mainline to keep
- [ ] To create one commit instead of many
> A merge has two parents; Git cannot guess which side's changes to undo.

### Exercises

1. **Split a bad commit** — Your last (unpushed) commit contains two unrelated changes. Turn it into two commits.
<details><summary>Solution</summary>

```bash
git reset HEAD~1            # mixed: changes back in working tree, unstaged
git add rates.csv && git commit -m "Update Texas rate matrix"
git add cover.md && git commit -m "Fix cover letter salutation"
```

</details>

2. **Undo a range on main** — Commits `a1`, `b2` and `c3` (newest) were pushed to `main` and must be undone as one commit.
<details><summary>Solution</summary>

```bash
git revert --no-commit c3 b2 a1
git commit -m "Revert rate matrix changes a1..c3 pending re-validation"
git push
```

Listing newest first avoids conflicts when later commits depend on earlier ones.

</details>

3. **Bring back a deleted SOP** — `docs/escalation.md` was deleted several commits ago. Restore it.
<details><summary>Solution</summary>

```bash
h=$(git log --format=%h --diff-filter=D -n 1 -- docs/escalation.md)
git restore --source="$h~1" docs/escalation.md
git add docs/escalation.md && git commit -m "Restore escalation SOP"
```

</details>

### Interview Questions

**Q: Explain the difference between `git reset --soft`, `--mixed` and `--hard`.**
All three move the current branch to the target commit; they differ in how far the change propagates. `--soft` stops there, leaving the index and working tree as they were, so the undone commits' changes sit staged and ready to recommit, which is how I squash local commits. `--mixed`, the default, also resets the index to the target, so the changes remain only in the working tree as unstaged edits. `--hard` additionally overwrites the working tree, discarding uncommitted work entirely. I use soft to reshape commits, mixed to re-stage differently, and hard only to align with a remote after stashing anything I care about.

**Q: When do you use `git revert` instead of `git reset`?**
Whenever the commit I want to undo has been pushed to a branch other people use. Reset rewrites the branch pointer, so the remote would reject my push or, if forced, invalidate every collaborator's clone and any PR based on those commits. Revert instead records a new commit that reverses the change, keeping history append-only and the audit trail intact, which matters for anything regulated. Locally, before pushing, reset is fine and produces cleaner history. A concrete example: a rate-matrix change that under-charged loan policies was reverted on `main` within minutes and the revert itself was reviewed like any other change.

**Q: A colleague ran `git reset --hard` and lost a day's work. Can it be recovered?**
Partly. Anything that was committed is still in the object database and the reflog (`git reflog`) lists where HEAD pointed before the reset, so `git reset --hard HEAD@{1}` or `git branch rescue <hash>` brings the commits back for at least 30 days by default. Anything that was only in the working tree and never staged is gone, because Git never stored it. Files that were staged but not committed may survive as dangling blobs findable with `git fsck --lost-found`, though without filenames. The lesson I give the team is to commit early on a private branch and clean up later with an interactive rebase.

## Stash & tags

Two small features solve two everyday problems. **Stash** answers "I need to switch branches right now but my current edits are half-finished". **Tags** answer "which exact commit did we ship to the client as version 2.1". Neither is complicated, but both have details that trip people up.

### Stashing work in progress

```bash
git stash                          # save tracked modifications + staged changes, restore clean tree
git stash push -m "half-done Texas matrix"    # with a label (recommended)
git stash push -u                  # include untracked files
git stash push -- rates.csv        # stash only one path
git stash list
# stash@{0}: On feature/texas: half-done Texas matrix
# stash@{1}: WIP on main: 4f2a9c1 Add QA checklist
```

A stash is stored as a special commit (actually two or three: index, working tree and optionally untracked files) hanging off a ref called `refs/stash`. It is local to your repository and never pushed. After stashing, the working tree matches HEAD, so you can switch branches, pull, or handle the urgent fix.

### Getting it back

```bash
git stash pop                      # apply the newest stash and delete it from the list
git stash apply stash@{1}          # apply a specific stash and keep it in the list
git stash show -p stash@{0}        # see what a stash contains
git stash drop stash@{0}           # delete one
git stash clear                    # delete all
git stash branch fix-from-stash stash@{0}   # new branch at the stash's original commit with the stash applied
```

`pop` applies and drops; if the apply produces a conflict the stash is *kept* so nothing is lost. `apply` is the safer choice when you want to reuse the same changes on two branches. `stash branch` is the fix when the stash no longer applies cleanly to a branch that moved on.

### Stash gotchas

- By default stash ignores untracked and ignored files. Use `-u` for untracked, `-a` for everything.
- Applying a stash restores changes as unstaged edits unless you pass `--index` to also restore what was staged.
- Stashes are easy to forget; run `git stash list` before assuming work is lost.
- Stashes are not a backup. A branch is. For anything more than an hour's work, commit to a WIP branch instead.

> **Tip:** The common alternative to stash is a temporary commit: `git commit -am "WIP"` on your branch, switch away, come back, `git reset --soft HEAD~1`. It is pushable, survives a `git stash clear`, and is visible in `git log`. Many experienced developers never use stash at all.

### Tags

A **tag** is a permanent name for one commit. Unlike a branch, it does not move. Tags mark releases: the handbook version sent to print, the rate-calculator build deployed on 1 March, the exact commit a client approved.

```bash
git tag                             # list
git tag -l "v2.*"                   # pattern
git tag v2.1.0                      # lightweight tag at HEAD
git tag -a v2.1.0 -m "Handbook 2.1: renumbered section 4, new TOC"   # annotated tag
git tag -a v2.0.3 9e8d7c6 -m "Hotfix release"   # tag an older commit
git show v2.1.0                     # annotated: tagger, date, message, then the commit
```

**Lightweight** tags are just a pointer file, like a branch that never moves. **Annotated** tags are full objects with a tagger name, date, message and optional GPG signature; use them for anything public because `git describe` and GitHub Releases treat them as real releases.

### Pushing and deleting tags

```bash
git push origin v2.1.0              # push one tag
git push origin --tags              # push all tags
git push --follow-tags              # push commits plus annotated tags that point at them
git tag -d v2.1.0                   # delete locally
git push origin --delete v2.1.0     # delete on remote
git fetch --tags                    # fetch tags that were created elsewhere
```

Tags are not pushed by `git push` alone, which is the number one reason a release "does not exist on GitHub". Set `git config --global push.followTags true` to always send annotated tags with their commits.

### Semantic versioning and GitHub Releases

Most projects tag with **SemVer**: `vMAJOR.MINOR.PATCH`, where major changes break compatibility, minor add features, patch fixes bugs. On GitHub, Releases → Draft a new release lets you pick or create a tag, write release notes (GitHub can auto-generate them from merged PR titles), and attach files such as the compiled PDF or an installer. `gh release create v2.1.0 handbook.pdf --generate-notes` does it from the terminal. The attached binaries are exactly where generated deliverables belong instead of in the repository.

```bash
git describe --tags                 # v2.1.0-3-g1a2b3c4: 3 commits after v2.1.0 at commit 1a2b3c4
git log v2.0.0..v2.1.0 --oneline    # changelog between releases
git checkout v2.0.0                 # inspect a release (detached HEAD)
```

### Try It Yourself

```bash
echo "draft" >> rates.csv
git stash push -m "draft rates"
git stash list
git stash pop
git tag -a v1.0.0 -m "First client-approved handbook"
git push origin v1.0.0
git describe --tags
```

### Quiz

1. What does `git stash pop` do if applying the stash causes a conflict?
- [ ] Deletes the stash anyway
- [x] Applies what it can and keeps the stash in the list
- [ ] Aborts and leaves the tree unchanged
> Pop only drops the stash on a clean apply, so nothing is lost.

2. Which files does plain `git stash` ignore?
- [ ] Staged files
- [x] Untracked and ignored files
- [ ] Modified tracked files
> Use `-u` to include untracked files and `-a` to include ignored ones.

3. Why are tags missing on GitHub after `git push`?
- [ ] Tags cannot be pushed
- [x] Tags are not pushed by default; use `--tags` or `--follow-tags`
- [ ] Only annotated tags can be pushed
> Push sends branches; tags need to be named or `push.followTags` enabled.

4. What is the difference between a lightweight and an annotated tag?
- [x] Annotated tags are objects with tagger, date and message; lightweight tags are bare pointers
- [ ] Lightweight tags can move; annotated cannot
- [ ] Annotated tags are only for GitHub
> Use annotated tags for releases; `git describe` ignores lightweight tags by default.

### Exercises

1. **Urgent fix mid-work** — You have uncommitted edits on `feature/x` and must hotfix `main`. Do it without losing anything.
<details><summary>Solution</summary>

```bash
git stash push -u -m "feature/x in progress"
git switch main && git pull --ff-only
git switch -c hotfix/rounding
# fix, commit, push, open PR
git switch feature/x
git stash pop
```

</details>

2. **Release with notes** — Tag the current commit as `v2.1.0`, push it, and create a GitHub release with auto-generated notes and the built PDF attached.
<details><summary>Solution</summary>

```bash
git tag -a v2.1.0 -m "Handbook 2.1"
git push origin v2.1.0
gh release create v2.1.0 build/handbook.pdf --generate-notes --title "Handbook 2.1"
```

</details>

3. **Retag a mistake** — `v2.1.0` was placed on the wrong commit and already pushed. Move it correctly.
<details><summary>Solution</summary>

```bash
git tag -d v2.1.0
git push origin --delete v2.1.0
git tag -a v2.1.0 <correct-hash> -m "Handbook 2.1"
git push origin v2.1.0
```

Tell collaborators to `git fetch --tags --force`, because Git does not update a tag that already exists locally. Better still, publish `v2.1.1` and leave the wrong tag alone.

</details>

### Interview Questions

**Q: What is `git stash` and when would you avoid it?**
Stash saves my uncommitted tracked changes (and optionally untracked files with `-u`) as a hidden commit and resets the working tree, so I can switch branches or pull cleanly, then `pop` them back. It is ideal for a five-minute interruption such as reviewing a colleague's PR. I avoid it for anything long-lived because stashes are local, unnamed by default, invisible in `git log`, and easy to lose with `stash clear`; a WIP commit on a branch is safer and pushable. I also avoid it when the branch will move far, because a stale stash applies with conflicts; `git stash branch` exists precisely for that case.

**Q: What is the difference between a tag and a branch?**
Both are references to a commit stored under `.git/refs`, but a branch is expected to move as you commit on it while a tag is a permanent label that never moves. Committing while a tag is checked out puts you in detached HEAD and does not move the tag. Annotated tags are additionally full objects carrying tagger, date, message and possibly a signature, which makes them auditable release markers. Branches are for work in progress, tags are for points in time you will refer back to, such as the commit deployed to production or the handbook version approved by the client.

**Q: How do you produce release notes from Git history?**
If the team writes good commit or PR titles, `git log --oneline v2.0.0..v2.1.0` or `git log --pretty=format:"- %s (%h)"` between two tags is already a draft changelog. GitHub's release page can auto-generate notes from merged PRs and their labels, grouping by category when a `.github/release.yml` config exists. For customer-facing notes I curate that draft, removing internal refactors and adding upgrade steps, and attach the built artefacts to the release. Conventional Commits (`feat:`, `fix:`) plus a tool like release-please or semantic-release automate the whole loop including the version bump.

# LEVEL: Advanced

## Rebase & interactive rebase

**Rebase** moves a series of commits so that they start from a different base commit. Where a merge joins two lines of history with a merge commit, a rebase rewrites your commits so they appear to have been made on top of the other branch all along. The result is a linear history that reads like a story, at the price of replacing your commits with new ones that have new hashes. That price is why the golden rule exists: never rebase commits that exist outside your own repository.

### Rebasing a feature branch onto main

```text
before:        A ──▶ B ──▶ C   (main)
                \
                 D ──▶ E       (feature)

git switch feature && git rebase main

after:         A ──▶ B ──▶ C   (main)
                            \
                             D' ──▶ E'   (feature)
```

```bash
git switch feature/texas
git fetch origin
git rebase origin/main
# resolve any conflicts, then:
git push --force-with-lease
```

Git finds the merge base (A), takes each of your commits (D, E) as a patch, resets the branch to `main`'s tip (C), and re-applies the patches one by one, creating D' and E'. If a patch does not apply cleanly you get a conflict at that commit: fix the files, `git add` them, `git rebase --continue`. `git rebase --abort` returns everything to the pre-rebase state at any point, and `--skip` drops the current commit.

### Why rebase before a PR

Rebasing your branch onto the latest `main` before opening or updating a pull request means the reviewer sees only your changes, CI tests your work against current code, and the eventual merge is a fast-forward with no "Merge branch 'main' into feature" noise. Many teams require it; GitHub's "Require branches to be up to date" setting effectively demands either a rebase or a merge from main.

### Interactive rebase: editing history

`git rebase -i <base>` opens an editor listing every commit after `<base>`, oldest first, each with a command you can change.

```bash
git rebase -i HEAD~4
```

```text
pick 1a2b3c4 Add Texas owner rates
pick 5d6e7f8 fix typo
pick 9a0b1c2 Add Texas loan rates
pick 3d4e5f6 WIP more rates

# Commands:
# p, pick   = use commit
# r, reword = use commit, but edit the commit message
# e, edit   = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup  = like squash, but discard this commit's log message
# d, drop   = remove commit
# x, exec   = run command (the rest of the line) using shell
```

Change the file to:

```text
pick 1a2b3c4 Add Texas owner rates
fixup 5d6e7f8 fix typo
pick 9a0b1c2 Add Texas loan rates
squash 3d4e5f6 WIP more rates
```

Save and close: the typo fix melts into the first commit, the WIP squashes into the loan-rates commit and you are prompted for a combined message. Reordering lines reorders commits; deleting a line drops it. `edit` stops at that commit so you can `git commit --amend` (for example to split it) then `git rebase --continue`.

### Fixup commits and autosquash

```bash
git commit --fixup 1a2b3c4          # commit message "fixup! Add Texas owner rates"
git rebase -i --autosquash HEAD~5   # Git places the fixup right after its target, already marked
git config --global rebase.autosquash true
```

This is the professional way to address review comments: make a fixup commit per comment, push normally so the reviewer sees the increments, and autosquash before the final merge.

### Useful rebase flags

| Flag | Purpose |
|---|---|
| `--onto <new> <old>` | Transplant a range: `git rebase --onto main feature-a feature-b` moves `feature-b`'s commits from atop `feature-a` to atop `main` |
| `--autostash` | Stash uncommitted changes before rebasing and reapply after |
| `--update-refs` (2.38+) | Move other branches that point into the rebased range, essential for stacked branches |
| `-x "pytest"` | Run a command after each commit; fails the rebase at the first commit that breaks tests |
| `--rebase-merges` | Preserve merge commits in the rebased range instead of flattening |

> **Warning:** After a rebase your branch and its remote copy have diverged and `git push` is rejected. That is expected. Use `git push --force-with-lease`, which refuses if someone else pushed to the branch since you last fetched. Never `--force` a shared branch, and never rebase `main`.

### Rebase versus merge: the actual trade-off

Merge preserves what really happened, including when you integrated upstream changes, and never rewrites anything; the cost is a history full of merge commits that `git log` and `git bisect` must wade through. Rebase produces a clean, linear, reviewable sequence at the cost of rewriting commits, losing the record of when you synchronised, and requiring force pushes on published branches. The common compromise: rebase private feature branches freely, merge (or squash) into shared branches, and never rewrite shared branches.

### Try It Yourself

```bash
git switch feature/texas
git fetch origin
git rebase --autostash origin/main
git rebase -i HEAD~3         # squash the last three commits into one
git log --oneline --graph -n 8
git push --force-with-lease
```

### Quiz

1. What does `git rebase main` do while on `feature`?
- [ ] Merges main into feature with a merge commit
- [x] Re-applies feature's commits on top of main's tip, creating new commits
- [ ] Moves main to feature's tip
> The original commits are replaced by copies with new parents and new hashes.

2. Which interactive rebase command combines a commit into the previous one and discards its message?
- [ ] squash
- [x] fixup
- [ ] reword
> `squash` keeps both messages for editing; `fixup` keeps only the earlier one.

3. Why is `--force-with-lease` preferred over `--force`?
- [ ] It is faster
- [x] It fails if the remote branch moved since your last fetch, protecting others' pushes
- [ ] It does not rewrite history
> It is a compare-and-swap on the remote ref.

4. What is the golden rule of rebasing?
- [x] Do not rebase commits that others may have based work on
- [ ] Always rebase instead of merge
- [ ] Rebase only on Fridays
> Rewriting shared history forces everyone else to recover from diverged clones.

### Exercises

1. **Clean up before review** — Your branch has five commits including "typo" and "wip". Reduce them to two meaningful commits.
<details><summary>Solution</summary>

```bash
git rebase -i origin/main
# In the editor: keep the first real commit as pick, mark "typo" as fixup,
# keep the second real commit as pick, mark "wip" as squash, reword messages.
git push --force-with-lease
```

</details>

2. **Transplant a branch** — `feature-b` was branched from `feature-a`, which was abandoned. Move `feature-b`'s own commits onto `main`.
<details><summary>Solution</summary>

```bash
git rebase --onto main feature-a feature-b
git log --oneline --graph main feature-b
```

</details>

3. **Test every commit** — Rebase and ensure each commit passes the test suite.
<details><summary>Solution</summary>

```bash
git rebase -i origin/main -x "python -m pytest -q"
# The rebase stops at the first commit whose tests fail; fix, git commit --amend, git rebase --continue
```

</details>

### Interview Questions

**Q: Merge or rebase: how do you decide?**
Rebase for my own unpublished or personal-branch commits, because it produces a linear, reviewable history and makes the eventual integration trivial; merge for anything shared, because rebase rewrites hashes and would break everyone whose work references them. On a feature branch I `git rebase origin/main` daily and clean up with `rebase -i` before requesting review. Into `main` the team either squash-merges or merges with `--no-ff`, never rebases `main` itself. The trade-off I state explicitly is fidelity versus readability: merge records what happened, rebase records what we wish had happened, and the second is more useful to the future reader as long as the first is not needed for audit.

**Q: Walk through resolving a conflict during a rebase.**
The rebase stops at the offending commit and marks the conflicting files. I run `git status` to list them, open each, resolve the `<<<<<<<`/`>>>>>>>` markers remembering that during a rebase "ours" is the branch being rebased *onto* and "theirs" is my commit being replayed, which is reversed from a merge. I `git add` each resolved file, then `git rebase --continue`; Git may stop again at later commits. If the resolution is wrong or I am unsure, `git rebase --abort` returns the branch to exactly its pre-rebase state. To avoid repeating the same resolution across commits I enable `rerere` so Git records and replays resolutions.

**Q: What is `git rebase --onto` for?**
It rebases a range of commits with an explicit new base, decoupling "where the commits currently start" from "where they should go". The classic case is stacked branches: `feature-b` was built on `feature-a`, `feature-a` is merged (and squashed, so its hashes vanish) and now `feature-b` must sit on `main` without re-applying `feature-a`'s changes. `git rebase --onto main feature-a feature-b` says: take the commits reachable from `feature-b` but not from `feature-a`, and replay them on `main`. It also lets you drop a range of commits in the middle of a branch by rebasing the tail onto the commit before the range.

## Merge conflicts

A conflict occurs when Git merges or rebases two lines of history that changed the same region of the same file, or when one side deleted a file the other modified. Git cannot know which version is right, so it stops and asks you. Conflicts are normal, not failures; on a documentation project they mostly come from two people editing the same paragraph of a manual. This chapter shows exactly what Git leaves on disk, how to read it, and how to make conflicts rare.

### What a conflict looks like

```bash
git merge feature/ohio
# Auto-merging rates.csv
# CONFLICT (content): Merge conflict in rates.csv
# Automatic merge failed; fix conflicts and then commit the result.
git status
# You have unmerged paths.
#   both modified:   rates.csv
```

Inside `rates.csv`:

```text
WY,OWNER,100000,575
<<<<<<< HEAD
WY,OWNER,150000,750
=======
WY,OWNER,150000,725
OH,OWNER,150000,690
>>>>>>> feature/ohio
WY,OWNER,200000,875
```

Between `<<<<<<< HEAD` and `=======` is the version on your current branch ("ours"); between `=======` and `>>>>>>> feature/ohio` is the incoming version ("theirs"). Everything outside the markers merged automatically. To resolve, edit the file so it contains what should be there and remove all three marker lines.

```bash
# after editing rates.csv to the correct content:
git add rates.csv
git commit             # Git pre-fills "Merge branch 'feature/ohio'"
```

`git add` marks the path as resolved. Until every conflicted path is added, `git commit` refuses. `git merge --abort` gives up and restores the pre-merge state.

### Seeing all three versions

Enable `diff3` (or `zdiff3`, Git 2.35+) style so the markers also show the common ancestor, which is often what makes the right answer obvious:

```bash
git config --global merge.conflictStyle zdiff3
```

```text
<<<<<<< HEAD
WY,OWNER,150000,750
||||||| merge base
WY,OWNER,150000,725
=======
WY,OWNER,150000,725
OH,OWNER,150000,690
>>>>>>> feature/ohio
```

Now you can see that `main` changed 725 to 750 and `feature/ohio` only added an Ohio line, so the correct resolution keeps 750 *and* adds the Ohio row. Without the base you might have picked one side and silently lost the other's change.

### Taking one side wholesale

```bash
git checkout --ours rates.csv      # keep my version of the whole file
git checkout --theirs rates.csv    # keep the incoming version
git add rates.csv
```

Remember that in a rebase the meaning flips: `--ours` is the branch you are rebasing onto (`main`), `--theirs` is your own commit being replayed. For binaries such as `.docx`, whole-file selection is the only option because there is nothing to hand-merge.

### Merge tools

```bash
git mergetool                      # opens the configured 3-way tool per file
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait --merge $REMOTE $LOCAL $BASE $MERGED'
```

VS Code's built-in merge editor (since 1.69, 2022) shows Incoming, Current and Result panes with "Accept Incoming / Accept Current / Accept Both" buttons per hunk. Other popular tools: Beyond Compare, KDiff3, Meld, and the GitHub web conflict editor for simple cases inside a PR.

### Delete/modify and rename conflicts

```text
CONFLICT (modify/delete): docs/old-sop.md deleted in HEAD and modified in feature/x.
```

Decide whether the file should exist: `git rm docs/old-sop.md` to confirm deletion, or `git add docs/old-sop.md` to keep the modified version. Rename detection usually handles files moved on one side and edited on the other, but if both sides renamed differently you get a rename/rename conflict resolved the same way: choose, `git add`, commit.

### Making conflicts rare

| Practice | Why it helps |
|---|---|
| Small, frequent merges or rebases from `main` | Divergence is what creates conflicts |
| One sentence per line in Markdown/LaTeX | Line-based diffs then isolate edits to a sentence, not a paragraph |
| Agree formatting (Prettier, Black) and commit it separately | Reformatting commits touch everything and conflict with everyone |
| Avoid long-lived branches | A three-week branch almost always conflicts |
| `git rerere` | **Re**use **re**corded **re**solution: Git remembers how you resolved a conflict and applies it automatically next time, which is invaluable when the same conflict recurs on rebase after rebase |

```bash
git config --global rerere.enabled true
```

> **Tip:** In a CSV rate matrix or a config file, sort the rows before committing. Two people appending to the end of a file always conflict; two people inserting into a sorted file rarely do because their lines land in different places.

### Conflicts in pull requests

GitHub shows "This branch has conflicts that must be resolved" with a **Resolve conflicts** button for small text conflicts. For anything larger, resolve locally: `git fetch origin && git rebase origin/main` (or `git merge origin/main`), fix, push. After the push GitHub re-evaluates and CI re-runs.

### Try It Yourself

```bash
git config --global merge.conflictStyle zdiff3
git config --global rerere.enabled true
git merge feature/ohio || true
git status --short             # UU rates.csv
git diff                       # shows conflict hunks with base
# edit rates.csv, remove markers, then:
git add rates.csv
git commit --no-edit
```

### Quiz

1. In a merge conflict, what lies between `<<<<<<< HEAD` and `=======`?
- [x] The current branch's version
- [ ] The incoming branch's version
- [ ] The common ancestor
> HEAD is where you are; the incoming side follows `=======` up to `>>>>>>>`.

2. What does `git add` on a conflicted file signify?
- [ ] Discard the incoming change
- [x] The conflict in that file is resolved
- [ ] Stage the conflict markers permanently
> Git treats an added path as resolved; make sure the markers are gone first.

3. During a rebase, `--theirs` refers to what?
- [ ] The branch you are rebasing onto
- [x] The commit from your branch being replayed
- [ ] The remote branch
> Rebase replays your commits onto the upstream, so the upstream is "ours" and your commit is "theirs".

4. What does `rerere` do?
- [ ] Reverts a merge automatically
- [x] Records conflict resolutions and replays them when the same conflict recurs
- [ ] Rebases repeatedly until no conflicts remain
> It is especially useful for long-running branches rebased many times.

### Exercises

1. **Create and resolve** — Deliberately produce a conflict on one line in two branches, then resolve keeping both changes.
<details><summary>Solution</summary>

```bash
git switch -c a && sed -i 's/725/750/' rates.csv && git commit -am "Raise WY 150k"
git switch main && git switch -c b && echo "OH,OWNER,150000,690" >> rates.csv && git commit -am "Add OH"
git switch a && git merge b        # conflict if lines are adjacent
# edit rates.csv: keep 750 line and OH line, remove markers
git add rates.csv && git commit
```

</details>

2. **Binary conflict** — Both branches changed `cover.docx`. Resolve by keeping the incoming version.
<details><summary>Solution</summary>

```bash
git checkout --theirs cover.docx
git add cover.docx
git commit -m "Merge feature, keep incoming cover.docx"
```

Text-merge is impossible for DOCX; announce which side was kept in the commit message.

</details>

3. **Abort safely** — Halfway through a messy merge you decide to start over.
<details><summary>Solution</summary>

```bash
git merge --abort        # or git rebase --abort during a rebase
git status               # clean, back to pre-merge state
```

</details>

### Interview Questions

**Q: How do you resolve a merge conflict?**
I run `git status` to see the unmerged paths and open each file, where Git has left `<<<<<<<`, `=======` and `>>>>>>>` markers around the two versions; with `zdiff3` style I also see the common ancestor, which tells me what each side intended. I edit the region to the correct final content, which is often a combination rather than one side, delete the markers, and `git add` the file to mark it resolved. Once all files are added I run `git commit` for a merge or `git rebase --continue` for a rebase, then run the tests. If I am unsure, `git merge --abort` restores the previous state so I can ask the other author. For binaries I pick a side with `--ours` or `--theirs` and document the choice.

**Q: How would you reduce conflicts on a team editing the same large document?**
Structure the document as many small files, one per chapter or section, so people rarely touch the same file, and keep one sentence per line so a diff isolates a sentence. Merge or rebase from `main` daily so branches never drift far, keep branches short-lived, and land formatting changes as separate commits agreed in advance. Enable `rerere` for anyone rebasing a long branch, and put generated artefacts such as the built PDF outside the repository so they never conflict. Finally, communicate: a quick "I am restructuring chapter 4 today" avoids the worst conflicts before Git ever sees them.

**Q: Why do "ours" and "theirs" swap meaning between merge and rebase?**
Both terms refer to the two parents of the operation from Git's point of view. In a merge, HEAD is my branch (ours) and the branch named on the command line is theirs. In a rebase, Git first checks out the upstream commit and then replays my commits onto it as if merging each one in, so HEAD during the replay is the upstream (ours) and the patch being applied is my commit (theirs). Knowing this prevents the classic mistake of running `git checkout --ours` during a rebase and throwing away your own work.

## Git workflows (GitHub Flow, trunk-based)

A workflow is the team's agreement about which branches exist, who may push where, how changes are reviewed and how releases are cut. Git imposes none of this; the conventions below are what teams actually use. Interviewers ask "which branching strategy have you used and why" and expect a comparison, not a name.

### GitHub Flow

The simplest widely used model, designed for continuously deployed web services and equally suited to a documentation or automation repository.

1. `main` is always deployable.
2. Branch from `main` with a descriptive name.
3. Commit locally, push regularly.
4. Open a pull request; discuss, review, CI runs.
5. Merge into `main` only after approval and green checks.
6. Deploy from `main` immediately (or on a schedule).
7. Delete the branch.

```bash
git switch main && git pull --ff-only
git switch -c feature/rate-calculator-v2
# work, commit, push, PR, merge
git switch main && git pull --ff-only && git branch -d feature/rate-calculator-v2
```

There are no release or develop branches. If production breaks you fix forward with another PR or revert the merge. Its weakness is supporting several released versions at once, which it does not attempt.

### Git Flow

Vincent Driessen's 2010 model with five branch types: `main` (released code, tagged), `develop` (integration), `feature/*` (from develop, back to develop), `release/*` (from develop, stabilised, merged to both main and develop) and `hotfix/*` (from main, merged to both). It fits products with scheduled versioned releases and long support windows, such as desktop software or a printed handbook edition, but is heavy for anything deployed continuously. The `git flow` CLI extension automates the branch dance. Its own author now recommends GitHub Flow for web apps.

### Trunk-based development

Everyone commits to one branch (`trunk`, i.e. `main`) either directly or via very short-lived branches that live hours, not days. Incomplete features hide behind **feature flags** so `main` is always releasable even mid-feature. Releases are cut from `main` by tag; if a release needs a fix, it is made on `main` and cherry-picked to a release branch.

```bash
git switch -c tiny-change      # lives an hour
# commit
git fetch origin && git rebase origin/main
git push -u origin tiny-change && gh pr create --fill
# merge within the hour
```

Trunk-based development is what DORA research associates with the highest-performing teams, because integration pain is paid continuously in tiny amounts instead of in painful merges every few weeks. It demands strong CI, fast tests and a merge queue at scale.

### Comparison

| | GitHub Flow | Git Flow | Trunk-based |
|---|---|---|---|
| Long-lived branches | `main` | `main`, `develop`, plus release branches | `main` only |
| Feature branch lifetime | Days | Days to weeks | Hours to a day |
| Release model | Deploy from `main` | Versioned release branches | Tag from `main`, optional release branch |
| Hotfixes | PR to `main` | `hotfix/*` merged to both | Fix on `main`, cherry-pick |
| Best for | Web apps, docs, small teams | Multi-version products | High-performing CI-driven teams |
| Main risk | Multi-version support | Merge overhead, stale develop | Needs flags, discipline, fast CI |

### Cherry-pick

```bash
git cherry-pick 9e8d7c6            # apply that commit's change here as a new commit
git cherry-pick -x 9e8d7c6         # append "(cherry picked from commit ...)" to the message
git cherry-pick a1b2c3..d4e5f6     # a range (exclusive of a1b2c3)
git cherry-pick --no-commit 9e8d7c6
```

Cherry-pick copies a commit's patch onto the current branch. It is the mechanism behind backporting a fix from `main` to `release/2.1` and behind "I committed on the wrong branch". Because the copy has a different hash, later merging the original branch can produce duplicate-looking commits; keep cherry-picks for genuine backports.

### Conventional commits and semantic release

Many workflows standardise message prefixes so tooling can derive versions and changelogs:

```text
feat(rates): add Ohio simultaneous-issue table
fix(toc): regenerate field after renumbering
docs: update escalation SOP
chore(ci): pin actions/checkout to v4
feat!: drop support for legacy .doc input   # ! marks a breaking change
```

`feat` bumps the minor version, `fix` the patch, `!` or a `BREAKING CHANGE:` footer the major. Tools such as commitlint enforce the format in a hook and release-please or semantic-release turn merged commits into tags and release notes automatically.

> **Interview note:** A strong answer describes the workflow you used, why it fit the release model, one concrete pain point and how you mitigated it. Example: "GitHub Flow with squash merges for the reporting tools; the pain was stale branches conflicting with the shared rate schema, so we rebased daily and put schema changes in their own PR first."

### Choosing for a small documentation or automation team

For a two-to-five person team producing scripts and document templates, use GitHub Flow with protected `main`, squash merges, tags for client-approved versions and GitHub Releases for the built deliverables. Move toward trunk-based practices, meaning branches that live less than a day, as CI matures.

### Try It Yourself

```bash
git switch main && git pull --ff-only
git switch -c fix/wy-rounding
git commit --allow-empty -m "fix(rates): round after simultaneous-issue discount"
git push -u origin fix/wy-rounding
gh pr create --fill
gh pr merge --squash --delete-branch --auto
git switch release/2.1 && git cherry-pick -x main
```

### Quiz

1. Which workflow keeps only one long-lived branch and hides incomplete work behind flags?
- [ ] Git Flow
- [x] Trunk-based development
- [ ] GitHub Flow with release branches
> Trunk-based teams integrate to `main` continuously and gate features at runtime.

2. In Git Flow, where does a hotfix branch start and where is it merged?
- [ ] From develop, into develop
- [x] From main, into both main and develop
- [ ] From a release branch, into main only
> Merging into both keeps develop from regressing the fix.

3. What does `git cherry-pick -x` add?
- [ ] A signature
- [x] A note in the message naming the original commit
- [ ] The original author's date
> The trailer makes backports traceable to their source commit.

4. Under Conventional Commits, which prefix triggers a minor version bump?
- [ ] fix
- [x] feat
- [ ] chore
> `feat` adds functionality; `fix` is a patch; `!` marks a breaking (major) change.

### Exercises

1. **Backport a fix** — A rounding fix `3f4e5d6` is on `main`. Apply it to `release/2.1` with traceability.
<details><summary>Solution</summary>

```bash
git switch release/2.1
git cherry-pick -x 3f4e5d6
git push
```

</details>

2. **Wrong branch** — You made two commits on `main` that should be on a feature branch, and have not pushed.
<details><summary>Solution</summary>

```bash
git branch feature/oops            # new branch at current HEAD keeps the commits
git reset --hard origin/main       # move main back to the remote's state
git switch feature/oops
```

</details>

3. **Write a branch policy** — Draft the rules for a protected `main` in GitHub Flow.
<details><summary>Solution</summary>

```text
Rulesets → main:
- Require a pull request before merging (1 approval, dismiss stale approvals)
- Require status checks: lint, tests, build-docs
- Require branches to be up to date before merging
- Require linear history (squash or rebase merges only)
- Block force pushes and deletions
- Require signed commits (optional, see Expert level)
```

</details>

### Interview Questions

**Q: Compare GitHub Flow, Git Flow and trunk-based development.**
GitHub Flow has one permanent branch, short feature branches and PRs, and deploys from `main`; it is simple and suits continuously delivered services. Git Flow adds `develop`, release and hotfix branches, which supports maintaining several released versions but costs extra merges and a `develop` that drifts from production. Trunk-based development pushes integration frequency to its limit with branches living hours and feature flags hiding unfinished work; it yields the fewest merge problems and fastest feedback but needs strong CI and discipline. I would pick GitHub Flow for a small team, move toward trunk-based as tests mature, and reach for Git Flow only when we genuinely ship versioned releases with long support.

**Q: What are feature flags and why do they matter for branching?**
A feature flag is a runtime switch, from a config file, environment variable or flag service, that turns a code path on or off without a deploy. They decouple *deploying* code from *releasing* a feature, so incomplete work can be merged to `main` behind an off flag, which is what makes very short-lived branches possible. They also enable gradual rollouts and instant rollback by flipping the flag rather than reverting a merge. The cost is flag debt: every flag is a branch in the code, so we track them and remove each one once the feature is fully on.

**Q: When is cherry-picking appropriate and when is it a smell?**
Appropriate for backporting a specific fix to a release branch, or moving a commit made on the wrong branch, where the intent is genuinely "this one change, there too". It is a smell when used to move features between long-lived branches routinely, because the copies have new hashes, later merges show the change twice, and conflicts recur. If a team cherry-picks constantly, the branching model is wrong: usually they need shorter branches merged forward, or a proper release-branch policy where fixes land on `main` first and are cherry-picked once with `-x` for traceability.

## GitHub Actions & GitHub Pages deployment

**GitHub Actions** runs workflows, defined in YAML files under `.github/workflows/`, on GitHub's servers in response to events such as a push, a pull request or a schedule. It is how teams run tests on every PR, build documents automatically, and deploy sites. **GitHub Pages** hosts static websites straight from a repository, and Actions is the modern way to publish to it. Together they let a documentation repository test itself and publish a live site on every merge.

### Anatomy of a workflow

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:          # manual "Run workflow" button

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: pip
      - run: pip install -r requirements.txt
      - run: python -m pytest -q
      - name: Validate rate matrices
        run: python tools/validate_rates.py rates/*.csv
```

Key vocabulary: a **workflow** has one or more **jobs** that run in parallel on separate **runners** (fresh virtual machines, `ubuntu-latest`, `windows-latest`, `macos-latest`) unless you add `needs:`. Each job has **steps** that either `run` a shell command or `uses` a reusable **action** from the Marketplace, pinned to a version tag or a commit SHA. `matrix` fans one job out across combinations. The `${{ }}` syntax evaluates expressions and contexts such as `github.ref`, `secrets.X` and `matrix.x`.

### Triggers you will use

| `on:` | Fires when |
|---|---|
| `push` / `pull_request` | Commits pushed, PR opened or updated; filter by `branches`, `paths`, `tags` |
| `schedule: - cron: "0 6 * * 1"` | Every Monday 06:00 UTC, e.g. weekly report generation |
| `workflow_dispatch` | Manually from the Actions tab, with optional `inputs` |
| `release: types: [published]` | When a release is published; build and attach artefacts |
| `workflow_run` | After another workflow finishes |

### Secrets, permissions and artefacts

Never put tokens in YAML. Store them under Settings → Secrets and variables → Actions and reference `${{ secrets.SHAREPOINT_TOKEN }}`; the log masks them. Every job gets a short-lived `GITHUB_TOKEN`; set `permissions:` to the minimum it needs. Files a job produces can be saved with `actions/upload-artifact@v4` and downloaded from the run page or by a later job with `actions/download-artifact@v4`.

```yaml
      - uses: actions/upload-artifact@v4
        with:
          name: handbook-pdf
          path: build/handbook.pdf
          retention-days: 14
```

### Building a document on every push

```yaml
name: Build handbook
on:
  push:
    paths: ["docs/**", "templates/**"]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: sudo apt-get update && sudo apt-get install -y pandoc
      - run: pandoc docs/*.md --reference-doc=templates/letterhead.dotx -o build/handbook.docx
      - uses: actions/upload-artifact@v4
        with: { name: handbook, path: build/ }
```

This is Ali's world in one file: every merged edit to the Markdown source produces a fresh branded DOCX that anyone can download from the run, with no one's laptop involved.

### GitHub Pages

Pages serves static files (HTML, CSS, JS, images) at `https://<user>.github.io/<repo>/`, or at `https://<user>.github.io/` for a repository named `<user>.github.io`, with free HTTPS and custom domains via a `CNAME` file. Two publishing modes exist under Settings → Pages → Source:

1. **Deploy from a branch**: pick `main` (or `gh-pages`) and a folder (`/` or `/docs`). Simple, no workflow needed. Jekyll processes the files unless a `.nojekyll` file is present.
2. **GitHub Actions**: a workflow builds the site with any tool (MkDocs, Docusaurus, Astro, plain HTML) and uploads it. This is the recommended mode and is required for build steps.

```yaml
name: Deploy site
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install mkdocs-material && mkdocs build --strict
      - uses: actions/upload-pages-artifact@v3
        with: { path: site }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`upload-pages-artifact` packages the folder; `deploy-pages` publishes it. The `id-token: write` permission is what lets the deploy step prove its identity via OIDC. The Actions tab shows each run with per-step logs, and the environment's URL appears on the run summary.

> **Tip:** Run workflows locally before pushing with `act` (nektos/act), or keep the logic in a script such as `tools/build.sh` that the workflow merely calls. Workflows that are one line of `run: ./tools/build.sh` are testable on a laptop and far easier to debug than 60 lines of YAML.

### Debugging failures

Click the red X on the commit or PR to open the run, expand the failed step for logs, and use `gh run list`, `gh run view <id> --log-failed` and `gh run rerun <id>` from the terminal. Enable step debug logging by setting the secret `ACTIONS_STEP_DEBUG=true`. Common causes: an action pinned to a removed tag, a missing secret in a fork's PR (secrets are not exposed to PRs from forks), and paths that differ between Windows and Linux runners.

### Try It Yourself

```yaml
# .github/workflows/validate.yml
name: Validate
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: node tools/validate.js
```

### Quiz

1. Where do workflow files live?
- [ ] `.git/workflows/`
- [x] `.github/workflows/`
- [ ] `workflows/` at the root
> GitHub only reads YAML files from that folder on the default branch (and the PR branch for `pull_request` events).

2. How do jobs in one workflow run by default?
- [x] In parallel on separate runners
- [ ] Sequentially on the same runner
- [ ] One at a time in file order
> Use `needs:` to create dependencies between jobs.

3. Why are secrets unavailable in a PR from a fork?
- [ ] Forks cannot run workflows
- [x] To prevent untrusted code from exfiltrating them
- [ ] Secrets must be re-entered per branch
> Anyone can open a PR from a fork, so exposing secrets would be a security hole.

4. Which permission enables OIDC-based deployment to Pages?
- [ ] `contents: write`
- [x] `id-token: write`
- [ ] `actions: write`
> The deploy action requests an OIDC token to authenticate to the Pages service.

### Exercises

1. **Scheduled report** — Run `python reports/weekly.py` every Monday at 03:00 UTC and upload `out/weekly.xlsx`.
<details><summary>Solution</summary>

```yaml
name: Weekly report
on:
  schedule:
    - cron: "0 3 * * 1"
  workflow_dispatch:
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install openpyxl && python reports/weekly.py
      - uses: actions/upload-artifact@v4
        with: { name: weekly, path: out/weekly.xlsx }
```

</details>

2. **Publish a plain HTML folder** — Deploy the `site/` folder to Pages without any build step.
<details><summary>Solution</summary>

Either choose "Deploy from a branch" with folder `/site` (only `/` and `/docs` are offered, so move or rename to `docs/`), or use the Actions workflow from the chapter with `upload-pages-artifact` pointing at `site` and no build command. Add an empty `.nojekyll` file so underscore-prefixed folders are served.

</details>

3. **Attach a PDF to a release** — When a release is published, build the handbook and attach it.
<details><summary>Solution</summary>

```yaml
on:
  release:
    types: [published]
permissions:
  contents: write
jobs:
  attach:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./tools/build.sh      # produces build/handbook.pdf
      - run: gh release upload "$GITHUB_REF_NAME" build/handbook.pdf
        env:
          GH_TOKEN: ${{ github.token }}
```

</details>

### Interview Questions

**Q: Explain the structure of a GitHub Actions workflow.**
A workflow is a YAML file in `.github/workflows` with a name, an `on` block listing triggering events and filters, and a `jobs` map. Each job declares a runner image with `runs-on`, optional `needs` for ordering, `permissions`, an `environment`, and an ordered list of `steps`. A step either runs a shell command with `run` or invokes a reusable action with `uses`, passing inputs under `with`. Expressions in `${{ }}` access contexts like `github`, `secrets`, `matrix` and step outputs. A `strategy.matrix` fans a job across versions or platforms. Artefacts and caches pass data between jobs and runs; everything else on a runner is discarded when the job ends.

**Q: How do you keep CI secure?**
Pin third-party actions to a full commit SHA rather than a mutable tag, because a compromised tag can be repointed. Grant the minimum `permissions:` per job instead of the default broad token. Never echo secrets and know that secrets are withheld from fork PRs, so design workflows that need them to run only on `push` to trusted branches. Use OIDC federation instead of long-lived cloud keys for deployments, protect environments with required reviewers for production, enable Dependabot for action updates, and keep build logic in scripts that are reviewed like code. Finally, treat `pull_request_target` with great care because it runs with the base repository's permissions on untrusted input.

**Q: What are the two ways to publish to GitHub Pages and which do you recommend?**
"Deploy from a branch" serves a folder (`/` or `/docs`) from a chosen branch with Jekyll processing; it needs no workflow and suits hand-written HTML or Jekyll sites. "GitHub Actions" runs a workflow that builds with any tool and uploads the output via `upload-pages-artifact` and `deploy-pages`, which is what I recommend for anything with a build step such as MkDocs or a static-site generator, because the source and the built site are cleanly separated, the build is reproducible in CI, and the `github-pages` environment gives you deployment history and protection rules. Both give HTTPS and custom domains via a `CNAME` file.

## VS Code & debugging basics

Visual Studio Code is the editor most developers, technical writers and data analysts use, and knowing it well multiplies everything else in this course. It ships with Git integration, a terminal, a debugger for many languages and thousands of extensions. This chapter covers the parts you use daily: navigation, the Source Control view, the integrated terminal, settings, and setting a breakpoint in a Python or JavaScript script instead of sprinkling print statements.

### Navigation you should not live without

| Shortcut (Windows/Linux) | macOS | Does |
|---|---|---|
| `Ctrl+P` | `Cmd+P` | Quick open any file by fuzzy name |
| `Ctrl+Shift+P` | `Cmd+Shift+P` | Command Palette: every command by name |
| `Ctrl+Shift+F` | `Cmd+Shift+F` | Search across the workspace (regex, include/exclude globs) |
| `Ctrl+Shift+H` | `Cmd+Shift+H` | Replace across files |
| `Ctrl+G` | `Ctrl+G` | Go to line |
| `F12` / `Alt+F12` | `F12` / `Opt+F12` | Go to / peek definition |
| `Shift+F12` | `Shift+F12` | Find all references |
| `F2` | `F2` | Rename symbol everywhere |
| `` Ctrl+` `` | `` Ctrl+` `` | Toggle integrated terminal |
| `Ctrl+B` | `Cmd+B` | Toggle sidebar |
| `Alt+Up/Down` | `Opt+Up/Down` | Move line |
| `Shift+Alt+Down` | `Shift+Opt+Down` | Duplicate line |
| `Ctrl+D` | `Cmd+D` | Select next occurrence (multi-cursor) |
| `Ctrl+/` | `Cmd+/` | Toggle line comment |
| `Ctrl+Shift+K` | `Cmd+Shift+K` | Delete line |

Multi-cursor editing with `Ctrl+D` or `Alt+Click` is the fastest way to fix twenty similar lines in a rate table without a regex.

### Source Control view

The Git icon in the Activity Bar opens a panel listing changed files. Clicking a file shows a side-by-side diff; the `+` icon stages, `-` unstages, the curved arrow discards. Type a message and press `Ctrl+Enter` to commit. The bottom-left status bar shows the branch; click it to switch or create. The **GitLens** extension adds inline blame, commit graph, file history and rich comparisons, and **GitHub Pull Requests and Issues** lets you review and merge PRs without leaving the editor. VS Code's own three-way merge editor opens when you click a conflicted file.

### Integrated terminal and tasks

`` Ctrl+` `` opens a terminal already in the workspace folder, choosing bash, PowerShell or Git Bash from the dropdown. **Tasks** (`.vscode/tasks.json`) wrap commands you run often so `Ctrl+Shift+B` runs the build:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build handbook",
      "type": "shell",
      "command": "python tools/build.py --out build/handbook.docx",
      "group": { "kind": "build", "isDefault": true },
      "problemMatcher": []
    }
  ]
}
```

### Settings and workspaces

Settings live in three layers: user (`settings.json`, applies everywhere), workspace (`.vscode/settings.json`, committed so the team shares it) and folder. Open with `Ctrl+,` or edit the JSON. A minimal shared workspace file for a Python document-automation project:

```json
{
  "editor.formatOnSave": true,
  "editor.rulers": [88],
  "files.trimTrailingWhitespace": true,
  "files.eol": "\n",
  "python.defaultInterpreterPath": ".venv/bin/python",
  "[markdown]": { "editor.wordWrap": "on" },
  "files.exclude": { "**/__pycache__": true, "**/~$*": true }
}
```

`.vscode/extensions.json` with a `recommendations` list prompts every teammate to install the same extensions (Python, Pylance, Prettier, GitLens, markdownlint).

### Debugging

The Run and Debug view (`Ctrl+Shift+D`) runs your program under a debugger. Click in the gutter left of a line number to set a **breakpoint**; press `F5`. Execution pauses there and you can inspect **Variables**, evaluate expressions in the **Debug Console**, add **Watch** expressions, and see the **Call Stack**. Step controls: `F10` step over, `F11` step into, `Shift+F11` step out, `F5` continue.

A `launch.json` describes how to start the program:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug rate validator",
      "type": "debugpy",
      "request": "launch",
      "program": "${workspaceFolder}/tools/validate_rates.py",
      "args": ["rates/WY.csv", "--strict"],
      "console": "integratedTerminal",
      "justMyCode": true
    },
    {
      "name": "Debug Node script",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/tools/build.js"
    }
  ]
}
```

`type: debugpy` is the current Python debugger (the older `python` type still works as an alias). Right-click a breakpoint for a **conditional breakpoint** (`row["state"] == "WY" and amount > 150000`) or a **logpoint** that prints without stopping. **Exception breakpoints** in the Breakpoints panel pause the moment an uncaught error is raised, showing the exact state that caused a crash in a 700-file batch.

> **Tip:** When a script fails only on the 412th file, set a conditional breakpoint on the loop with `i == 411` rather than stepping 411 times, or use a logpoint `{filename} {len(rows)}` to print a trace without editing the code.

### Remote and containers

The **Remote - SSH** extension opens a folder on a server as if local, and **Dev Containers** runs the workspace inside Docker with tools preinstalled from `.devcontainer/devcontainer.json`, giving every teammate the same Python, pandoc and LibreOffice versions. GitHub Codespaces is the same idea hosted by GitHub, with the browser or desktop VS Code attached.

### Try It Yourself

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug current file",
      "type": "debugpy",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    }
  ]
}
```

### Quiz

1. Which shortcut opens the Command Palette?
- [ ] `Ctrl+P`
- [x] `Ctrl+Shift+P`
- [ ] `Ctrl+Shift+F`
> `Ctrl+P` is quick file open; the palette lists every command.

2. Where do team-shared editor settings belong?
- [ ] User `settings.json`
- [x] `.vscode/settings.json` in the repository
- [ ] `launch.json`
> Workspace settings are committed and apply to everyone who opens the folder.

3. What is a logpoint?
- [x] A breakpoint that prints a message instead of pausing
- [ ] A breakpoint that only fires once
- [ ] A saved debug session log
> Logpoints are edited like breakpoints and remove the need for temporary print statements.

4. Which `launch.json` type is the current Python debugger?
- [ ] `python3`
- [x] `debugpy`
- [ ] `pydebug`
> The Python extension migrated to the `debugpy` type; `python` remains as an alias.

### Exercises

1. **Conditional breakpoint** — A loop over CSV rows crashes on one row. Pause only when `row["policy_no"] == "WY-0421"`.
<details><summary>Solution</summary>

Set a breakpoint on the first line inside the loop, right-click it → Edit Breakpoint → Expression → `row["policy_no"] == "WY-0421"`. Press `F5`; the debugger stops only for that row and the Variables pane shows the offending values.

</details>

2. **Recommended extensions** — Make VS Code prompt teammates to install Python, GitLens and markdownlint.
<details><summary>Solution</summary>

```json
{
  "recommendations": [
    "ms-python.python",
    "eamodio.gitlens",
    "DavidAnson.vscode-markdownlint"
  ]
}
```

Save as `.vscode/extensions.json` and commit it.

</details>

3. **Multi-cursor fix** — Fifteen lines in a CSV have `WY ` with a trailing space before the comma. Fix them without regex.
<details><summary>Solution</summary>

Select the first `WY ,`, press `Ctrl+D` repeatedly (or `Ctrl+Shift+L` to select all occurrences at once), type `WY,`, press Escape. Alternatively `Ctrl+H` with regex `WY ,` → `WY,`.

</details>

### Interview Questions

**Q: How do you debug a script that fails deep inside a batch job?**
I reproduce with the smallest input that fails, then run it under the VS Code debugger with an exception breakpoint enabled so it stops exactly where the error is raised, with the full call stack and local variables visible. If the failure depends on a particular record I use a conditional breakpoint on the loop rather than stepping, and logpoints to trace values without modifying code. I inspect state in the Debug Console, form a hypothesis, fix, and then add a unit test with that input so it cannot regress. Print statements are fine for a quick look, but a debugger shows the whole state at once and does not leave debris in the code.

**Q: What VS Code configuration would you commit to a team repository?**
`.vscode/settings.json` for behaviour that affects the code itself: format on save, line endings, rulers, the interpreter path, file excludes; `.vscode/extensions.json` recommending the linters and language tools the project relies on; `.vscode/launch.json` with the standard debug configurations so nobody rebuilds them; and `.vscode/tasks.json` for build and test commands. I keep personal preferences such as theme, font and keybindings in user settings, never in the repo. If the team needs identical tool versions I add a `.devcontainer` so the environment itself is reproducible.

**Q: Explain step over, step into and step out.**
When paused at a breakpoint, step over (`F10`) executes the current line entirely, including any function calls, and pauses at the next line in the same function. Step into (`F11`) descends into the function called on the current line so you can follow its logic, pausing at its first line. Step out (`Shift+F11`) runs the rest of the current function and pauses when it returns to the caller. With `justMyCode` enabled the Python debugger skips library internals when stepping, which keeps you in your own code instead of inside pandas or the standard library.

# LEVEL: Expert

## Git internals (objects, refs, packfiles)

Everything Git does is a manipulation of four object types stored in a content-addressed database, plus a handful of text files that point into it. Once you can see that, `reset`, `rebase`, `cherry-pick` and the reflog stop being magic. This chapter opens `.git` and reads it with the plumbing commands.

### The object database

Every object is stored under `.git/objects/` in a path derived from the SHA-1 hash of its content (`ab/cdef...`: first two hex characters as a folder, the remaining 38 as the filename). Because the name *is* the hash of the content, identical content is stored once and any corruption changes the name, which is what "content-addressable" means. Git is migrating to SHA-256 (`git init --object-format=sha256`, experimental since 2.29 and interoperable since 2.42), but SHA-1 remains the default and what GitHub uses.

| Type | Contains | Points to |
|---|---|---|
| **blob** | The bytes of one file; no name, no permissions | nothing |
| **tree** | A directory listing: mode, type, hash, name per entry | blobs and sub-trees |
| **commit** | tree hash, parent hash(es), author, committer, message | one tree, zero or more commits |
| **tag** | Annotated tag: object hash, type, tagger, message | usually a commit |

```bash
git cat-file -t 4f2a9c1              # commit
git cat-file -p 4f2a9c1              # pretty-print it
# tree 8a1c...
# parent 3b7e...
# author Ali Raza <ali@example.com> 1757990400 +0500
# committer Ali Raza <ali@example.com> 1757990400 +0500
#
# Add QA checklist
git cat-file -p 8a1c                 # the tree
# 100644 blob 9f2b...    checklist.md
# 040000 tree c4d5...    docs
git cat-file -p 9f2b                 # the blob: the file's text
```

Modes are `100644` (regular file), `100755` (executable), `120000` (symlink), `040000` (directory) and `160000` (gitlink, a submodule commit). Git does not store other permissions or timestamps, which is why cloning gives every file the current time.

### Writing objects by hand

```bash
echo "WY,OWNER,100000,575" | git hash-object -w --stdin      # returns a blob hash
git update-index --add --cacheinfo 100644,<blob>,rates.csv   # put it in the index
git write-tree                                               # tree hash from the index
echo "Manual commit" | git commit-tree <tree> -p HEAD          # commit hash
git update-ref refs/heads/main <commit>                       # move the branch
```

This is literally what `git add` and `git commit` do. The **index** (`.git/index`) is a binary file listing every tracked path with its blob hash and stat data; `write-tree` turns it into tree objects.

### Refs and HEAD

```bash
cat .git/HEAD                        # ref: refs/heads/main
cat .git/refs/heads/main             # 4f2a9c1... (a commit hash)
ls .git/refs/remotes/origin/         # remote-tracking branches
ls .git/refs/tags/
git show-ref                         # all refs and their hashes
git rev-parse HEAD~2 main@{yesterday} v2.1.0^{commit}
```

A branch is a file with a hash. `HEAD` is normally a symbolic ref naming a branch; in detached state it holds a hash directly. `git pack-refs` (run automatically by `gc`) moves refs into a single `.git/packed-refs` file, so a missing file under `refs/heads` does not mean the branch is gone. Git 2.45 added the **reftable** backend as an alternative storage for refs, used by default in some hosted environments.

### Loose objects, packfiles and gc

Freshly written objects are **loose**: one zlib-compressed file each. Thousands of them are slow, so `git gc` (triggered automatically by `git gc --auto` after pushes and commits) packs them into `.git/objects/pack/pack-*.pack` with a companion `.idx` for random access. Inside a pack, similar objects are stored as **deltas** against a base, which is where the huge space savings come from: fifty versions of a 767-page Markdown handbook cost roughly one copy plus fifty small deltas. Git chooses delta bases by sorting objects by type, size and name, so it usually deltas a file against its own earlier versions.

```bash
git count-objects -vH                # loose vs packed sizes
git gc --aggressive --prune=now      # repack everything, drop unreachable objects
git verify-pack -v .git/objects/pack/pack-*.idx | sort -k3 -n | tail -5   # biggest objects
git fsck --full                      # check integrity, list dangling objects
```

Unreachable objects (from amended commits, deleted branches, dropped stashes) are kept until they are older than `gc.pruneExpire` (two weeks by default) and no reflog references them, which is the safety window the next chapter relies on.

### Reachability and what "deleted" means

Nothing is deleted when you delete a branch; only the ref is removed. Commits reachable from any ref, reflog entry or the index survive. Objects reachable from nothing are garbage and will eventually be pruned. `git log --all` walks every ref; `git fsck --lost-found` lists objects nothing points at.

> **Interview note:** "How does Git store data?" wants: content-addressed objects (blob/tree/commit/tag), snapshots not diffs at the object level, delta compression only inside packfiles as a storage optimisation, refs as pointers, and HEAD as the pointer to the current ref. Add that SHA-1 names make integrity verifiable and identical content deduplicated, and you have a senior answer.

### Hooks

`.git/hooks/` holds sample scripts run at lifecycle points: `pre-commit` (lint, secret scan), `commit-msg` (enforce message format), `pre-push` (run tests), `post-merge`. They are local and not cloned, so teams use frameworks such as **pre-commit** (Python) or **husky** (Node) that install hooks from a committed config, or `git config core.hooksPath .githooks` to point at a tracked folder.

```bash
# .githooks/pre-commit
#!/bin/sh
git diff --cached --name-only | grep -E '\.csv$' | xargs -r python tools/validate_rates.py || exit 1
```

### Try It Yourself

```bash
git cat-file -p HEAD
git cat-file -p HEAD^{tree}
git rev-parse HEAD main origin/main
cat .git/HEAD
git count-objects -vH
git verify-pack -v .git/objects/pack/*.idx | sort -k3 -n | tail -3
```

### Quiz

1. What determines an object's filename under `.git/objects`?
- [ ] Its path in the working tree
- [x] The SHA-1 hash of its content
- [ ] The commit that created it
> Content addressing deduplicates identical files and makes corruption detectable.

2. Where does Git store diffs?
- [ ] In every commit object
- [x] Only as deltas inside packfiles, as a storage optimisation
- [ ] In the index
> Commits point at full tree snapshots; delta compression is invisible to the object model.

3. What is `.git/HEAD` in the normal (attached) state?
- [x] A symbolic ref naming the current branch
- [ ] The hash of the latest commit
- [ ] A list of all branches
> `ref: refs/heads/main`; detached HEAD holds a raw hash instead.

4. Why does deleting a branch not immediately lose its commits?
- [ ] Branches are copied before deletion
- [x] The objects remain until garbage collection prunes unreachable, expired objects
- [ ] Git forbids deleting branches with commits
> The reflog and the prune expiry give you a recovery window.

### Exercises

1. **Trace a file to its blob** — Find the blob hash of `rates.csv` at `HEAD` and print its contents with plumbing commands only.
<details><summary>Solution</summary>

```bash
git ls-tree HEAD rates.csv          # 100644 blob 9f2b... rates.csv
git cat-file -p 9f2b
# or in one step: git rev-parse HEAD:rates.csv
```

</details>

2. **Find the largest object ever committed** — A clone is 900 MB; identify the culprit.
<details><summary>Solution</summary>

```bash
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '$1=="blob"' | sort -k3 -n | tail -5
```

The last column is the path; this typically reveals a committed `.pbix` or video that belongs in LFS.

</details>

3. **Install a tracked pre-commit hook** — Make a hook in `.githooks/` run for every clone that opts in.
<details><summary>Solution</summary>

```bash
mkdir -p .githooks
printf '#!/bin/sh\ngitleaks protect --staged || exit 1\n' > .githooks/pre-commit
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks       # each developer runs this once, or a setup script does
git add .githooks && git commit -m "Add secret-scanning pre-commit hook"
```

</details>

### Interview Questions

**Q: Describe Git's object model.**
Git is a key-value store keyed by the SHA-1 of content. Blobs hold file bytes, trees map names and modes to blobs and sub-trees, commits point at one tree plus parent commits with author, committer and message, and annotated tags point at an object with a tagger and message. A commit therefore references a complete snapshot; nothing in the model is a diff. Branches and tags are refs, plain files containing a hash, and HEAD names the current ref. Delta compression happens only in packfiles, below the object model, which is why Git can present snapshots yet store fifty versions of a large file cheaply.

**Q: What happens on disk when you run `git gc`?**
Loose objects are combined into a packfile with an index, similar objects are stored as deltas against a base to save space, refs are consolidated into `packed-refs`, reflog entries older than their expiry (90 days for reachable, 30 for unreachable by default) are dropped, and unreachable objects older than the prune expiry are deleted. It runs automatically when loose-object or pack counts cross thresholds. For a bloated repository I run `git gc --aggressive --prune=now` after removing large files from history, and I verify with `git count-objects -vH` before and after. On the server, GitHub does the same maintenance; a very large repo may benefit from `git maintenance start`, which schedules incremental tasks.

**Q: How do Git hooks work and how do you share them across a team?**
Hooks are executable scripts in `.git/hooks` named after events; Git runs them at that point and a non-zero exit aborts the operation for the client-side hooks such as `pre-commit`, `commit-msg` and `pre-push`. Because `.git` is not cloned, hooks are local, so sharing needs either `core.hooksPath` pointing at a committed folder, or a manager like pre-commit or husky that installs hooks from a committed config file during setup. I treat hooks as a fast local safety net, running formatters, linters and a secret scanner, and never as the sole enforcement, because anyone can skip them with `--no-verify`; CI on the pull request is the real gate.

## Bisect/blame/reflog recovery

Three tools turn history from a record into an investigation kit. `git bisect` finds the commit that introduced a bug by binary search. `git blame` and its friends tell you who last touched a line and, with a little technique, who *really* introduced it. The **reflog** records every place HEAD and each branch has pointed, which is what lets you undo almost any Git mistake, including a botched rebase or a hard reset.

### git bisect

Suppose the rate calculator produced correct output at tag `v2.0.0` but is wrong on `main`, and there are 180 commits in between. Testing each would take a day; bisect needs about eight tests.

```bash
git bisect start
git bisect bad                      # current commit is broken
git bisect good v2.0.0              # this one worked
# Bisecting: 90 revisions left to test after this (roughly 7 steps)
python tools/calc.py WY 150000      # test the checked-out commit
git bisect good                     # or: git bisect bad
# ...repeat until:
# 3f4e5d6 is the first bad commit
git bisect reset                    # return to where you started
```

Fully automated when you have a script that exits 0 for good and non-zero for bad:

```bash
git bisect start HEAD v2.0.0
git bisect run python -m pytest tests/test_rounding.py -q
git bisect reset
```

Exit code 125 tells bisect to skip a commit that cannot be tested (for example it does not build). `git bisect log` saves the session, and `git bisect terms --term-old=fast --term-new=slow` renames good/bad when hunting a performance regression rather than a bug. Bisect works well only when commits are small and each builds, which is a strong argument for the clean history you learned to make with interactive rebase.

### Blame beyond the surface

```bash
git blame -w -M -C -C -L 40,60 rates.py       # ignore whitespace, follow moves and copies
git blame --ignore-rev 7a8b9c0 rates.py       # skip a known reformatting commit
git config blame.ignoreRevsFile .git-blame-ignore-revs    # a committed list of such commits
git log -L 40,60:rates.py                     # full history of a line range, with diffs
git log -S "round(" --oneline -- rates.py     # when did this call appear or vanish
git log -G "round\(.*discount" --oneline      # regex variant, matches changed lines
```

`.git-blame-ignore-revs` is the accepted way to keep a "format entire codebase with Black" commit from polluting every blame; GitHub honours the file too. `git log -L` is the most under-used command in Git: it follows a function or range through renames and refactors and shows each change in context.

### The reflog

Every time HEAD moves, Git appends a line to `.git/logs/HEAD`; each branch has its own log under `.git/logs/refs/heads/`. The reflog is local, never pushed, and expires after 90 days (30 for entries no longer reachable).

```bash
git reflog
# 4f2a9c1 HEAD@{0}: reset: moving to HEAD~3
# 9e8d7c6 HEAD@{1}: commit: Add Ohio loan rates
# 5d6e7f8 HEAD@{2}: rebase (finish): returning to refs/heads/feature
# ...
git reflog show feature/texas        # one branch's history of positions
git show HEAD@{1}                    # inspect
git reset --hard HEAD@{1}            # undo the reset
git branch rescue HEAD@{5}           # or give the lost commit a name first (safer)
git checkout main@{yesterday}        # time-based syntax
```

### Recovery recipes

| Disaster | Recovery |
|---|---|
| `reset --hard` lost commits | `git reflog`, find the pre-reset entry, `git reset --hard HEAD@{n}` |
| Deleted a branch | `git reflog` for its last commit, `git branch name <hash>`; or `git fsck --lost-found` |
| Rebase went wrong | `git reflog`, find `rebase (start)`, reset to the entry just before it; or `ORIG_HEAD` right after |
| Amended the wrong commit | `git reset --soft HEAD@{1}` restores the pre-amend commit as the tip |
| Dropped a stash | `git fsck --unreachable | grep commit`, `git show` candidates, `git stash apply <hash>` |
| Force-pushed over a colleague's work | Their clone still has it: `git push --force-with-lease origin their-branch` from their machine; on GitHub, the Events API or the PR page may show the old hash |

`ORIG_HEAD` is set by merge, rebase, reset and pull to the previous HEAD, so `git reset --hard ORIG_HEAD` is a one-liner undo immediately after any of those.

> **Warning:** The reflog cannot save work that was never committed or staged. It also lives only in your clone: a repository deleted from disk takes its reflog with it. Push feature branches regularly; the remote is your backup, the reflog is your undo.

### Finding lost work without the reflog

```bash
git fsck --lost-found                   # writes dangling objects to .git/lost-found/
git fsck --unreachable --no-reflogs | grep commit | cut -d' ' -f3 | \
  xargs -I{} git log -1 --format="%h %ad %s" --date=short {}
```

Dangling blobs have no filename, but `git cat-file -p` shows their content, which is often enough to recognise a lost file.

### Try It Yourself

```bash
git reflog -n 10
git bisect start HEAD v2.0.0
git bisect run python -m pytest tests/test_rounding.py -q
git bisect log
git bisect reset
git log -L 1,10:rates.csv --oneline
```

### Quiz

1. How many tests does bisect need for roughly 1000 commits?
- [ ] About 100
- [x] About 10
- [ ] About 500
> Binary search halves the range each step: log2(1000) is just under 10.

2. What exit code makes `git bisect run` skip a commit?
- [ ] 0
- [ ] 1
- [x] 125
> 125 means "cannot test here"; other non-zero codes mean bad.

3. Where is the reflog stored, and is it pushed?
- [x] In `.git/logs`, never pushed
- [ ] In `.git/refs`, pushed with branches
- [ ] On the remote only
> The reflog is a per-clone safety net, not part of the repository's shared history.

4. Immediately after a bad `git rebase`, what is the quickest undo?
- [ ] `git rebase --undo`
- [x] `git reset --hard ORIG_HEAD`
- [ ] `git revert HEAD`
> Merge, rebase, reset and pull all record the previous HEAD in `ORIG_HEAD`.

### Exercises

1. **Recover a deleted branch** — You ran `git branch -D feature/ohio` yesterday. Bring it back.
<details><summary>Solution</summary>

```bash
git reflog | grep -i "ohio"          # find the last commit hash on it, e.g. 9e8d7c6
git branch feature/ohio 9e8d7c6
```

If the reflog has no entry, `git fsck --lost-found` and inspect dangling commits.

</details>

2. **Automated bisect for a performance regression** — The build went from 20 s to 90 s. Find the commit using custom terms and a timing script.
<details><summary>Solution</summary>

```bash
cat > /tmp/perf.sh <<'SH'
#!/bin/sh
start=$(date +%s); ./tools/build.sh >/dev/null 2>&1 || exit 125
[ $(( $(date +%s) - start )) -lt 40 ]
SH
chmod +x /tmp/perf.sh
git bisect start --term-old=fast --term-new=slow
git bisect slow HEAD && git bisect fast v2.0.0
git bisect run /tmp/perf.sh
git bisect reset
```

</details>

3. **Clean blame** — A commit reformatted every file. Make `git blame` skip it for everyone.
<details><summary>Solution</summary>

```bash
echo "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b  # Black reformat" >> .git-blame-ignore-revs
git config --global blame.ignoreRevsFile .git-blame-ignore-revs
git add .git-blame-ignore-revs && git commit -m "Ignore reformat commit in blame"
```

</details>

### Interview Questions

**Q: How does `git bisect` work and what makes it effective?**
It performs a binary search over the commits between a known good and a known bad revision, checking out the midpoint, asking you (or a script) whether it is good or bad, and halving the remaining range each time, so 1000 commits need about ten checks. With `git bisect run` and a test that exits 0 or non-zero, the whole search is unattended, and exit 125 skips untestable commits. It is effective only if history is bisectable: each commit builds and represents one logical change, which is why squashing "wip" commits and keeping `main` green matter. I used it to find which of 180 commits changed a rounding rule in a rate calculator in under five minutes.

**Q: A teammate says they lost a day of work after a bad rebase. What do you do?**
First stop them running anything else, especially `gc`. Then `git reflog` in their clone: the entries before `rebase (start)` show where the branch tip was, so `git branch rescue <hash>` names the old tip and nothing is lost. If they had already continued and it was recent, `ORIG_HEAD` may still point there. If the reflog was somehow pruned, `git fsck --lost-found` lists dangling commits to inspect with `git show`. Uncommitted edits cannot be recovered, so the retrospective lesson is to commit or push a WIP branch before any history rewrite, and to use `--force-with-lease` so the remote copy would have refused an accidental overwrite.

**Q: How do you find who introduced a specific bug, not just who last touched the line?**
Plain `git blame` names the most recent change, which is often a rename or reformat. I use `-w -M -C` so whitespace and moved code are seen through, and `--ignore-rev` or a `.git-blame-ignore-revs` file for bulk reformat commits. When the line was still touched by an unrelated edit, `git log -L start,end:file` shows every change to that range in order, or `git log -S "text"` jumps to the commit that first added the text. GitHub's blame view has "View blame prior to this change" for the same walk. Finally, if the bug is behavioural rather than textual, bisect with a failing test is more reliable than reading blame at all.

## Monorepos & submodules

Sometimes one repository must contain, or refer to, other projects: a suite of document tools that share a template library, a client deliverable that depends on a shared style package, or a company that keeps every service in one **monorepo**. Git gives you submodules, subtrees and worktrees, each with a different trade-off, and large monorepos need sparse checkout and partial clone to stay usable.

### Submodules

A submodule is a pointer from a parent repository to a specific commit of another repository. The parent stores only the commit hash (mode `160000`) plus a `.gitmodules` file mapping paths to URLs; the content lives in its own nested repository.

```bash
git submodule add https://github.com/aliraza/doc-templates.git templates
git commit -m "Add templates submodule"
cat .gitmodules
# [submodule "templates"]
#     path = templates
#     url = https://github.com/aliraza/doc-templates.git
```

Cloning a project with submodules requires an extra step or flag, and the number one support question is "why is the templates folder empty":

```bash
git clone --recurse-submodules https://github.com/aliraza/handbook-builder.git
# or after a plain clone:
git submodule update --init --recursive
```

Updating to the submodule's latest upstream commit and recording it in the parent:

```bash
git submodule update --remote templates      # fetch and check out the tracked branch tip
git add templates && git commit -m "Bump templates to v3.2"
git config --global submodule.recurse true   # make pull/checkout update submodules automatically
```

Submodules are precise (you know exactly which template commit produced a handbook) but awkward: detached HEADs inside the submodule, a two-step commit for every bump, and colleagues forgetting `--init`. Use them when the dependency has its own release cycle and you need pinned versions.

### Subtrees

`git subtree` copies another repository's history *into* a folder of the parent, so clones need nothing special and the files are ordinary tracked files.

```bash
git subtree add --prefix=templates https://github.com/aliraza/doc-templates.git main --squash
git subtree pull --prefix=templates https://github.com/aliraza/doc-templates.git main --squash
git subtree push --prefix=templates https://github.com/aliraza/doc-templates.git main
```

`--squash` avoids importing the entire upstream history. Subtrees are simpler for consumers and harder for maintainers who push changes back; pick them when the parent mostly consumes.

| | Submodule | Subtree |
|---|---|---|
| Clone experience | Needs `--recurse-submodules` | Plain clone works |
| Storage | Separate repo, pinned hash | Files in parent history |
| Update | `submodule update --remote` + commit | `subtree pull` |
| Contribute upstream | Commit inside submodule, push, bump parent | `subtree push` (slow on large history) |
| Best for | Pinned third-party or shared libraries | Vendoring, simple consumption |

### Worktrees

A worktree is a second working directory attached to the same repository, so you can have `main` and a feature branch checked out at once without a second clone or stashing.

```bash
git worktree add ../handbook-hotfix hotfix/2.1.1     # new folder, existing or new branch
git worktree list
git worktree remove ../handbook-hotfix
git worktree prune
```

Worktrees share the object database, so they are cheap, and each has its own index and HEAD. They are ideal for reviewing a PR while mid-feature, or for running a long build on one branch while editing another.

### Monorepos

A monorepo holds many projects (`tools/rate-calc`, `tools/docx-builder`, `templates/`, `sites/learn`) in one repository with one history. Benefits: atomic changes across projects, one CI, shared tooling, no version skew between internal libraries. Costs: size, slow clones and status, permission granularity (Git has none below the repo), and CI that must know which projects a change touched. Tooling such as Nx, Turborepo, Bazel and Pants exists to compute affected projects and cache builds; GitHub Actions can approximate it with `paths:` filters and the `dorny/paths-filter` action.

### Keeping a large repo fast

```bash
git clone --filter=blob:none <url>       # partial clone: trees and commits now, blobs on demand
git clone --depth 1 <url>                # shallow clone: last commit only (CI)
git sparse-checkout init --cone
git sparse-checkout set tools/rate-calc templates    # only these folders in the working tree
git sparse-checkout list
git config core.fsmonitor true           # built-in filesystem monitor (2.37+) makes status instant
git config feature.manyFiles true        # enables index v4 and untracked cache
git maintenance start                    # background prefetch, commit-graph, gc
git lfs install && git lfs track "*.pbix" "*.psd"    # large binaries via LFS pointers
```

Partial clone plus cone-mode sparse checkout is how Microsoft works in the Windows repository, and it works just as well for a 5 GB documents monorepo where each freelancer needs one client folder. `git scalar clone` (2.38+) bundles all of these defaults.

> **Tip:** Git LFS stores a small pointer file in Git and the real bytes on the LFS server, fetched on checkout. It is the right answer for `.pbix`, `.psd`, video and large PDFs that must be versioned. Track patterns in `.gitattributes`, commit that file, and note that GitHub's free LFS quota is 1 GB storage and 1 GB bandwidth per month, with data packs beyond that.

### Try It Yourself

```bash
git clone --filter=blob:none --no-checkout https://github.com/aliraza/doc-monorepo.git
cd doc-monorepo
git sparse-checkout init --cone
git sparse-checkout set tools/rate-calc templates
git checkout main
git worktree add ../doc-monorepo-review origin/feature/ohio
git worktree list
```

### Quiz

1. What does the parent repository store for a submodule?
- [ ] A copy of the submodule's files
- [x] A commit hash (gitlink) and an entry in `.gitmodules`
- [ ] The submodule's full history
> The content is fetched separately, which is why fresh clones show an empty folder without `--init`.

2. Which approach lets a plain `git clone` include the vendored code?
- [ ] Submodule
- [x] Subtree
- [ ] Worktree
> Subtree merges the other project's files into the parent's history.

3. What does `git clone --filter=blob:none` do?
- [ ] Clones only the latest commit
- [x] Downloads commits and trees but fetches file contents on demand
- [ ] Excludes binary files
> This is partial clone; combine with sparse checkout to limit the working tree.

4. Why use a worktree instead of a second clone?
- [x] It shares the object database and refs, so it is instant and always in sync
- [ ] It allows two people to share one folder
- [ ] It disables the reflog
> Each worktree has its own HEAD and index but the same `.git` objects.

### Exercises

1. **Fix the empty folder** — A new hire cloned the handbook repo and `templates/` is empty. Fix it and prevent the issue for future pulls.
<details><summary>Solution</summary>

```bash
git submodule update --init --recursive
git config --global submodule.recurse true
```

Add a line to the README: clone with `--recurse-submodules`.

</details>

2. **Move binaries to LFS** — Start tracking `.pbix` and `.psd` files with LFS in an existing repo (without rewriting history).
<details><summary>Solution</summary>

```bash
git lfs install
git lfs track "*.pbix" "*.psd"
git add .gitattributes
git add --renormalize .
git commit -m "Track Power BI and Photoshop files with LFS"
```

History still contains old copies; `git lfs migrate import --include="*.pbix,*.psd" --everything` rewrites it if the team agrees to re-clone.

</details>

3. **Review while working** — You are mid-feature with uncommitted changes and need to run tests on PR 88's branch.
<details><summary>Solution</summary>

```bash
git fetch origin pull/88/head:pr-88
git worktree add ../review-88 pr-88
cd ../review-88 && python -m pytest
cd - && git worktree remove ../review-88 && git branch -D pr-88
```

</details>

### Interview Questions

**Q: Submodules or subtrees: how do you choose?**
Submodules keep the dependency as a separate repository pinned to an exact commit, which gives precise provenance and clean upstream contribution but complicates every clone and update and confuses people with detached HEADs. Subtrees copy the files into the parent's history, so consumers need nothing special and the dependency can be modified in place, at the cost of a fatter history and clumsy pushes back upstream. I use submodules for a shared library with its own release cadence that several projects must pin, and subtrees for vendoring something we consume and rarely change. In many cases the better answer is neither: publish the dependency as a package and pin a version in a lockfile.

**Q: How would you make a 10 GB monorepo usable for a contractor who needs one folder?**
Partial clone with `--filter=blob:none` so they download commit and tree metadata but no file content up front, then cone-mode sparse checkout limited to their folder plus shared tooling, so only those blobs are fetched and only those paths appear on disk. I enable the built-in fsmonitor and `git maintenance` so status and fetch stay fast, keep large binaries in LFS so even full clones are lean, and use `paths:` filters in CI so their PRs run only the relevant checks. Access control below the repository level is not something Git provides, so if the contractor must not see other folders, that content belongs in a separate repository.

**Q: What are Git worktrees and when have you used them?**
A worktree is an additional checkout of the same repository in another directory, sharing objects and refs but with its own HEAD, index and working files. `git worktree add ../hotfix hotfix/2.1.1` creates one in a second. I use them to review a pull request or run a long test suite on one branch while continuing to edit on another, and to keep a permanent `main` checkout next to feature checkouts for quick comparisons. They avoid the stash-switch-stash dance and the disk cost of multiple clones, with the one rule that a branch can be checked out in only one worktree at a time.

## Signing/security & secrets hygiene

A commit's author field is a free-text string that anyone can set with `git config`. Without signing, "Ali Raza" on a commit proves nothing. Security in Git is about three things: proving who made a change (signatures), making sure no secrets enter history (hygiene and scanning), and limiting what compromised credentials or CI can do (least privilege). Interviewers for any role that touches production ask about at least one of these.

### Commit signing with SSH keys

Since Git 2.34 you can sign with the SSH key you already use for GitHub, which is far simpler than GPG.

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
git commit -S -m "Sign this one explicitly"     # -S not needed once commit.gpgsign is true
git log --show-signature -n 1
```

On GitHub, add the same public key under Settings → SSH and GPG keys as a **Signing Key** (separate from its authentication use) and commits show a green **Verified** badge. To verify locally you need an allowed-signers file:

```bash
echo "ali@example.com $(cat ~/.ssh/id_ed25519.pub)" > ~/.ssh/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
git verify-commit HEAD
```

### GPG and other options

GPG signing (`gpg --full-generate-key`, `git config user.signingkey <KEYID>`, `gpg.format openpgp`) is the older path and still common in open source. **gitsign** from Sigstore signs with short-lived certificates tied to your identity provider, leaving no long-lived key to lose. Whichever you pick, GitHub's **Vigilant mode** (Settings → SSH and GPG keys) marks *unsigned* commits attributed to you as Unverified, which is the real protection against impersonation. Branch rulesets can require signed commits on `main`.

### Credentials and tokens

- Passwords for Git over HTTPS were removed by GitHub in 2021; use **fine-grained personal access tokens** scoped to specific repositories and permissions with an expiry, or SSH keys.
- Git Credential Manager stores tokens in the OS keychain; never in `.git/config` or `~/.git-credentials` in plain text (`credential.helper store` does exactly that, so avoid it).
- In CI, use the automatic `GITHUB_TOKEN` with minimal `permissions:` or OIDC federation to cloud providers; avoid long-lived deploy keys.
- Enable **two-factor authentication**; GitHub requires it for contributors to popular repositories.

### Keeping secrets out of history

Prevention layers, cheapest first:

1. `.gitignore` for `.env`, `*.pem`, `*.pfx`, `credentials.json`.
2. A pre-commit secret scanner: `gitleaks protect --staged` or `detect-secrets`, installed via the pre-commit framework.
3. GitHub **push protection** (Settings → Code security → Secret scanning), which rejects pushes containing recognised token formats such as AWS keys, Slack tokens or Azure connection strings; free for public repositories and part of GitHub Advanced Security for private ones.
4. Load secrets from environment variables or a vault at runtime, never from source.

```bash
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks:
      - id: gitleaks
```

### When a secret leaks anyway

```bash
# 1. Rotate the credential first. History cleanup does not un-leak anything.
# 2. Remove it from all history:
pip install git-filter-repo
git filter-repo --path config/prod.env --invert-paths          # drop the file everywhere
# or replace the text while keeping the file:
echo "AKIAIOSFODNN7EXAMPLE==>REDACTED" > /tmp/replacements.txt
git filter-repo --replace-text /tmp/replacements.txt
# 3. Force-push every branch and tag, then have everyone re-clone:
git push --force --all && git push --force --tags
```

`git filter-repo` replaced the slow, error-prone `git filter-branch` and is what the Git project recommends; the BFG Repo-Cleaner is an older alternative. After the push, open pull requests, forks and GitHub's cached views may still hold the old commits, so contact GitHub support to purge them. Document the incident: what leaked, when rotated, which commits were rewritten.

> **Warning:** The moment a secret reaches a public remote, assume automated scrapers have it; GitHub tokens pushed to public repositories are typically used within minutes. Rotation, not deletion, is the fix. Rewriting history is about hygiene and compliance, not containment.

### Supply-chain hygiene

- Pin GitHub Actions to commit SHAs and review Dependabot's bump PRs.
- Enable Dependabot alerts and security updates for dependencies.
- Use `git config --global transfer.fsckObjects true` to reject malformed objects on fetch.
- Verify tags before building releases: `git verify-tag v2.1.0`.
- Review `.gitattributes` and hooks in third-party repositories before running builds; a malicious `core.hooksPath` cannot be set by a clone, but a repository's build scripts can do anything.

### Try It Yourself

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git commit --allow-empty -m "Test signed commit"
git log --show-signature -n 1
gitleaks detect --source . --verbose
```

### Quiz

1. What does an unsigned commit's author field prove?
- [ ] The committer's GitHub identity
- [x] Nothing; it is a free-text config value
- [ ] That the email is verified
> Only a signature bound to a key registered with GitHub produces a Verified badge.

2. Which Git version introduced SSH commit signing?
- [ ] 2.23
- [x] 2.34
- [ ] 2.45
> `gpg.format ssh` arrived in 2.34 (late 2021).

3. A secret was pushed to a public repo ten minutes ago. What is the first action?
- [ ] Rewrite history with filter-repo
- [x] Rotate the secret
- [ ] Delete the repository
> Scrapers act within minutes; only rotation makes the leaked value useless.

4. Which tool does the Git project recommend for rewriting history to remove a file?
- [ ] `git filter-branch`
- [x] `git filter-repo`
- [ ] `git rebase -i`
> filter-branch is deprecated as slow and error-prone; filter-repo is faster and safer.

### Exercises

1. **Enable signing and verify** — Configure SSH signing, make a signed commit and verify it locally.
<details><summary>Solution</summary>

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
echo "ali@example.com $(cat ~/.ssh/id_ed25519.pub)" >> ~/.ssh/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
git commit --allow-empty -m "Signed"
git verify-commit HEAD
```

</details>

2. **Purge a file from history** — `client-data/ssn-export.csv` was committed six months ago. Remove it from all history and push.
<details><summary>Solution</summary>

```bash
git filter-repo --path client-data/ssn-export.csv --invert-paths
git remote add origin git@github.com:aliraza/repo.git    # filter-repo removes remotes as a safety step
git push --force --all && git push --force --tags
echo "client-data/" >> .gitignore
```

Notify collaborators to re-clone and contact GitHub support to purge cached views.

</details>

3. **Block secrets before push** — Add a pre-commit hook via the pre-commit framework that runs gitleaks.
<details><summary>Solution</summary>

```bash
pip install pre-commit
cat > .pre-commit-config.yaml <<'YAML'
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks:
      - id: gitleaks
YAML
pre-commit install
git add .pre-commit-config.yaml && git commit -m "Add gitleaks pre-commit hook"
```

</details>

### Interview Questions

**Q: Why sign commits, and how does GitHub's Verified badge work?**
Because the author and committer fields are just configuration, anyone can produce a commit that claims to be from me; signing binds the commit content to a key I control. With SSH signing I set `gpg.format ssh`, point `user.signingkey` at my public key and register that key on GitHub as a signing key. GitHub checks each commit's signature against keys on the account matching the committer email and shows Verified when it matches, Unverified when it does not, and nothing when unsigned unless Vigilant mode is on. Combined with a ruleset requiring signed commits on `main`, this ensures every change to production history is attributable to a real key holder.

**Q: Walk through your response to a leaked credential in Git.**
Rotate it immediately, because deletion from history does not revoke a value that scrapers may already hold. Assess blast radius: what the credential could access and whether logs show use. Then clean history with `git filter-repo`, either removing the file or replacing the text, force-push all branches and tags, have everyone re-clone, and ask GitHub support to purge cached commits and check forks. Finally prevent recurrence: `.gitignore` the file type, add a gitleaks pre-commit hook, enable push protection, and move the secret to environment variables or a vault. I write a short incident note with timestamps so the next audit has the facts.

**Q: What does least privilege look like in a GitHub repository and its CI?**
People get the lowest role that lets them work: read for observers, triage for issue managers, write for contributors, and admin for two named owners, with teams rather than individuals where possible. `main` is protected by a ruleset requiring PRs, reviews, status checks and signed commits with no force pushes. Workflows declare `permissions:` per job so the `GITHUB_TOKEN` can, for example, read contents and write checks but not push; deployments use OIDC to assume a narrowly scoped cloud role rather than a stored key, and production environments require a reviewer. Third-party actions are pinned to SHAs and secrets are scoped to environments so a compromised PR workflow cannot reach production credentials.

## Git & tooling interview questions

This chapter is a rehearsal room. It gathers the questions that appear in developer, DevOps, technical-writer and data-engineering interviews about Git and the surrounding toolchain, and it shows how to structure an answer that sounds like experience rather than a glossary. The pattern that works: **define it in one sentence, give the mechanism, name the trade-off, and anchor with a concrete example** from your own work.

### The questions you will almost certainly get

| Question | The one-sentence core |
|---|---|
| Difference between `merge` and `rebase`? | Merge joins histories with a merge commit; rebase rewrites your commits onto a new base for linear history |
| `fetch` vs `pull`? | Fetch updates remote-tracking refs only; pull is fetch plus merge or rebase into your branch |
| `reset` vs `revert`? | Reset moves the branch pointer (rewrites); revert adds an inverse commit (safe on shared history) |
| What is the staging area? | A prepared snapshot between working tree and repository that lets you compose commits |
| What is HEAD? | A pointer to the current branch (or commit, when detached) |
| How do you resolve a conflict? | Edit the markers to the intended content, `git add`, continue or commit |
| What is a detached HEAD? | HEAD points at a commit rather than a branch; new commits are orphaned unless you branch |
| `git stash`? | Shelve uncommitted changes as a hidden commit and restore later |
| Cherry-pick? | Apply one commit's patch to another branch as a new commit |
| Git vs GitHub? | Git is the VCS; GitHub hosts repos and adds PRs, Actions, issues |

### Answer structure with an example

**Q: "Explain rebase."** A weak answer: "It moves commits to another branch." A strong answer: "Rebase replays a series of commits on top of a new base. Git finds the merge base, turns each of my commits into a patch, resets my branch to the target tip, and re-applies the patches, producing new commits with new hashes. I use it to keep a feature branch current with `main` and, interactively, to squash fixup commits before review so the reviewer sees three logical commits instead of fifteen. The trade-off is that it rewrites history, so I only rebase branches nobody else has based work on, and I push with `--force-with-lease`. On the handbook-builder project we rebased daily; merges into `main` were squash merges, so `main` stayed linear and bisectable."

That answer is four sentences of mechanism, one of trade-off, one of example. Practise until every core question sounds like that.

### Scenario questions

Interviewers increasingly pose situations. Prepare these:

1. **"You committed to the wrong branch."** Not pushed: `git branch correct-branch`, then `git reset --hard origin/main` on the wrong one. Pushed to a shared branch: `git revert`, then cherry-pick onto the right branch.
2. **"A colleague force-pushed over your commits."** Your clone still has them: `git push --force-with-lease` your copy after coordinating, or `git branch backup` and reconcile with a merge; then protect the branch.
3. **"`main` is broken in production."** Revert the merge commit with `git revert -m 1`, deploy, then fix forward in a PR. Explain why revert beats reset here.
4. **"The repository is 3 GB and slow."** Find large blobs with `rev-list --objects` plus `cat-file --batch-check`, move binaries to LFS, `filter-repo` them out if the team agrees, recommend partial clone and sparse checkout for consumers.
5. **"How do you review a 2000-line PR?"** Ask for it to be split; if impossible, review commit by commit, focus on the riskiest paths first, and require tests for behaviour changes.
6. **"CI is flaky."** Quarantine the flaky test, add retries only as a stopgap, fix the root cause (timing, shared state), and never normalise re-running pipelines.

### Tooling beyond Git

Expect a few of these:

- **What is CI/CD?** Continuous integration merges small changes frequently with automated tests; continuous delivery keeps `main` deployable with a manual release; continuous deployment ships every green merge automatically.
- **Package managers and lockfiles?** `requirements.txt` vs `pyproject.toml` plus `uv.lock` or `poetry.lock`; `package.json` vs `package-lock.json`; lockfiles pin exact versions for reproducibility and belong in Git.
- **Linters and formatters?** Ruff and Black for Python, ESLint and Prettier for JavaScript, markdownlint for docs; run in pre-commit and in CI.
- **Environment variables and secrets?** `.env` locally (ignored), CI secrets in the platform's store, never in code.
- **Semantic versioning?** MAJOR breaking, MINOR features, PATCH fixes; tags drive releases.

> **Interview note:** When you do not know a flag, say how you would find it: `git help <cmd>`, `git <cmd> -h`, or the Pro Git book. Interviewers care far more that you understand the model than that you recall `--onto` syntax; but the model plus a handful of memorised recipes is what makes you look fluent.

### Portfolio evidence

Bring proof. A public GitHub profile with: a repository whose history reads as a story (`git log --oneline` shows imperative, scoped messages), a PR you authored with a good description and responses to review, a CI workflow that builds a document or runs tests, a release with attached artefacts, and a README that explains the branching policy. For Ali's profile that could be the handbook-builder pipeline: Markdown source, a pandoc build workflow, tagged client releases with the PDF attached, and signed commits. 

### Try It Yourself

```bash
git log --oneline --graph --all -n 15
git diff main...HEAD --stat
git reflog -n 5
git stash list
git worktree list
git tag -l "v*" --sort=-v:refname | head -3
```

### Quiz

1. Which command is the safe way to undo a merge that has been deployed from `main`?
- [ ] `git reset --hard HEAD~1` then force-push
- [x] `git revert -m 1 <merge-hash>`
- [ ] `git rebase -i` and drop the merge
> Revert keeps history append-only; `-m 1` names the mainline parent.

2. In the answer structure recommended here, what follows the mechanism?
- [ ] Another definition
- [x] The trade-off, then a concrete example
- [ ] A list of flags
> Trade-offs show judgement; the example shows experience.

3. Which file makes a Node or Python install reproducible and belongs in Git?
- [ ] `.env`
- [x] The lockfile (`package-lock.json`, `uv.lock`, `poetry.lock`)
- [ ] `node_modules/`
> Lockfiles pin exact versions; dependencies themselves are restored from them.

4. What distinguishes continuous delivery from continuous deployment?
- [x] Delivery keeps main releasable with a manual release step; deployment ships every green merge automatically
- [ ] Delivery is for libraries, deployment for apps
- [ ] They are the same
> The difference is whether the final push to production is a human decision.

### Exercises

1. **Write your rebase answer** — Draft a six-sentence answer to "explain rebase" following define, mechanism, trade-off, example, using a project of your own.
<details><summary>Solution</summary>

```text
1. Definition: rebase replays commits onto a new base.
2–3. Mechanism: merge base, patches, reset, re-apply, new hashes.
4. Use: keep feature current; interactive to squash before review.
5. Trade-off: rewrites history; only on unshared branches; --force-with-lease.
6. Example: "On the SOP library we rebased daily and squash-merged; main stayed bisectable."
```

</details>

2. **Scenario drill** — Write the exact commands for "you committed two changes to `main` locally that belong on a branch, and one of them has already been pushed".
<details><summary>Solution</summary>

```bash
git branch feature/moved                 # keep both commits reachable
git revert HEAD~1                        # undo the pushed one on main with a new commit (assuming it is HEAD~1)
git reset --hard HEAD~1                  # drop the unpushed one from main (it lives on feature/moved)
git push                                 # publish the revert
git switch feature/moved && git rebase main
```

The pushed commit gets a revert; the unpushed one is simply removed; both continue on the feature branch.

</details>

3. **Audit a repository** — List five things you would check in a candidate's GitHub repository to judge their Git practice.
<details><summary>Solution</summary>

```text
- git log --oneline: imperative, specific messages, no "fix" x 20
- Branch/PR history: small PRs with descriptions and review responses
- .gitignore present and no committed build output, .env or node_modules
- CI workflow exists and is green; releases tagged with SemVer
- Signed commits, protected main, README with setup and workflow notes
```

</details>

### Interview Questions

**Q: What is the difference between `git merge` and `git rebase`, and when do you use each?**
Merge integrates another branch by creating a commit with two parents, preserving both histories exactly as they happened; rebase re-applies my commits on top of the other branch's tip, producing new commits and a linear history. Merge is non-destructive and right for shared branches and for recording when integration happened; rebase gives a cleaner, bisectable story and is right for private feature branches before review. My habit is rebase-then-squash-merge: rebase my branch onto `origin/main` daily and interactively squash noise, then the PR is squash-merged so `main` gets one commit per feature. The rule I never break is not rewriting commits someone else may have pulled.

**Q: How would you set up version control and tooling for a new documentation-automation project from scratch?**
`git init` with `main` as the default, a `.gitignore` for Python, Office lock files and generated output, a README describing the build and branching policy, and a `.pre-commit-config.yaml` running Ruff, markdownlint and gitleaks. Push to a private GitHub repository with a ruleset on `main` requiring PRs, one review, green checks and signed commits. Add a GitHub Actions workflow that runs tests and builds the DOCX and PDF on every PR, uploads them as artefacts, and on a `v*` tag creates a release with the files attached. Commit `.vscode/settings.json`, `extensions.json` and `launch.json` so every contributor gets the same formatter, linters and debug configs, and keep large binaries in LFS from day one.

**Q: Tell me about a time Git saved you or a time you made a mistake with it.**
On a client handbook project a colleague force-pushed a feature branch and appeared to erase two days of my rate-table work; because every clone is a full repository my commits were still in my reflog, so `git branch rescue HEAD@{3}` restored them in thirty seconds and we merged both sets of changes. The mistake side: early on I committed a `.env` with a SharePoint token to a private repo. I rotated the token, used `git filter-repo` to purge the file from history, force-pushed and had the team re-clone, then added push protection and a gitleaks hook. The lesson I took from both was the same: Git rarely loses committed work, and the real risks are secrets and uncommitted edits, so commit early, push often and scan before you commit.

**Q: What would you look for in a team's Git history to judge its engineering health?**
Small, frequent commits with imperative messages that explain why, merged through pull requests with substantive review comments rather than rubber-stamp approvals. Short-lived branches and few long-running divergences, which shows continuous integration is real. Tags matching releases, a changelog derivable from history, and CI status on every merge. Red flags are giant "misc fixes" commits, commented-out code, secrets or generated binaries in the tree, force-pushes on `main`, and a `develop` branch that has not been merged to `main` in months. History is the most honest record of how a team actually works, which is why I read it before joining a project.
