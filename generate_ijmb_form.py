from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Table, TableStyle
import os

# --- CONFIGURATION ---
ORG_NAME = "IJMB DIRECT ENTRY"
ORG_TAGLINE = "A'Level Registration — Gain Admission into 200 Level"
ORG_ADDRESS = "No. 1 Example Street, City  |  Tel: 0800-000-0000  |  info@ijmb.info"
OUTPUT_DIR = "public/forms"
OUTPUT_FILENAME = "IJMB_Registration_Form.pdf"

# --- COLORS ---
COLOR_PRIMARY = colors.HexColor("#006400") # Deep Green
COLOR_ACCENT = colors.HexColor("#FFB300")  # Gold

def create_form():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    filepath = os.path.join(OUTPUT_DIR, OUTPUT_FILENAME)
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4
    
    # --- PAGE 1 ---
    # Header
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(COLOR_PRIMARY)
    c.drawCentredString(width/2, height - 1.0*inch, ORG_NAME)
    
    c.setFont("Helvetica-Oblique", 12)
    c.setFillColor(colors.black)
    c.drawCentredString(width/2, height - 1.3*inch, ORG_TAGLINE)
    
    c.setFont("Helvetica", 9)
    c.drawCentredString(width/2, height - 1.5*inch, ORG_ADDRESS)
    
    c.setLineWidth(2)
    c.setStrokeColor(COLOR_ACCENT)
    c.line(0.5*inch, height - 1.6*inch, width - 0.5*inch, height - 1.6*inch)
    
    c.drawString(1*inch, height/2, "This is a placeholder for the generated form.")
    c.drawString(1*inch, height/2 - 20, "Please install reportlab and run this script to generate the full PDF.")
    
    c.showPage()
    c.save()
    print(f"PDF generated at: {filepath}")

if __name__ == "__main__":
    create_form()
