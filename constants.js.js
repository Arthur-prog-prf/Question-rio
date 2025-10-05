export const REVIEW_INTERVALS = [3, 7, 15, 30, 60];

export const PAGE_CONFIG = {
    hoje: { 
        title: "Foco do Dia", 
        subtitle: "Sua central de comando para os estudos de hoje." 
    },
    edital: { 
        title: "Edital Completo", 
        subtitle: "Acompanhe e edite seu progresso em cada tópico." 
    },
    planejamento: { 
        title: "Planejamento", 
        subtitle: "Organize sua semana e defina sua estratégia." 
    },
    estatisticas: { 
        title: "Estatísticas", 
        subtitle: "Analise seu desempenho e evolução." 
    },
    conquistas: { 
        title: "Conquistas", 
        subtitle: "Celebre seu progresso e mantenha-se motivado." 
    },
};

export const DEFAULT_EDITAL = {
    "LÍNGUA PORTUGUESA, LITERATURA NACIONAL E REDAÇÃO": { 
        topics: [ 
            { name: "1. Gramática normativa: uso da língua culta." }, 
            { name: "2. Fonética e fonologia." }, 
            { name: "3. Morfologia." }, 
            { name: "4. Sintaxe." }, 
            { name: "5. Semântica." }, 
            { name: "6. Literatura: texto literário, gêneros literários, principais movimentos literários." }, 
            { name: "7. Tipos de textos e gêneros textuais." }, 
            { name: "8. Produção e interpretação de texto." }, 
            { name: "9. Intertextualidade." }, 
            { name: "10. Citações e transcrições." }, 
            { name: "11. Redação Oficial: uso da norma culta da linguagem, clareza e precisão, objetividade, concisão, coesão e coerência, impessoalidade, formalidade e padronização." } 
        ] 
    },
    "RACIOCÍNIO LÓGICO MATEMÁTICO": { 
        topics: [ 
            { name: "1. Estruturas lógicas e noções básicas de lógica." }, 
            { name: "2. Lógica de argumentação e análise crítica de informações." }, 
            { name: "3. Operações com conjuntos." }, 
            { name: "4. Análise, interpretação e utilização de dados apresentados em tabelas, gráficos e diagramas." }, 
            { name: "5. Características e relações matemáticas." }, 
            { name: "6. Noções básicas de Contagem e Probabilidades." } 
        ] 
    },
    "LÍNGUA INGLESA": { 
        topics: [ 
            { name: "1. Conhecimento e uso das formas contemporâneas da linguagem inglesa." }, 
            { name: "2. Compreensão e interpretação de textos variados." }, 
            { name: "3. Itens gramaticais relevantes para a compreensão dos conteúdos semânticos." } 
        ] 
    },
    "DIREITO CONSTITUCIONAL": { 
        topics: [ 
            { name: "1. Constituição de 1988." }, 
            { name: "2. Poder constituinte." }, 
            { name: "3. Controle de constitucionalidade." }, 
            { name: "4. Princípios Fundamentais. Direitos e Garantias Fundamentais." }, 
            { name: "5. Organização do Estado." }, 
            { name: "6. Administração Pública." }, 
            { name: "7. Poder Legislativo." }, 
            { name: "8. Poder Executivo." }, 
            { name: "9. Poder Judiciário." }, 
            { name: "10. Defesa do Estado e das Instituições Democráticas." } 
        ] 
    },
    "DIREITO ADMINISTRATIVO": { 
        topics: [ 
            { name: "1. Conceitos e princípios." }, 
            { name: "2. Organização da Administração." }, 
            { name: "3. Poderes e Deveres Administrativos." }, 
            { name: "4. Atos Administrativos." }, 
            { name: "5. Agentes Públicos." }, 
            { name: "6. Processo Administrativo Federal." }, 
            { name: "7. Licitações e contratos administrativos." }, 
            { name: "8. Controle Interno e Externo da Administração." }, 
            { name: "9. Responsabilidade Civil do Estado." }, 
            { name: "10. Improbidade Administrativa." }, 
            { name: "11. Lei de Acesso à Informação." }, 
            { name: "12. Lei Geral de Proteção de Dados." }, 
            { name: "13. Regime jurídico-administrativo na LINDB." } 
        ] 
    },
    "DIREITO PENAL E PROCESSUAL PENAL": { 
        topics: [ 
            { name: "1. Princípios penais." }, 
            { name: "2. Lei penal." }, 
            { name: "3. Teoria geral do crime." }, 
            { name: "4. Concurso de pessoas e concurso de crimes." }, 
            { name: "5. Sanção penal e extinção da punibilidade." }, 
            { name: "6. Crimes contra a pessoa." }, 
            { name: "7. Crimes contra o patrimônio." }, 
            { name: "8. Crimes contra a dignidade sexual." }, 
            { name: "9. Crimes contra a paz pública." }, 
            { name: "10. Crimes contra a fé pública." }, 
            { name: "11. Crimes contra a Administração Pública." }, 
            { name: "12. Princípios e Garantias Processuais." }, 
            { name: "13. Aplicação da lei processual penal." }, 
            { name: "14. Investigação criminal." }, 
            { name: "15. Ação penal." }, 
            { name: "16. Jurisdição e Competência." }, 
            { name: "17. Comunicação dos atos processuais." }, 
            { name: "18. Prova." }, 
            { name: "19. Prisão. Medidas cautelares." }, 
            { name: "20. Leis penais especiais." } 
        ] 
    },
    "CRIMINALÍSTICA": { 
        topics: [ 
            { name: "1. Criminalística: Definição. Histórico. Doutrina." }, 
            { name: "2. Perícia." }, 
            { name: "3. Locais de crime." }, 
            { name: "4. Cadeia de Custódia." }, 
            { name: "5. Rastreabilidade. Vestígios de interesse Forense." }, 
            { name: "6. Levantamento papiloscópico." } 
        ] 
    },
    "DIREITO DIGITAL": { 
        topics: [ 
            { name: "1. Proteção de dados e direito de privacidade." }, 
            { name: "2. Responsabilidade de provedores." }, 
            { name: "3. Quebra do sigilo telemático." }, 
            { name: "4. Redes sociais, direitos de personalidade e notícias falsas." }, 
            { name: "5. Leis de Direito Digital." } 
        ] 
    },
    "DIREITOS HUMANOS": { 
        topics: [ 
            { name: "1. Conceito. Evolução. Abrangência." }, 
            { name: "2. Declaração Universal dos Direitos Humanos." }, 
            { name: "3. Convenção Americana sobre Direitos Humanos." } 
        ] 
    },
    "INFORMÁTICA": { 
        topics: [ 
            { name: "1. Hardware e Software." }, 
            { name: "2. Redes de computadores." }, 
            { name: "3. Internet e Intranet." }, 
            { name: "4. Internet das coisas." }, 
            { name: "5. Sistema Operacional Microsoft Windows." }, 
            { name: "6. Sistema Operacional Mobile." }, 
            { name: "7. Navegadores web." }, 
            { name: "8. Cliente de correio eletrônico." }, 
            { name: "9. Edição de textos, planilhas e apresentações." }, 
            { name: "10. Ferramentas de mídias sociais." }, 
            { name: "11. Conceitos sobre sistemas de gestão de documentos eletrônicos." } 
        ] 
    }
};

export const ACHIEVEMENTS = {
    week_streak: { 
        name: "Foco de Aço", 
        description: "Estudou por 7 dias seguidos.", 
        icon: "🔥" 
    },
    subject_master: { 
        name: "O Conquistador", 
        description: "Dominou todos os tópicos de uma matéria.", 
        icon: "🏆" 
    },
    marathoner: { 
        name: "Maratonista", 
        description: "Registrou 50 horas (3000 min) de estudo.", 
        icon: "🏃‍♂️" 
    },
    specialist: { 
        name: "O Especialista", 
        description: "Atingiu 90% de acerto em um simulado.", 
        icon: "🎯" 
    },
    first_log: { 
        name: "Primeiro Passo", 
        description: "Registrou sua primeira sessão de estudo.", 
        icon: "🌱" 
    }
};