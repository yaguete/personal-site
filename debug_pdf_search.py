#!/usr/bin/env python3
"""
Script para diagnosticar la búsqueda de PDFs en PrintBuddy.

Lee GOOGLE_CSE_KEY y GOOGLE_CSE_CX desde el entorno o desde .env local.
No hardcodear secretos aquí.
"""
import os
import sys
from pathlib import Path
from urllib.parse import urlencode

import requests


def _load_dotenv(path: Path) -> None:
    if not path.is_file():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


_load_dotenv(Path(__file__).resolve().parent / ".env")
_load_dotenv(Path(__file__).resolve().parent / "heroku-deploy" / ".env")

GOOGLE_CSE_KEY = os.environ.get("GOOGLE_CSE_KEY", "").strip()
GOOGLE_CSE_CX = os.environ.get("GOOGLE_CSE_CX", "").strip()


def test_google_cse_pdf_search():
    """Probar la búsqueda de PDFs con Google Custom Search"""
    if not GOOGLE_CSE_KEY or not GOOGLE_CSE_CX:
        print(
            "Faltan GOOGLE_CSE_KEY / GOOGLE_CSE_CX en el entorno o en .env. Abortando.",
            file=sys.stderr,
        )
        sys.exit(1)

    print("=== Probando Google Custom Search para PDFs ===")

    query = "HP LaserJet printer troubleshooting"

    cse_params = {
        "key": GOOGLE_CSE_KEY,
        "cx": GOOGLE_CSE_CX,
        "q": f"({query}) (site:support.hp.com OR site:kaas.hpcloud.hp.com)",
        "num": "10",
        "safe": "off",
        "fileType": "pdf",
    }

    cse_url = f"https://www.googleapis.com/customsearch/v1?{urlencode(cse_params)}"
    # No imprimir la URL completa: lleva la API key en querystring
    print("URL de búsqueda: https://www.googleapis.com/customsearch/v1?[redacted]")

    try:
        response = requests.get(cse_url, timeout=10)
        print(f"Status Code: {response.status_code}")

        if response.ok:
            data = response.json()
            print(
                f"Total results: {data.get('searchInformation', {}).get('totalResults', 'N/A')}"
            )

            items = data.get("items", [])
            print(f"Items encontrados: {len(items)}")

            pdf_count = 0
            for i, item in enumerate(items):
                link = item.get("link", "")
                title = item.get("title", "")
                print(f"\nItem {i+1}:")
                print(f"  Título: {title}")
                print(f"  URL: {link}")
                print(
                    f"  Es PDF: {link.lower().endswith('.pdf') or 'pdf' in link.lower()}"
                )

                if link.lower().endswith(".pdf") or "pdf" in link.lower():
                    pdf_count += 1

            print(f"\nPDFs encontrados: {pdf_count}")

            print("\n=== Probando búsqueda relajada (sin fileType) ===")
            cse_params_relaxed = {
                "key": GOOGLE_CSE_KEY,
                "cx": GOOGLE_CSE_CX,
                "q": f"({query}) (site:support.hp.com OR site:kaas.hpcloud.hp.com)",
                "num": "10",
                "safe": "off",
            }

            cse_url_relaxed = (
                f"https://www.googleapis.com/customsearch/v1?{urlencode(cse_params_relaxed)}"
            )
            response_relaxed = requests.get(cse_url_relaxed, timeout=10)

            if response_relaxed.ok:
                data_relaxed = response_relaxed.json()
                items_relaxed = data_relaxed.get("items", [])
                print(f"Items encontrados (relajada): {len(items_relaxed)}")

                pdf_count_relaxed = 0
                for item in items_relaxed:
                    link = item.get("link", "")
                    title = item.get("title", "")
                    is_pdf = (
                        link.lower().endswith(".pdf")
                        or "pdf" in link.lower()
                        or ("support.hp.com" in link and "document" in link)
                    )

                    if is_pdf:
                        pdf_count_relaxed += 1
                        print(f"  PDF {pdf_count_relaxed}: {title}")
                        print(f"    URL: {link}")

                print(f"\nPDFs encontrados (relajada): {pdf_count_relaxed}")

        else:
            print(f"Error en la respuesta: {response.status_code}")
            print(f"Contenido: {response.text}")

    except Exception as e:
        print(f"Error en la búsqueda: {e}")


def test_heroku_endpoint():
    """Probar el endpoint de Heroku directamente"""
    print("\n=== Probando endpoint de Heroku ===")

    heroku_url = os.environ.get(
        "PRINTBUDDY_HEROKU_URL",
        "https://thinkmaketest-61751b04667e.herokuapp.com/printbuddy/search",
    )

    payload = {"query": "HP LaserJet printer troubleshooting"}

    try:
        response = requests.post(heroku_url, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")

        if response.ok:
            data = response.json()
            print(f"Respuesta: {data}")
        else:
            print(f"Error: {response.text}")

    except Exception as e:
        print(f"Error en la petición a Heroku: {e}")


if __name__ == "__main__":
    test_google_cse_pdf_search()
    test_heroku_endpoint()
