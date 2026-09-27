#!/usr/bin/env python3
"""Build the Cradle Your Cravings static site.

Reads the Baby Steps course sheet (data/course.json), lesson scripts
(data/scripts/*.txt) and downloadable resources (data/resources/), and writes a
complete static site to site/cradle-your-cravings/.

    python3 tools/cradle/build.py
"""
import html
import json
import os
import re
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(REPO, "site", "cradle-your-cravings")
DATA = os.path.join(HERE, "data")
BASE_URL = "https://alirazavirtualassistant-lab.github.io/my-website/cradle-your-cravings/"
PORTRAIT = "https://static.wixstatic.com/media/e5b602_11f5da33ff684f9a8482628125ecf075~mv2.jpg/v1/fill/w_900,h_1125,al_c,q_85,enc_auto/portrait.jpg"
SPEAKING = "https://static.wixstatic.com/media/e5b602_afc0e3ddc30545c9944c3c8b6685c883f002.jpg/v1/fill/w_1000,h_800,al_c,q_85,enc_auto/speaking.jpg"
BOOK_FIX = "https://static.wixstatic.com/media/e5b602_aa830669ed8a4be2b5c3c51bef413997~mv2.webp/v1/fill/w_480,h_720,al_c,q_85,enc_auto/fix.webp"
BOOK_RAINBOWS = "https://static.wixstatic.com/media/e5b602_e76728b2ec9449b09d497d04c9c83705~mv2.png/v1/fill/w_480,h_720,al_c,q_85,enc_auto/rainbows.png"
EMAIL = "cynthiajmm@gmail.com"
PHONE = "+1 (215) 353-7034"
PHONE_HREF = "tel:+12153537034"

e = html.escape

# --------------------------------------------------------------------------- icons
ICON_PATHS = {
    "home": '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    "sprout": '<path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c0-4 3-7 8-7 0 5-3 7-8 7z"/><path d="M12 14c0-3-2.5-6-7-6 0 4 2.5 6 7 6z"/>',
    "apple": '<path d="M12 7c-2-2-6-1.5-7 2-1 3.5 1 9 4 11 1 .6 2 .3 3-.3 1 .6 2 .9 3 .3 3-2 5-7.5 4-11-1-3.5-5-4-7-2z"/><path d="M12 7c0-2 1-4 3-4"/>',
    "activity": '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    "wind": '<path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
    "droplet": '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    "heart": '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    "compass": '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    "gift": '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v9H5v-9"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    "video": '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3z"/>',
    "arrow": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    "check": '<path d="m5 12 5 5 9-10"/>',
    "lock": '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    "play": '<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "file": '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    "star": '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    "users": '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><circle cx="17" cy="9" r="3"/><path d="M16 14.2c3.4.4 6 3 6 6.8"/>',
    "sparkle": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    "shield": '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    "leaf": '<path d="M5 21c0-9 6-15 16-16-1 10-7 16-16 16z"/><path d="M5 21 14 12"/>',
    "book": '<path d="M4 4h6a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h5z"/>',
    "download": '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    "map": '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    "chat": '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    "award": '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "instagram": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    "facebook": '<path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5v4h3v7h4v-7h3l1-4h-4V7.5a.5.5 0 0 1 .5-.5H15z"/>',
    "linkedin": '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    "youtube": '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    "caret": '<path d="m6 9 6 6 6-6"/>',
}


def icon(name, size=None, cls=""):
    s = f' width="{size}" height="{size}"' if size else ""
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c}{s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICON_PATHS[name]}</svg>')


LOGO = ('<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#D08B7B"/><stop offset="1" stop-color="#D9A85D"/></linearGradient></defs>'
        '<circle cx="24" cy="24" r="24" fill="#3D4F44"/>'
        '<path d="M11 25c0 7.2 5.8 13 13 13s13-5.8 13-13" fill="none" stroke="url(#lg)" stroke-width="3.2" stroke-linecap="round"/>'
        '<path d="M24 29c-4-2.6-7-5.6-7-9a3.8 3.8 0 0 1 7-2 3.8 3.8 0 0 1 7 2c0 3.4-3 6.4-7 9z" fill="#F6E2D8"/>'
        '<circle cx="24" cy="11" r="2" fill="#D9A85D"/></svg>')

# --------------------------------------------------------------------------- course data
MOD_META = {
    "m0": {"icon": "home", "color": "var(--m0)", "slug": "welcome", "folder": "00_Course_Home"},
    "m1": {"icon": "sprout", "color": "var(--m1)", "slug": "module-1", "folder": "01_Module_1_Foundations_of_Family_Wellness"},
    "m2": {"icon": "apple", "color": "var(--m2)", "slug": "module-2", "folder": "02_Module_2_Nutrition_for_Optimal_Fertility"},
    "m3": {"icon": "activity", "color": "var(--m3)", "slug": "module-3", "folder": "03_Module_3_Exercise_and_Movement"},
    "m4": {"icon": "wind", "color": "var(--m4)", "slug": "module-4", "folder": "04_Module_4_Stress_Management_and_Emotional_Wellness"},
    "m5": {"icon": "droplet", "color": "var(--m5)", "slug": "module-5", "folder": "05_Module_5_Toxin_Elimination_and_Detox"},
    "m6": {"icon": "heart", "color": "var(--m6)", "slug": "module-6", "folder": "06_Module_6_Family_Connection_and_Communication"},
    "m7": {"icon": "compass", "color": "var(--m7)", "slug": "module-7", "folder": "07_Module_7_Integration_and_Long-Term_Wellness"},
    "bonus": {"icon": "gift", "color": "var(--mb)", "slug": "bonuses", "folder": "08_Bonuses"},
    "replay": {"icon": "video", "color": "var(--mr)", "slug": "replays", "folder": "09_Replays"},
}


def parse_action(s):
    if not s:
        return None
    m = re.match(r"^(.*?),\s*(\d+)\s*XP\s*$", s.strip())
    if not m:
        return None
    label = re.sub(r"\s*\(link:[^)]*\)", "", m.group(1)).strip()
    return label, int(m.group(2))


def release_info(s):
    s = (s or "").strip()
    m = re.search(r"(\d+)\s*Days", s)
    day = int(m.group(1)) + 1 if m else 1
    week = (day - 1) // 7 + 1
    return day, week


def duration(video):
    m = re.search(r"\((\d+)\s*min", video or "")
    return int(m.group(1)) if m else None


def pretty_file(fn):
    base, ext = os.path.splitext(fn)
    base = re.sub(r"^M\dT\d+_", "", base)
    return base.replace("_", " ").replace(" and ", " & "), ext.lstrip(".").lower()


def fmt_size(n):
    return f"{n / 1024:.0f} KB" if n < 1024 * 1024 else f"{n / 1024 / 1024:.1f} MB"


def load_script(prefix):
    d = os.path.join(DATA, "scripts")
    for fn in sorted(os.listdir(d)):
        if fn.startswith(prefix):
            return parse_script(open(os.path.join(d, fn), encoding="utf-8").read())
    return None


def nice_heading(h):
    small = {"and", "or", "of", "the", "a", "for", "to", "in", "on", "with", "vs"}
    words = h.lower().split()
    out = []
    for i, w in enumerate(words):
        if i and w in small:
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:])
    t = " ".join(out)
    return re.sub(r'"(\w)', lambda m: '"' + m.group(1).upper(), t).replace("Q&a", "Q&A")


def parse_script(text):
    lines = text.strip().splitlines()
    title = lines[0].strip()
    sections = []
    cur = None
    for ln in lines[1:]:
        m = re.match(r"^—\s*([\d:]+)[–-]([\d:]+)\s+(.*?)\s*—\s*$", ln.strip())
        if m:
            cur = {"start": m.group(1), "end": m.group(2), "heading": nice_heading(m.group(3)), "paras": []}
            sections.append(cur)
        elif ln.strip() and cur is not None:
            cur["paras"].append(ln.strip())
    hook = ""
    if sections and sections[0]["paras"]:
        first = sections[0]["paras"][0]
        sentences = re.split(r"(?<=[.!?])\s+", first)
        hook = ""
        for s in sentences:
            if len(hook) + len(s) > 280 and hook:
                break
            hook = (hook + " " + s).strip()
    return {"title": title, "sections": sections, "hook": hook}


def para_html(p):
    t = e(p)
    t = re.sub(r"\[([^\]]+)\]", r'<span class="chip chip--amber">\1</span>', t)
    return f"<p>{t}</p>"


def transcript_html(sc):
    out = []
    for s in sc["sections"]:
        out.append(f'<h4><time>{s["start"]}</time>{e(s["heading"])}</h4>')
        out.extend(para_html(p) for p in s["paras"])
    return "\n".join(out)


def build_course():
    rows = json.load(open(os.path.join(DATA, "course.json")))
    res_root = os.path.join(DATA, "resources")
    modules = []
    by_id = {}
    for r in rows:
        code, tnum = r[0], r[1]
        if code == "Course Home":
            mid = "m0"
        elif code.startswith("M"):
            mid = "m" + code[1:]
        elif code == "Bonus":
            mid = "bonus"
        else:
            mid = "replay"
        if mid not in by_id:
            meta = MOD_META[mid]
            files = sorted(os.listdir(os.path.join(res_root, meta["folder"])))
            num = int(mid[1:]) if mid.startswith("m") else None
            titles = {"m0": "Welcome to Baby Steps", "bonus": "Bonus Trainings", "replay": "Group Coaching Replays"}
            mod = {
                "id": mid, "num": num, "slug": meta["slug"], "icon": meta["icon"], "color": meta["color"],
                "folder": meta["folder"], "files": files, "core": mid.startswith("m"),
                "title": titles.get(mid) or r[2],
                "desc": r[4] if tnum is None else "", "notes": r[5] if tnum is None else "",
                "release": r[7], "lessons": [], "resource_names": r[8] if tnum is None else "",
            }
            mod["day"], mod["week"] = release_info(r[7])
            by_id[mid] = mod
            modules.append(mod)
        mod = by_id[mid]
        if mid == "m0":
            # Course Home is a single welcome lesson with the pre-course actions.
            acts = [("Watch the welcome video", 10), ("Download the Welcome Guide", 10),
                    ("Complete the pre-course survey", 25), ("Set your \"why\" intention", 15)]
            mod["lessons"].append({
                "code": "welcome", "title": "Welcome to Baby Steps", "desc": r[4], "notes": r[5],
                "video_min": 5, "actions": acts, "script": "M0_",
            })
            continue
        if tnum is None:
            continue  # module header row already captured
        title = r[3]
        acts = [a for a in (parse_action(x) for x in r[9:13]) if a]
        if mid == "bonus":
            script = "Bonus1_" if tnum == "1" else f"Bonus2_THE_FIX_Session{ {'2a': 1, '2b': 2, '2c': 3}[tnum] }_"
            if title is None:
                title = r[2]
        elif mid == "replay":
            script = f"Replay{tnum}_"
        else:
            script = f"M{mid[1:]}T{tnum}_"
        mod["lessons"].append({
            "code": tnum, "title": title, "series": r[2], "desc": r[4], "notes": r[5],
            "video_min": duration(r[6]), "actions": acts, "script": script, "resources": r[8],
        })
        if mid in ("bonus", "replay") and not mod["desc"]:
            mod["desc"] = {"bonus": "Deep-dive trainings to accelerate your progress — twelve tiny habits and the three-session THE FIX for Cravings series.",
                           "replay": "Edited replays of live group coaching calls, with the questions real members asked and Cynthia's answers."}[mid]

    # module intro script + lesson ids/urls/resources
    for m in modules:
        m["intro"] = load_script(f"M{m['num']}T0_") if m["id"] not in ("m0", "bonus", "replay") else None
        m["url"] = f"course/{m['slug']}.html"
        used = set()
        for i, l in enumerate(m["lessons"], 1):
            l["id"] = f"{m['id']}-l{i}"
            l["n"] = i
            if m["id"] == "m0":
                l["url"] = "course/welcome.html"
            elif m["id"] == "bonus":
                l["url"] = f"course/bonus-{l['code']}.html"
            elif m["id"] == "replay":
                l["url"] = f"course/replay-{l['code']}.html"
            else:
                l["url"] = f"course/{m['slug']}-lesson-{l['code']}.html"
            l["script_data"] = load_script(l["script"])
            # resources for lesson: files with lesson prefix, or named in the sheet
            files = []
            pref = f"M{m['num']}T{l['code']}_" if m["id"] not in ("m0", "bonus", "replay") else None
            names = [re.sub(r"\s*\(.*?\)", "", x).strip() for x in re.split(r";", l.get("resources") or "")]
            for fn in m["files"]:
                stem = os.path.splitext(fn)[0]
                hit = pref and fn.startswith(pref)
                for nm in names:
                    base_nm = os.path.splitext(nm)[0].replace(" ", "_")
                    for nstem in {base_nm.replace("&", "and"), base_nm.replace("&", "")}:
                        if nstem and (stem == nstem or stem.endswith("_" + nstem)):
                            hit = True
                if hit:
                    files.append(fn)
                    used.add(fn)
            if m["id"] == "m0":
                files = list(m["files"])
            l["files"] = files
            l["xp"] = sum(a[1] for a in l["actions"])
            l["actions"] = [{"id": f"{l['id']}-a{j}", "label": a[0], "xp": a[1]} for j, a in enumerate(l["actions"], 1)]
    return modules


