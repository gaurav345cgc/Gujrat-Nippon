import os

path = r"d:\GitHub\GNIL\gujarat-nippon"
for root, dirs, files in os.walk(path):
    if "node_modules" in root or ".git" in root or ".next" in root:
        continue
    for file in files:
        if file.endswith((".css", ".tsx", ".ts")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if "#003153" in content or "#002240" in content:
                    content = content.replace("#003153", "#0076CE")
                    content = content.replace("#002240", "#005B9F")
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
            except Exception as e:
                pass
