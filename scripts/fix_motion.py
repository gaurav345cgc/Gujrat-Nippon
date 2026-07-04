import os
import re

dirs = ['d:/GitHub/GNIL/gujarat-nippon/app', 'd:/GitHub/GNIL/gujarat-nippon/components']

patterns_to_remove = [
    r'initial=\{[^}]+\}',
    r'animate=\{[^}]+\}',
    r'whileInView=\{[^}]+\}',
    r'viewport=\{[^}]+\}',
    r'variants=\{[\s\S]*?\}\}\}',
    r'variants=\{[^}]+\}',
    r'transition=\{[\s\S]*?\}\}',
    r'transition=\{[^}]+\}',
    r'custom=\{[^}]+\}',
]

for d in dirs:
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                original = content
                
                # Replace motion. tags
                content = re.sub(r'<\/?motion\.([a-zA-Z0-9]+)', lambda m: f'<{m.group(1)}' if m.group(0).startswith('<m') else f'</{m.group(1)}', content)
                
                for pattern in patterns_to_remove:
                    content = re.sub(pattern, '', content)

                content = re.sub(r'import\s+\{\s*motion[^}]*\}\s+from\s+[\'"]framer-motion[\'"];?', '', content)
                content = content.replace("import { motion, useInView, useScroll, useTransform } from 'framer-motion';", "")
                content = content.replace("style={{ y }}", "")
                content = content.replace("style={{ opacity }}", "")

                if original != content:
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(content)
                    print(f'Updated {path}')
