
import streamlit as st
import re
import random

st.set_page_config(page_title="Simulado Interativo", layout="wide")
st.title("📝 Simulado Interativo com Fundamentação")

uploaded_file = st.file_uploader("📤 Envie o arquivo .txt do simulado", type="txt")

def parse_simulado(texto):
    questoes_raw = re.split(r'\nGabarito:\n', texto)[0].strip()
    gabarito_raw = re.search(r'Gabarito:\n(.*?)\n\nFundamentação:', texto, re.DOTALL).group(1).strip()
    fundamentacao_raw = re.split(r'\nFundamentação:\n', texto)[1].strip()

    questoes = re.findall(
        r'Questão (\d+) - (.*?)\n\na\) (.*?)\nb\) (.*?)\nc\) (.*?)\nd\) (.*?)\n',
        questoes_raw, re.DOTALL
    )

    gabarito = dict(re.findall(r'(\d+) - ([a-d])', gabarito_raw))
    fundamentos_raw = re.findall(r'(\d+) - ([a-d])\)\n(.*?)(?=\n\d+ - [a-d]\)|\Z)', fundamentacao_raw, re.DOTALL)
    fundamentacoes = {num: texto.strip() for num, _, texto in fundamentos_raw}

    lista = []
    for q in questoes:
        numero, enunciado, a, b, c, d = q
        alternativas = {'a': a.strip(), 'b': b.strip(), 'c': c.strip(), 'd': d.strip()}
        correta = gabarito.get(numero)
        fundamentacao = fundamentacoes.get(numero, "")
        lista.append({
            'numero': int(numero),
            'enunciado': enunciado.strip(),
            'alternativas': alternativas,
            'correta': correta,
            'fundamentacao': fundamentacao
        })
    return lista

if uploaded_file:
    texto = uploaded_file.read().decode('utf-8')
    questoes = parse_simulado(texto)
    total = len(questoes)

    qtd = st.selectbox("📚 Quantas questões por página?", [1, 5, 10, total], index=2)

    if qtd > 0:
        max_paginas = (total // qtd) + (1 if total % qtd else 0)
        pagina = st.number_input("📄 Página", min_value=1, max_value=max_paginas, step=1)
        start = (pagina - 1) * qtd
        end = start + qtd
        questoes_exibir = questoes[start:end]

        for q in questoes_exibir:
            with st.expander(f"Questão {q['numero']} - {q['enunciado']}", expanded=True):
                alternativa_escolhida = st.radio(
                    f"Escolha sua resposta para a Questão {q['numero']}",
                    options=list(q['alternativas'].keys()),
                    format_func=lambda x: f"{x}) {q['alternativas'][x]}",
                    key=f"radio_{q['numero']}"
                )

                if st.button("Verificar", key=f"verificar_{q['numero']}"):
                    if alternativa_escolhida == q['correta']:
                        st.success("✅ Resposta correta!")
                    else:
                        st.error(f"❌ Resposta incorreta! A correta é **{q['correta']}) {q['alternativas'][q['correta']]}**")

                if st.button("Mostrar Fundamentação", key=f"fund_{q['numero']}"):
                    st.info(q['fundamentacao'])
    else:
        st.warning("Selecione uma quantidade válida de questões por página.")
