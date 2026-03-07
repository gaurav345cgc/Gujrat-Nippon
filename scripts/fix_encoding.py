import os

with open(r"d:\GitHub\GNIL\gujarat-nippon\scripts\update_about.py", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('open(r"d:\GitHub\GNIL\gujarat-nippon\\app\\about\\About.module.css", "w")', 'open(r"d:\GitHub\GNIL\gujarat-nippon\\app\\about\\About.module.css", "w", encoding="utf-8")')
content = content.replace('open(r"d:\GitHub\GNIL\gujarat-nippon\\app\\about\\page.tsx", "w")', 'open(r"d:\GitHub\GNIL\gujarat-nippon\\app\\about\\page.tsx", "w", encoding="utf-8")')

with open(r"d:\GitHub\GNIL\gujarat-nippon\scripts\update_about2.py", "w", encoding="utf-8") as f:
    f.write(content)