# --------------------------------------------------------------------------- layout
NAV = [
    ("index.html", "Home"),
]


def menu_program(root, modules):
    core = [m for m in modules if m["id"] not in ("bonus", "replay")]
    links = []
    for m in core:
        label = "Course Home" if m["id"] == "m0" else f"Module {m['num']}"
        mi = f'<span class="mi" style="background:{m["color"]}">{"★" if m["id"] == "m0" else m["num"]}</span>'
        links.append(f'<a href="{root}{m["url"]}">{mi}<span><strong>{e(m["title"])}</strong><small>{label} · Week {m["week"]}</small></span></a>')
    for mid in ("bonus", "replay"):
        m = next(x for x in modules if x["id"] == mid)
        mi = f'<span class="mi" style="background:{m["color"]}">{icon(m["icon"], 16)}</span>'
        links.append(f'<a href="{root}{m["url"]}">{mi}<span><strong>{e(m["title"])}</strong><small>{len(m["lessons"])} sessions</small></span></a>')
    links.append(f'<div class="menu-foot"><a href="{root}program.html">Program overview →</a><a href="{root}course/index.html">My course dashboard →</a></div>')
    return "".join(links)


def header(root, current, modules):
    def cur(key):
        return ' aria-current="page"' if current == key else ""

    prog_cur = ' class="is-current"' if current in ("program", "course") else ""
    about_cur = ' class="is-current"' if current in ("about", "team", "faq", "contact") else ""
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container nav">
    <a class="brand" href="{root}index.html" aria-label="Cradle Your Cravings — home">{LOGO}<span class="brand-text"><strong>Cradle Your Cravings</strong><small>with Cynthia Myers-Morrison, EdD</small></span></a>
    <nav aria-label="Primary"><ul class="nav-links">
      <li><a href="{root}index.html"{cur("home")}>Home</a></li>
      <li class="has-menu"><button type="button" aria-expanded="false" aria-haspopup="true"{prog_cur}>The Program {icon("caret", cls="caret")}</button>
        <div class="menu menu--wide">{menu_program(root, modules)}</div></li>
      <li><a href="{root}assessment.html"{cur("assessment")}>Free Assessment</a></li>
      <li><a href="{root}resources.html"{cur("resources")}>Resources</a></li>
      <li class="has-menu"><button type="button" aria-expanded="false" aria-haspopup="true"{about_cur}>About {icon("caret", cls="caret")}</button>
        <div class="menu">
          <a href="{root}about.html"><span class="mi" style="background:var(--rose)">{icon("heart", 16)}</span><span><strong>Meet Cynthia</strong><small>Her story, credentials &amp; books</small></span></a>
          <a href="{root}team.html"><span class="mi" style="background:var(--moss)">{icon("users", 16)}</span><span><strong>Join the Team</strong><small>Ambassadors, circle hosts &amp; partners</small></span></a>
          <a href="{root}faq.html"><span class="mi" style="background:var(--amber)">{icon("chat", 16)}</span><span><strong>FAQ</strong><small>Answers to common questions</small></span></a>
          <a href="{root}contact.html"><span class="mi" style="background:var(--m5)">{icon("mail", 16)}</span><span><strong>Contact</strong><small>Reach Cynthia directly</small></span></a>
        </div></li>
    </ul></nav>
    <div class="nav-cta">
      <a class="btn btn--ghost btn--sm guest-only" href="{root}login.html">Sign in</a>
      <a class="btn btn--rose btn--sm guest-only" href="{root}signup.html">Join free</a>
    </div>
    <a class="member-pill" href="{root}course/index.html"><span class="av" data-member-initial>•</span><span>My course</span></a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
  </div>
</header>
<nav class="drawer" id="drawer" aria-label="Mobile">
  <a href="{root}index.html">Home</a>
  <details><summary>The Program</summary><div>
    <a href="{root}program.html">Program overview</a>
    <a href="{root}course/index.html">My course dashboard</a>
    {"".join(f'<a href="{root}{m["url"]}">{"Course Home" if m["id"] == "m0" else ("Module " + str(m["num"]) if m["num"] else "")}{" · " if m["num"] or m["id"] == "m0" else ""}{e(m["title"])}</a>' for m in modules)}
  </div></details>
  <a href="{root}assessment.html">Free Assessment</a>
  <a href="{root}resources.html">Resources</a>
  <details><summary>About</summary><div>
    <a href="{root}about.html">Meet Cynthia</a>
    <a href="{root}team.html">Join the Team</a>
    <a href="{root}faq.html">FAQ</a>
    <a href="{root}contact.html">Contact</a>
  </div></details>
  <a class="btn btn--rose btn--block btn--lg guest-only" href="{root}signup.html">Join free</a>
  <a class="btn btn--ghost btn--block btn--lg guest-only" href="{root}login.html">Sign in</a>
  <a class="btn btn--primary btn--block btn--lg member-only" href="{root}course/index.html">Go to my course</a>
</nav>'''


def footer(root, modules):
    core = [m for m in modules if m["id"].startswith("m") and m["id"] != "m0"]
    return f'''<footer class="site-footer">
  <div class="container">
    <div class="foot-news">
      <div><h3>The Cradle Letter</h3><p>Gentle weekly notes from Cynthia — recipes, craving tools and encouragement for your journey.</p></div>
      <form class="inline-form-wrap" data-form="newsletter" data-subject="New Cradle Letter subscriber: {{name}}" data-ok="You're subscribed — welcome to the Cradle Letter!" data-autoresponse="Thank you for subscribing to the Cradle Letter from Cradle Your Cravings. Cynthia's gentle weekly notes will arrive in your inbox soon.">
        <div class="inline-form">
          <label class="sr-only" for="nl-email-{root.count("/")}">Email address</label>
          <input id="nl-email-{root.count("/")}" type="email" name="Email" placeholder="Your email address" required autocomplete="email" />
          <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <input type="hidden" name="Form" value="Newsletter (footer)" />
          <button class="btn btn--light" type="submit"><span class="spinner"></span>Subscribe</button>
        </div>
        <div class="form-status" role="status" aria-live="polite"></div>
      </form>
    </div>
    <div class="foot-top">
      <div class="foot-brand">
        <a class="brand" href="{root}index.html">{LOGO}<span class="brand-text"><strong>Cradle Your Cravings</strong><small>with Cynthia Myers-Morrison, EdD</small></span></a>
        <p>Baby Steps: your health journey toward conception. Calm cravings, nourish your body and build a loving foundation for the family you're dreaming of.</p>
        <div class="socials">
          <a href="https://www.instagram.com/cindyjmm/" target="_blank" rel="noopener" aria-label="Instagram">{icon("instagram")}</a>
          <a href="https://www.facebook.com/cynthia.myersmorrison/" target="_blank" rel="noopener" aria-label="Facebook">{icon("facebook")}</a>
          <a href="https://www.linkedin.com/in/cynthiamyersmorrison/" target="_blank" rel="noopener" aria-label="LinkedIn">{icon("linkedin")}</a>
          <a href="https://www.youtube.com/playlist?list=PLnEgmO43ZcYJq27_qXtongO6kxT7-tJmy" target="_blank" rel="noopener" aria-label="YouTube">{icon("youtube")}</a>
        </div>
      </div>
      <div><h4>Program</h4><ul>
        <li><a href="{root}program.html">Program overview</a></li>
        <li><a href="{root}course/index.html">Course dashboard</a></li>
        <li><a href="{root}course/welcome.html">Course Home</a></li>
        <li><a href="{root}course/bonuses.html">Bonus trainings</a></li>
        <li><a href="{root}course/replays.html">Coaching replays</a></li>
      </ul></div>
      <div><h4>Modules</h4><ul>
        {"".join(f'<li><a href="{root}{m["url"]}">{m["num"]}. {e(m["title"].split(" and ")[0])}</a></li>' for m in core)}
      </ul></div>
      <div><h4>Community</h4><ul>
        <li><a href="{root}signup.html">Join free</a></li>
        <li><a href="{root}team.html">Join the team</a></li>
        <li><a href="{root}assessment.html">Trigger Assessment</a></li>
        <li><a href="{root}resources.html">Free resources</a></li>
        <li><a href="{root}login.html">Member sign in</a></li>
      </ul></div>
      <div><h4>Cynthia</h4><ul>
        <li><a href="{root}about.html">About Cynthia</a></li>
        <li><a href="{root}faq.html">FAQ</a></li>
        <li><a href="{root}contact.html">Contact</a></li>
        <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
        <li><a href="{PHONE_HREF}">{PHONE}</a></li>
      </ul></div>
    </div>
    <div class="foot-bottom">
      <span>© <span data-year>2026</span> Cradle Your Cravings · A program by Cynthia Myers-Morrison, EdD</span>
      <span><a href="{root}privacy.html">Privacy</a> · <a href="{root}terms.html">Terms</a> · <a href="{root}faq.html#medical">Medical disclaimer</a></span>
    </div>
  </div>
</footer>'''


def page(path, title, desc, content, modules, current="", extra_body="", scripts_extra=""):
    depth = path.count("/")
    root = "../" * depth
    d = os.path.dirname(path)
    body_attrs = f' data-root="{root}"' + (f' data-dir="{d}"' if d else "") + extra_body
    full_title = title if "Cradle Your Cravings" in title else f"{title} | Cradle Your Cravings"
    doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{e(full_title)}</title>
<meta name="description" content="{e(desc)}" />
<link rel="canonical" href="{BASE_URL}{"" if path == "index.html" else path}" />
<meta name="theme-color" content="#3D4F44" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Cradle Your Cravings" />
<meta property="og:title" content="{e(full_title)}" />
<meta property="og:description" content="{e(desc)}" />
<meta property="og:image" content="{PORTRAIT}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="{root}assets/css/styles.css" />
<link rel="icon" href="{root}assets/img/favicon.svg" type="image/svg+xml" />
<link rel="manifest" href="{root}site.webmanifest" />
</head>
<body{body_attrs}>
{header(root, current, modules)}
<main id="main">
{content.replace("{R}", root)}
</main>
{footer(root, modules)}
<script src="{root}assets/js/course-data.js"></script>
<script src="{root}assets/js/app.js"></script>
{scripts_extra}
</body>
</html>
'''
    out = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(doc)
    PAGES.append(path)


PAGES = []


def crumbs(items):
    lis = "".join(f'<li><a href="{{R}}{u}">{e(t)}</a></li>' if u else f'<li aria-current="page">{e(t)}</li>' for t, u in items)
    return f'<ol class="crumbs" aria-label="Breadcrumb">{lis}</ol>'


def page_hero(eyebrow, title_html, lead, crumb_items=None, center=False, extra=""):
    return f'''<section class="page-hero grain{" center" if center else ""}">
  <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="container">
    {crumbs(crumb_items) if crumb_items else ""}
    <span class="eyebrow reveal">{eyebrow}</span>
    <h1 class="reveal" data-d="1">{title_html}</h1>
    <p class="lead reveal" data-d="2">{lead}</p>
    {extra}
  </div>
</section>'''


def cta_band(title="Your first baby step starts today", text="Join free to unlock the course dashboard, save your progress, earn XP and download every worksheet. Cynthia personally welcomes every new member.", primary=("Join free", "signup.html"), secondary=("Explore the program", "program.html")):
    return f'''<section class="section--tight"><div class="container">
  <div class="cta-band center reveal">
    <span class="eyebrow">Ready when you are</span>
    <h2>{title}</h2>
    <p>{text}</p>
    <div class="btn-row">
      <a class="btn btn--light btn--lg" href="{{R}}{primary[1]}">{primary[0]} {icon("arrow")}</a>
      <a class="btn btn--outline-light btn--lg" href="{{R}}{secondary[1]}">{secondary[0]}</a>
    </div>
  </div>
</div></section>'''


def dl_link(mod, fn, gated=True, show_module=False):
    name, ext = pretty_file(fn)
    size = fmt_size(os.path.getsize(os.path.join(DATA, "resources", mod["folder"], fn)))
    kind = "Spreadsheet" if ext.startswith("xls") else "PDF"
    sub = f'{e(mod["title"])} · ' if show_module else ""
    g = " data-gated" if gated else ""
    lock = f'<span class="lock" title="Members only">{icon("lock")}</span>' if gated else ""
    return (f'<a class="dl" href="{{R}}downloads/{mod["slug"]}/{fn}" download{g} data-cat="{mod["id"]}">'
            f'<span class="ft {ext}">{ext.upper()[:4]}</span><span><strong>{e(name)}</strong><small>{sub}{kind} · {size}</small></span>{lock}</a>')


# --------------------------------------------------------------------------- pages
def module_card(m, i=0):
    label = "Start here" if m["id"] == "m0" else (f'Module <b>{m["num"]}</b>' if m["num"] else e(m["title"].split()[0]))
    mins = sum(l["video_min"] or 0 for l in m["lessons"])
    return f'''<a class="module-card reveal" data-d="{i % 3}" href="{{R}}{m["url"]}" style="--c:{m["color"]}">
  <div class="mc-top"><span class="mc-num">{label}</span><span class="mc-ic">{icon(m["icon"])}</span></div>
  <h3>{e(m["title"])}</h3>
  <p>{e(m["desc"])}</p>
  <div class="mc-meta"><span>{icon("video", 15)} {len(m["lessons"])} lesson{"s" if len(m["lessons"]) != 1 else ""}</span><span>{icon("clock", 15)} {mins} min</span><span>{icon("calendar", 15)} {"Day 1" if m["day"] == 1 else "Opens day " + str(m["day"])}</span></div>
  <div class="mc-progress member-only" data-module-progress="{m["id"]}"><i></i></div>
</a>'''


