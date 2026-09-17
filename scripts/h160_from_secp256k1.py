#!/usr/bin/env python3
"""Derive an Ethereum H160 from a 0x-prefixed secp256k1 private key.

Uses openssl for the curve and a stdlib Keccak-256 (not SHA3-256).
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
import tempfile

# Keccak-f[1600] round constants
_RC = (
    0x0000000000000001,
    0x0000000000008082,
    0x800000000000808A,
    0x8000000080008000,
    0x000000000000808B,
    0x0000000080000001,
    0x8000000080008081,
    0x8000000000008009,
    0x000000000000008A,
    0x0000000000000088,
    0x0000000080008009,
    0x000000008000000A,
    0x000000008000808B,
    0x800000000000008B,
    0x8000000000008089,
    0x8000000000008003,
    0x8000000000008002,
    0x8000000000000080,
    0x000000000000800A,
    0x800000008000000A,
    0x8000000080008081,
    0x8000000000008080,
    0x0000000080000001,
    0x8000000080008008,
)
_ROT = (
    (0, 36, 3, 41, 18),
    (1, 44, 10, 45, 2),
    (62, 6, 43, 15, 61),
    (28, 55, 25, 21, 56),
    (27, 20, 39, 8, 14),
)


def _rotl64(x: int, n: int) -> int:
    x &= (1 << 64) - 1
    return ((x << n) | (x >> (64 - n))) & ((1 << 64) - 1)


def keccak256(data: bytes) -> bytes:
    rate = 136
    state = [0] * 25
    offset = 0
    while offset + rate <= len(data):
        block = data[offset : offset + rate]
        for i, b in enumerate(block):
            state[i >> 3] ^= b << (8 * (i & 7))
        _keccak_f(state)
        offset += rate
    last = bytearray(data[offset:])
    last.append(0x01)
    last.extend(b"\x00" * (rate - len(last)))
    last[-1] |= 0x80
    for i, b in enumerate(last):
        state[i >> 3] ^= b << (8 * (i & 7))
    _keccak_f(state)
    out = bytearray()
    while len(out) < 32:
        for i in range(rate // 8):
            out.extend(state[i].to_bytes(8, "little"))
        if len(out) < 32:
            _keccak_f(state)
    return bytes(out[:32])


def _keccak_f(st: list[int]) -> None:
    for rnd in range(24):
        c = [st[i] ^ st[i + 5] ^ st[i + 10] ^ st[i + 15] ^ st[i + 20] for i in range(5)]
        d = [c[(i + 4) % 5] ^ _rotl64(c[(i + 1) % 5], 1) for i in range(5)]
        for i in range(25):
            st[i] ^= d[i % 5]
        b = [0] * 25
        for x in range(5):
            for y in range(5):
                b[y + 5 * ((2 * x + 3 * y) % 5)] = _rotl64(st[x + 5 * y], _ROT[x][y])
        for x in range(5):
            for y in range(5):
                st[x + 5 * y] = b[x + 5 * y] ^ ((~b[(x + 1) % 5 + 5 * y]) & b[(x + 2) % 5 + 5 * y])
        st[0] ^= _RC[rnd]


def parse_privkey(raw: str) -> bytes:
    text = raw.strip()
    if text.startswith(("0x", "0X")):
        text = text[2:]
    text = re.sub(r"\s+", "", text)
    if not re.fullmatch(r"[0-9a-fA-F]{64}", text):
        raise SystemExit("ERROR: expected 0x-prefixed 32-byte hex secp256k1 private key")
    key = bytes.fromhex(text)
    n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
    if int.from_bytes(key, "big") == 0 or int.from_bytes(key, "big") >= n:
        raise SystemExit("ERROR: secp256k1 private key is out of range")
    return key


def _sec1_ec_private_key_der(priv: bytes) -> bytes:
    # RFC 5915 ECPrivateKey with named curve secp256k1, no public key.
    body = bytes.fromhex("0201010420") + priv + bytes.fromhex("a00706052b8104000a")
    return bytes([0x30, len(body)]) + body


def uncompressed_pubkey(priv: bytes) -> bytes:
    der = _sec1_ec_private_key_der(priv)
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(der)
        path = tmp.name
    try:
        der_pub = subprocess.check_output(
            [
                "openssl",
                "ec",
                "-inform",
                "DER",
                "-in",
                path,
                "-pubout",
                "-conv_form",
                "uncompressed",
                "-outform",
                "DER",
            ],
            stderr=subprocess.DEVNULL,
        )
    except subprocess.CalledProcessError as exc:
        raise SystemExit("ERROR: openssl failed to derive secp256k1 public key") from exc
    finally:
        os.unlink(path)
    if len(der_pub) < 65 or der_pub[-65] != 0x04:
        raise SystemExit(f"ERROR: expected uncompressed secp256k1 SPKI, got {der_pub.hex()}")
    return der_pub[-65:]


def h160(priv: bytes) -> str:
    digest = keccak256(uncompressed_pubkey(priv)[1:])
    return "0x" + digest[-20:].hex()


def self_check() -> None:
    empty = keccak256(b"")
    expected_empty = bytes.fromhex("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470")
    if empty != expected_empty:
        raise SystemExit(f"ERROR: keccak256 self-check failed: {empty.hex()}")
    addr = h160(bytes.fromhex("01".rjust(64, "0")))
    expected_addr = "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf"
    if addr != expected_addr:
        raise SystemExit(f"ERROR: H160 self-check failed: {addr}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("keyfile", nargs="?", help="file containing 0x-prefixed 32-byte hex key")
    parser.add_argument("--self-check", action="store_true")
    args = parser.parse_args()
    if args.self_check:
        self_check()
        print("ok")
        return
    if args.keyfile:
        raw = open(args.keyfile, encoding="utf-8").read()
    else:
        raw = sys.stdin.read()
    print(h160(parse_privkey(raw)))


if __name__ == "__main__":
    main()
