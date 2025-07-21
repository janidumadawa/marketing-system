import pdfplumber
import json
import re

pdf_file = "clients3.pdf"
data_list = []

current_month = None
current_year = None

with pdfplumber.open(pdf_file) as pdf:
    for page_num, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                # Check for month and year in any column
                for col in row:
                    if col:
                        match = re.search(r"(January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\s*(\d{4})", col)
                        if match:
                            current_month = match.group(1)
                            current_year = int(match.group(2))

                # Try extracting a client row (client + amount in one cell)
                for col in row:
                    if col:
                        match = re.match(r"([A-Za-z0-9\s\.\-&]+)\s+([0-9,\.]+)$", col.strip())
                        if match:
                            client_name = match.group(1).strip()
                            amount_str = match.group(2).replace(',', '').replace('.', '')
                            if amount_str.isdigit():
                                amount_spent = int(amount_str)
                                entry = {
                                    "clientName": client_name,
                                    "amountSpent": amount_spent,
                                    "year": current_year if current_year else 0,
                                    "month": current_month if current_month else "Unknown"
                                }
                                data_list.append(entry)
                                # Optional: print(entry)
                            break  # Only one client per row

# Save to output.json
with open("output.json", "w", encoding="utf-8") as f:
    json.dump(data_list, f, indent=4)

print(f"\n✅ Extracted {len(data_list)} records. Saved to output.json")