def build_home(modules):
    core = [m for m in modules if m["id"].startswith("m") and m["id"] != "m0"]
    n_lessons = sum(len(m["lessons"]) for m in modules)
    n_files = sum(len(m["files"]) for m in modules)
    total_xp = sum(l["xp"] for m in modules for l in m["lessons"])
    featured = [modules[1]["lessons"][1], modules[2]["lessons"][1], modules[4]["lessons"][1]]
    fm = [modules[1], modules[2], modules[4]]
    tl = "".join(f'''<a class="tl-item reveal" href="{{R}}{m["url"]}" style="--c:{m["color"]}">
      <span class="tl-dot">{m["num"]}</span>
      <div class="tl-body"><span class="tl-week">Week {m["week"]} · {len(m["lessons"])} lessons</span><h4>{e(m["title"])}</h4><p>{e(m["desc"])}</p></div></a>''' for m in core)
    feat = "".join(f'''<a class="card reveal" data-d="{i}" href="{{R}}{l["url"]}" style="--c:{m["color"]}">
      <span class="chip" style="color:{m["color"]}"><span class="dot"></span>Module {m["num"]} · {l["video_min"]} min</span>
      <h3 style="margin-top:18px">{e(l["title"])}</h3>
      <p class="quote" style="font-size:1.08rem;margin-bottom:18px">{e(l["script_data"]["hook"])}</p>
      <span class="link-arrow">Preview the lesson</span></a>''' for i, (l, m) in enumerate(zip(featured, fm)))
    content = f'''
<section class="hero grain">
  <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="container hero-grid">
    <div>
      <span class="eyebrow reveal">Baby Steps · Your health journey toward conception</span>
      <h1 class="reveal" data-d="1">Cradle your cravings. <em class="accent">Nurture the family</em> you're dreaming of.</h1>
      <p class="lead reveal" data-d="2">A warm, science-backed 7-module program from Cynthia Myers-Morrison, EdD, that helps you and your partner calm cravings, balance hormones and build the healthiest foundation for conception — one baby step at a time.</p>
      <div class="btn-row reveal" data-d="3">
        <a class="btn btn--rose btn--lg guest-only" href="{{R}}signup.html">Join free today {icon("arrow")}</a>
        <a class="btn btn--primary btn--lg member-only" href="{{R}}course/index.html">Continue my course {icon("arrow")}</a>
        <a class="btn btn--ghost btn--lg" href="{{R}}assessment.html">Take the free assessment</a>
      </div>
      <div class="hero-meta reveal" data-d="3">
        <div class="avatars" aria-hidden="true"><span style="background:var(--m1)">{icon("heart", 16)}</span><span style="background:var(--m2)">{icon("apple", 16)}</span><span style="background:var(--m4)">{icon("wind", 16)}</span><span style="background:var(--m6)">{icon("users", 16)}</span></div>
        <p><strong>{n_lessons} video lessons · {len(core)} modules</strong><br/>plus bonus trainings, coaching replays &amp; {n_files} worksheets</p>
      </div>
    </div>
    <div class="hero-art reveal" data-d="2">
      <div class="arch-ring" aria-hidden="true"></div>
      <div class="arch"><img src="{PORTRAIT}" alt="Cynthia Myers-Morrison, EdD, smiling" width="900" height="1125" fetchpriority="high" /></div>
      <div class="float-card fc1"><span class="ic" style="background:var(--amber-soft);color:#8A6424">{icon("sparkle", 20)}</span><span><strong>Module 2 unlocked</strong><small>Nutrition for Optimal Fertility</small></span></div>
      <div class="float-card fc2"><span class="ic" style="background:var(--blush);color:var(--rose-dark)">{icon("star", 20)}</span><span><strong>+40 XP earned</strong><small>First sugar swap tried</small><span class="xp-bar"><i></i></span></span></div>
      <div class="float-card fc3"><span class="ic" style="background:rgba(61,79,68,.1);color:var(--moss)">{icon("check", 20)}</span><span><strong>3 triggers found</strong><small>Cravings are signals, not flaws</small></span></div>
    </div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">
  {"".join("<span>" + w + "</span>" for w in ["No diets", "No shame", "Science-backed", "Partner-inclusive", "Trauma-informed", "Real food", "Generational healing", "Tiny daily habits"] * 2)}
</div></div>

<section class="section">
  <div class="container split">
    <div>
      <span class="eyebrow reveal">Why it matters</span>
      <h2 class="reveal" data-d="1">A craving is not a character flaw. <em class="accent">It's a signal.</em></h2>
      <p class="lead reveal" data-d="2">In the months before conception, what you eat, how you sleep, how you breathe and how you love are already shaping the child you're hoping for. That's not a poetic idea — it's biology.</p>
      <p class="reveal" data-d="2">Baby Steps turns that truth into gentle, doable daily actions. You'll learn to read your cravings instead of fighting them, nourish your hormones with real food, move and rest in ways that support fertility, clear toxins from your home, and grow closer as a couple — so you walk into pregnancy calm, confident and connected.</p>
      <div class="btn-row reveal" data-d="3" style="margin-top:28px"><a class="btn btn--primary" href="{{R}}program.html">See what's inside {icon("arrow")}</a></div>
    </div>
    <div class="grid grid-2">
      <div class="card reveal"><div class="icon-badge">{icon("apple")}</div><h4>Balance hormones</h4><p>Swap sugar spikes for steady, fertility-friendly meals you'll actually enjoy.</p></div>
      <div class="card reveal" data-d="1" style="margin-top:34px"><div class="icon-badge moss">{icon("wind")}</div><h4>Calm the stress</h4><p>Breathwork, journaling and sleep rituals for the emotional side of trying to conceive.</p></div>
      <div class="card reveal"><div class="icon-badge amber">{icon("droplet")}</div><h4>Clear the toxins</h4><p>Simple, budget-friendly swaps for a cleaner kitchen, bathroom and home.</p></div>
      <div class="card reveal" data-d="1" style="margin-top:34px"><div class="icon-badge">{icon("users")}</div><h4>Grow together</h4><p>Partner exercises that turn a stressful season into a shared adventure.</p></div>
    </div>
  </div>
</section>

<section class="section band-paper" id="journey">
  <div class="container split" style="align-items:start">
    <div class="sticky">
      <span class="eyebrow reveal">Your 7-week journey</span>
      <h2 class="reveal" data-d="1">Seven modules. Seven weeks. <em class="accent">One healthier family.</em></h2>
      <p class="lead reveal" data-d="2">A new module opens every week so you're never overwhelmed. Each lesson is a short video with a worksheet and 2–3 action steps that earn XP as you go.</p>
      <div class="btn-row reveal" data-d="3" style="margin-top:28px">
        <a class="btn btn--rose" href="{{R}}course/welcome.html">Start with Course Home {icon("arrow")}</a>
        <a class="btn btn--ghost" href="{{R}}course/index.html">View full curriculum</a>
      </div>
    </div>
    <div class="timeline">{tl}</div>
  </div>
</section>

<section class="section band-moss">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">How Baby Steps works</span>
      <h2>Small steps. Real momentum.</h2>
      <p>Everything is designed for busy, hopeful people — short lessons, clear actions, and a warm community around you.</p>
    </div>
    <div class="grid grid-4">
      <div class="pillar reveal"><div class="num">01</div><h3>Watch</h3><p>Short, heartfelt video lessons (7–15 min) from Cynthia, each with a clear takeaway.</p></div>
      <div class="pillar reveal" data-d="1"><div class="num">02</div><h3>Do</h3><p>Two or three bite-size action steps per lesson. Check them off and earn XP.</p></div>
      <div class="pillar reveal" data-d="2"><div class="num">03</div><h3>Download</h3><p>Worksheets, trackers, recipes and planners for every lesson — {n_files} in total.</p></div>
      <div class="pillar reveal" data-d="3"><div class="num">04</div><h3>Connect</h3><p>Partner exercises, live group coaching replays and a community cheering you on.</p></div>
    </div>
    <div class="stats" style="margin-top:60px">
      <div class="stat reveal"><b data-count="{len(core)}">{len(core)}</b><span>Modules</span></div>
      <div class="stat reveal" data-d="1"><b data-count="{n_lessons}">{n_lessons}</b><span>Video lessons</span></div>
      <div class="stat reveal" data-d="2"><b data-count="{n_files}">{n_files}</b><span>Downloads</span></div>
      <div class="stat reveal" data-d="3"><b data-count="{total_xp}">{total_xp:,}</b><span>XP to earn</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">A peek inside</span>
      <h2>Lessons that feel like a warm conversation</h2>
      <p>Straight from the course — here's how a few of Cynthia's lessons begin.</p>
    </div>
    <div class="grid grid-3">{feat}</div>
  </div>
</section>

<section class="section band-cream2">
  <div class="container split">
    <div class="portrait-wrap reveal">
      <div class="portrait"><img src="{SPEAKING}" alt="Cynthia Myers-Morrison speaking to an audience" loading="lazy" width="1000" height="800" /></div>
      <div class="sticker"><span><b>27</b>years sugar-free</span></div>
    </div>
    <div>
      <span class="eyebrow reveal">Meet your guide</span>
      <h2 class="reveal" data-d="1">Cynthia Myers-Morrison, EdD</h2>
      <p class="quote reveal" data-d="2">I know the desperation of wanting to stop and not being able to. I also know the profound joy of living a life that is peaceful, purposeful, and free.</p>
      <p class="reveal" data-d="2">A former Marriage &amp; Family Therapist, Certified Food Addiction Professional and Vice Chair of the Food Addiction Institute, Cynthia has spent decades helping individuals and families break free from cravings — and she's lived it herself.</p>
      <div class="creds reveal" data-d="3"><span class="chip chip--moss">Doctorate in Education</span><span class="chip chip--moss">CFAP™ Certified</span><span class="chip chip--moss">SUGAR® Licensed</span><span class="chip chip--rose">Vice Chair, Food Addiction Institute</span><span class="chip chip--amber">Author of 2 books</span></div>
      <div class="btn-row reveal" data-d="3"><a class="btn btn--primary" href="{{R}}about.html">Read Cynthia's story {icon("arrow")}</a><span class="sig">— with love, Cynthia</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">Included with every membership</span>
      <h2>Bonuses, replays &amp; books</h2>
    </div>
    <div class="grid grid-3">
      <a class="card reveal" href="{{R}}course/bonuses.html"><div class="icon-badge" style="background:color-mix(in srgb, var(--mb) 16%, white);color:var(--mb)">{icon("gift")}</div><h3>THE FIX for Cravings</h3><p>A three-session deep dive into rewiring cravings, practical craving busters and long-term freedom — with the companion workbook.</p><span class="link-arrow">Explore bonuses</span></a>
      <a class="card reveal" data-d="1" href="{{R}}course/bonus-1.html"><div class="icon-badge amber">{icon("sparkle")}</div><h3>A Dozen Habits</h3><p>Twelve micro-habits — one tied to every module — that make a healthy life feel automatic.</p><span class="link-arrow">Watch the training</span></a>
      <a class="card reveal" data-d="2" href="{{R}}course/replays.html"><div class="icon-badge moss">{icon("video")}</div><h3>Group coaching replays</h3><p>Real questions from real members, answered live by Cynthia, with FAQ notes to keep.</p><span class="link-arrow">See the replays</span></a>
    </div>
    <div class="grid grid-2" style="margin-top:40px">
      <div class="book card reveal"><img src="{BOOK_FIX}" alt="THE FIX for Cravings book cover" loading="lazy" width="480" height="720" /><div><span class="chip chip--rose">Book</span><h3 style="margin-top:12px">THE FIX for Cravings</h3><p>Co-authored by Cynthia — understand the brain science of cravings and find real-food solutions.</p><a class="link-arrow" href="https://www.amazon.com/dp/1796091650" target="_blank" rel="noopener">View on Amazon</a></div></div>
      <div class="book card reveal" data-d="1"><img src="{BOOK_RAINBOWS}" alt="We Eat Rainbows! book cover" loading="lazy" width="480" height="720" /><div><span class="chip chip--amber">Family book</span><h3 style="margin-top:12px">We Eat Rainbows!</h3><p>A joyful picture book that helps little ones fall in love with colourful, real food.</p><a class="link-arrow" href="https://www.amazon.com/dp/B0CD4D9RW2" target="_blank" rel="noopener">View on Amazon</a></div></div>
    </div>
  </div>
</section>

<section class="section band-paper">
  <div class="container split">
    <div>
      <span class="eyebrow reveal">Join the team</span>
      <h2 class="reveal" data-d="1">Help more families <em class="accent">start well.</em></h2>
      <p class="lead reveal" data-d="2">Cradle Your Cravings is growing — and we'd love you with us. Become a community ambassador, host a support circle, partner as a practitioner, or share your recipes and story.</p>
      <div class="btn-row reveal" data-d="3" style="margin-top:26px"><a class="btn btn--primary" href="{{R}}team.html">See team roles {icon("arrow")}</a><a class="btn btn--ghost" href="{{R}}team.html#apply">Apply now</a></div>
    </div>
    <div class="grid grid-2">
      <a class="card reveal" href="{{R}}team.html?role=ambassador#apply"><div class="icon-badge">{icon("heart")}</div><h4>Ambassador</h4><p>Share the program with your community.</p></a>
      <a class="card reveal" data-d="1" href="{{R}}team.html?role=circle-host#apply"><div class="icon-badge moss">{icon("users")}</div><h4>Circle host</h4><p>Lead a warm peer support circle.</p></a>
      <a class="card reveal" href="{{R}}team.html?role=practitioner#apply"><div class="icon-badge amber">{icon("shield")}</div><h4>Practitioner</h4><p>Coaches, doulas, dietitians &amp; therapists.</p></a>
      <a class="card reveal" data-d="1" href="{{R}}team.html?role=contributor#apply"><div class="icon-badge">{icon("leaf")}</div><h4>Contributor</h4><p>Recipes, stories and creative skills.</p></a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow">
    <div class="section-head center reveal"><span class="eyebrow">Questions</span><h2>You might be wondering</h2></div>
    <div class="faq reveal">{faq_items(FAQ_HOME)}</div>
    <p class="reveal" style="text-align:center;margin-top:30px"><a class="link-arrow" href="{{R}}faq.html">See all questions</a></p>
  </div>
</section>
{cta_band()}
'''
    page("index.html", "Cradle Your Cravings | Baby Steps — your health journey toward conception",
         "Baby Steps by Cynthia Myers-Morrison, EdD: a 7-module, science-backed program to calm cravings, balance hormones and build a healthy foundation for conception — for you, your partner and your future family.",
         content, modules, "home")


