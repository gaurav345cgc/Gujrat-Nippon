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
                
                original_content = content
                
                # Replace #0076CE (previous replacement) with #0077C0
                content = content.replace("#0076ce", "#0077C0").replace("#0076CE", "#0077C0")
                
                # Replace #003153 (old primary) with #0077C0 just in case
                content = content.replace("#003153", "#0077C0")

                # Replace #005B9F (previous hover) with #005A93
                content = content.replace("#005b9f", "#005A93").replace("#005B9F", "#005A93")

                # Replace #002240 (old hover) with #005A93 just in case
                content = content.replace("#002240", "#005A93")
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")
            except Exception as e:
                print(f"Error on {filepath}: {e}")
