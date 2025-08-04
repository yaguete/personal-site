from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
from PIL import Image
import io
import fitz  # PyMuPDF
import os
import base64
from dotenv import load_dotenv
import openai

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite CORS para todas las rutas

@app.route("/")
def root():
    return {"message": "Preprint Audit API is running"}

@app.route("/python")
def hello_world():
    return {"message": "Hello World"}

@app.route("/analyze-pdf", methods=['POST'])
@app.route("/preprint-audit/analyze-pdf", methods=['POST'])
def analyze_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No se ha enviado ningún archivo"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No se ha seleccionado ningún archivo"}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "El archivo debe ser un PDF"}), 400

    try:
        # Leer el archivo en bytes para usarlo con ambas librerías
        file_bytes = file.read()
        
        # Procesar con PyPDF2
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        
        # Procesar con PyMuPDF (fitz) para obtener DPI
        doc_fitz = fitz.open(stream=file_bytes, filetype="pdf")
        
        # Inicializar el resumen
        summary = {
            "total_pages": len(pdf_reader.pages),
            "has_images": False,
            "total_images": 0,
            "total_fonts": 0,
            "embedded_fonts": 0,
            "fonts": [],
            "pages_without_trim_marks": 0,
            "pages_without_fold_marks": 0,
            "pages_without_bleed": 0,
            "has_text": False
        }
        
        # Lista para almacenar información de las páginas
        pages = []
        
        # Set para almacenar fuentes únicas
        unique_fonts = set()
        
        # Recorrer cada página
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            page_info = {
                "page_number": page_num + 1,
                "has_images": False,
                "images": [],
                "has_trim_marks": False,
                "has_fold_marks": False,
                "has_bleed": False,
                "has_rasterized_text": False,
                "fonts": []
            }
            
            # Obtener dimensiones de la página (MediaBox) en milímetros
            if '/MediaBox' in page:
                media_box = page['/MediaBox']
                media_box_mm = [round(float(x) * 0.352777778, 2) for x in media_box]
                page_info["dimensions"] = {
                    "width": media_box_mm[2] - media_box_mm[0],
                    "height": media_box_mm[3] - media_box_mm[1]
                }
            
            # Verificar trim box
            if '/TrimBox' in page:
                trim_box = page['/TrimBox']
                print(f"Página {page_num + 1} - TrimBox encontrado: {trim_box}")
                page_info["has_trim_marks"] = True
            
            # Verificar bleed box
            if '/BleedBox' in page:
                bleed_box = page['/BleedBox']
                print(f"Página {page_num + 1} - BleedBox encontrado: {bleed_box}")
                bleed_box = [float(x) for x in bleed_box]
                media_box = [float(x) for x in page['/MediaBox']]
                if (bleed_box[0] < media_box[0] or
                    bleed_box[1] < media_box[1] or
                    bleed_box[2] > media_box[2] or
                    bleed_box[3] > media_box[3]):
                    page_info["has_bleed"] = True
                    page_info["bleed_margins"] = {
                        "left": round((media_box[0] - bleed_box[0]) * 0.352777778, 2),
                        "right": round((bleed_box[2] - media_box[2]) * 0.352777778, 2),
                        "top": round((bleed_box[3] - media_box[3]) * 0.352777778, 2),
                        "bottom": round((media_box[1] - bleed_box[1]) * 0.352777778, 2)
                    }
            
            # Verificar marcas de plegado (usando ArtBox y TrimBox)
            if '/ArtBox' in page and '/TrimBox' in page:
                art_box = [float(x) for x in page['/ArtBox']]
                trim_box = [float(x) for x in page['/TrimBox']]
                if (abs(art_box[0] - trim_box[0]) > 0.1 or
                    abs(art_box[1] - trim_box[1]) > 0.1 or
                    abs(art_box[2] - trim_box[2]) > 0.1 or
                    abs(art_box[3] - trim_box[3]) > 0.1):
                    page_info["has_fold_marks"] = True
            
            # --- Extraer imágenes con PyMuPDF (todo en uno) ---
            page_fitz = doc_fitz[page_num]
            images_fitz = page_fitz.get_images(full=True)
            
            for img in images_fitz:
                xref = img[0]
                try:
                    base_image = doc_fitz.extract_image(xref)
                    
                    # Información básica de la imagen
                    width_px = base_image["width"]
                    height_px = base_image["height"]
                    
                    # Información de color y compresión
                    color_space = base_image.get("colorspace", "Unknown")
                    is_compressed = base_image.get("ext", "") != ""
                    compression_type = base_image.get("ext", None)
                    
                    # Determinar modo de color
                    color_mode = 'Unknown'
                    if isinstance(color_space, str):
                        color_mode = color_space.replace('Device', '')
                    elif isinstance(color_space, list):
                        if color_space[0] == '/ICCBased':
                            color_mode = 'ICC'
                        elif color_space[0] == '/Indexed':
                            color_mode = 'Indexed'
                        elif color_space[0] == '/Separation':
                            color_mode = 'Spot'
                        elif color_space[0] == '/DeviceN':
                            color_mode = 'DeviceN'
                    
                    # Calcular DPI
                    dpi_info = []
                    rects = page_fitz.get_image_rects(xref)
                    
                    for rect in rects:
                        # Tamaño en puntos (1 pulgada = 72 puntos)
                        width_pt = rect.width
                        height_pt = rect.height
                        width_in = width_pt / 72 if width_pt else 0
                        height_in = height_pt / 72 if height_pt else 0
                        dpi_x = width_px / width_in if width_in > 0 else 0
                        dpi_y = height_px / height_in if height_in > 0 else 0
                        dpi_avg = (dpi_x + dpi_y) / 2
                        dpi_info.append({
                            "dpi_x": round(dpi_x, 2),
                            "dpi_y": round(dpi_y, 2),
                            "dpi_avg": round(dpi_avg, 2)
                        })
                    
                    # Extraer los datos de la imagen como base64
                    image_data = base_image["image"]
                    image_base64 = base64.b64encode(image_data).decode('utf-8')
                    
                    image_info = {
                        "color_mode": color_mode,
                        "color_space": str(color_space),
                        "height_px": height_px,
                        "width_px": width_px,
                        "dpi_info": dpi_info,  # SIEMPRE lista
                        "spot_colors": [],
                        "is_compressed": is_compressed,
                        "compression_type": compression_type,
                        "image_data": image_base64,  # Datos de la imagen en base64
                        "image_ext": base_image.get("ext", "png")  # Extensión de la imagen
                    }
                    
                    page_info["images"].append(image_info)
                    page_info["has_images"] = True
                    summary["has_images"] = True
                    summary["total_images"] += 1
                    
                except Exception as e:
                    # Si no se puede extraer la imagen, continuar con la siguiente
                    continue

            # Extraer fuentes usando PyMuPDF
            try:
                # Obtener el diccionario de texto de la página
                text_dict = page.get_text("dict")
                
                # Procesar bloques de texto
                for block in text_dict.get("blocks", []):
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            font_info = span.get("font", {})
                            
                            # Obtener información de la fuente
                            font_name = font_info.get("name", "Unknown")
                            font_type = font_info.get("type", "Unknown")
                            
                            # Determinar si está embebida
                            is_embedded = font_info.get("embedded", False)
                            
                            # Crear identificador único
                            font_id = f"{font_name}_{font_type}_{is_embedded}"
                            
                            if font_id not in unique_fonts:
                                unique_fonts.add(font_id)
                                summary["fonts"].append({
                                    "name": str(font_name),
                                    "type": str(font_type),
                                    "embedded": is_embedded
                                })
                                if is_embedded:
                                    summary["embedded_fonts"] += 1
                                page_info["fonts"].append({
                                    "name": str(font_name),
                                    "type": str(font_type),
                                    "embedded": is_embedded
                                })
            except Exception as e:
                print(f"Error al extraer fuentes con PyMuPDF en página {page_num + 1}: {str(e)}")
                # Mantener la extracción con PyPDF2 como fallback
                if '/Resources' in page and '/Font' in page['/Resources']:
                    fonts = page['/Resources']['/Font']
                    for font_name, font_obj in fonts.items():
                        if isinstance(font_obj, PyPDF2.generic.IndirectObject):
                            font_obj = font_obj.get_object()
                        font_type = font_obj.get('/Subtype', 'Unknown')
                        if isinstance(font_type, PyPDF2.generic.IndirectObject):
                            font_type = font_type.get_object()
                        
                        is_embedded = False
                        if '/FontDescriptor' in font_obj:
                            font_descriptor = font_obj['/FontDescriptor']
                            if isinstance(font_descriptor, PyPDF2.generic.IndirectObject):
                                font_descriptor = font_descriptor.get_object()
                            is_embedded = ('/FontFile' in font_descriptor or 
                                           '/FontFile2' in font_descriptor or 
                                           '/FontFile3' in font_descriptor)
                        
                        font_id = f"{font_name}_{font_type}_{is_embedded}"
                        
                        if font_id not in unique_fonts:
                            unique_fonts.add(font_id)
                            summary["fonts"].append({
                                "name": str(font_name),
                                "type": str(font_type),
                                "embedded": is_embedded
                            })
                            if is_embedded:
                                summary["embedded_fonts"] += 1
                            page_info["fonts"].append({
                                "name": str(font_name),
                                "type": str(font_type),
                                "embedded": is_embedded
                            })
            
            # Actualizar contadores de resumen
            if not page_info["has_trim_marks"]:
                summary["pages_without_trim_marks"] += 1
            if not page_info["has_fold_marks"]:
                summary["pages_without_fold_marks"] += 1
            if not page_info["has_bleed"]:
                summary["pages_without_bleed"] += 1
            
            pages.append(page_info)
        
        summary["total_fonts"] = len(summary["fonts"])
        
        # Crear el objeto de datos que vamos a enviar
        pdf_data = {
            "summary": summary,
            "pages": pages
        }
        
        # Analizar con el LLM
        llm_analysis = analyze_pdf_with_ai(pdf_data)
        
        # Devolver todo junto al frontend
        return jsonify({
            "summary": summary,
            "pages": pages,
            "llm_analysis": llm_analysis
        })
        
    except Exception as e:
        return jsonify({"error": f"Error al procesar el PDF: {str(e)}"}), 500