FAQ_HOME = [
    ("Who is Baby Steps for?", "Anyone preparing for conception — individuals, couples, and those who are supporting a loved one. It's especially helpful if cravings, stress or old food patterns feel like they're getting in the way."),
    ("Is it really free to join?", "Yes. Creating your member account is free and gives you the course dashboard, progress tracking and downloads. Cynthia personally hears about every new member."),
    ("How much time does it take?", "Most lessons are 7–15 minutes, plus a couple of small action steps. Plan on about 20–30 minutes a few times a week. A new module opens each week."),
    ("Do I need my partner to take part?", "It's wonderful if they do — many lessons include partner exercises — but you can absolutely take the course on your own."),
    ("Is this medical advice?", "No. Baby Steps is education and coaching, not medical care. Always involve your doctor or fertility specialist — especially for supplements, detox or exercise changes."),
]

FAQ_ALL = [
    ("The program", [
        ("What is Cradle Your Cravings?", "Cradle Your Cravings is Cynthia Myers-Morrison's signature program. Its flagship course, <em>Baby Steps: Your Health Journey Toward Conception</em>, helps you calm cravings, balance hormones and build a loving, healthy foundation for your future family."),
        ("What's inside the course?", "Seven modules (Foundations, Nutrition, Movement, Stress &amp; Emotions, Toxin Elimination, Family Connection, and Integration), a welcome module, two bonus trainings, two group coaching replays and more than fifty worksheets, trackers, recipes and planners."),
        ("How are modules released?", "Course Home and Module 1 open on day one. After that, a new module opens every seven days so you have time to practise. You can always revisit earlier lessons."),
        ("What is XP?", "Every lesson has 2–3 action steps worth experience points. Checking them off fills your progress rings and moves you up through the levels — Seedling, Sprout, Blossom, Bloom and Harvest. It's a gentle way to celebrate consistency."),
    ]),
    ("Your account", [
        ("How do I join?", 'Head to the <a href="{R}signup.html">Join free</a> page and complete three quick steps. Cynthia is notified by email straight away and you\'ll receive a welcome confirmation.'),
        ("Where is my progress saved?", "Your progress, XP and member access are saved securely in the browser you use, so you can pick up right where you left off. If you switch devices, simply sign in with the same email address."),
        ("How do I sign out?", 'Open your <a href="{R}course/index.html">course dashboard</a> and choose “Sign out” at the top of the page.'),
    ]),
    ("Health &amp; safety", [
        ("Is this medical advice?", "No. Baby Steps offers education, coaching and encouragement — it is not a substitute for medical care. Please talk with your doctor or fertility specialist before changing supplements, medications, exercise or detox routines."),
        ("What if I'm already pregnant?", "Congratulations! Many of the lessons — especially stress, sleep, toxin reduction and connection — are still helpful. Please check nutrition and movement guidance with your prenatal care provider."),
        ("Is the program trauma-informed?", "Yes. Cynthia is a former Marriage &amp; Family Therapist and has studied trauma extensively. The course never uses shame, and you're always invited to go at your own pace."),
    ]),
    ("Team &amp; community", [
        ("How can I join the team?", 'We welcome ambassadors, support-circle hosts, practitioner partners and content contributors. Visit <a href="{R}team.html">Join the Team</a> to apply — Cynthia reads every application.'),
        ("Can practitioners use Baby Steps with clients?", 'Yes — coaches, dietitians, doulas and therapists can apply as practitioner partners on the <a href="{R}team.html?role=practitioner#apply">team page</a>.'),
    ]),
]


def faq_items(items):
    return "".join(f'<details><summary>{q}</summary><div><p>{a}</p></div></details>' for q, a in items)


def build_program(modules):
    core = [m for m in modules if m["id"].startswith("m")]
    n_lessons = sum(len(m["lessons"]) for m in modules)
    total_xp = sum(l["xp"] for m in modules for l in m["lessons"])
    curriculum = ""
    for m in modules:
        rows = "".join(f'<li><a href="{{R}}{l["url"]}">{e(l["title"])}</a> <span class="muted">· {l["video_min"] or "—"} min · {l["xp"]} XP</span></li>' for l in m["lessons"])
        label = "Course Home" if m["id"] == "m0" else (f'Module {m["num"]}' if m["num"] else m["title"])
        curriculum += f'''<details><summary><span style="color:{m["color"]}">{label}</span> — {e(m["title"]) if m["num"] else f'{len(m["lessons"])} sessions'}</summary><div>
<p>{e(m["desc"])}</p><ul style="padding-left:1.2em;display:grid;gap:6px">{rows}</ul>
<p style="margin-top:14px"><a class="link-arrow" href="{{R}}{m["url"]}">Open {label}</a></p></div></details>'''
    content = page_hero("The program", 'Baby Steps: <em class="accent">your health journey</em> toward conception',
                        "Seven gentle modules that help you and your partner prepare body, mind, home and relationship for the family you're dreaming of.",
                        [("Home", "index.html"), ("The Program", None)],
                        extra=f'<div class="btn-row reveal" data-d="3" style="margin-top:30px"><a class="btn btn--rose btn--lg guest-only" href="{{R}}signup.html">Join free {icon("arrow")}</a><a class="btn btn--primary btn--lg member-only" href="{{R}}course/index.html">Go to my course {icon("arrow")}</a><a class="btn btn--ghost btn--lg" href="{{R}}course/welcome.html">Preview Course Home</a></div>')
    content += f'''
<section class="section--tight"><div class="container"><div class="stats">
  <div class="stat reveal"><b data-count="7">7</b><span>Core modules</span></div>
  <div class="stat reveal" data-d="1"><b data-count="{n_lessons}">{n_lessons}</b><span>Lessons &amp; sessions</span></div>
  <div class="stat reveal" data-d="2"><b data-count="49">49</b><span>Days, start to finish</span></div>
  <div class="stat reveal" data-d="3"><b data-count="{total_xp}">{total_xp:,}</b><span>XP to earn</span></div>
</div></div></section>

<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">The curriculum</span><h2>Every module, every lesson</h2><p>Click any module to open it, or jump straight into a lesson.</p></div>
    <div class="modules">{"".join(module_card(m, i) for i, m in enumerate(modules))}</div>
  </div>
</section>

<section class="section band-moss">
  <div class="container">
    <div class="section-head center reveal"><span class="eyebrow">Who it's for</span><h2>Made for every kind of hopeful family</h2></div>
    <div class="grid grid-3">
      <div class="pillar reveal"><div class="num">{icon("heart", 40)}</div><h3>Hoping to conceive</h3><p>You want to feel your healthiest, calmest self before pregnancy — without diets or shame.</p></div>
      <div class="pillar reveal" data-d="1"><div class="num">{icon("users", 40)}</div><h3>Couples together</h3><p>Partner exercises, shared visioning and communication tools turn this into a team journey.</p></div>
      <div class="pillar reveal" data-d="2"><div class="num">{icon("shield", 40)}</div><h3>Practitioners</h3><p>Coaches, doulas and therapists can partner with Cynthia to support their clients.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split" style="align-items:start">
    <div class="sticky">
      <span class="eyebrow reveal">Full syllabus</span>
      <h2 class="reveal" data-d="1">Explore the complete syllabus</h2>
      <p class="lead reveal" data-d="2">Every lesson includes a short video, a downloadable worksheet and action steps that earn XP.</p>
      <div class="side-card reveal" data-d="3" style="margin-top:26px">
        <h4>Release schedule</h4>
        {"".join(f'<p style="margin:0 0 8px;display:flex;justify-content:space-between;gap:10px"><a href="{{R}}{m["url"]}">{("Course Home" if m["id"] == "m0" else "Module " + str(m["num"]))}</a><span class="muted">Day {m["day"]}</span></p>' for m in core)}
      </div>
    </div>
    <div class="faq">{curriculum}</div>
  </div>
</section>
{cta_band()}'''
    page("program.html", "The Baby Steps Program", "Explore the full Baby Steps curriculum: 7 modules, 49+ lessons, bonus trainings, coaching replays and 50+ worksheets for your health journey toward conception.", content, modules, "program")


def build_course_index(modules):
    total_xp = sum(l["xp"] for m in modules for l in m["lessons"])
    content = f'''
<section class="page-hero grain">
  <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="container">
    {crumbs([("Home", "index.html"), ("My course", None)])}
    <div class="dash-head">
      <div>
        <span class="eyebrow">Baby Steps · Course dashboard</span>
        <h1 class="member-only" style="max-width:none">Welcome back, <em class="accent" data-member-name>friend</em></h1>
        <h1 class="guest-only" style="max-width:none">Your course <em class="accent">dashboard</em></h1>
        <p class="lead member-only">Signed in as <strong data-member-email></strong> · <a href="#" data-signout>Sign out</a></p>
        <p class="lead guest-only">You're previewing the course. <a href="{{R}}signup.html?next=course/index.html">Join free</a> or <a href="{{R}}login.html">sign in</a> to save progress, earn XP and unlock every download.</p>
      </div>
      <div class="progress-ring" data-course-ring style="--p:0;--c:var(--rose)"><div style="position:relative;text-align:center"><b data-course-pct>0%</b><small>complete</small></div></div>
    </div>
    <div class="dash-stats">
      <div class="dash-stat"><small>Level</small><b data-course-level>Seedling</b><div class="bar"><i data-course-xp-bar></i></div></div>
      <div class="dash-stat"><small>XP earned</small><b><span data-course-xp>0</span><span class="muted" style="font-size:1rem"> / {total_xp:,}</span></b><div class="bar"><i data-course-xp-bar></i></div></div>
      <div class="dash-stat"><small>Lessons done</small><b data-course-lessons>0</b><div class="bar"><i data-course-lessons-bar></i></div></div>
      <div class="dash-stat"><small>Your journey</small><b data-course-day>Day 1</b><div class="bar"><i data-course-day-bar></i></div></div>
    </div>
    <a class="continue-card" href="{{R}}course/welcome.html" data-continue>
      <span class="play-sm">{icon("play")}</span>
      <span><small data-continue-module>Start here · Course Home</small><strong data-continue-title>Welcome to Baby Steps</strong></span>
      <span class="btn btn--light btn--sm">Continue {icon("arrow")}</span>
    </a>
  </div>
</section>
<section class="section--tight" style="padding-top:20px">
  <div class="container">
    <div class="section-head" style="margin-bottom:30px"><span class="eyebrow">Your modules</span><h2>Pick up where you left off</h2></div>
    <div class="modules">{"".join(module_card(m, i) for i, m in enumerate(modules))}</div>
    <p class="member-only muted" style="margin-top:30px;text-align:center;font-size:.9rem">Progress is saved in this browser. <button class="btn btn--ghost btn--sm" type="button" data-reset-progress>Reset progress</button></p>
  </div>
</section>
{cta_band("Need a hand?", "Questions about a lesson, or want to share a win? Cynthia would love to hear from you.", ("Contact Cynthia", "contact.html"), ("Read the FAQ", "faq.html"))}'''
    page("course/index.html", "My Course Dashboard", "Your Baby Steps course dashboard — progress, XP, and every module and lesson in one place.", content, modules, "course")


