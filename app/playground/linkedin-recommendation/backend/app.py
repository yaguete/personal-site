import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
import openai
from flask_cors import CORS
import traceback

# Configura tu app Flask
app = Flask(__name__, static_folder='static/', static_url_path='/')
CORS(app)  # Permitir solicitudes desde cualquier origen

# Carga las variables desde el archivo .env
load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')
modeloGPT = os.getenv('OPENAI_MODEL', 'gpt-4')
minCaracteres = 350
maxCaracteres = 800

def cargar_instrucciones(archivo):
    try:
        with open(archivo, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {archivo}")
        return ""

# Cargar los prompts desde la carpeta prompts
tone_instructions_flores = cargar_instrucciones('prompts/flores.txt')
tone_instructions_medio = cargar_instrucciones('prompts/medio.txt')
tone_instructions_chili = cargar_instrucciones('prompts/chili.txt')

# Recomendaciones de fallback para cuando no hay créditos de OpenAI
def get_fallback_recommendation(relacion, idioma, tono):
    fallback_recommendations = {
        'es': {
            'flores': {
                'jefe/a de Yago': 'Yago es un profesional excepcional que siempre demuestra un alto nivel de compromiso y dedicación. Su capacidad para resolver problemas complejos y su atención al detalle lo convierten en un activo valioso para cualquier equipo. Recomiendo encarecidamente a Yago para cualquier proyecto que requiera un desarrollador talentoso y comprometido.',
                'persona que era supervisada por Yago (Yago era su jefe)': 'Trabajar bajo la supervisión de Yago ha sido una experiencia muy enriquecedora. Su liderazgo y capacidad para guiar al equipo hacia el éxito son excepcionales. Su conocimiento técnico y su habilidad para comunicar ideas complejas de manera clara lo hacen un excelente mentor.',
                'persona que trabajó en el mismo equipo que Yago, al mismo nivel': 'Yago es un compañero de equipo excepcional. Su colaboración y disposición para ayudar a otros siempre han sido destacables. Su capacidad técnica y su actitud positiva contribuyen significativamente al éxito de cualquier proyecto.',
                'cliente/a de Yago': 'Yago ha demostrado ser un profesional altamente competente y confiable. Su capacidad para entender las necesidades del cliente y entregar soluciones de calidad excede las expectativas. Su comunicación clara y su atención al detalle hacen que trabajar con él sea una experiencia muy positiva.',
                'proveedor/a de Yago': 'Yago es un cliente excelente que siempre proporciona retroalimentación constructiva y clara. Su comprensión del proceso de desarrollo y su comunicación efectiva facilitan enormemente la colaboración. Es un placer trabajar con alguien tan profesional y organizado.'
            },
            'medio': {
                'jefe/a de Yago': 'Yago es un desarrollador competente con buenas habilidades técnicas. Aunque en ocasiones puede tardar más de lo esperado en completar tareas, su dedicación al trabajo es innegable. Con un poco más de organización, seguirá siendo un activo valioso para cualquier equipo.',
                'persona que era supervisada por Yago (Yago era su jefe)': 'Yago tiene buenas habilidades de liderazgo y es capaz de guiar al equipo de manera efectiva. Aunque a veces puede ser un poco desorganizado, su conocimiento técnico y su disposición para ayudar compensan estas áreas de mejora.',
                'persona que trabajó en el mismo equipo que Yago, al mismo nivel': 'Yago es un buen compañero de equipo con sólidas habilidades técnicas. Su colaboración es valiosa, aunque a veces puede distraerse con detalles menores. Su actitud positiva y su disposición para aprender lo hacen un buen colega.',
                'cliente/a de Yago': 'Yago es un cliente razonable que generalmente proporciona buenos requerimientos. Aunque a veces puede cambiar de opinión durante el desarrollo, su comunicación es clara y su disposición para colaborar facilita el trabajo.',
                'proveedor/a de Yago': 'Yago es un cliente que entiende bien el proceso de desarrollo. Aunque a veces puede ser un poco impaciente, su retroalimentación es constructiva y su comunicación es efectiva. Es agradable trabajar con él.'
            },
            'chili': {
                'jefe/a de Yago': '¡Qué decir de Yago! 😄 El tío tiene sus momentos... A veces llega tarde a las reuniones y se pasa más tiempo en la cafetería que trabajando, pero al final siempre saca el trabajo adelante. ¡Un crack!',
                'persona que era supervisada por Yago (Yago era su jefe)': 'Trabajar con Yago como jefe ha sido... interesante 😅 El tío va de reunión en reunión sin saber exactamente de qué se trata, pero utiliza palabras como "procesos" y "diseño" para disimular. ¡Al menos es divertido!',
                'persona que trabajó en el mismo equipo que Yago, al mismo nivel': '¡Yago! El compañero que siempre llega tarde pero tiene las mejores excusas 😂 Pasa más tiempo creando presentaciones de PowerPoint llenas de cajas y flechas que nadie entiende, pero todos le siguen la corriente. ¡Un personaje!',
                'cliente/a de Yago': 'Yago como cliente... ¡qué experiencia! 😄 A veces no sabe exactamente qué quiere, pero utiliza palabras técnicas para sonar profesional. Al final siempre termina contento con el resultado, aunque no entienda completamente lo que se le entregó.',
                'proveedor/a de Yago': 'Yago como cliente es... especial 😅 El tío siempre tiene prisa pero no sabe exactamente qué necesita. Utiliza términos como "research" y "diseño" para disimular su confusión, pero al final siempre paga a tiempo. ¡Se puede trabajar con él!'
            }
        },
        'en': {
            'flores': {
                'jefe/a de Yago': 'Yago is an exceptional professional who always demonstrates a high level of commitment and dedication. His ability to solve complex problems and his attention to detail make him a valuable asset for any team. I highly recommend Yago for any project requiring a talented and committed developer.',
                'persona que era supervisada por Yago (Yago era su jefe)': 'Working under Yago\'s supervision has been a very enriching experience. His leadership and ability to guide the team toward success are exceptional. His technical knowledge and ability to communicate complex ideas clearly make him an excellent mentor.',
                'persona que trabajó en el mismo equipo que Yago, al mismo nivel': 'Yago is an exceptional team member. His collaboration and willingness to help others have always been remarkable. His technical skills and positive attitude contribute significantly to the success of any project.',
                'cliente/a de Yago': 'Yago has proven to be a highly competent and reliable professional. His ability to understand client needs and deliver quality solutions exceeds expectations. His clear communication and attention to detail make working with him a very positive experience.',
                'proveedor/a de Yago': 'Yago is an excellent client who always provides constructive and clear feedback. His understanding of the development process and effective communication greatly facilitate collaboration. It\'s a pleasure to work with someone so professional and organized.'
            },
            'medio': {
                'jefe/a de Yago': 'Yago is a competent developer with good technical skills. Although he sometimes takes longer than expected to complete tasks, his dedication to work is undeniable. With a bit more organization, he will continue to be a valuable asset for any team.',
                'persona que era supervisada por Yago (Yago era su jefe)': 'Yago has good leadership skills and is able to guide the team effectively. Although he can sometimes be a bit disorganized, his technical knowledge and willingness to help compensate for these areas of improvement.',
                'persona que trabajó en el mismo equipo que Yago, al mismo nivel': 'Yago is a good team member with solid technical skills. His collaboration is valuable, although he can sometimes get distracted by minor details. His positive attitude and willingness to learn make him a good colleague.',
                'cliente/a de Yago': 'Yago is a reasonable client who generally provides good requirements. Although he sometimes changes his mind during development, his communication is clear and his willingness to collaborate facilitates work.',
                'proveedor/a de Yago': 'Yago is a client who understands the development process well. Although he can sometimes be a bit impatient, his feedback is constructive and his communication is effective. It\'s pleasant to work with him.'
            },
            'chili': {
                'jefe/a de Yago': 'What can I say about Yago! 😄 The guy has his moments... Sometimes he\'s late to meetings and spends more time in the cafeteria than working, but in the end he always gets the job done. A legend!',
                'persona que era supervisada por Yago (Yago era su jefe)': 'Working with Yago as a boss has been... interesting 😅 The guy goes from meeting to meeting without knowing exactly what it\'s about, but uses words like "processes" and "design" to disguise it. At least it\'s fun!',
                'persona que trabajó en el mismo equipo que Yago, al mismo nivel': 'Yago! The colleague who\'s always late but has the best excuses 😂 He spends more time creating PowerPoint presentations full of boxes and arrows that no one understands, but everyone goes along with it. A character!',
                'cliente/a de Yago': 'Yago as a client... what an experience! 😄 Sometimes he doesn\'t know exactly what he wants, but uses technical words to sound professional. In the end he\'s always happy with the result, even if he doesn\'t fully understand what was delivered.',
                'proveedor/a de Yago': 'Yago as a client is... special 😅 The guy is always in a hurry but doesn\'t know exactly what he needs. He uses terms like "research" and "design" to disguise his confusion, but in the end he always pays on time. You can work with him!'
            }
        }
    }
    
    return fallback_recommendations[idioma][tono].get(relacion, 'Recomendación de ejemplo para esta relación.')

@app.route('/')
def serve():
    return send_from_directory('static/', 'index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static/', path)

# Endpoint para generar recomendaciones
@app.route('/generate', methods=['POST'])
def generate_recommendation():
    try:
        data = request.json  # Recibe los datos del frontend
        relacion = data.get('relacion')
        aspectos_destacados = data.get('aspectos_destacados', "")  # Campo opcional "¿qué quieres destacar?"
        idioma = data.get('idioma', 'es')
        tono = data.get('tono', 'flores')

        print(f"Idioma seleccionado: {idioma}")

        if not relacion:
            return jsonify({"error": "No se ha indicado nada en el campo 'relación'"}), 400
        
        # Intentar usar OpenAI primero
        try:
            # Seleccionar el archivo de instrucciones según el tono
            if tono == 'flores':
                tone_instructions = tone_instructions_flores
            elif tono == 'chili':
                tone_instructions = tone_instructions_chili
            else:
                tone_instructions = tone_instructions_medio
            
            # Crear el prompt según el idioma seleccionado
            if idioma == 'es':
                user_message = f"Escribe una recomendación en español para un {relacion} de Yago."
                if aspectos_destacados:
                    user_message += f" Destaca lo siguiente: {aspectos_destacados}."
                user_message += f" En un mínimo de {minCaracteres} caracteres y un máximo de {maxCaracteres}."
            
            elif idioma == 'en':
                user_message = f"Write a recommendation in English for a {relacion} with Yago."
                if aspectos_destacados:
                    user_message += f" Highlight the following: {aspectos_destacados}."
                user_message += f" In a minimum of {minCaracteres} characters and a maximum of {maxCaracteres}."
            
            # Llamada a OpenAI para generar el texto
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            response = client.chat.completions.create(
                model=modeloGPT,
                messages=[
                    {"role": "system", "content": tone_instructions},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=800,
                temperature=0.8
            )
            
            recommendation = response.choices[0].message.content.strip()
            
        except Exception as openai_error:
            print(f"Error con OpenAI: {openai_error}")
            # Si falla OpenAI, usar recomendación de fallback
            recommendation = get_fallback_recommendation(relacion, idioma, tono)
            print("Usando recomendación de fallback")

        # Devuelve la recomendación generada
        return jsonify({'recommendation': recommendation})

    except Exception as e:
        print(traceback.format_exc())  # Imprime el traceback del error en la consola
        return jsonify({"error": str(e)}), 500

# Inicia la aplicación
if __name__ == '__main__':
    app.run(debug=True, port=5001) 