-- Empresas
CREATE TABLE empresas (
    empresa_id SERIAL PRIMARY KEY,
    nome_empresa VARCHAR(200) NOT NULL,
    cnpj VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(200) NOT NULL,
    senha VARCHAR(20) NOT NULL,
    rede_social_1 VARCHAR(200),
    rede_social_2 VARCHAR(200)
);

CREATE TABLE contratos_empresas(
    contrato_id SERIAL PRIMAY KEY;
    inicio DATE NOT NULL,
    renovacao DATE,
    tempo_contrato_meses INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL
    empresa_id INT NOT NULL REFERENCES empresas(empresa_id),
)
/*
CREATE TABLE contratos_usuarios(
    contrato_id SERIAL PRIMAY KEY;
    inicio DATE NOT NULL,
    renovacao DATE,
    tempo_contrato_meses INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL
    usuario_id INT NOT NULL REFERENCES usuarios(usuario_id),
)*/
-- como administrador desejo adicionar/alterar/remover empresas, contratos, usuarios, funcoes do site,
-- Funções do site (administrador(dono do site), moderador(empregados do site), gerente_empresa(gerente da empresa contratada), secretario_empresa(pessoa que pode realizar acoes pelo gerente), usuario comum(pessoa que pode ver tabelas e editar o proprio perfil), visitante(pessoa que pode visualizar o site))

CREATE TABLE funcoes (
    funcao_id SERIAL PRIMARY KEY,
    nome_funcao VARCHAR(100)
);
-- como gerente da empresa quero definir os cargos dos meus funcionários cadastrados no site ex. professores, coordenadores, secretários, auxiliares, alunos, porteiros
-- Cargos
CREATE TABLE cargos (
    cargo_id SERIAL PRIMARY KEY,
    nome_cargo VARCHAR(100),
    empresa_id INT NOT NULL REFERENCES empresas(empresa_id)
);
-- Usuários
CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    sobrenome VARCHAR(200),
    nascimento DATE,
    cpf VARCHAR(14) NOT NULL,
    matricula INT NOT NULL,
    email VARCHAR(200) NOT NULL,
    telefone VARCHAR(20),
    senha VARCHAR(30) NOT NULL,
    foto VARCHAR(500),
    informacoes_publicas BOOLEAN NOT NULL,
    empresa_id INT NOT NULL REFERENCES empresas(empresa_id),
    funcao_id INT NOT NULL REFERENCES funcoes(funcao_id),
    cargo_id INT NOT NULL REFERENCES cargos(cargo_id)
);
/*
-- Usuário VIP
CREATE TABLE usuario_vip (
    vip_id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(usuario_id),
    inicio_contrato DATE NOT NULL,
    duracao_contrato INT NOT NULL,
    valor_contrato DECIMAL(10,2) NOT NULL,
    anuncios_contratados INT NOT NULL
);

-- Anúncios
CREATE TABLE anuncios (
    anuncio_id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(usuario_id),
    produto VARCHAR(200) NOT NULL,
    descricao VARCHAR(500),
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_termino DATE NOT NULL,
    valor DECIMAL(10,2),
    fotos VARCHAR(500)
);*/

-- Horários
CREATE TABLE horarios (
    horario_id SERIAL PRIMARY KEY,
    ano INT NOT NULL,
    semestre INT NOT NULL
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
);

-- Campi
CREATE TABLE campi (
    campus_id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    complemento VARCHAR(100) NOT NULL,
    cep VARCHAR(20),
    cidade VARCHAR(200) NOT NULL,
    estado VARCHAR(200) NOT NULL,
    latitude VARCHAR(100) NOT NULL,
    longitude VARCHAR(100) NOT NULL,
    empresa_id INT NOT NULL REFERENCES empresas(empresa_id)
);

-- Blocos
CREATE TABLE blocos (
    bloco_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    campus_id INT REFERENCES campi(campus_id)
);

-- Pavimentos
CREATE TABLE pavimentos (
    pavimento_id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    bloco_id INT REFERENCES blocos(bloco_id),
    imagem VARCHAR(500) NOT NULL
);

-- Tipos de Áreas
CREATE TABLE tipos_areas (
    tipo_area_id SERIAL PRIMARY KEY,
    nome VARCHAR(200)
);

-- Salas
CREATE TABLE salas (
    sala_id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    apelido VARCHAR(200) NOT NULL,
    tipo_area_id INT NOT NULL REFERENCES tipos_areas(tipo_area_id),
    pavimento_id INT NOT NULL REFERENCES pavimentos(pavimento_id),
    lotacao int not null,
    lista_coordenadas VARCHAR(500) NOT NULL
);

-- Cursos
CREATE TABLE cursos (
    curso_id SERIAL PRIMARY KEY,
    nome VARCHAR(300) NOT NULL
);

-- Disciplinas
CREATE TABLE disciplinas (
    disciplina_id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL
);

-- Quadro de Aulas
CREATE TABLE quadro_de_aulas (
    quadro_id SERIAL PRIMARY KEY,
    periodo_id INT REFERENCES periodo(periodo_id),
    dia_semana INT,
    hora_id_inicio INT REFERENCES horarios(horario_id),
    hora_id_termino INT REFERENCES horarios(horario_id),
    sala_id INT REFERENCES salas(sala_id),
    curso_id INT REFERENCES cursos(curso_id),
    professor INT REFERENCES usuarios(usuario_id),
    disciplina_id INT REFERENCES disciplinas(disciplina_id)
);
