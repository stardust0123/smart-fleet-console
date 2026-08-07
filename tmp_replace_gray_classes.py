from pathlib import Path
import re
root = Path(__file__).parent
patterns = [
    (r'text-gray-400', 'text-gray-700'),
    (r'text-gray-500', 'text-gray-800'),
    (r'text-gray-600', 'text-gray-900'),
    (r'text-gray-700', 'text-black'),
    (r'text-gray-800', 'text-black'),
]
files_changed = []
for path in root.rglob('*.*'):
    if 'node_modules' in path.parts:
        continue
    if path.suffix in {'.ts', '.tsx', '.js', '.jsx'}:
        text = path.read_text(encoding='utf-8')
        original = text
        for old, new in patterns:
            text = re.sub(rf'\b{re.escape(old)}\b', new, text)
        if text != original:
            path.write_text(text, encoding='utf-8')
            files_changed.append(str(path.relative_to(root)))
print('changed', len(files_changed), 'files')
for f in files_changed:
    print(f)