def build_module_page(m, modules):
    idx = modules.index(m)
    prev_m = modules[idx - 1] if idx > 0 else None
    next_m = modules[idx + 1] if idx + 1 < len(modules) else None
    mins = sum(l["video_min"] or 0 for l in m["lessons"])
    xp = sum(l["xp"] for l in m["lessons"])
    label = f'Module {m["num"]}' if m["num"] else m["title"]
    rows = "".join(f'''<a class="lesson-row reveal" href="{{R}}{l["url"]}" data-lesson-row="{l["id"]}" style="--c:{m["color"]}">
  <span class="ln">{l["code"] if l["code"] != "welcome" else "★"}</span>
  <span><h3>{e(l["title"])}</h3><p>{e(l["desc"])}</p></span>
  <span class="lr-meta"><span>{icon("clock", 14)} {l["video_min"] or "—"} min</span><span class="chip chip--amber">{l["xp"]} XP</span></span>
</a>''' for l in m["lessons"])
    intro = ""
    if m.get("intro"):
        sc = m["intro"]
        outline = "".join(f'<li><time>{s["start"]}</time><span>{e(s["heading"])}</span></li>' for s in sc["sections"])
        intro = f'''<div class="card reveal" style="margin-bottom:26px">
  <span class="chip" style="color:{m["color"]}"><span class="dot"></span>Module introduction</span>
  <p class="pull" style="margin-top:20px;--c:{m["color"]}">{e(sc["hook"])}</p>
  <details class="faq" style="display:block"><summary style="font-size:1rem;padding:6px 36px 6px 0">What this module covers</summary><div><ol class="outline">{outline}</ol></div></details>
</div>'''
    downloads = "".join(dl_link(m, fn) for fn in m["files"])
    pager = ""
    if prev_m:
        pager += f'<a class="prev" href="{{R}}{prev_m["url"]}"><small>← Previous</small><strong>{e(prev_m["title"])}</strong></a>'
    if next_m:
        pager += f'<a class="next" href="{{R}}{next_m["url"]}"><small>Next →</small><strong>{e(next_m["title"])}</strong></a>'
    content = f'''
<section class="mod-hero" style="--c:{m["color"]}">
  <div class="container">
    {crumbs([("Home", "index.html"), ("My course", "course/index.html"), (label, None)])}
    <div class="split" style="grid-template-columns:1fr auto;align-items:center">
      <div>
        <span class="mod-num">{label}{" · Week " + str(m["week"]) if m["num"] else ""}</span>
        <h1>{e(m["title"])}</h1>
        <p class="lead">{e(m["desc"])}</p>
        <div class="mod-facts">
          <span class="chip">{icon("video", 15)} {len(m["lessons"])} lessons</span>
          <span class="chip">{icon("clock", 15)} {mins} minutes</span>
          <span class="chip">{icon("star", 15)} {xp} XP</span>
          <span class="chip">{icon("calendar", 15)} {"Available from day 1" if m["day"] == 1 else "Opens on day " + str(m["day"])}</span>
        </div>
        <div class="btn-row"><a class="btn btn--primary" href="{{R}}{m["lessons"][0]["url"]}">Start lesson 1 {icon("arrow")}</a>{'<a class="btn btn--ghost" href="#downloads">Module downloads</a>' if downloads else ''}</div>
      </div>
      <div class="progress-ring" data-module-progress="{m["id"]}" style="--c:{m["color"]}"><div style="position:relative;text-align:center"><b>0%</b><small>complete</small></div></div>
    </div>
  </div>
</section>
<section class="section--tight">
  <div class="container mod-layout">
    <div>
      {intro}
      <h2 style="font-size:1.8rem;margin-bottom:20px">Lessons</h2>
      <div class="lesson-list">{rows}</div>
      <div class="mod-pager">{pager}</div>
    </div>
    <aside class="sticky">
      <div class="side-card"><h4>Your progress</h4><p style="margin:0 0 10px;font-weight:700" data-module-count="{m["id"]}">0 / {len(m["lessons"])} lessons complete</p><div class="mc-progress" data-module-progress="{m["id"]}" style="height:8px;border-radius:8px;background:var(--cream-2);overflow:hidden"><i style="display:block;height:100%;width:0;background:{m["color"]};transition:width 1s"></i></div>
        <p class="guest-only muted" style="font-size:.86rem;margin:14px 0 0"><a href="{{R}}signup.html?next=course/{m["slug"]}.html">Join free</a> to track progress.</p></div>
      {f'<div class="side-card" id="downloads"><h4>Module downloads</h4>{downloads}</div>' if downloads else ''}
      {f'<div class="side-card"><h4>Cynthia’s note</h4><p style="margin:0;font:italic 400 1.1rem/1.5 var(--serif)">{e(m["notes"])}</p></div>' if m.get("notes") else ''}
    </aside>
  </div>
</section>'''
    page(m["url"], f'{label}: {m["title"]}' if m["num"] else m["title"], m["desc"], content, modules, "course")


def build_lesson_page(m, l, modules):
    flat = [(mm, ll) for mm in modules for ll in mm["lessons"]]
    i = next(k for k, (mm, ll) in enumerate(flat) if ll is l)
    prev_l = flat[i - 1] if i > 0 else None
    next_l = flat[i + 1] if i + 1 < len(flat) else None
    sc = l["script_data"]
    label = "Course Home" if m["id"] == "m0" else (f'Module {m["num"]}' if m["num"] else m["title"])
    lesson_label = "Welcome" if m["id"] == "m0" else (f'Lesson {l["code"]}' if m["num"] else ("Session " + l["code"]))
    outline = "".join(f'<li><time>{s["start"]}</time><span>{e(s["heading"])}</span></li>' for s in sc["sections"]) if sc else ""
    actions = "".join(f'''<label class="action" data-action="{a["id"]}" data-xp="{a["xp"]}">
  <input type="checkbox" /><span class="box">{icon("check")}</span>
  <span class="at">{e(a["label"])}</span><span class="xp">+{a["xp"]} XP</span></label>''' for a in l["actions"])
    downloads = "".join(dl_link(m, fn, gated=not (m["id"] == "m0")) for fn in l["files"])
    siblings = "".join(f'<a class="dl" href="{{R}}{x["url"]}" data-lesson-row="{x["id"]}" style="{"border-color:" + m["color"] if x is l else ""}"><span class="ft" style="background:{m["color"]}">{x["code"] if x["code"] != "welcome" else "★"}</span><span><strong>{e(x["title"])}</strong><small>{x["video_min"] or "—"} min · {x["xp"]} XP</small></span></a>' for x in m["lessons"])
    pager = ""
    if prev_l:
        pager += f'<a class="prev" href="{{R}}{prev_l[1]["url"]}"><small>← Previous</small><strong>{e(prev_l[1]["title"])}</strong></a>'
    if next_l:
        pager += f'<a class="next" href="{{R}}{next_l[1]["url"]}"><small>Next →</small><strong>{e(next_l[1]["title"])}</strong></a>'
    series = f'{e(l["series"])} · ' if l.get("series") and m["id"] in ("bonus", "replay") and l["series"] != l["title"] else ""
    content = f'''
<section class="mod-hero" style="--c:{m["color"]};padding-bottom:40px">
  <div class="container">
    {crumbs([("Home", "index.html"), ("My course", "course/index.html"), (label, m["url"] if m["id"] != "m0" else None)] + ([(lesson_label, None)] if m["id"] != "m0" else []))}
    <span class="mod-num">{label} · {lesson_label}</span>
    <h1 style="max-width:24ch">{series}{e(l["title"])}</h1>
    <p class="lead">{e(l["desc"])}</p>
  </div>
</section>
<section class="section--tight" style="padding-top:40px">
  <div class="container mod-layout">
    <div>
      <div class="player" style="--c:{m["color"]}" role="img" aria-label="Lesson video: {e(l["title"])}">
        <span class="tag">{label}</span>
        <div><div class="play">{icon("play")}</div><h2>{e(l["title"])}</h2><p>Video lesson with Cynthia · releasing to members soon</p></div>
        <span class="dur">{l["video_min"] or 5}:00</span>
      </div>

      {f'<p class="pull" style="margin-top:40px;--c:{m["color"]}">{e(sc["hook"])}</p>' if sc and sc["hook"] else ''}

      <div class="card" style="margin-top:30px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px">
          <h2 style="font-size:1.5rem;margin:0">Your action steps</h2>
          <span class="chip chip--amber" data-lesson-xp>0 / {l["xp"]} XP</span>
        </div>
        <div class="actions">{actions}</div>
        <div class="btn-row" style="margin-top:20px"><button class="btn btn--primary" type="button" data-complete-lesson>Mark lesson complete</button>{f'<a class="btn btn--ghost" href="{{R}}{next_l[1]["url"]}">Next lesson {icon("arrow")}</a>' if next_l else ''}</div>
        <p class="guest-only muted" style="font-size:.86rem;margin:14px 0 0"><a href="{{R}}signup.html?next={l["url"]}">Join free</a> to save your progress and earn XP.</p>
      </div>

      {f"""<div class="card" style="margin-top:24px"><h2 style="font-size:1.5rem">In this lesson</h2><ol class="outline">{outline}</ol></div>""" if outline else ''}

      {f"""<div class="transcript" style="margin-top:24px"><div class="card"><h2 style="font-size:1.5rem">Read the lesson</h2><p class="muted" style="font-size:.9rem">The full lesson from Cynthia, in her own words.</p><div class="tx-body">{transcript_html(sc)}</div></div>
      <div class="tx-gate"><div class="icon-badge" style="margin:0 auto 16px">{icon("lock")}</div><h3>Members can read the full lesson</h3><p class="muted">Join free to unlock every lesson, worksheet and progress tracker.</p><div class="btn-row" style="justify-content:center"><a class="btn btn--rose" href="{{R}}signup.html?next={l["url"]}">Join free</a><a class="btn btn--ghost" href="{{R}}login.html?next={l["url"]}">Sign in</a></div></div></div>""" if sc else ''}

      <div class="mod-pager">{pager}</div>
    </div>
    <aside class="sticky">
      {f'<div class="side-card"><h4>Lesson downloads</h4>{downloads}</div>' if downloads else ''}
      {f'<div class="side-card"><h4>Cynthia’s note</h4><p style="margin:0;font:italic 400 1.1rem/1.5 var(--serif)">{e(l["notes"])}</p></div>' if l.get("notes") else ''}
      <div class="side-card"><h4>{e(label)}{"" if m["id"] == "m0" else " lessons"}</h4>{siblings}
        <a class="link-arrow" href="{{R}}{m["url"] if m["id"] != "m0" else "course/index.html"}" style="margin-top:8px">{"Back to module" if m["id"] != "m0" else "Go to dashboard"}</a></div>
    </aside>
  </div>
</section>'''
    page(l["url"], f'{l["title"]} — {label}', l["desc"], content, modules, "course", extra_body=f' data-lesson="{l["id"]}"')


def build_about(modules):
    content = page_hero("Meet Cynthia", 'Lived experience. <em class="accent">Clinical wisdom.</em> Wholehearted care.',
                        "Cynthia Myers-Morrison, EdD, has spent decades helping individuals and families find freedom from cravings — and she has walked that road herself.",
                        [("Home", "index.html"), ("About", None)])
    content += f'''
<section class="section--tight"><div class="container split">
  <div class="portrait-wrap reveal">
    <div class="portrait"><img src="{PORTRAIT}" alt="Portrait of Cynthia Myers-Morrison, EdD" width="900" height="1125" /></div>
    <div class="sticker"><span><b>54</b>years in recovery</span></div>
  </div>
  <div>
    <span class="eyebrow reveal">Her story</span>
    <h2 class="reveal" data-d="1">From searching to freedom</h2>
    <div class="prose reveal" data-d="2">
      <p>Cynthia has spent most of her life searching for freedom — from addiction, from shame, and from the belief that something was “wrong” with her. Her work today is the result of decades of personal recovery, academic study, and a deep commitment to helping others find the peace she once thought was impossible.</p>
      <p>She has been free from alcohol and drugs for 54 years, and abstinent from grains and sugars for 27. “These milestones are not badges,” she says. “They are reminders of what is possible when we understand our brains, honor our biology, and receive the right support.”</p>
      <p>Before specializing in food addiction, Cynthia spent years as a Marriage &amp; Family Therapist. Her passion today extends to supporting people with PCOS, fertility challenges, and those preparing for conception who want to enter pregnancy with optimal health and stability — which is exactly why she created <strong>Baby Steps</strong>.</p>
    </div>
    <p class="quote reveal" data-d="3" style="font-size:1.35rem">My work is not theoretical. It is lived, practiced, and continually renewed.</p>
  </div>
</div></section>

<section class="section band-moss"><div class="container">
  <div class="stats">
    <div class="stat reveal"><b data-count="54">54</b><span>Years free from alcohol &amp; drugs</span></div>
    <div class="stat reveal" data-d="1"><b data-count="27">27</b><span>Years sugar &amp; grain abstinent</span></div>
    <div class="stat reveal" data-d="2"><b data-count="4">4</b><span>Academic degrees</span></div>
    <div class="stat reveal" data-d="3"><b data-count="2">2</b><span>Published books</span></div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Credentials</span><h2>Trained with the leaders in the field</h2></div>
  <div class="grid grid-3">
    <div class="card reveal"><div class="icon-badge">{icon("award")}</div><h3>Education</h3><p>Doctorate in Education (EdD) and three Master's degrees, plus advanced study in nutrition, addiction, trauma and brain chemistry.</p></div>
    <div class="card reveal" data-d="1"><div class="icon-badge moss">{icon("shield")}</div><h3>Certifications</h3><p>Certified Food Addiction Professional (CFAP™), SUGAR® Certified &amp; Licensed, and trained in Holistic Medicine for Addiction by Bitten Jonsson.</p></div>
    <div class="card reveal" data-d="2"><div class="icon-badge amber">{icon("book")}</div><h3>Training</h3><p>Institute for Integrative Nutrition, ACORN Food Dependency Recovery Services, Florida School of Addiction Studies, INFACT, and trauma studies with Bessel van der Kolk.</p></div>
    <div class="card reveal"><div class="icon-badge">{icon("users")}</div><h3>Clinical practice</h3><p>Former Marriage &amp; Family Therapist working with individuals and families across the lifespan.</p></div>
    <div class="card reveal" data-d="1"><div class="icon-badge moss">{icon("heart")}</div><h3>Advocacy</h3><p>Secretary and Vice Chair of the Board of the Food Addiction Institute, advocating for food addiction to be recognized as treatable.</p></div>
    <div class="card reveal" data-d="2"><div class="icon-badge amber">{icon("map")}</div><h3>Generational work</h3><p>Uses genograms to help families release guilt, shame and inherited patterns that no longer serve them.</p></div>
  </div>
</div></section>

<section class="section band-paper"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Books</span><h2>Read with Cynthia</h2></div>
  <div class="grid grid-2">
    <div class="book card reveal"><img src="{BOOK_FIX}" alt="THE FIX for Cravings book cover" loading="lazy" width="480" height="720" /><div><h3>THE FIX for Cravings</h3><p>Understand why cravings happen and how to rewire them with real food and real support.</p><a class="btn btn--primary btn--sm" href="https://www.amazon.com/dp/1796091650" target="_blank" rel="noopener">Buy on Amazon</a></div></div>
    <div class="book card reveal" data-d="1"><img src="{BOOK_RAINBOWS}" alt="We Eat Rainbows! book cover" loading="lazy" width="480" height="720" /><div><h3>We Eat Rainbows!</h3><p>A bright, joyful picture book that helps children love colourful whole foods.</p><a class="btn btn--primary btn--sm" href="https://www.amazon.com/dp/B0CD4D9RW2" target="_blank" rel="noopener">Buy on Amazon</a></div></div>
  </div>
</div></section>
{cta_band("Walk the path with Cynthia", "Join Baby Steps free, or reach out to Cynthia directly — she'd love to hear your story.", ("Join free", "signup.html"), ("Contact Cynthia", "contact.html"))}'''
    page("about.html", "About Cynthia Myers-Morrison, EdD", "Meet Cynthia Myers-Morrison, EdD — Certified Food Addiction Professional, former Marriage & Family Therapist, author, and Vice Chair of the Food Addiction Institute.", content, modules, "about")


