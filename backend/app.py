from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
from pdf2docx import Converter
from docx2pdf import convert
from fpdf import FPDF
from PyPDF2 import PdfReader, PdfMerger, PdfWriter
from PyPDF2.errors import WrongPasswordError
import io
import tempfile
import os       # <-- IMPORT 'os' TO READ ENVIRONMENT VARIABLES
import requests 

app = Flask(__name__)
CORS(app)

# --- All Existing Routes (Minimized for Brevity) ---
@app.route('/api/convert', methods=['POST'])
def convert_jpeg_to_pdf():
    # ... (existing code, no change) ...
    try:
        if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '': return jsonify({'error': 'No selected file'}), 400
        if file and (file.filename.lower().endswith('.jpg') or file.filename.lower().endswith('.jpeg')):
            image = Image.open(file.stream);
            if image.mode == 'RGBA': image = image.convert('RGB')
            pdf_buffer = io.BytesIO(); image.save(pdf_buffer, format='PDF'); pdf_buffer.seek(0)
            return send_file(pdf_buffer, as_attachment=True, download_name='converted.pdf', mimetype='application/pdf')
        else: return jsonify({'error': 'Invalid file type. Please upload a JPEG.'}), 400
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/jpg-to-png', methods=['POST'])
def convert_jpg_to_png():
    # ... (existing code, no change) ...
    try:
        if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '': return jsonify({'error': 'No selected file'}), 400
        if file and (file.filename.lower().endswith('.jpg') or file.filename.lower().endswith('.jpeg')):
            image = Image.open(file.stream); png_buffer = io.BytesIO(); image.save(png_buffer, format='PNG'); png_buffer.seek(0)
            return send_file(png_buffer, as_attachment=True, download_name='converted.png', mimetype='image/png')
        else: return jsonify({'error': 'Invalid file type. Please upload a JPEG.'}), 400
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/png-to-jpg', methods=['POST'])
def convert_png_to_jpg():
    # ... (existing code, no change) ...
    try:
        if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '': return jsonify({'error': 'No selected file'}), 400
        if file and file.filename.lower().endswith('.png'):
            image = Image.open(file.stream);
            if image.mode == 'RGBA': image = image.convert('RGB')
            jpg_buffer = io.BytesIO(); image.save(jpg_buffer, format='JPEG'); jpg_buffer.seek(0)
            return send_file(jpg_buffer, as_attachment=True, download_name='converted.jpg', mimetype='image/jpeg')
        else: return jsonify({'error': 'Invalid file type. Please upload a PNG.'}), 400
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/resize-image', methods=['POST'])
def resize_image():
    # ... (existing code, no change) ...
    try:
        if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
        file = request.files['file'];
        if 'width' not in request.form or 'height' not in request.form: return jsonify({'error': 'Missing width or height'}), 400
        try: width = int(request.form['width']); height = int(request.form['height'])
        except ValueError: return jsonify({'error': 'Width and height must be integers'}), 400
        if width <= 0 or height <= 0: return jsonify({'error': 'Width and height must be positive numbers'}), 400
        filename = file.filename.lower()
        if not (filename.endswith('.png') or filename.endswith('.jpg') or filename.endswith('.jpeg')): return jsonify({'error': 'Invalid file type.'}), 400
        image = Image.open(file.stream); resized_image = image.resize((width, height), Image.Resampling.LANCZOS)
        output_buffer = io.BytesIO(); format = 'PNG' if filename.endswith('.png') else 'JPEG'
        resized_image.save(output_buffer, format=format); output_buffer.seek(0)
        new_filename = f"resized_{width}x{height}.{format.lower()}"; mimetype = f"image/{format.lower()}"
        return send_file(output_buffer, as_attachment=True, download_name=new_filename, mimetype=mimetype)
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/compress-image', methods=['POST'])
def compress_image():
    # ... (existing code, no change) ...
    try:
        if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if 'quality' not in request.form: return jsonify({'error': 'Missing quality setting'}), 400
        try:
            quality = int(request.form['quality'])
            if not 1 <= quality <= 100: raise ValueError
        except ValueError: return jsonify({'error': 'Quality must be an integer between 1 and 100'}), 400
        filename = file.filename.lower()
        if not (filename.endswith('.png') or filename.endswith('.jpg') or filename.endswith('.jpeg')): return jsonify({'error': 'Invalid file type.'}), 400
        image = Image.open(file.stream); output_buffer = io.BytesIO()
        if filename.endswith('.png'):
            image.save(output_buffer, format='PNG', optimize=True); new_filename = 'compressed.png'; mimetype = 'image/png'
        else:
            if image.mode == 'RGBA': image = image.convert('RGB')
            image.save(output_buffer, format='JPEG', quality=quality); new_filename = f"compressed_q{quality}.jpg"; mimetype = 'image/jpeg'
        output_buffer.seek(0)
        return send_file(output_buffer, as_attachment=True, download_name=new_filename, mimetype=mimetype)
    except Exception as e: return jsonify({'error': str(e)}), 500

