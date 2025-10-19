

-- NOME DA TABELA -> QUEM PODE EDITAR

-- FUNCOES -> MAPA - OK
CREATE TABLE funcoes (
    funcao_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);
--MODELOS -> MAPA - CRIADO - OK
create table modelos(
    modelo_id serial primary key,
    nome varchar(100) not null,
    imoveis varchar(50) not null,
    comodos varchar(50) not null,
    categorias varchar(50) not null,
    produtos varchar(50) not null,
)
-- Empresas -> MAPA - OK

CREATE TABLE empresas (
    empresa_id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    data_cadastro timestamp default now(),
    nome VARCHAR(200) NOT NULL,
    cnpj VARCHAR(100) unique NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(200) unique NOT NULL,
    senha VARCHAR(20) NOT NULL,
    rede_social_1 VARCHAR(200),
    rede_social_2 VARCHAR(200),
    imagem VARCHAR(500),
    visibilidade BOOLEAN NOT NULL,
    modelo_id references modelos(modelo_id),
    validacao boolean default false
);

-- como gerente da empresa quero definir os cargos dos meus funcionários cadastrados no site ex. professores, coordenadores, secretários, auxiliares, alunos, porteiros
-- Cargos -> EMPRESA - OK
CREATE TABLE cargos (
    cargo_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) unique,
    empresa_id INT NOT NULL REFERENCES empresas(empresa_id)
);
-- CONTRATOS -> MAPA - ok

CREATE TABLE contratos_empresas(
    contrato_id SERIAL PRIMAY KEY;
    inicio DATE NOT NULL,
    renovacao DATE,
    tempo_contrato_meses INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    empresa_id unique INT NOT NULL REFERENCES empresas(empresa_id),
    qtd_comodos int not null,
    qtd_produtos int not null,
    qtd_usuários int not null,
    data_cadastro timestamp default now(),
    validacao boolean default false
)
-- Usuários -> EMPRESA, COORDENADOR
-- EMPRESA CRIA USUARIOS DE QUALQUER CARGO, COORDENADOR CRIA PROFESSORES PARA O CURSO DELE
CREATE TABLE usuarios (
    usuario_id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    data_cadastro timestamp default now(),
    nome VARCHAR(200) NOT NULL,
    sobrenome VARCHAR(200),
    nascimento DATE,
    cpf VARCHAR(14) unique NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(200) unique NOT NULL,
    senha VARCHAR(30) NOT NULL,
    pin int4 not null,
    rede_social VARCHAR(200) unique NOT NULL,
    imagem VARCHAR(500),
    visibilidade BOOLEAN set default true,
    validacao boolean default false
);
--USUARIOS CADASTRADOS NA EMPRESA (ESSE FORMATO PERMITE MUITOS USUARIOS PARA MUITAS EMPRESAS) -> EMPRESA, COORDENADOR
create table usuarios_empresas(
    id serial primary key,
    matricula INT NOT NULL,
    usuario_id int NOT NULL references usuarios(usuario_id),
    empresa_id int NOT NULL references empresas(empresa_id),
    funcao_id INT NOT NULL REFERENCES funcoes(funcao_id),
    cargo_id INT NOT NULL REFERENCES cargos(cargo_id),
    validacao boolean default false,
    data_cadastro timestamp default now(),
);

-- Horários -> EMPRESA
CREATE TABLE horarios (
    horario_id SERIAL PRIMARY KEY,
    ano INT4 NOT NULL,
    semestre INT2 NOT NULL
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
);

-- Tipos de Áreas -> MAPA
CREATE TABLE tipos_areas (
    tipo_area_id SERIAL PRIMARY KEY,
    nome VARCHAR(200)
);
-- Campi -> EMPRESA
CREATE TABLE imoveis (
    imovel_id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    complemento VARCHAR(100) NOT NULL,
    cep VARCHAR(20),
    cidade VARCHAR(200) NOT NULL,
    estado VARCHAR(200) NOT NULL,
    latitude VARCHAR(100),
    longitude VARCHAR(100),
    empresa_id INT NOT NULL REFERENCES empresas(empresa_id)
);

-- Blocos -> EMPRESA
CREATE TABLE blocos (
    bloco_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    imovel_id INT REFERENCES imoveis(imovel_id)
);

-- Pavimentos -> EMPRESA
CREATE TABLE pavimentos (
    pavimento_id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    bloco_id INT REFERENCES blocos(bloco_id),
    imagem VARCHAR(500) NOT NULL
);


-- Salas -> EMPRESA
CREATE TABLE comodos (
    comodo_id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    apelido VARCHAR(200) NOT NULL,
    tipo_area_id INT NOT NULL REFERENCES tipos_areas(tipo_area_id),
    pavimento_id INT NOT NULL REFERENCES pavimentos(pavimento_id),
    lotacao int not null,
    lista_coordenadas VARCHAR(500) NOT NULL
);

-- Cursos -> EMPRESA
CREATE TABLE categorias (
    categoria_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao varchar(500)
);

-- Disciplinas -> EMPRESA, COORDENADOR, SECRETARIO
CREATE TABLE produtos (
    produtos_id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao varchar(500),
    valor float,
    foto VARCHAR(500)
);

-- Quadro de Aulas -> EMPRESA, COORDENADOR, SECRETARIO
-- QUADRO DE FUNCIONAMENTO PASSARÁ PARA NOSQL E DEVE PERMITIR ADICIONAR MULTIPLOS PRODUTOS, USUÁRIOS E CATEGORIAS
-- retirar 10 segundos do tempo de termino para evitar conflitos
CREATE TABLE quadro_de_funcionamento (
    quadro_id SERIAL PRIMARY KEY,
    qtd_lotacao int,
    dia_semana INT,
    hora_id_inicio INT REFERENCES horarios(horario_id),
    hora_id_termino INT REFERENCES horarios(horario_id),
    comodo_id INT REFERENCES comodos(comodo_id),
    categoria_id INT REFERENCES categorias(categoria_id),
    usuario_id INT REFERENCES usuarios(usuario_id),
    produto_id INT REFERENCES produtos(produto_id)
);


