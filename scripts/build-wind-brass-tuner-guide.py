"""Build the bilingual Wind Brass Tuner guide served by Orchestra Tools."""

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "manuals" / "wind-brass-tuner.pdf"
APP_URL = "https://www.hitori-biz.com/wind-brass-tuner"
SUPPORT_URL = "https://www.hitori-biz.com/wind-brass-tuner/support"
WIDTH, HEIGHT = A4
MARGIN = 46
CONTENT_WIDTH = WIDTH - 2 * MARGIN

FONT_SANS = "NotoSansJP"
FONT_SERIF = "NotoSerifJP"
pdfmetrics.registerFont(TTFont(FONT_SANS, r"C:\Windows\Fonts\NotoSansJP-VF.ttf"))
pdfmetrics.registerFont(TTFont(FONT_SERIF, r"C:\Windows\Fonts\NotoSerifJP-VF.ttf"))

NAVY = colors.HexColor("#111827")
SLATE = colors.HexColor("#475569")
MUTED = colors.HexColor("#64748B")
ROSE = colors.HexColor("#FB7185")
ROSE_LIGHT = colors.HexColor("#FFF1F2")
CYAN = colors.HexColor("#22D3EE")
CYAN_LIGHT = colors.HexColor("#ECFEFF")
LINE = colors.HexColor("#CBD5E1")
WHITE = colors.white


def paragraph(pdf, value, x, top, width, size=10.5, leading=17, color=SLATE,
              font=FONT_SANS, align=TA_LEFT):
    style = ParagraphStyle(
        "body",
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=align,
        wordWrap="CJK",
        spaceAfter=0,
        spaceBefore=0,
        allowWidows=0,
        allowOrphans=0,
    )
    p = Paragraph(escape(value), style)
    _, height = p.wrap(width, HEIGHT)
    p.drawOn(pdf, x, top - height)
    return height


def rounded_box(pdf, x, top, width, height, fill=WHITE, stroke=LINE, radius=12):
    pdf.setFillColor(fill)
    pdf.setStrokeColor(stroke)
    pdf.setLineWidth(0.75)
    pdf.roundRect(x, top - height, width, height, radius, stroke=1, fill=1)


def label(pdf, value, x, y, color=MUTED, size=8.5):
    pdf.setFont(FONT_SANS, size)
    pdf.setFillColor(color)
    pdf.drawString(x, y, value)


def heading(pdf, value, x, y, size=18, color=NAVY, font=FONT_SANS):
    pdf.setFillColor(color)
    pdf.setFont(font, size)
    pdf.drawString(x, y, value)


def page_header(pdf, section, title, number):
    label(pdf, "HitoriBIZ ORCHESTRA TOOLS  /  WIND BRASS TUNER", MARGIN, HEIGHT - 36, ROSE, 8)
    pdf.setStrokeColor(LINE)
    pdf.line(MARGIN, HEIGHT - 47, WIDTH - MARGIN, HEIGHT - 47)
    label(pdf, section.upper(), MARGIN, HEIGHT - 82, MUTED, 9)
    heading(pdf, title, MARGIN, HEIGHT - 117, 23)
    pdf.setStrokeColor(LINE)
    pdf.line(MARGIN, 45, WIDTH - MARGIN, 45)
    label(pdf, "hitori-biz.com/wind-brass-tuner", MARGIN, 28, MUTED, 8)
    label(pdf, f"{number} / 5", WIDTH - MARGIN - 27, 28, MUTED, 8)


def draw_qr(pdf, x, y, size):
    qr = QrCodeWidget(APP_URL)
    x1, y1, x2, y2 = qr.getBounds()
    scale = size / max(x2 - x1, y2 - y1)
    drawing = Drawing(size, size, transform=[scale, 0, 0, scale, -x1 * scale, -y1 * scale])
    drawing.add(qr)
    renderPDF.draw(drawing, pdf, x, y)