# --- CHANGE 1: PDF-to-Word Route (Disabled) ---
@app.route('/api/pdf-to-word', methods=['POST'])
def pdf_to_word():
    # This route is disabled on free hosting as it requires Microsoft Word
    # 503 means "Service Unavailable"
    return jsonify({'error': 'This feature (PDF to Word) is unavailable on this server due to external software requirements.'}), 503

# --- CHANGE 2: Word-to-PDF Route (Disabled) ---
@app.route('/api/word-to-pdf', methods=['POST'])
def word_to_pdf():
    # This route is disabled on free hosting as it requires Microsoft Word
    return jsonify({'error': 'This feature (Word to PDF) is unavailable on this server due to external software requirements.'}), 503

@app.route('/api/text-to-pdf', methods=['POST'])
def text_to_pdf():
    # ... (existing code, no change) ...
    if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '': return jsonify({'error': 'No selected file'}), 400
    if not file.filename.lower().endswith('.txt'):
        return jsonify({'error': 'Invalid file type. Please upload a .txt file.'}), 400
    try:
        text_content = file.stream.read().decode('utf-8')
        pdf = FPDF(); pdf.add_page(); pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, txt=text_content)
        pdf_bytes = pdf.output()
        pdf_stream = io.BytesIO(pdf_bytes); pdf_stream.seek(0)
        return send_file(pdf_stream, as_attachment=True, download_name='converted.pdf', mimetype='application/pdf')
    except UnicodeDecodeError: return jsonify({'error': 'File encoding is not valid UTF-8.'}), 400
    except Exception as e: return jsonify({'error': f"Conversion failed: {str(e)}"}), 500

@app.route('/api/pdf-to-text', methods=['POST'])
def pdf_to_text():
    # ... (existing code, no change) ...
    if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '': return jsonify({'error': 'No selected file'}), 400
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Please upload a .pdf file.'}), 400
    try:
        pdf_reader = PdfReader(file.stream); full_text = ""
        for page in pdf_reader.pages:
            full_text += page.extract_text() + "\n"
        text_bytes = full_text.encode('utf-8')
        text_stream = io.BytesIO(text_bytes); text_stream.seek(0)
        return send_file(text_stream, as_attachment=True, download_name='converted.txt', mimetype='text/plain')
    except Exception as e:
        return jsonify({'error': f"Conversion failed: {str(e)}"}), 500

@app.route('/api/merge-pdfs', methods=['POST'])
def merge_pdfs():
    # ... (existing code, no change) ...
    files = request.files.getlist('files')
    if not files: return jsonify({'error': 'No files part'}), 400
    if len(files) < 2: return jsonify({'error': 'Please select at least 2 files to merge.'}), 400
    for file in files:
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': f"Invalid file type: {file.filename}. All files must be PDFs."}), 400
    try:
        merger = PdfMerger()
        for file in files:
            merger.append(file.stream)
        output_stream = io.BytesIO(); merger.write(output_stream); merger.close(); output_stream.seek(0)
        return send_file(output_stream, as_attachment=True, download_name='merged.pdf', mimetype='application/pdf')
    except Exception as e:
        return jsonify({'error': f"Merge failed: {str(e)}"}), 500

@app.route('/api/split-pdf', methods=['POST'])
def split_pdf():
    # ... (existing code, no change) ...
    if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if 'startPage' not in request.form or 'endPage' not in request.form:
        return jsonify({'error': 'Missing start or end page numbers'}), 400
    try:
        start_page = int(request.form['startPage'])
        end_page = int(request.form['endPage'])
    except ValueError: return jsonify({'error': 'Page numbers must be integers'}), 400
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Please upload a .pdf file.'}), 400
    try:
        reader = PdfReader(file.stream); writer = PdfWriter()
        total_pages = len(reader.pages)
        if start_page < 1 or end_page < start_page or end_page > total_pages:
            return jsonify({'error': f"Invalid page range. Must be between 1 and {total_pages}."}), 400
        for i in range(start_page - 1, end_page):
            writer.add_page(reader.pages[i])
        output_stream = io.BytesIO(); writer.write(output_stream); writer.close(); output_stream.seek(0)
        new_filename = f"split_pages_{start_page}_to_{end_page}.pdf"
        return send_file(output_stream, as_attachment=True, download_name=new_filename, mimetype='application/pdf')
    except Exception as e:
        return jsonify({'error': f"Split failed: {str(e)}"}), 500

