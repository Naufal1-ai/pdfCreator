import zipfile
import os

os.makedirs('test_files', exist_ok=True)

# 1. Create sample_word.docx
def create_docx(filepath):
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>'''

    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''

    document = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>Halo! Ini adalah dokumen Word (.docx) untuk pengujian konversi WordToPDF Converter.</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>'''

    with zipfile.ZipFile(filepath, 'w') as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('word/document.xml', document)

# 2. Create sample_excel.xlsx
def create_xlsx(filepath):
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>'''

    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''

    wb = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>'''

    wb_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>'''

    sheet = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    <row r="1">
      <c r="A1" t="inlineStr"><is><t>Kolom Produk</t></is></c>
      <c r="B1" t="inlineStr"><is><t>Jumlah Penjualan</t></is></c>
    </row>
    <row r="2">
      <c r="A2" t="inlineStr"><is><t>Lisensi Software</t></is></c>
      <c r="B2" t="inlineStr"><is><t>1500</t></is></c>
    </row>
  </sheetData>
</worksheet>'''

    with zipfile.ZipFile(filepath, 'w') as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('xl/workbook.xml', wb)
        z.writestr('xl/_rels/workbook.xml.rels', wb_rels)
        z.writestr('xl/worksheets/sheet1.xml', sheet)

# 3. Create sample_text.txt
def create_txt(filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('Ini adalah berkas teks (TXT) untuk verifikasi konversi dokumen ke format PDF.')

# 4. Create sample_data.csv
def create_csv(filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('ID,Nama,Departemen,Gaji\n1,Budi Santoso,IT,12000000\n2,Siti Rahma,Keuangan,11500000\n3,Ahmad Yani,Operasional,9500000')

if __name__ == '__main__':
    create_docx('test_files/sample_word.docx')
    create_xlsx('test_files/sample_excel.xlsx')
    create_txt('test_files/sample_text.txt')
    create_csv('test_files/sample_data.csv')
    print('Semua file sampel berhasil dibuat di folder test_files/')