QUIZ = [
    ("When do cravings usually hit you hardest?", [
        ("Mid-afternoon or late at night, especially for sweets", {"nutrition": 3, "stress": 1}),
        ("After a stressful conversation or a tough day", {"stress": 3, "connection": 1}),
        ("When I'm tired or haven't moved much", {"movement": 3, "nutrition": 1}),
        ("Honestly, they're pretty manageable", {}),
    ]),
    ("How would you describe a typical day of eating?", [
        ("Lots of quick, packaged or on-the-go food", {"nutrition": 3, "toxins": 2}),
        ("I skip meals, then overeat later", {"nutrition": 2, "stress": 2}),
        ("Mostly home-cooked, but sugar sneaks in", {"nutrition": 2}),
        ("Balanced, colourful, mostly whole foods", {}),
    ]),
    ("How much movement is in your week?", [
        ("Very little — work and life get in the way", {"movement": 3}),
        ("Occasional bursts, then I burn out", {"movement": 2, "stress": 1}),
        ("Regular, but intense workouts leave me drained", {"movement": 2}),
        ("Gentle, consistent movement I enjoy", {}),
    ]),
    ("How are you sleeping lately?", [
        ("Poorly — my mind races at night", {"stress": 3, "movement": 1}),
        ("I get to bed late scrolling or snacking", {"stress": 1, "nutrition": 2}),
        ("It's okay, but I wake up tired", {"stress": 1, "toxins": 1, "movement": 1}),
        ("Restful most nights", {}),
    ]),
    ("When you think about trying to conceive, you mostly feel…", [
        ("Anxious, overwhelmed or sad", {"stress": 3, "connection": 1}),
        ("Hopeful but unsure where to start", {"nutrition": 1, "movement": 1, "toxins": 1}),
        ("Out of sync with my partner about it", {"connection": 3}),
        ("Calm and excited", {}),
    ]),
    ("Which sounds most like your home?", [
        ("Plastic containers, scented candles, lots of cleaning sprays", {"toxins": 3}),
        ("I've never really thought about toxins", {"toxins": 2}),
        ("I've made a few swaps already", {"toxins": 1}),
        ("Pretty clean, filtered water, natural products", {}),
    ]),
    ("How do you and your partner (or support person) talk about health?", [
        ("We don't really — it causes friction", {"connection": 3, "stress": 1}),
        ("One of us is all-in, the other is less sure", {"connection": 2}),
        ("We try, but life gets busy", {"connection": 1}),
        ("We're a great team", {}),
    ]),
    ("Which statement feels most true?", [
        ("“I know what to do, I just can't stop the cravings.”", {"nutrition": 3, "stress": 1}),
        ("“I carry a lot of stress in my body.”", {"stress": 3}),
        ("“I want a healthier home for our future baby.”", {"toxins": 3}),
        ("“I want us to feel closer through this.”", {"connection": 3}),
    ]),
]


def build_assessment(modules):
    qs = ""
    for i, (q, opts) in enumerate(QUIZ):
        o = "".join(f'<button type="button" class="q-opt" aria-pressed="false" data-w=\'{json.dumps(w)}\'><span class="k">{"ABCD"[j]}</span>{e(t)}</button>' for j, (t, w) in enumerate(opts))
        qs += f'<div class="q" role="group" aria-label="Question {i + 1}"><h2>{e(q)}</h2><div class="q-opts">{o}</div></div>'
    content = page_hero("Free · 2 minutes", 'Discover your <em class="accent">craving triggers</em>',
                        "Eight quick questions reveal which area of your pre-conception wellness needs the most love right now — and exactly where to start in Baby Steps.",
                        [("Home", "index.html"), ("Free Assessment", None)], center=True)
    content += f'''
<section class="section--tight"><div class="container">
  <div class="card quiz" data-quiz style="padding:clamp(24px,4vw,48px)">
    <div class="quiz-progress"><span data-q-count>Question 1 of {len(QUIZ)}</span><button class="btn btn--ghost btn--sm" type="button" data-q-back>← Back</button></div>
    <div class="quiz-bar"><i></i></div>
    {qs}
  </div>
  <div class="card quiz" data-quiz-result hidden style="padding:clamp(24px,4vw,48px)">
    <span class="eyebrow">Your result</span>
    <h2>Your biggest opportunity: <em class="accent" data-r-title></em></h2>
    <p class="lead">Here's how your answers map across the five pillars of Baby Steps. The higher the score, the more support that area could use.</p>
    <div class="result-bars" data-r-bars></div>
    <div class="side-card" style="background:var(--cream)"><h4>Recommended starting point</h4><p style="font:500 1.25rem/1.3 var(--serif);margin:0 0 14px" data-r-module></p><a class="link-arrow" data-r-link href="{{R}}program.html">Preview this module</a></div>
    <div class="btn-row">
      <a class="btn btn--rose btn--lg guest-only" href="{{R}}signup.html">Join free &amp; save my result {icon("arrow")}</a>
      <a class="btn btn--primary btn--lg member-only" href="{{R}}course/index.html">Go to my course {icon("arrow")}</a>
      <button class="btn btn--ghost" type="button" data-retake>Retake</button>
    </div>
    <p class="muted" style="font-size:.84rem;margin-top:16px">This assessment is for education and self-reflection — it isn't a diagnosis. Your result is shared with Cynthia only if you choose to join.</p>
  </div>
</div></section>'''
    page("assessment.html", "Free Craving Trigger Assessment", "Take the free 2-minute Craving Trigger Assessment and discover which area of your pre-conception wellness to focus on first.", content, modules, "assessment")


def build_signup(modules):
    joining = [
        ("individual", "Hoping to conceive", "I'm preparing my body & mind"),
        ("couple", "We're a couple", "Taking the journey together"),
        ("support", "Supporting a loved one", "Family member or friend"),
        ("practitioner", "Practitioner / coach", "I support clients"),
        ("team", "I want to join the team", "Ambassador, host or volunteer"),
        ("curious", "Just curious", "Exploring for now"),
    ]
    goals = ["Calm my cravings", "Balance hormones naturally", "Eat for fertility", "Reduce stress & anxiety", "Sleep better",
             "Detox my home", "Get my partner involved", "Build lasting habits"]
    jc = "".join(f'<label class="choice"><input type="radio" name="Joining as" value="{e(t)}" data-key="{k}" required /><span><span>{e(t)}<small>{e(s)}</small></span></span></label>' for k, t, s in joining)
    gc = "".join(f'<label class="choice"><input type="checkbox" name="Goals" value="{e(g)}" /><span>{e(g)}</span></label>' for g in goals)
    content = f'''
<section class="page-hero grain" style="padding-bottom:80px">
  <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="container auth">
    <div>
      {crumbs([("Home", "index.html"), ("Join free", None)])}
      <span class="eyebrow">Join the Cradle family</span>
      <h1 style="font-size:clamp(2.3rem,4.5vw,3.6rem)">Take your first <em class="accent">baby step</em> today</h1>
      <p class="lead">Create your free member account in under two minutes. Cynthia personally hears about every new member.</p>
      <ul class="perks">
        <li><span class="tick">{icon("check")}</span><span><strong>Your course dashboard</strong><span>Track lessons, action steps, XP and your level.</span></span></li>
        <li><span class="tick">{icon("check")}</span><span><strong>Every worksheet &amp; tracker</strong><span>Unlock 50+ downloads, recipes and planners.</span></span></li>
        <li><span class="tick">{icon("check")}</span><span><strong>Full lesson readings</strong><span>Read each lesson in Cynthia's own words.</span></span></li>
        <li><span class="tick">{icon("check")}</span><span><strong>The Cradle Letter</strong><span>Gentle weekly encouragement in your inbox.</span></span></li>
      </ul>
      <p class="muted" style="font-size:.9rem">Already a member? <a href="{{R}}login.html">Sign in</a></p>
    </div>
    <div class="form-card">
      <form data-form="signup" data-steps data-subject="New Cradle Your Cravings signup: {{name}}" data-autoresponse="Welcome to Cradle Your Cravings! Thank you for joining Baby Steps: Your Health Journey Toward Conception. Your member dashboard is ready on the website — start with Course Home and the Welcome Guide. Cynthia has been notified that you joined and is so glad you're here. With love, Cynthia Myers-Morrison, EdD">
        <div class="steps-bar" aria-hidden="true"><i></i><i></i><i></i></div>
        <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <input type="hidden" name="Form" value="Member signup" />

        <fieldset class="fstep" style="border:0;padding:0;margin:0">
          <legend><h3 style="font-size:1.6rem">About you</h3></legend>
          <p class="muted" style="font-size:.9rem;margin-top:-6px">Step 1 of 3</p>
          <div class="form-grid">
            <div class="field"><label for="su-first">First name</label><input id="su-first" name="First name" autocomplete="given-name" required /><span class="err">Please enter your first name.</span></div>
            <div class="field"><label for="su-last">Last name</label><input id="su-last" name="Last name" autocomplete="family-name" required /><span class="err">Please enter your last name.</span></div>
            <div class="field full"><label for="su-email">Email</label><input id="su-email" type="email" name="Email" autocomplete="email" required /><span class="err">Please enter a valid email address.</span></div>
            <div class="field full"><label for="su-phone">Phone <span class="opt">(optional)</span></label><input id="su-phone" type="tel" name="Phone" autocomplete="tel" /></div>
          </div>
          <div class="fstep-nav"><span></span><button class="btn btn--primary" type="button" data-next>Continue {icon("arrow")}</button></div>
        </fieldset>

        <fieldset class="fstep" style="border:0;padding:0;margin:0">
          <legend><h3 style="font-size:1.6rem">Your journey</h3></legend>
          <p class="muted" style="font-size:.9rem;margin-top:-6px">Step 2 of 3</p>
          <div class="field"><span class="label">I'm joining as…</span><div class="choice-grid">{jc}</div><span class="err">Please choose one option.</span></div>
          <div class="form-grid" style="margin-top:18px">
            <div class="field"><label for="su-stage">Where are you right now?</label><select id="su-stage" name="Stage"><option value="">Choose one</option><option>Planning in the next 6–12 months</option><option>Actively trying to conceive</option><option>Working with a fertility specialist</option><option>Currently pregnant</option><option>Supporting someone else</option><option>Prefer not to say</option></select></div>
            <div class="field"><label for="su-country">Country / city <span class="opt">(optional)</span></label><input id="su-country" name="Location" autocomplete="country-name" /></div>
          </div>
          <div class="fstep-nav"><button class="btn btn--ghost" type="button" data-prev>← Back</button><button class="btn btn--primary" type="button" data-next>Continue {icon("arrow")}</button></div>
        </fieldset>

        <fieldset class="fstep" style="border:0;padding:0;margin:0">
          <legend><h3 style="font-size:1.6rem">Your goals</h3></legend>
          <p class="muted" style="font-size:.9rem;margin-top:-6px">Step 3 of 3</p>
          <div class="field"><span class="label">What would you love help with? <span class="opt">(choose any)</span></span><div class="choice-grid">{gc}</div></div>
          <div class="form-grid" style="margin-top:18px">
            <div class="field full"><label for="su-heard">How did you hear about us? <span class="opt">(optional)</span></label><select id="su-heard" name="Heard about us"><option value="">Choose one</option><option>Instagram</option><option>Facebook</option><option>YouTube</option><option>A friend or family member</option><option>My doctor or practitioner</option><option>Cynthia's books</option><option>Google search</option><option>Other</option></select></div>
            <div class="field full"><label for="su-msg">Anything you'd like Cynthia to know? <span class="opt">(optional)</span></label><textarea id="su-msg" name="Message" rows="3"></textarea></div>
            <label class="consent full"><input type="checkbox" name="Consent" value="Yes" required /><span>I agree to the <a href="{{R}}terms.html" target="_blank">Terms</a> and <a href="{{R}}privacy.html" target="_blank">Privacy Policy</a>, and understand Baby Steps is education, not medical advice.<span class="err" style="display:none">Please agree to continue.</span></span></label>
            <label class="consent full"><input type="checkbox" name="Newsletter" value="Yes" checked /><span>Send me the Cradle Letter — gentle weekly notes from Cynthia.</span></label>
          </div>
          <div class="fstep-nav"><button class="btn btn--ghost" type="button" data-prev>← Back</button><button class="btn btn--rose btn--lg" type="submit"><span class="spinner"></span>Create my free account <span class="btn-label-arrow">{icon("arrow")}</span></button></div>
          <div class="form-status" role="alert" aria-live="assertive"></div>
          <p class="form-note">{icon("shield", 16)} Your details go only to Cynthia. We never sell your information.</p>
        </fieldset>
      </form>
    </div>
  </div>
</section>'''
    page("signup.html", "Join Free", "Join Cradle Your Cravings free — unlock the Baby Steps course dashboard, progress tracking, XP and every worksheet.", content, modules, "signup")


