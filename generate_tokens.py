#!/usr/bin/env python3
"""
generate_tokens.py — lê tokens.json e regenera o bloco :root do style.css,
substituindo só o trecho entre TOKENS:START e TOKENS:END.
Rodado automaticamente pelo GitHub Action a cada push que mexer em tokens.json.
"""
import json
import re
import sys

TOKENS_FILE = "tokens.json"
CSS_FILE = "style.css"

with open(TOKENS_FILE, encoding="utf-8") as f:
    data = json.load(f)

lines = ["  /* TOKENS:START — gerado automaticamente a partir de tokens.json, não edite direto aqui */"]
for name, value in data["tokens"].items():
    lines.append(f"  {name}: {value};")
lines.append("  /* TOKENS:END */")
new_block = "\n".join(lines)

with open(CSS_FILE, encoding="utf-8") as f:
    css = f.read()

pattern = re.compile(r"  /\* TOKENS:START.*?TOKENS:END \*/", re.DOTALL)
if not pattern.search(css):
    print("ERRO: marcadores TOKENS:START/TOKENS:END não encontrados em style.css")
    sys.exit(1)

css = pattern.sub(new_block, css, count=1)

with open(CSS_FILE, "w", encoding="utf-8") as f:
    f.write(css)

print(f"OK: {len(data['tokens'])} tokens escritos em {CSS_FILE}")