def draw_cover(pdf):
    pdf.setFillColor(NAVY)
    pdf.rect(0, HEIGHT - 458, WIDTH, 458, fill=1, stroke=0)
    pdf.setFillColor(colors.HexColor("#1F2937"))
    pdf.circle(WIDTH + 45, HEIGHT - 30, 248, stroke=0, fill=1)
    pdf.setFillColor(ROSE)
    pdf.circle(MARGIN + 35, HEIGHT - 92, 34, stroke=0, fill=1)
    pdf.setStrokeColor(NAVY)
    pdf.setLineWidth(2.6)
    pdf.line(MARGIN + 12, HEIGHT - 92, MARGIN + 30, HEIGHT - 92)
    pdf.line(MARGIN + 30, HEIGHT - 92, MARGIN + 51, HEIGHT - 102)
    pdf.line(MARGIN + 30, HEIGHT - 92, MARGIN + 51, HEIGHT - 82)
    pdf.line(MARGIN + 51, HEIGHT - 102, MARGIN + 51, HEIGHT - 82)
    pdf.line(MARGIN + 23, HEIGHT - 91, MARGIN + 23, HEIGHT - 78)
    pdf.line(MARGIN + 30, HEIGHT - 91, MARGIN + 30, HEIGHT - 76)

    label(pdf, "HitoriBIZ Orchestra Tools", MARGIN, HEIGHT - 164, CYAN, 11)
    heading(pdf, "Wind Brass Tuner", MARGIN, HEIGHT - 218, 31, WHITE, FONT_SERIF)
    paragraph(pdf, "管楽器・金管楽器のための移調対応チューナー", MARGIN, HEIGHT - 243,
              CONTENT_WIDTH, 16, 24, WHITE)
    paragraph(pdf, "A transposition-aware tuner for wind and brass players", MARGIN,
              HEIGHT - 282, CONTENT_WIDTH, 11.5, 19, colors.HexColor("#CBD5E1"))
    paragraph(pdf, "Written Pitch と Concert Pitch を見ながら、練習前の調音やロングトーンに。",
              MARGIN, HEIGHT - 340, CONTENT_WIDTH - 35, 11, 20, WHITE)
    label(pdf, "USER GUIDE  /  使い方説明書", MARGIN, HEIGHT - 419, CYAN, 9)

    rounded_box(pdf, MARGIN, HEIGHT - 486, CONTENT_WIDTH, 196, CYAN_LIGHT,
                colors.HexColor("#A5F3FC"), 16)
    heading(pdf, "アプリを開く / Open the app", MARGIN + 24, HEIGHT - 521, 15)
    label(pdf, APP_URL, MARGIN + 24, HEIGHT - 547, NAVY, 9.3)
    pdf.linkURL(APP_URL, (MARGIN + 20, HEIGHT - 558, MARGIN + 340, HEIGHT - 532),
                relative=0)
    paragraph(pdf, "スマートフォンでQRコードを読み取るか、URLを開いてください。インストールは不要です。",
              MARGIN + 24, HEIGHT - 570, 290, 10, 17, SLATE)
    paragraph(pdf, "Scan the QR code or open the URL in your browser.", MARGIN + 24,
              HEIGHT - 625, 290, 9, 15, SLATE)
    draw_qr(pdf, WIDTH - MARGIN - 152, HEIGHT - 657, 128)
    label(pdf, "Concert  /  B♭  /  E♭  /  F", MARGIN + 24, HEIGHT - 657, ROSE, 11)

    label(pdf, "HitoriBIZ by Olive Co., Ltd.  |  2026.09", MARGIN, 42, MUTED, 8.5)
    pdf.showPage()


def step_card(pdf, top, number, title, body, height=74):
    rounded_box(pdf, MARGIN, top, CONTENT_WIDTH, height, WHITE, LINE, 11)
    pdf.setFillColor(ROSE_LIGHT)
    pdf.setStrokeColor(ROSE)
    pdf.circle(MARGIN + 26, top - 27, 13, stroke=1, fill=1)
    heading(pdf, str(number), MARGIN + 22, top - 31, 10, NAVY)
    heading(pdf, title, MARGIN + 48, top - 25, 12.5)
    paragraph(pdf, body, MARGIN + 48, top - 35, CONTENT_WIDTH - 69, 9.5, 15)


def draw_japanese_steps(pdf):
    page_header(pdf, "01  はじめに", "基本操作 / はじめて使うとき", 2)
    steps = [
        ("アプリを開く", APP_URL),
        ("楽器タイプを選ぶ", "Concert Pitch、B♭、E♭、F Instrument から、楽器に合うものを選びます。"),
        ("Target Note / 記譜音を選ぶ", "吹く予定の楽譜上の音を選びます。A4、B♭4、C5、D5、E♭5、F5、G5 に対応します。"),
        ("A4 Reference を設定する", "440〜444 Hz から選べます。初期値は 442 Hz です。"),
        ("Start Tuning を押す", "ブラウザにマイク使用を求められたら許可します。画面が Listening に変わります。"),
        ("音を伸ばして確認する", "Detected Note、cents、Frequency を見ながら調整します。終わったら Stop Tuning を押します。"),
    ]
    top = HEIGHT - 146
    for index, (title, body) in enumerate(steps, 1):
        step_card(pdf, top, index, title, body)
        top -= 83
    rounded_box(pdf, MARGIN, top + 2, CONTENT_WIDTH, 85, ROSE_LIGHT,
                colors.HexColor("#FDA4AF"), 11)
    heading(pdf, "判定の見方", MARGIN + 16, top - 22, 12)
    paragraph(pdf, "In Tune: 目標の ±5 cents 以内。Sharp: 高い。Flat: 低い。数値だけでなく耳でも確認してください。",
              MARGIN + 16, top - 31, CONTENT_WIDTH - 32, 10, 17)
    pdf.showPage()