def build_login(modules):
    content = f'''
<section class="page-hero grain center" style="padding-bottom:100px">
  <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="container" style="max-width:520px">
    {crumbs([("Home", "index.html"), ("Sign in", None)])}
    <span class="eyebrow">Welcome back</span>
    <h1 style="font-size:clamp(2.2rem,4vw,3.2rem);margin-inline:auto">Sign in to <em class="accent">your course</em></h1>
    <div class="form-card" style="text-align:left;margin-top:30px">
      <form data-form="login">
        <div class="field"><label for="li-email">Email</label><input id="li-email" type="email" name="Email" autocomplete="email" required /><span class="err">Please enter the email you joined with.</span></div>
        <button class="btn btn--primary btn--block btn--lg" type="submit" style="margin-top:20px">Continue to my course {icon("arrow")}</button>
        <div class="form-status" role="alert"></div>
        <p class="form-note">{icon("shield", 16)} No password needed — your progress is stored privately in this browser.</p>
      </form>
    </div>
    <p style="margin-top:24px">New here? <a href="{{R}}signup.html">Join free in 2 minutes</a></p>
  </div>
</section>'''
    page("login.html", "Sign In", "Sign in to your Cradle Your Cravings member dashboard.", content, modules, "login")


def build_welcome(modules):
    content = f'''
<section class="page-hero grain center" style="padding-bottom:90px">
  <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="container" style="max-width:880px">
    <div class="form-success" style="display:block;padding:0"><div class="check">{icon("check")}</div></div>
    <span class="eyebrow">You're in!</span>
    <h1 style="margin-inline:auto">Welcome to the family, <em class="accent" data-member-name>friend</em></h1>
    <p class="lead" style="margin-inline:auto">Your free member account is ready and Cynthia has been notified that you joined. A confirmation is on its way to <strong data-member-email>your inbox</strong>.</p>
    <div class="grid grid-3" style="margin-top:44px;text-align:left">
      <a class="card" href="{{R}}course/welcome.html"><div class="icon-badge">{icon("play")}</div><span class="chip chip--rose">Step 1</span><h3 style="margin-top:12px">Start Course Home</h3><p>Watch the welcome and complete your pre-course actions.</p><span class="link-arrow">Begin</span></a>
      <a class="card" href="{{R}}assessment.html"><div class="icon-badge amber">{icon("sparkle")}</div><span class="chip chip--amber">Step 2</span><h3 style="margin-top:12px">Take the assessment</h3><p>Find the area that needs the most love right now.</p><span class="link-arrow">Discover</span></a>
      <a class="card" href="{{R}}course/module-1.html"><div class="icon-badge moss">{icon("sprout")}</div><span class="chip chip--moss">Step 3</span><h3 style="margin-top:12px">Open Module 1</h3><p>Foundations of Family Wellness is unlocked for you today.</p><span class="link-arrow">Explore</span></a>
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:40px"><a class="btn btn--primary btn--lg" href="{{R}}course/index.html">Go to my dashboard {icon("arrow")}</a></div>
  </div>
</section>'''
    page("welcome.html", "Welcome to Cradle Your Cravings", "Welcome to Cradle Your Cravings — your member account is ready.", content, modules, "welcome")


def build_team(modules):
    roles = [
        ("ambassador", "heart", "var(--rose)", "Community Ambassador", "Share Baby Steps with your friends, followers, church, workplace or community.", ["Share-ready posts, graphics & talking points", "Early access to new lessons", "Monthly ambassador call with Cynthia"]),
        ("circle-host", "users", "var(--moss)", "Support Circle Host", "Lead a small, warm peer circle — online or in person — using Cradle's guided rituals.", ["Host guide & session outlines", "Training on trauma-informed facilitation", "A community of fellow hosts"]),
        ("practitioner", "shield", "var(--amber)", "Practitioner Partner", "Coaches, dietitians, doulas, therapists and fertility professionals supporting clients.", ["Use Baby Steps alongside your practice", "Referral & collaboration opportunities", "Professional community & case consults"]),
        ("contributor", "leaf", "var(--m5)", "Content Contributor", "Share recipes, your story, photography, design or writing skills with the community.", ["Featured recipes & member stories", "Credit on published content", "Collaborate with Cynthia's team"]),
    ]
    cards = "".join(f'''<div class="card role reveal" data-d="{i % 2}"><div class="icon-badge" style="background:color-mix(in srgb, {c} 16%, white);color:{c}">{icon(ic)}</div><h3>{t}</h3><p>{d}</p>
<ul class="perk-list">{"".join("<li>" + p + "</li>" for p in ps)}</ul><a class="btn btn--ghost btn--block" href="#apply" data-pick-role="{k}">Apply as {t.split()[-1].lower()} {icon("arrow")}</a></div>''' for i, (k, ic, c, t, d, ps) in enumerate(roles))
    opts = "".join(f'<option data-key="{k}" value="{t}">{t}</option>' for k, _, _, t, _, _ in roles)
    content = page_hero("Join the team", 'Help more families <em class="accent">start well</em>',
                        "Cradle Your Cravings is a growing movement of people who believe every family deserves a calm, nourished, connected beginning. There's a place for you here.",
                        [("Home", "index.html"), ("About", "about.html"), ("Join the Team", None)],
                        extra=f'<div class="btn-row reveal" data-d="3" style="margin-top:30px"><a class="btn btn--rose btn--lg" href="#apply">Apply now {icon("arrow")}</a><a class="btn btn--ghost btn--lg" href="#roles">See the roles</a></div>')
    content += f'''
<section class="section--tight" id="roles"><div class="container">
  <div class="grid grid-2">{cards}</div>
</div></section>

<section class="section band-moss"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">How it works</span><h2>From hello to making a difference</h2></div>
  <div class="grid grid-3">
    <div class="pillar reveal"><div class="num">01</div><h3>Apply</h3><p>Tell us a little about yourself and the role that excites you. It takes about five minutes.</p></div>
    <div class="pillar reveal" data-d="1"><div class="num">02</div><h3>Connect</h3><p>Cynthia reads every application personally and will reach out to set up a friendly conversation.</p></div>
    <div class="pillar reveal" data-d="2"><div class="num">03</div><h3>Grow together</h3><p>Get onboarded with guides, training and a community of people who care as much as you do.</p></div>
  </div>
</div></section>

<section class="section" id="apply"><div class="container auth">
  <div>
    <span class="eyebrow reveal">Application</span>
    <h2 class="reveal" data-d="1">Apply to join the team</h2>
    <p class="lead reveal" data-d="2">Your application goes straight to Cynthia. You'll receive an email confirmation, and she'll be in touch personally.</p>
    <ul class="perks reveal" data-d="3">
      <li><span class="tick">{icon("mail")}</span><span><strong>Prefer email?</strong><span><a href="mailto:{EMAIL}?subject=Joining%20the%20Cradle%20team">{EMAIL}</a></span></span></li>
      <li><span class="tick">{icon("phone")}</span><span><strong>Rather talk?</strong><span><a href="{PHONE_HREF}">{PHONE}</a></span></span></li>
    </ul>
  </div>
  <div class="form-card reveal">
    <form data-form="team" data-subject="Join the Team application: {{name}}" data-autoresponse="Thank you for applying to join the Cradle Your Cravings team! Cynthia has received your application and reads every one personally. She'll be in touch soon. With gratitude, Cynthia Myers-Morrison, EdD">
      <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <input type="hidden" name="Form" value="Join the Team application" />
      <div class="form-grid">
        <div class="field"><label for="tm-first">First name</label><input id="tm-first" name="First name" autocomplete="given-name" required /><span class="err">Please enter your first name.</span></div>
        <div class="field"><label for="tm-last">Last name</label><input id="tm-last" name="Last name" autocomplete="family-name" required /><span class="err">Please enter your last name.</span></div>
        <div class="field"><label for="tm-email">Email</label><input id="tm-email" type="email" name="Email" autocomplete="email" required /><span class="err">Please enter a valid email.</span></div>
        <div class="field"><label for="tm-phone">Phone <span class="opt">(optional)</span></label><input id="tm-phone" type="tel" name="Phone" autocomplete="tel" /></div>
        <div class="field"><label for="tm-role">Role you're interested in</label><select id="tm-role" name="Role" data-role-select required><option value="">Choose a role</option>{opts}<option data-key="other" value="Something else">Something else</option></select><span class="err">Please choose a role.</span></div>
        <div class="field"><label for="tm-loc">Location</label><input id="tm-loc" name="Location" placeholder="City, country" /></div>
        <div class="field full"><label for="tm-bg">Tell us about yourself</label><textarea id="tm-bg" name="About" required placeholder="Your background, experience, or community"></textarea><span class="err">Please share a little about yourself.</span></div>
        <div class="field full"><label for="tm-why">Why does this work matter to you?</label><textarea id="tm-why" name="Why" rows="3"></textarea></div>
        <div class="field"><label for="tm-hours">Availability</label><select id="tm-hours" name="Availability"><option value="">Choose one</option><option>1–2 hours a week</option><option>3–5 hours a week</option><option>5+ hours a week</option><option>Occasional / project-based</option></select></div>
        <div class="field"><label for="tm-link">Website or social <span class="opt">(optional)</span></label><input id="tm-link" name="Link" type="url" placeholder="https://" /></div>
        <label class="consent full"><input type="checkbox" name="Consent" value="Yes" required /><span>I'm happy for Cynthia to contact me about this application.</span></label>
      </div>
      <button class="btn btn--rose btn--lg btn--block" type="submit" style="margin-top:24px"><span class="spinner"></span>Send my application <span class="btn-label-arrow">{icon("arrow")}</span></button>
      <div class="form-status" role="alert" aria-live="assertive"></div>
    </form>
    <div class="form-success"><div class="check">{icon("check")}</div><h3>Application received — thank you!</h3><p class="muted">Cynthia has your application and a confirmation is on its way to your inbox. She'll be in touch personally.</p><a class="btn btn--primary" href="{{R}}index.html">Back to home</a></div>
  </div>
</div></section>'''
    page("team.html", "Join the Team", "Join the Cradle Your Cravings team as a community ambassador, support circle host, practitioner partner or content contributor.", content, modules, "team")


