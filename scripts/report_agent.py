"""
BrandFlow Report Agent
Main orchestrator for the Marketing Plan Report system.
Usage:
  python report_agent.py pdf [json_path] [output_path]   — Generate PDF report
  python report_agent.py serve [port]                     — Start web dashboard
  python report_agent.py                                  — Show help
"""
import sys
import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
WEB_DIR = os.path.join(BASE_DIR, "web")
DEFAULT_JSON = os.path.join(DATA_DIR, "sample_marketing_plan.json")


def cmd_pdf(args):
    """Generate a PDF report from JSON data."""
    from generate_pdf_report import generate_report
    json_path = args[0] if args else DEFAULT_JSON
    output_path = args[1] if len(args) > 1 else os.path.join(OUTPUT_DIR, "Marketing_Plan_Report.pdf")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    generate_report(json_path, output_path)


def cmd_serve(args):
    """Start a local web server for the dashboard."""
    import http.server
    import functools

    port = int(args[0]) if args else 8080

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=WEB_DIR, **kw)

        def do_GET(self):
            if self.path == "/api/data":
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(DEFAULT_JSON, "r", encoding="utf-8") as f:
                    self.wfile.write(f.read().encode())
            elif self.path == "/api/generate-pdf":
                from generate_pdf_report import generate_report
                os.makedirs(OUTPUT_DIR, exist_ok=True)
                pdf_path = os.path.join(OUTPUT_DIR, "Marketing_Plan_Report.pdf")
                generate_report(DEFAULT_JSON, pdf_path)
                self.send_response(200)
                self.send_header("Content-Type", "application/pdf")
                self.send_header("Content-Disposition", "attachment; filename=Marketing_Plan_Report.pdf")
                self.end_headers()
                with open(pdf_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                super().do_GET()

    server = http.server.HTTPServer(("0.0.0.0", port), Handler)
    print(f"[START] BrandFlow Dashboard running at http://localhost:{port}")
    print(f"   API data:     http://localhost:{port}/api/data")
    print(f"   Generate PDF: http://localhost:{port}/api/generate-pdf")
    print("   Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[STOP] Server stopped.")


def show_help():
    print("""
╔══════════════════════════════════════════════════════╗
║           BrandFlow Report Agent v1.0                ║
╠══════════════════════════════════════════════════════╣
║ Commands:                                            ║
║   pdf   [json] [output]  — Generate PDF report       ║
║   serve [port]           — Start web dashboard        ║
║   help                   — Show this message          ║
╚══════════════════════════════════════════════════════╝
    """)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"
    args = sys.argv[2:]

    if cmd == "pdf":
        cmd_pdf(args)
    elif cmd == "serve":
        cmd_serve(args)
    else:
        show_help()