@app.route("/expert-analysis", methods=['POST'])
@app.route("/preprint-audit/expert-analysis", methods=['POST'])
def expert_analysis():
    """
    Genera un análisis experto del PDF usando OpenAI.
    """
    try:
        data = request.get_json()
        analysis_data = data.get('analysisData')
        selected_size = data.get('selectedSize')
        current_size = data.get('currentSize')
        language = data.get('language', 'en')
        
        if not analysis_data:
            return jsonify({"error": "No se proporcionaron datos de análisis"}), 400
        
        # Usar el tamaño actual del selector si está disponible
        target_size = current_size or selected_size or {"label": "Original", "width": None, "height": None}
        
        # Mapear códigos de idioma a nombres
        language_names = {
            'es': 'Spanish',
            'en': 'English',
            'ca': 'Catalan',
            'gl': 'Galician'
        }
        
        selected_language_name = language_names.get(language, 'Spanish')
        
        # Crear el prompt para OpenAI
        pages = analysis_data.get('pages', [])
        first_page_dimensions = pages[0].get('dimensions', {}) if pages else {}
        
        # Si el tamaño es "Original", usar las dimensiones reales del PDF
        if target_size.get('label') == 'Original' or not target_size.get('width'):
            display_width = first_page_dimensions.get('width', 'N/A')
            display_height = first_page_dimensions.get('height', 'N/A')
        else:
            display_width = target_size.get('width', 'N/A')
            display_height = target_size.get('height', 'N/A')
        
        prompt = f"""

IMPORTANT: You must respond in {selected_language_name.upper()}.

PDF INFORMATION:
- Total pages: {analysis_data.get('summary', {}).get('total_pages', 'N/A')}
- Selected size: {target_size.get('label', 'Original')}
- Dimensions: {display_width} x {display_height} mm

TECHNICAL ANALYSIS:
- Images: {analysis_data.get('summary', {}).get('total_images', 0)} images
- Embedded fonts: {analysis_data.get('summary', {}).get('embedded_fonts', 0)}
- Non-embedded fonts: {(analysis_data.get('summary', {}).get('total_fonts', 0) - analysis_data.get('summary', {}).get('embedded_fonts', 0))}
- Pages without trim marks: {analysis_data.get('summary', {}).get('pages_without_trim_marks', 0)}
- Pages without bleed: {analysis_data.get('summary', {}).get('pages_without_bleed', 0)}

IMAGES DETAILS:
{chr(10).join([chr(10).join([f"- Page {pageIndex + 1}: {image.get('width_px', 'N/A')}x{image.get('height_px', 'N/A')}px, DPI: {image.get('dpi_info', [{}])[0].get('dpi_avg', 'N/A') if image.get('dpi_info') else 'N/A'}, Color: {image.get('color_mode', 'N/A')}" for image in page.get('images', [])]) for pageIndex, page in enumerate(analysis_data.get('pages', []))]) or 'No images'}

FONTS DETAILS:
{chr(10).join([f"- {font.get('name', 'N/A')} ({font.get('type', 'N/A')}): {'Embedded' if font.get('embedded') else 'Non-embedded'}" for font in analysis_data.get('summary', {}).get('fonts', [])]) or 'No fonts'}

INSTRUCTIONS:
1. RESPOND ONLY IN {selected_language_name.upper()}
2. Identify the most critical issues first—those that could ruin the print or prevent it from being processed.
2. Give clear and straightforward explanations for each issue you find, using professional but accessible language.
3. Be specific with your recommendations: explain what you would do if you were the client.
4. Always mention the selected print size and warn if there's any mismatch with the document's size or proportions.
5. If you find images with low DPI, clearly explain what impact this will have (e.g., pixelation, lack of sharpness).
6. If there are non-embedded fonts, clarify the risks (fonts may change or be missing when printed).
7. If there are missing trim marks or bleed, briefly explain why these are important for a professional finish.
8. Structure your answer in clear sections and finish with a summary of key recommendations.
10.Do not offer further assistance or invite follow-up questions. Your analysis should be self-contained and final.

Formato tu respuesta de manera clara y estructurada EN {selected_language_name.upper()}."""

        # Configurar OpenAI
        client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert print technician with 20 years of experience in digital prepress. You spot issues that could ruin a print job in seconds and give clear, direct, and honest advice. Your style is professional but approachable—no unnecessary jargon, no sugarcoating. Always be helpful and point out anything that could affect the final result."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        
        analysis = completion.choices[0].message.content
        
        if not analysis:
            raise Exception('No se pudo generar el análisis')
        
        return jsonify({
            "success": True,
            "analysis": analysis
        })
        
    except Exception as e:
        print(f"Error en expert analysis: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Error al generar el análisis experto: {str(e)}"
        }), 500