def build_contact(modules):
    content = page_hero("Contact", 'We\'d love to <em class="accent">hear from you</em>',
                        "Questions about Baby Steps, speaking, partnerships or your own journey — Cynthia reads every message.",
                        [("Home", "index.html"), ("Contact", None)])
    content += f'''
<section class="section--tight"><div class="container auth">
  <div>
    <div class="grid" style="gap:16px">
      <a class="card" href="mailto:{EMAIL}"><div class="icon-badge">{icon("mail")}</div><h3>Email</h3><p>{EMAIL}</p></a>
      <a class="card" href="{PHONE_HREF}"><div class="icon-badge moss">{icon("phone")}</div><h3>Phone</h3><p>{PHONE}</p></a>
      <div class="card"><div class="icon-badge amber">{icon("chat")}</div><h3>Follow along</h3><div class="socials" style="margin-top:10px">
        <a href="https://www.instagram.com/cindyjmm/" target="_blank" rel="noopener" aria-label="Instagram" style="border-color:var(--line-2);color:var(--ink)">{icon("instagram")}</a>
        <a href="https://www.facebook.com/cynthia.myersmorrison/" target="_blank" rel="noopener" aria-label="Facebook" style="border-color:var(--line-2);color:var(--ink)">{icon("facebook")}</a>
        <a href="https://www.linkedin.com/in/cynthiamyersmorrison/" target="_blank" rel="noopener" aria-label="LinkedIn" style="border-color:var(--line-2);color:var(--ink)">{icon("linkedin")}</a>
        <a href="https://www.youtube.com/playlist?list=PLnEgmO43ZcYJq27_qXtongO6kxT7-tJmy" target="_blank" rel="noopener" aria-label="YouTube" style="border-color:var(--line-2);color:var(--ink)">{icon("youtube")}</a></div></div>
    </div>
  </div>
  <div class="form-card">
    <form data-form="contact" data-subject="New message via Cradle Your Cravings: {{name}}" data-autoresponse="Thank you for reaching out to Cradle Your Cravings. Cynthia has received your message and will reply personally as soon as she can.">
      <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <input type="hidden" name="Form" value="Contact" />
      <div class="form-grid">
        <div class="field"><label for="ct-name">Your name</label><input id="ct-name" name="Name" autocomplete="name" required /><span class="err">Please enter your name.</span></div>
        <div class="field"><label for="ct-email">Email</label><input id="ct-email" type="email" name="Email" autocomplete="email" required /><span class="err">Please enter a valid email.</span></div>
        <div class="field full"><label for="ct-topic">Topic</label><select id="ct-topic" name="Topic"><option>A question about Baby Steps</option><option>Coaching with Cynthia</option><option>Speaking &amp; media</option><option>Partnerships</option><option>Technical help</option><option>Something else</option></select></div>
        <div class="field full"><label for="ct-msg">Message</label><textarea id="ct-msg" name="Message" required rows="6"></textarea><span class="err">Please write a message.</span></div>
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="submit" style="margin-top:22px"><span class="spinner"></span>Send message <span class="btn-label-arrow">{icon("arrow")}</span></button>
      <div class="form-status" role="alert" aria-live="assertive"></div>
    </form>
    <div class="form-success"><div class="check">{icon("check")}</div><h3>Message sent — thank you!</h3><p class="muted">Cynthia will reply personally as soon as she can. A confirmation is on its way to your inbox.</p><a class="btn btn--primary" href="{{R}}index.html">Back to home</a></div>
  </div>
</div></section>'''
    page("contact.html", "Contact Cynthia", "Contact Cynthia Myers-Morrison, EdD about Baby Steps, coaching, speaking or partnerships.", content, modules, "contact")


def build_faq(modules):
    groups = "".join(f'<h2 class="reveal" style="font-size:1.7rem;margin:50px 0 18px" {"id=" + chr(34) + "medical" + chr(34) if "Health" in g else ""}>{g}</h2><div class="faq reveal">{faq_items(items)}</div>' for g, items in FAQ_ALL)
    content = page_hero("FAQ", 'Questions, <em class="accent">answered</em>', "Everything you need to know about Baby Steps, your membership and joining the team.",
                        [("Home", "index.html"), ("FAQ", None)], center=True)
    content += f'<section class="section--tight" style="padding-top:0"><div class="container narrow">{groups}</div></section>'
    content += cta_band("Still have a question?", "Send Cynthia a note — she answers personally.", ("Contact Cynthia", "contact.html"), ("Join free", "signup.html"))
    page("faq.html", "Frequently Asked Questions", "Answers to common questions about Baby Steps, membership, health and safety, and joining the Cradle Your Cravings team.", content, modules, "faq")


def build_resources(modules):
    free = {"Welcome_Guide.pdf", "Cravings_FAQ.pdf", "Foundations_Overview.pdf", "Pre-Course_Survey_and_Welcome_Audio.pdf"}
    items = "".join(dl_link(m, fn, gated=fn not in free, show_module=True) for m in modules for fn in m["files"])
    freebies = "".join(dl_link(m, fn, gated=False, show_module=True) for m in modules for fn in m["files"] if fn in free)
    btns = '<button type="button" class="on" data-filter="all" aria-pressed="true">All</button>' + "".join(
        f'<button type="button" data-filter="{m["id"]}" aria-pressed="false">{"Welcome" if m["id"] == "m0" else ("Module " + str(m["num"]) if m["num"] else m["title"].split()[0] + "s" if m["id"] == "bonus" else "Replays")}</button>' for m in modules)
    total = sum(len(m["files"]) for m in modules)
    content = page_hero("Resource library", f'{total} worksheets, trackers <em class="accent">&amp; guides</em>',
                        "Start with the free guides below. Members unlock the complete library — recipes, planners, journals and trackers for every lesson.",
                        [("Home", "index.html"), ("Resources", None)])
    content += f'''
<section class="section--tight" style="padding-top:0"><div class="container">
  <div class="card" style="background:var(--blush);border-color:transparent">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:20px"><div><span class="chip chip--rose">Free for everyone</span><h2 style="font-size:1.8rem;margin:12px 0 0">Start here</h2></div><a class="btn btn--primary guest-only" href="{{R}}signup.html?next=resources.html">Unlock everything — join free</a></div>
    <div class="lib">{freebies}</div>
  </div>
</div></section>
<section class="section--tight"><div class="container">
  <div class="section-head"><span class="eyebrow">The complete library</span><h2>Browse by module</h2><p class="guest-only">Items marked with a lock are for members — <a href="{{R}}signup.html?next=resources.html">join free</a> to download them.</p></div>
  <div class="lib-filters" role="toolbar" aria-label="Filter resources">{btns}</div>
  <div class="lib">{items}</div>
</div></section>
{cta_band()}'''
    page("resources.html", "Resource Library", "Free guides plus the complete Baby Steps library of worksheets, trackers, recipes and planners for your health journey toward conception.", content, modules, "resources")


def build_legal(modules):
    privacy = f'''
<h2>What we collect</h2><p>When you join, apply to the team, subscribe or contact us, we collect the details you enter (such as your name, email, phone, location and messages). These are emailed directly to Cynthia Myers-Morrison via our form provider, FormSubmit, so she can welcome you and respond.</p>
<h2>What stays on your device</h2><p>Your course progress, XP, assessment results and member sign-in are stored in your own browser's local storage. They are not sent to us unless you choose to share them (your assessment summary is included in your signup email if you took it first). Clearing your browser data removes them.</p>
<h2>How we use your information</h2><ul><li>To welcome you and provide access to the program</li><li>To reply to your messages and applications</li><li>To send the Cradle Letter if you opted in (unsubscribe any time by replying “unsubscribe”)</li></ul>
<p>We never sell or rent your personal information.</p>
<h2>Third parties</h2><p>Form submissions are processed by FormSubmit. Fonts are served by Google Fonts and some images by Wix's media CDN. Book links go to Amazon.</p>
<h2>Your choices</h2><p>To access, correct or delete your information, email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
<h2>Contact</h2><p>Cynthia Myers-Morrison, EdD · <a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="{PHONE_HREF}">{PHONE}</a></p>'''
    terms = f'''
<h2>Educational purpose</h2><p id="medical">Cradle Your Cravings and the Baby Steps course provide education, coaching and encouragement. They are not medical advice, diagnosis or treatment, and do not replace care from your physician, fertility specialist, dietitian or mental-health professional. Always consult your healthcare provider before changing your diet, supplements, medications, exercise or detox routines — especially if you are pregnant, trying to conceive or managing a health condition.</p>
<h2>Your membership</h2><p>Membership is free and personal to you. Please don't share or resell course materials. You may leave at any time.</p>
<h2>Content</h2><p>All videos, scripts, worksheets and materials are © Cynthia Myers-Morrison and may be used for your own personal, non-commercial use. SUGAR® is a registered assessment methodology used under license. CFAP™ is the Certified Food Addiction Professional credential.</p>
<h2>Community</h2><p>Be kind. We're all here to heal and grow. We may remove anyone who is disrespectful or unsafe.</p>
<h2>No guarantees</h2><p>Everyone's body and journey are different. We can't guarantee specific results, including conception.</p>
<h2>Contact</h2><p>Questions? Email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>'''
    for path, title, eyebrow, body in (("privacy.html", "Privacy Policy", "Privacy", privacy), ("terms.html", "Terms of Use", "Terms", terms)):
        content = page_hero(eyebrow, title, "Last updated September 2026.", [("Home", "index.html"), (title, None)])
        content += f'<section class="section--tight" style="padding-top:0"><div class="narrow prose">{body}</div></section>'
        page(path, title, f"{title} for Cradle Your Cravings.", content, modules, "")


def build_404(modules):
    content = f'''<section class="page-hero grain center" style="padding:120px 0"><div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div><div class="container">
<span class="eyebrow">404</span><h1 style="margin-inline:auto">This page took a <em class="accent">little detour</em></h1>
<p class="lead" style="margin-inline:auto">The page you're looking for doesn't exist or has moved. Let's get you back on the path.</p>
<div class="btn-row" style="justify-content:center;margin-top:30px"><a class="btn btn--primary btn--lg" href="{BASE_URL}">Go home</a><a class="btn btn--ghost btn--lg" href="{BASE_URL}program.html">Explore the program</a></div></div></section>'''
    page("404.html", "Page not found", "Page not found.", content, modules, "")


REDIRECTS = {
    "how-it-works.html": "program.html", "dashboard.html": "course/index.html", "journey.html": "program.html",
    "pricing.html": "signup.html", "community.html": "team.html",
}


def write_redirects():
    for src, dst in REDIRECTS.items():
        with open(os.path.join(OUT, src), "w") as f:
            f.write(f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Redirecting…</title><meta name="robots" content="noindex">'
                    f'<meta http-equiv="refresh" content="0; url={dst}"><link rel="canonical" href="{BASE_URL}{dst}"></head>'
                    f'<body><p>This page has moved to <a href="{dst}">{dst}</a>.</p></body></html>\n')


def write_meta(modules):
    total_xp = sum(l["xp"] for m in modules for l in m["lessons"])
    data = {
        "totalXP": total_xp,
        "levels": [{"name": "Seedling", "xp": 0}, {"name": "Sprout", "xp": 300}, {"name": "Blossom", "xp": 1200},
                   {"name": "Bloom", "xp": 2400}, {"name": "Harvest", "xp": 3600}],
        "modules": [{"id": m["id"], "num": m["num"], "title": m["title"], "url": m["url"], "core": m["core"],
                     "lessons": [{"id": l["id"], "title": l["title"], "url": l["url"], "xp": l["xp"], "actions": l["actions"]} for l in m["lessons"]]}
                    for m in modules],
    }
    with open(os.path.join(OUT, "assets", "js", "course-data.js"), "w") as f:
        f.write("/* Generated by tools/cradle/build.py — do not edit by hand. */\nwindow.CYC_COURSE = " + json.dumps(data, separators=(",", ":")) + ";\n")
    urls = "".join(f"  <url><loc>{BASE_URL}{'' if p == 'index.html' else p}</loc></url>\n" for p in PAGES if p not in ("404.html", "welcome.html", "login.html"))
    with open(os.path.join(OUT, "sitemap.xml"), "w") as f:
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
    with open(os.path.join(OUT, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\nSitemap: {BASE_URL}sitemap.xml\n")
    with open(os.path.join(OUT, "site.webmanifest"), "w") as f:
        json.dump({"name": "Cradle Your Cravings", "short_name": "Cradle", "start_url": "./index.html", "display": "standalone",
                   "background_color": "#FBF6EF", "theme_color": "#3D4F44",
                   "icons": [{"src": "assets/img/favicon.svg", "sizes": "any", "type": "image/svg+xml"}]}, f, indent=2)
    os.makedirs(os.path.join(OUT, "assets", "img"), exist_ok=True)
    with open(os.path.join(OUT, "assets", "img", "favicon.svg"), "w") as f:
        f.write(LOGO.replace('class="brand-mark" ', 'xmlns="http://www.w3.org/2000/svg" '))


def main():
    modules = build_course()
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    shutil.copytree(os.path.join(HERE, "static"), OUT)
    for m in modules:
        dst = os.path.join(OUT, "downloads", m["slug"])
        os.makedirs(dst, exist_ok=True)
        for fn in m["files"]:
            shutil.copy2(os.path.join(DATA, "resources", m["folder"], fn), dst)
    build_home(modules)
    build_program(modules)
    build_course_index(modules)
    for m in modules:
        if m["id"] != "m0":
            build_module_page(m, modules)
        for l in m["lessons"]:
            build_lesson_page(m, l, modules)
    build_about(modules)
    build_assessment(modules)
    build_signup(modules)
    build_login(modules)
    build_welcome(modules)
    build_team(modules)
    build_contact(modules)
    build_faq(modules)
    build_resources(modules)
    build_legal(modules)
    build_404(modules)
    write_redirects()
    write_meta(modules)
    with open(os.path.join(OUT, ".nojekyll"), "w"):
        pass
    print(f"Built {len(PAGES)} pages → {os.path.relpath(OUT, REPO)}")
    for m in modules:
        missing = [l["title"] for l in m["lessons"] if not l["script_data"]]
        nofiles = [l["title"] for l in m["lessons"] if not l["files"]]
        print(f'  {m["id"]:7} {len(m["lessons"])} lessons, {len(m["files"])} files'
              + (f" | no script: {missing}" if missing else "") + (f" | no files: {nofiles}" if nofiles else ""))


if __name__ == "__main__":
    main()