@app.route('/api/protect-pdf', methods=['POST'])
def protect_pdf():
    # ... (existing code, no change) ...
    if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if 'password' not in request.form: return jsonify({'error': 'Missing password'}), 400
    password = request.form['password']
    if not password: return jsonify({'error': 'Password cannot be empty'}), 400
    if not file.filename.lower().endswith('.pdf'): return jsonify({'error': 'Invalid file type.'}), 400
    try:
        reader = PdfReader(file.stream); writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        writer.encrypt(password)
        output_stream = io.BytesIO(); writer.write(output_stream); writer.close(); output_stream.seek(0)
        return send_file(output_stream, as_attachment=True, download_name='protected.pdf', mimetype='application/pdf')
    except Exception as e:
        return jsonify({'error': f"Protection failed: {str(e)}"}), 500
        
@app.route('/api/unlock-pdf', methods=['POST'])
def unlock_pdf():
    # ... (existing code, no change) ...
    if 'file' not in request.files: return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if 'password' not in request.form: return jsonify({'error': 'Missing password'}), 400
    password = request.form['password']
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Please upload a .pdf file.'}), 400
    try:
        reader = PdfReader(file.stream)
        if not reader.is_encrypted:
            return jsonify({'error': 'File is not encrypted.'}), 400
        if reader.decrypt(password):
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
            output_stream = io.BytesIO(); writer.write(output_stream); writer.close(); output_stream.seek(0)
            return send_file(output_stream, as_attachment=True, download_name='unlocked.pdf', mimetype='application/pdf')
        else:
            return jsonify({'error': 'Incorrect password.'}), 400
    except WrongPasswordError:
        return jsonify({'error': 'Incorrect password.'}), 400
    except Exception as e:
        return jsonify({'error': f"Unlock failed: {str(e)}"}), 500

@app.route('/api/summarize-pdf', methods=['POST'])
def summarize_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Please upload a .pdf file.'}), 400
    
    try:
        reader = PdfReader(file.stream)
        
        if reader.is_encrypted:
            return jsonify({'error': 'Cannot summarize an encrypted PDF. Please unlock it first.'}), 400
            
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() + "\n"
        
        if not full_text.strip():
            return jsonify({'error': 'Could not extract text. The PDF might be an image (scan).'}), 400

        # --- CHANGE 3: Read API key from Environment Variable ---
        # This securely reads the key we will set in Render's dashboard.
        api_key = os.environ.get('GEMINI_API_KEY')
        
        
        if not api_key:
             # This error will show if we forget to set the key in Render
             return jsonify({'error': 'API key is missing on the server.'}), 500
        
        # --- END OF CHANGE ---

        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={api_key}"
        
        system_prompt = "You are an expert summarizer. Provide a concise, helpful summary of the following document. Start with a 1-2 sentence overview, followed by key bullet points."
        user_query = f"Please summarize this document:\n\n{full_text}"
        
        if len(user_query) > 30000:
            user_query = user_query[:30000] + "... (content truncated)"

        payload = {
            "contents": [{
                "parts": [{"text": user_query}]
            }],
            "systemInstruction": {
                "parts": [{"text": system_prompt}]
            }
        }
        
        headers = {'Content-Type': 'application/json'}
        
        api_response = requests.post(api_url, json=payload, headers=headers)
        
        if api_response.status_code != 200:
            return jsonify({'error': f"AI API Error: {api_response.text}"}), 500
        
        result = api_response.json()
        
        if 'candidates' not in result or not result['candidates']:
             return jsonify({'error': 'AI model returned an empty response.'}), 500
             
        summary = result['candidates'][0]['content']['parts'][0]['text']
        
        return jsonify({'summary': summary})

    except Exception as e:
        return jsonify({'error': f"Summarization failed: {str(e)}"}), 500

# --- CHANGE 4: Remove the 'app.run()' block ---
# We delete this entire block:
#
# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
#
# Our production server (gunicorn) will start the 'app' object directly.