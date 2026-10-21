#!/usr/bin/env python3
"""css/style.css + js/*.js 를 한 파일로 합쳐 claude.ai 아티팩트용 dist/artifact.html 을 만든다.

아티팩트 환경이 <html>/<head>/<body> 뼈대를 직접 감싸 주므로, 결과물은
title · 글꼴 링크 · <style> · 화면 마크업 · <script> 순서의 조각(fragment)이다.
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
read = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()

index = read("index.html")

title = re.search(r"<title>(.*?)</title>", index, re.S).group(1)
fonts = re.search(r'<link rel="stylesheet" href="(https://fonts[^"]+)">', index).group(1)

body = re.search(r"<body>(.*?)</body>", index, re.S).group(1)
body = re.sub(r"<!--.*?-->", "", body, flags=re.S)              # 주석 제거
body = re.sub(r'<script src="[^"]+"></script>\s*', "", body)     # 개별 스크립트 태그 제거
body = body.strip()

css = read("css/style.css")
js_files = sorted(glob.glob(os.path.join(ROOT, "js", "*.js")))
if not js_files:
    sys.exit("js/*.js 가 없습니다")
js = "\n".join(open(p, encoding="utf-8").read().rstrip("\n") for p in js_files)

if "</script>" in js:
    sys.exit("js 안에 '</script>' 문자열이 있어 인라인할 수 없습니다")

out = f"""<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts}">
<style>
{css}
</style>
{body}
<script>
{js}
</script>
"""

os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
dest = os.path.join(ROOT, "dist", "artifact.html")
open(dest, "w", encoding="utf-8").write(out)
print(f"만들었습니다: {dest} ({len(out.encode('utf-8')):,} bytes, JS {len(js_files)}개 합침)")
