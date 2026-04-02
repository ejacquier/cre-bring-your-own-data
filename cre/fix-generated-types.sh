#!/bin/bash
# Adds // @ts-nocheck to all generated contract bindings.
# Run this after `cre generate-bindings` to fix viem type incompatibilities.
for f in contracts/evm/ts/generated/*.ts; do
  if ! head -1 "$f" | grep -q '@ts-nocheck'; then
    sed -i '' '1s/^/\/\/ @ts-nocheck\n/' "$f"
  fi
done
echo "✅ Added @ts-nocheck to generated bindings"