def analyze_pdf_with_ai(pdf_data):
    """
    Analiza los datos del PDF usando un LLM para proporcionar recomendaciones de impresión.
    """
    try:
        # Por ahora, devolvemos un análisis básico sin OpenAI
        summary = pdf_data.get("summary", {})
        
        analysis = f"""
        ANÁLISIS DEL PDF:
        
        Páginas totales: {summary.get('total_pages', 0)}
        Imágenes encontradas: {summary.get('total_images', 0)}
        Fuentes totales: {summary.get('total_fonts', 0)}
        Fuentes embebidas: {summary.get('embedded_fonts', 0)}
        
        PROBLEMAS DETECTADOS:
        - Páginas sin marcas de corte: {summary.get('pages_without_trim_marks', 0)}
        - Páginas sin marcas de plegado: {summary.get('pages_without_fold_marks', 0)}
        - Páginas sin sangrado: {summary.get('pages_without_bleed', 0)}
        
        RECOMENDACIONES:
        - Asegúrate de que todas las páginas tengan marcas de corte apropiadas
        - Verifica que las imágenes tengan al menos 300 DPI para impresión
        - Considera embebir todas las fuentes para evitar problemas de impresión
        """
        
        return {
            "success": True,
            "analysis": analysis
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))  # Puerto diferente para evitar conflictos
    app.run(host='0.0.0.0', port=port, debug=True) 