def draw_transposition(pdf):
    page_header(pdf, "02  移調と基準音", "記譜音と実音を理解する", 3)
    rounded_box(pdf, MARGIN, HEIGHT - 145, CONTENT_WIDTH, 106, CYAN_LIGHT,
                colors.HexColor("#A5F3FC"), 12)
    heading(pdf, "Written Pitch / 記譜音", MARGIN + 16, HEIGHT - 174, 12)
    paragraph(pdf, "楽譜に書かれ、奏者が指使いとして考える音です。", MARGIN + 16,
              HEIGHT - 183, CONTENT_WIDTH - 32, 9.5, 15)
    heading(pdf, "Concert Pitch / 実音", MARGIN + 16, HEIGHT - 218, 12)
    paragraph(pdf, "実際に鳴っている音です。画面の Target Concert Pitch に表示されます。",
              MARGIN + 16, HEIGHT - 227, CONTENT_WIDTH - 32, 9.5, 15)

    heading(pdf, "記譜 C5 を選んだ場合", MARGIN, HEIGHT - 282, 15)
    table_top = HEIGHT - 299
    row_h = 43
    pdf.setFillColor(NAVY)
    pdf.roundRect(MARGIN, table_top - 33, CONTENT_WIDTH, 33, 7, stroke=0, fill=1)
    label(pdf, "楽器タイプ", MARGIN + 14, table_top - 22, WHITE, 9)
    label(pdf, "鳴る実音", MARGIN + 322, table_top - 22, WHITE, 9)
    modes = [
        ("Concert Pitch", "C5"),
        ("B♭ Instrument", "B♭4"),
        ("E♭ Instrument", "E♭4"),
        ("F Instrument", "F4"),
    ]
    for i, (mode, sounding) in enumerate(modes):
        top = table_top - 34 - i * row_h
        pdf.setFillColor(WHITE if i % 2 else colors.HexColor("#F8FAFC"))
        pdf.rect(MARGIN, top - row_h, CONTENT_WIDTH, row_h, stroke=0, fill=1)
        label(pdf, mode, MARGIN + 14, top - 27, NAVY, 10)
        label(pdf, sounding, MARGIN + 329, top - 27, NAVY, 10)
        pdf.setStrokeColor(LINE)
        pdf.line(MARGIN, top - row_h, WIDTH - MARGIN, top - row_h)

    ref_top = HEIGHT - 535
    rounded_box(pdf, MARGIN, ref_top, CONTENT_WIDTH, 119, ROSE_LIGHT,
                colors.HexColor("#FDA4AF"), 12)
    heading(pdf, "Reference Tone / 基準音", MARGIN + 16, ref_top - 28, 13)
    paragraph(pdf, "選んだ実音を鳴らします。Reference Tone Start で再生、Stop で停止します。再生中は端末の音をマイクが拾わないよう、測定が自動停止します。",
              MARGIN + 16, ref_top - 37, CONTENT_WIDTH - 32, 10, 17)
    paragraph(pdf, "Start Tuning を押すと基準音は止まり、マイク測定に切り替わります。",
              MARGIN + 16, ref_top - 88, CONTENT_WIDTH - 32, 9.3, 16)
    label(pdf, "A4 Reference: 440 / 441 / 442 / 443 / 444 Hz  (default 442 Hz)",
          MARGIN, 110, SLATE, 9.5)
    pdf.showPage()


