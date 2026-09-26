import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "SafeSewer™ • AI Confined-Space Safety & Emergency Response Platform")
            self.drawRightString(612 - 54, 750, "Official System Documentation")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 744, 612 - 54, 744)

        # Footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 612 - 54, 45)
        
        self.drawString(54, 32, "Confidential • Indore Municipal Corporation Smart Safety Project • OSHA 1910.146 Compliant")
        self.drawRightString(612 - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom color palette
    c_navy = colors.HexColor("#0B132B")
    c_blue = colors.HexColor("#2563EB")
    c_dark_slate = colors.HexColor("#1E293B")
    c_slate = colors.HexColor("#475569")
    c_light_bg = colors.HexColor("#F8FAFC")
    c_emerald = colors.HexColor("#16A34A")
    c_amber = colors.HexColor("#D97706")
    c_red = colors.HexColor("#DC2626")
    
    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_navy,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_blue,
        spaceAfter=14
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_navy,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_blue,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_dark_slate,
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_dark_slate,
        leftIndent=12,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=c_dark_slate
    )
    
    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("SAFESEWER™", title_style))
    story.append(Paragraph("AI-Powered Safety & Emergency Response System for Confined-Space Workers", subtitle_style))
    story.append(Paragraph("<b>Document Scope:</b> Comprehensive System Architecture, Operational Lifecycle, UI Specifications & Phase 2 Technical Blueprint", body_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceBefore=4, spaceAfter=12))

    # Section 1: Executive Summary & Core Mission
    story.append(Paragraph("1. Executive Summary & Problem Definition", h1_style))
    story.append(Paragraph(
        "Confined spaces such as municipal sewer chambers, deep drainage culverts, and underground manholes represent one of the most hazardous work environments globally. Workers face life-threatening perils including lethal gas accumulations (Hydrogen Sulfide, Methane), extreme oxygen depletion, thermal exhaustion, physical entrapment, and delayed rescue responses.",
        body_style
    ))
    story.append(Paragraph(
        "<b>SafeSewer</b> resolves these hazards through an integrated IoT edge-monitoring ecosystem, an AI computer-vision PPE pre-verification protocol, a real-time Geospatial Command Center, and sub-second acoustic siren rescue dispatch workflows.",
        body_style
    ))

    # Section 2: Three Core User Roles
    story.append(Paragraph("2. System User Personas & Responsibilities", h1_style))
    
    roles_data = [
        [
            Paragraph("User Persona", table_header_style),
            Paragraph("Primary Interface", table_header_style),
            Paragraph("Core Responsibilities & Capabilities", table_header_style)
        ],
        [
            Paragraph("<b>1. WORKER</b>", table_cell_style),
            Paragraph("Mobile HUD App<br/>(Android Web App)", table_cell_style),
            Paragraph("• Check assigned chamber jobs & hazards<br/>• Complete pre-entry AI camera PPE verification (92% pass)<br/>• Monitor real-time gas vitals & pulse<br/>• Trigger 1-Click Emergency SOS panic beacon", table_cell_style)
        ],
        [
            Paragraph("<b>2. SUPERVISOR</b>", table_cell_style),
            Paragraph("Web Command Center<br/>(Desktop / Tablet)", table_cell_style),
            Paragraph("• Track active jobs and worker fleet in real-time<br/>• Monitor live 6-gas HUD telemetry (H2S, CH4, O2, Temp, IMU)<br/>• Receive automated warning/critical alerts & acoustic sirens<br/>• Initiate tripod hoist rescue evacuations", table_cell_style)
        ],
        [
            Paragraph("<b>3. MUNICIPAL ADMIN</b>", table_cell_style),
            Paragraph("Governance & Analytics<br/>Portal", table_cell_style),
            Paragraph("• Authorize and schedule subterranean jobs across all zones<br/>• Oversee IoT hardware fleet (battery, RSSI, calibration)<br/>• Review forensic incident timelines for compliance<br/>• Export audit-ready OSHA/BIS safety certificates", table_cell_style)
        ]
    ]
    
    t_roles = Table(roles_data, colWidths=[1.3*inch, 1.4*inch, 4.3*inch])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_roles)
    story.append(Spacer(1, 10))

    # Section 3: Subterranean Multi-Gas Standards
    story.append(Paragraph("3. Multi-Gas Telemetry & Threshold Decision Matrix", h1_style))
    story.append(Paragraph("The platform continuously samples environmental parameters via electrochemical sensors and IMU kinematics, classifying conditions into strict color-coded tiers:", body_style))

    gas_data = [
        [
            Paragraph("Telemetry Metric", table_header_style),
            Paragraph("Safe Level (🟢)", table_header_style),
            Paragraph("Caution Warning (🟡)", table_header_style),
            Paragraph("Critical / Evacuate (🔴)", table_header_style),
            Paragraph("Autonomous Action", table_header_style)
        ],
        [
            Paragraph("<b>H₂S (Hydrogen Sulfide)</b>", table_cell_style),
            Paragraph("< 5.0 ppm", table_cell_style),
            Paragraph("5.0 – 10.0 ppm", table_cell_style),
            Paragraph("<b>> 10.0 ppm</b>", table_cell_style),
            Paragraph("110dB Siren + Tripod Winch Lock", table_cell_style)
        ],
        [
            Paragraph("<b>CH₄ (Methane LEL)</b>", table_cell_style),
            Paragraph("< 0.5%", table_cell_style),
            Paragraph("0.5% – 1.0%", table_cell_style),
            Paragraph("<b>> 1.0%</b>", table_cell_style),
            Paragraph("Forced ventilation fan deployment", table_cell_style)
        ],
        [
            Paragraph("<b>O₂ (Atmospheric Oxygen)</b>", table_cell_style),
            Paragraph("19.5% – 23.5%", table_cell_style),
            Paragraph("18.0% – 19.4%", table_cell_style),
            Paragraph("<b>< 18.0%</b>", table_cell_style),
            Paragraph("SCBA oxygen line lock & extract", table_cell_style)
        ],
        [
            Paragraph("<b>Chamber Temperature</b>", table_cell_style),
            Paragraph("< 35.0 °C", table_cell_style),
            Paragraph("35.0 – 40.0 °C", table_cell_style),
            Paragraph("<b>> 40.0 °C</b>", table_cell_style),
            Paragraph("Worker rotation cooldown order", table_cell_style)
        ],
        [
            Paragraph("<b>6-Axis IMU (Motion)</b>", table_cell_style),
            Paragraph("Active Motion", table_cell_style),
            Paragraph("> 30s Stationary", table_cell_style),
            Paragraph("<b>Man-Down Trigger</b>", table_cell_style),
            Paragraph("Haptic wrist buzz + sentry ping", table_cell_style)
        ],
        [
            Paragraph("<b>Worker Heart Rate</b>", table_cell_style),
            Paragraph("60 – 100 BPM", table_cell_style),
            Paragraph("101 – 115 BPM", table_cell_style),
            Paragraph("<b>> 115 BPM</b>", table_cell_style),
            Paragraph("Exertion/toxicity distress alert", table_cell_style)
        ]
    ]

    t_gas = Table(gas_data, colWidths=[1.5*inch, 1.1*inch, 1.3*inch, 1.3*inch, 1.8*inch])
    t_gas.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_gas)
    story.append(Spacer(1, 10))

    # Section 4: End-to-End Safety Workflow Lifecycle
    story.append(Paragraph("4. End-to-End Safety Workflow Lifecycle", h1_style))
    story.append(Paragraph("<b>Phase A: Pre-Entry Clearance & AI PPE Audit</b>", h2_style))
    story.append(Paragraph("• Prior to descending, the worker positions their mobile camera. The simulated AI Computer Vision engine audits 6 required items: Helmet (98%), Gloves (95%), Boots (94%), SCBA Face Mask (89%), Gas Detector (96%), and Safety Harness (91%). Total Confidence: <b>92% (PASSED)</b>.", bullet_style))
    story.append(Paragraph("• Topside attendant confirms atmospheric gas pre-sweep before authorizing manhole entry.", bullet_style))
    
    story.append(Paragraph("<b>Phase B: Subterranean Ingress & Live Edge Telemetry</b>", h2_style))
    story.append(Paragraph("• Workers descend into depths up to 8.4 meters. SafeSewer Edge Node Mk IV (ESP32) transmits multi-gas and vital readings via 4G LTE and LoRaWAN mesh.", bullet_style))
    story.append(Paragraph("• Supervisor dashboard visualizes live updates every 4 seconds with Recharts time-series trends.", bullet_style))

    story.append(Paragraph("<b>Phase C: AI Safety Intelligence & Pattern Anomaly Detection</b>", h2_style))
    story.append(Paragraph("• Neural risk scorer computes a dynamic index (0–100). If toxic accumulation rate exceeds +4.0 ppm/min or localized stagnant pockets form, caution alerts are proactively flagged.", bullet_style))

    story.append(Paragraph("<b>Phase D: Emergency SOS & Topside Siren Intervention</b>", h2_style))
    story.append(Paragraph("• If H2S exceeds 10 ppm or a worker taps the Panic SOS button, topside 110dB acoustic sirens activate immediately, wristbands vibrate, and the Indore Municipal Quick Response Rescue Unit is alerted with precise GPS coordinates and chamber depth.", bullet_style))

    story.append(Paragraph("<b>Phase E: Post-Incident Forensic Reconstruction & Compliance</b>", h2_style))
    story.append(Paragraph("• Every step is logged in the forensic register with an unalterable chronological timeline from trigger to full stabilization.", bullet_style))
    story.append(Spacer(1, 8))

    # Section 5: Completed Application Routes & UI Architecture
    story.append(Paragraph("5. Complete Frontend Routes & UI Implementation", h1_style))
    
    routes_summary = [
        [
            Paragraph("Route Path", table_header_style),
            Paragraph("View Type", table_header_style),
            Paragraph("Key Features & Capabilities Implemented", table_header_style)
        ],
        [
            Paragraph("<b>/login</b>", table_cell_style),
            Paragraph("Public Portal", table_cell_style),
            Paragraph("Brand statement, Role Selector (Supervisor, Admin, Worker), and 1-Click Instant Demo Access.", table_cell_style)
        ],
        [
            Paragraph("<b>/dashboard</b>", table_cell_style),
            Paragraph("Supervisor", table_cell_style),
            Paragraph("4 KPI Cards, Live Subterranean GIS Map, Worker Fleet Stream, 6-Gas Telemetry HUD, Recharts Trend Visualizer, and AI Intelligence Panel.", table_cell_style)
        ],
        [
            Paragraph("<b>/jobs & /jobs/:id</b>", table_cell_style),
            Paragraph("Operations", table_cell_style),
            Paragraph("Confined job registry, 'Create Entry Job' modal with checklists, chamber depth cockpit, and live crew vitals.", table_cell_style)
        ],
        [
            Paragraph("<b>/workers</b>", table_cell_style),
            Paragraph("Fleet Oversight", table_cell_style),
            Paragraph("Worker safety roster, safety scores (0-100), PPE verification status, and slide-over Worker Dossier Drawer.", table_cell_style)
        ],
        [
            Paragraph("<b>/devices</b>", table_cell_style),
            Paragraph("Hardware Hub", table_cell_style),
            Paragraph("IoT Edge Node diagnostics (ESP32-001 to 006), battery %, RSSI dBm, network type, and Calibration/Ping simulators.", table_cell_style)
        ],
        [
            Paragraph("<b>/map</b>", table_cell_style),
            Paragraph("Geospatial GIS", table_cell_style),
            Paragraph("Vector GIS map of Indore chambers (Chamber #27, Vijay Nagar, Rajwada, Bypass), sewer line mesh, zoom, and popups.", table_cell_style)
        ],
        [
            Paragraph("<b>/alerts</b>", table_cell_style),
            Paragraph("Dispatch Center", table_cell_style),
            Paragraph("Severity filter tabs (Critical, Warning, Resolved) with functional Acknowledge and Resolve state buttons.", table_cell_style)
        ],
        [
            Paragraph("<b>/incidents</b>", table_cell_style),
            Paragraph("Forensics", table_cell_style),
            Paragraph("Minute-by-minute vertical timeline visualizer (10:31 Spike -> 10:33 Contacted -> 10:35 Evacuated -> 10:40 Resolved).", table_cell_style)
        ],
        [
            Paragraph("<b>/reports</b>", table_cell_style),
            Paragraph("Analytics", table_cell_style),
            Paragraph("Recharts graphs for Incident Trends & Gas Distributions, Zone Risk indices, and PDF/CSV Export simulation modal.", table_cell_style)
        ],
        [
            Paragraph("<b>/settings</b>", table_cell_style),
            Paragraph("System Config", table_cell_style),
            Paragraph("Gas cutoff thresholds (H2S, CH4, O2), Municipal emergency directory, and automated acoustic siren triggers.", table_cell_style)
        ],
        [
            Paragraph("<b>/worker/*</b>", table_cell_style),
            Paragraph("Worker Mobile", table_cell_style),
            Paragraph("Android-style HUD: 'SAFE TO WORK' banner, live vitals, AI PPE Camera Scan simulator, mobile alerts, and prominent SOS button.", table_cell_style)
        ]
    ]

    t_routes = Table(routes_summary, colWidths=[1.3*inch, 1.2*inch, 4.5*inch])
    t_routes.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_routes)
    story.append(Spacer(1, 10))

    # Section 6: Recommended Phase 2 Backend Architecture
    story.append(Paragraph("6. Recommended Phase 2 Backend & Hardware Architecture", h1_style))
    story.append(Paragraph("For commercial production deployment across municipal corporations, the following distributed architecture is recommended:", body_style))
    story.append(Paragraph("• <b>Hardware Layer:</b> ESP32-S3 Dual Core MCU with LoRa SX1262 transceiver, electrochemical H2S (Winsen ME4-H2S), galvanic O2 (ME2-O2), catalytic CH4 (MQ-4/MP-4), and 6-axis MPU-6050 IMU accelerometer.", bullet_style))
    story.append(Paragraph("• <b>Telemetry Ingestion:</b> High-throughput EMQX / Eclipse Mosquitto MQTT Broker processing compact binary Protobuf packets.", bullet_style))
    story.append(Paragraph("• <b>Time-Series Storage:</b> TimescaleDB / InfluxDB for sub-second sensor streams combined with PostgreSQL for relational crew data.", bullet_style))
    story.append(Paragraph("• <b>Real-Time Push:</b> Redis Pub/Sub with WebSocket connections ensuring sub-100ms push latency to supervisor consoles.", bullet_style))
    story.append(Paragraph("• <b>Edge AI:</b> YOLOv8-nano / MobileNet-v3 deployed on Raspberry Pi 5 or edge cameras for instant topside PPE verification.", bullet_style))
    story.append(Paragraph("• <b>Emergency Dispatch:</b> Twilio Voice API / Exotel SIP trunking for automated concurrent calls to municipal rescue units.", bullet_style))
    story.append(Spacer(1, 10))

    # Section 7: How to Run
    story.append(Paragraph("7. Local Execution & Testing Guide", h1_style))
    story.append(Paragraph("To launch and demonstrate the SafeSewer frontend prototype:", body_style))
    story.append(Paragraph("<code>cd /Users/kunalraikwar/Desktop/ss<br/>npm install<br/>npm run dev</code>", ParagraphStyle('Code', parent=styles['Normal'], fontName='Courier', fontSize=9, leading=12, textColor=c_navy, backColor=c_light_bg, borderPadding=6, spaceAfter=8)))
    story.append(Paragraph("Open <b>http://localhost:5173</b> in your web browser. Use the <b>'Simulate'</b> menu in the top bar to test toxic gas spikes, acoustic siren playback, and atmospheric flushing.", body_style))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    out_path = os.path.join(os.path.dirname(__file__), "SafeSewer_System_Documentation_and_User_Guide.pdf")
    build_pdf(out_path)
