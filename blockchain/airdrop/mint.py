#!/usr/bin/env python3
"""Mint TipsterToken to a list of recipients defined in a CSV file.

CSV format (one recipient per line):
    address,amount

The first line may be a header (it will be auto-skipped). Empty lines and
lines starting with `#` are ignored. By default `amount` is interpreted as
a whole-token amount and will be multiplied by 10**decimals (default 18).
Pass `--raw` to treat the value as raw token units (wei-like) instead.

Required environment variables (e.g. via `source blockchain/.env`):
    CONTRACT_ADDRESS  - address of the deployed TipsterToken
    SEPOLIA_RPC_URL   - RPC endpoint (any `RPC_URL` also works)
    PRIVATE_KEY       - signer key, must own MINTER_ROLE on the token

Example:
    cd blockchain
    source .env
    python airdrop/airdrop_mint.py --csv airdrop/airdrop.csv
"""

from __future__ import annotations

import argparse
import csv
import os
import re
import subprocess
import sys
from pathlib import Path


ADDRESS_RE = re.compile(r"^0x[0-9a-fA-F]{40}$")


def load_dotenv(path: Path) -> None:
    """Minimal .env loader: KEY=VALUE per line, no `export` required."""
    if not path.is_file():
        return
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export "):]
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        # Do not override values already exported in the shell.
        os.environ.setdefault(key, value)


def require_env(name: str, *aliases: str) -> str:
    for candidate in (name, *aliases):
        val = os.environ.get(candidate)
        if val:
            return val
    raise SystemExit(f"Missing required env var: {name}")


def read_csv_rows(csv_path: Path) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    with csv_path.open(newline="") as fh:
        reader = csv.reader(fh)
        for i, row in enumerate(reader):
            if not row:
                continue
            cleaned = [c.strip() for c in row]
            if cleaned[0].startswith("#"):
                continue
            if len(cleaned) < 2:
                raise SystemExit(f"{csv_path}:{i+1}: expected `address,amount`")
            addr, amount = cleaned[0], cleaned[1]
            # Auto-skip a header row.
            if i == 0 and not ADDRESS_RE.match(addr):
                continue
            if not ADDRESS_RE.match(addr):
                raise SystemExit(f"{csv_path}:{i+1}: invalid address `{addr}`")
            rows.append((addr, amount))
    return rows


def fetch_decimals(contract: str, rpc_url: str) -> int:
    """Read decimals() from the token via `cast call`."""
    out = subprocess.run(
        ["cast", "call", contract, "decimals()(uint8)", "--rpc-url", rpc_url],
        check=True, capture_output=True, text=True,
    ).stdout.strip()
    return int(out)


def cast_send(
    contract: str,
    to: str,
    amount_wei: int,
    rpc_url: str,
    private_key: str,
    dry_run: bool,
) -> None:
    cmd = [
        "cast", "send", contract,
        "mint(address,uint256)", to, str(amount_wei),
        "--rpc-url", rpc_url,
        "--private-key", private_key,
    ]
    if dry_run:
        # Mask the private key in the printed command.
        printable = [c if c != private_key else "***" for c in cmd]
        print("DRY:", " ".join(printable))
        return
    subprocess.run(cmd, check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="CSV airdrop mint for TipsterToken")
    parser.add_argument(
        "--csv",
        default="airdrop/airdrop.csv",
        help="Path to CSV file (default: airdrop/airdrop.csv)",
    )
    parser.add_argument(
        "--raw",
        action="store_true",
        help="Treat CSV amounts as raw token units (no decimals scaling)",
    )
    parser.add_argument(
        "--decimals",
        type=int,
        default=None,
        help="Override token decimals (default: read from contract)",
    )
    parser.add_argument(
        "--env-file",
        default="./.env",
        help="Path to .env (default: ./.env in current dir)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print cast commands without sending transactions",
    )
    args = parser.parse_args()

    load_dotenv(Path(args.env_file))

    contract = require_env("CONTRACT_ADDRESS", "TIPSTER_TOKEN")
    rpc_url = require_env("SEPOLIA_RPC_URL", "RPC_URL")
    private_key = require_env("PRIVATE_KEY")

    csv_path = Path(args.csv)
    if not csv_path.is_file():
        raise SystemExit(f"CSV not found: {csv_path}")

    rows = read_csv_rows(csv_path)
    if not rows:
        print("No recipients found in CSV — nothing to do.")
        return 0

    if args.raw:
        scale = 1
    else:
        decimals = args.decimals if args.decimals is not None else fetch_decimals(contract, rpc_url)
        scale = 10 ** decimals
        print(f"Token decimals: {decimals}")

    print(f"Token:      {contract}")
    print(f"CSV:        {csv_path}")
    print(f"Recipients: {len(rows)}")
    print(f"Raw mode:   {args.raw}")
    print(f"Dry run:    {args.dry_run}")
    print("-" * 40)

    total = 0
    for idx, (to, amount_str) in enumerate(rows, start=1):
        try:
            amount = int(amount_str)
        except ValueError:
            raise SystemExit(f"Invalid amount `{amount_str}` for {to}")
        if amount <= 0:
            raise SystemExit(f"Amount must be > 0 for {to}")

        amount_wei = amount * scale
        print(f"[{idx}/{len(rows)}] mint {amount_wei} -> {to}")
        try:
            cast_send(contract, to, amount_wei, rpc_url, private_key, args.dry_run)
        except subprocess.CalledProcessError as e:
            raise SystemExit(f"cast send failed for {to}: exit code {e.returncode}")
        total += amount_wei

    print("-" * 40)
    print(f"Done. Total minted: {total} (units)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
