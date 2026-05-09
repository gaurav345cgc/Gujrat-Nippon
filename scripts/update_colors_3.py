import os

path = r"d:\GitHub\GNIL\gujarat-nippon"

main_replacements = ["#224c98", "#224C98", "#0076ce", "#0076CE", "#003153"]
hover_replacements = ["#005b9f", "#005B9F", "#002240"]

for root, dirs, files in os.walk(path):
    if "node_modules" in root or ".git" in root or ".next" in root:
        continue
    for file in files:
        if file.endswith((".css", ".tsx", ".ts")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                for c in main_replacements:
                    content = content.replace(c, "#0077C0")
                for c in hover_replacements:
                    content = content.replace(c, "#005A93")
                
                # specific rgba updates
                content = content.replace("rgba(0, 118, 206", "rgba(0, 119, 192")
                content = content.replace("rgba(34, 76, 152", "rgba(0, 119, 192")
                content = content.replace("rgba(0, 49, 83", "rgba(0, 119, 192")
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
            except Exception as e:
                print(f"Error on {filepath}: {e}")