def draw_help(pdf):
    page_header(pdf, "03  スマートフォンとトラブル対応", "練習を始める前に", 4)
    rounded_box(pdf, MARGIN, HEIGHT - 144, CONTENT_WIDTH, 100, CYAN_LIGHT,
                colors.HexColor("#A5F3FC"), 12)
    heading(pdf, "ホーム画面に追加する", MARGIN + 16, HEIGHT - 174, 13)
    paragraph(pdf, "iPhone: Safari の共有ボタン →「ホーム画面に追加」。Android: Chrome のメニュー →「ホーム画面に追加」または「アプリをインストール」。",
              MARGIN + 16, HEIGHT - 184, CONTENT_WIDTH - 32, 10, 17)
    heading(pdf, "困ったとき", MARGIN, HEIGHT - 274, 15)
    issues = [
        ("マイクが使えない", "HTTPSのURLで開き、端末・ブラウザのマイク設定を確認してください。"),
        ("音を検出しない", "Start Tuning を押したか確認し、マイクをふさがず、楽器を少し近づけてください。"),
        ("表示が揺れる", "周囲の雑音を減らし、音の出始めではなくロングトーンが安定してから見てください。"),
        ("基準音が聞こえない", "端末の音量や消音設定を確認し、Reference Tone Start を押し直してください。"),
    ]
    top = HEIGHT - 294
    for title, body in issues:
        rounded_box(pdf, MARGIN, top, CONTENT_WIDTH, 76, WHITE, LINE, 11)
        heading(pdf, title, MARGIN + 15, top - 25, 11.5)
        paragraph(pdf, body, MARGIN + 15, top - 34, CONTENT_WIDTH - 30, 9.3, 15)
        top -= 85
    rounded_box(pdf, MARGIN, top - 3, CONTENT_WIDTH, 92, ROSE_LIGHT,
                colors.HexColor("#FDA4AF"), 11)
    heading(pdf, "練習のコツ", MARGIN + 15, top - 31, 12)
    paragraph(pdf, "チューナーの表示は練習の補助です。最後は耳で確認し、合奏では周囲の音にも合わせてください。",
              MARGIN + 15, top - 42, CONTENT_WIDTH - 30, 9.5, 16)
    pdf.showPage()


def draw_english(pdf):
    page_header(pdf, "04  English quick guide", "Wind & Brass Tuner", 5)
    paragraph(pdf, "A browser-based tuner for wind and brass players. It shows the written note alongside the concert (sounding) pitch.",
              MARGIN, HEIGHT - 143, CONTENT_WIDTH, 10.5, 18)
    heading(pdf, "Quick start", MARGIN, HEIGHT - 207, 15)
    steps = [
        "Open hitori-biz.com/wind-brass-tuner.",
        "Choose Concert, B♭, E♭ or F Instrument.",
        "Select the Target Note as written in your part.",
        "Set A4 Reference (440-444 Hz; default 442 Hz).",
        "Tap Start Tuning and allow microphone access.",
        "Play a steady note. Read Detected Note, cents and Frequency; tap Stop Tuning when done.",
    ]
    top = HEIGHT - 225
    for i, step in enumerate(steps, 1):
        rounded_box(pdf, MARGIN, top, CONTENT_WIDTH, 43, WHITE, LINE, 8)
        label(pdf, f"{i:02}", MARGIN + 13, top - 28, ROSE, 11)
        paragraph(pdf, step, MARGIN + 46, top - 12, CONTENT_WIDTH - 60, 9.5, 16)
        top -= 49
    heading(pdf, "Transposition examples (written C5)", MARGIN, top - 14, 13.5)
    top -= 30
    for mode, sounding in [
        ("Concert Pitch", "C5"), ("B♭ Instrument", "B♭4"),
        ("E♭ Instrument", "E♭4"), ("F Instrument", "F4"),
    ]:
        label(pdf, mode, MARGIN + 10, top - 16, NAVY, 10)
        label(pdf, "→  " + sounding, MARGIN + 315, top - 16, NAVY, 10)
        pdf.setStrokeColor(LINE)
        pdf.line(MARGIN, top - 25, WIDTH - MARGIN, top - 25)
        top -= 28
    rounded_box(pdf, MARGIN, top - 13, CONTENT_WIDTH, 84, CYAN_LIGHT,
                colors.HexColor("#A5F3FC"), 11)
    paragraph(pdf, "In Tune means within ±5 cents of the target. Sharp is high; Flat is low. Reference Tone plays the selected concert pitch and pauses microphone measurement.",
              MARGIN + 15, top - 29, CONTENT_WIDTH - 30, 9.5, 16)
    label(pdf, "Support: hitori-biz.com/wind-brass-tuner/support", MARGIN, 63, MUTED, 8.5)
    pdf.linkURL(SUPPORT_URL, (MARGIN, 58, MARGIN + 330, 80), relative=0)
    pdf.showPage()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    pdf.setTitle("Wind Brass Tuner - User Guide / 使い方説明書")
    pdf.setAuthor("HitoriBIZ by Olive Co., Ltd.")
    pdf.setSubject("Bilingual guide for Wind Brass Tuner")
    draw_cover(pdf)
    draw_japanese_steps(pdf)
    draw_transposition(pdf)
    draw_help(pdf)
    draw_english(pdf)
    pdf.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
