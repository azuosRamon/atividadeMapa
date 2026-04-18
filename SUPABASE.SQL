-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.blocos (
  bloco_id integer NOT NULL DEFAULT nextval('blocos_bloco_id_seq'::regclass),
  nome character varying NOT NULL,
  imovel_id integer NOT NULL,
  empresa_id uuid NOT NULL,
  CONSTRAINT blocos_pkey PRIMARY KEY (bloco_id),
  CONSTRAINT blocos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id),
  CONSTRAINT blocos_imovel_id_fkey FOREIGN KEY (imovel_id) REFERENCES public.imoveis(imovel_id)
);
CREATE TABLE public.cargos (
  cargo_id integer NOT NULL DEFAULT nextval('cargos_cargo_id_seq'::regclass),
  nome character varying,
  empresa_id uuid NOT NULL,
  CONSTRAINT cargos_pkey PRIMARY KEY (cargo_id),
  CONSTRAINT cargos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.categorias (
  categoria_id integer NOT NULL DEFAULT nextval('categorias_categoria_id_seq'::regclass),
  nome character varying NOT NULL,
  descricao character varying,
  empresa_id uuid,
  CONSTRAINT categorias_pkey PRIMARY KEY (categoria_id),
  CONSTRAINT categorias_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.comodos (
  comodo_id integer NOT NULL DEFAULT nextval('comodos_comodo_id_seq'::regclass),
  numero integer NOT NULL,
  apelido character varying NOT NULL,
  tipo_area_id integer NOT NULL,
  pavimento_id integer NOT NULL,
  lotacao integer NOT NULL,
  lista_coordenadas character varying NOT NULL,
  empresa_id uuid,
  CONSTRAINT comodos_pkey PRIMARY KEY (comodo_id),
  CONSTRAINT comodos_tipo_area_id_fkey FOREIGN KEY (tipo_area_id) REFERENCES public.tipos_areas(tipo_area_id),
  CONSTRAINT comodos_pavimento_id_fkey FOREIGN KEY (pavimento_id) REFERENCES public.pavimentos(pavimento_id),
  CONSTRAINT comodos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.contratos_empresas (
  contrato_id integer NOT NULL DEFAULT nextval('contratos_empresas_contrato_id_seq'::regclass),
  inicio date NOT NULL,
  renovacao date,
  tempo_contrato_meses integer NOT NULL,
  valor numeric NOT NULL,
  empresa_id uuid NOT NULL UNIQUE,
  qtd_comodos integer NOT NULL,
  qtd_produtos integer NOT NULL,
  qtd_usuarios integer NOT NULL,
  data_cadastro timestamp without time zone DEFAULT now(),
  validacao boolean DEFAULT false,
  CONSTRAINT contratos_empresas_pkey PRIMARY KEY (contrato_id),
  CONSTRAINT contratos_empresas_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.disponibilidade_semanal (
  disponibilidade_id integer NOT NULL DEFAULT nextval('disponibilidade_semanal_disponibilidade_id_seq'::regclass),
  usuario_id uuid NOT NULL,
  dia_da_semana smallint NOT NULL CHECK (dia_da_semana >= 1 AND dia_da_semana <= 7),
  hora_inicio time without time zone NOT NULL,
  hora_fim time without time zone NOT NULL,
  CONSTRAINT disponibilidade_semanal_pkey PRIMARY KEY (disponibilidade_id),
  CONSTRAINT disponibilidade_semanal_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id)
);
CREATE TABLE public.empresas (
  empresa_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  data_cadastro timestamp without time zone DEFAULT now(),
  nome character varying NOT NULL,
  cnpj character varying NOT NULL UNIQUE,
  telefone character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  rede_social_1 character varying,
  rede_social_2 character varying,
  imagem character varying,
  visibilidade boolean NOT NULL,
  modelo_id integer,
  validacao boolean DEFAULT false,
  CONSTRAINT empresas_pkey PRIMARY KEY (empresa_id),
  CONSTRAINT empresas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT empresas_modelo_id_fkey FOREIGN KEY (modelo_id) REFERENCES public.modelos(modelo_id)
);
CREATE TABLE public.funcoes (
  funcao_id integer NOT NULL DEFAULT nextval('funcoes_funcao_id_seq'::regclass),
  nome character varying NOT NULL UNIQUE,
  CONSTRAINT funcoes_pkey PRIMARY KEY (funcao_id)
);
CREATE TABLE public.horarios (
  horario_id integer NOT NULL DEFAULT nextval('horarios_horario_id_seq'::regclass),
  hora_inicio time without time zone NOT NULL,
  hora_termino time without time zone NOT NULL,
  ano integer,
  semestre smallint,
  empresa_id uuid,
  CONSTRAINT horarios_pkey PRIMARY KEY (horario_id),
  CONSTRAINT horarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.imoveis (
  imovel_id integer NOT NULL DEFAULT nextval('imoveis_imovel_id_seq'::regclass),
  nome character varying NOT NULL,
  logradouro character varying NOT NULL,
  complemento character varying NOT NULL,
  cep character varying,
  cidade character varying NOT NULL,
  estado character varying NOT NULL,
  latitude character varying,
  longitude character varying,
  empresa_id uuid NOT NULL,
  CONSTRAINT imoveis_pkey PRIMARY KEY (imovel_id),
  CONSTRAINT imoveis_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.modelos (
  modelo_id integer NOT NULL DEFAULT nextval('modelos_modelo_id_seq'::regclass),
  nome character varying NOT NULL,
  imoveis character varying NOT NULL,
  comodos character varying NOT NULL,
  categorias character varying NOT NULL,
  produtos character varying NOT NULL,
  CONSTRAINT modelos_pkey PRIMARY KEY (modelo_id)
);
CREATE TABLE public.pavimentos (
  pavimento_id integer NOT NULL DEFAULT nextval('pavimentos_pavimento_id_seq'::regclass),
  numero integer NOT NULL,
  bloco_id integer NOT NULL,
  imagem character varying NOT NULL,
  empresa_id uuid NOT NULL,
  CONSTRAINT pavimentos_pkey PRIMARY KEY (pavimento_id),
  CONSTRAINT pavimentos_bloco_id_fkey FOREIGN KEY (bloco_id) REFERENCES public.blocos(bloco_id),
  CONSTRAINT pavimentos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.produtos (
  produto_id integer NOT NULL DEFAULT nextval('produtos_produtos_id_seq'::regclass),
  nome character varying NOT NULL,
  descricao character varying,
  valor double precision,
  imagem character varying,
  empresa_id uuid,
  CONSTRAINT produtos_pkey PRIMARY KEY (produto_id),
  CONSTRAINT produtos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id)
);
CREATE TABLE public.quadro_de_funcionamento (
  funcionamento_id integer NOT NULL DEFAULT nextval('quadro_de_funcionamento_funcionamento_id_seq'::regclass),
  empresa_id uuid NOT NULL,
  turma character varying NOT NULL,
  categoria_id integer NOT NULL,
  produto_id integer NOT NULL,
  horario_id integer NOT NULL,
  dia_da_semana integer NOT NULL CHECK (dia_da_semana >= 1 AND dia_da_semana <= 7),
  usuario_id uuid NOT NULL,
  ocupacao integer NOT NULL,
  comodo_id integer NOT NULL,
  semestre smallint,
  tipo_area_id integer,
  ano bigint,
  CONSTRAINT quadro_de_funcionamento_pkey PRIMARY KEY (funcionamento_id),
  CONSTRAINT quadro_de_funcionamento_comodo_id_fkey FOREIGN KEY (comodo_id) REFERENCES public.comodos(comodo_id),
  CONSTRAINT quadro_de_funcionamento_tipo_area_id_fkey FOREIGN KEY (tipo_area_id) REFERENCES public.tipos_areas(tipo_area_id),
  CONSTRAINT quadro_de_funcionamento_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id),
  CONSTRAINT quadro_de_funcionamento_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(categoria_id),
  CONSTRAINT quadro_de_funcionamento_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(produto_id),
  CONSTRAINT quadro_de_funcionamento_horario_id_fkey FOREIGN KEY (horario_id) REFERENCES public.horarios(horario_id),
  CONSTRAINT quadro_de_funcionamento_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id)
);
CREATE TABLE public.tipos_areas (
  tipo_area_id integer NOT NULL DEFAULT nextval('tipos_areas_tipo_area_id_seq'::regclass),
  nome character varying,
  CONSTRAINT tipos_areas_pkey PRIMARY KEY (tipo_area_id)
);
CREATE TABLE public.usuarios (
  usuario_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  data_cadastro timestamp without time zone DEFAULT now(),
  nome character varying NOT NULL,
  sobrenome character varying,
  nascimento date,
  cpf character varying NOT NULL UNIQUE,
  telefone character varying,
  email character varying NOT NULL UNIQUE,
  rede_social character varying NOT NULL UNIQUE,
  imagem character varying,
  visibilidade boolean DEFAULT true,
  validacao boolean DEFAULT false,
  CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id),
  CONSTRAINT usuarios_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.usuarios_empresas (
  id integer NOT NULL DEFAULT nextval('usuarios_empresas_id_seq'::regclass),
  matricula integer NOT NULL,
  usuario_id uuid NOT NULL,
  empresa_id uuid NOT NULL,
  funcao_id integer NOT NULL,
  cargo_id integer NOT NULL,
  validacao boolean DEFAULT false,
  data_cadastro timestamp without time zone DEFAULT now(),
  CONSTRAINT usuarios_empresas_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_empresas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id),
  CONSTRAINT usuarios_empresas_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(empresa_id),
  CONSTRAINT usuarios_empresas_funcao_id_fkey FOREIGN KEY (funcao_id) REFERENCES public.funcoes(funcao_id),
  CONSTRAINT usuarios_empresas_cargo_id_fkey FOREIGN KEY (cargo_id) REFERENCES public.cargos(cargo_id)
);
ALTER TABLE public.blocos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comodos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disponibilidade_semanal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pavimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadro_de_funcionamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_empresas ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (Row Level Security)
-- Permite que usuários autenticados (com token válido) leiam, insiram, atualizem e deletem

-- Função auxiliar para verificar permissão de edição baseada na função do usuário
CREATE OR REPLACE FUNCTION public.pode_editar_cadastro()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios u
    JOIN public.usuarios_empresas ue ON u.usuario_id = ue.usuario_id
    WHERE u.user_id = auth.uid() AND ue.funcao_id IN (6, 7, 9, 10)
  );
$$;

CREATE POLICY "Permitir Leitura para usuários logados" ON public.blocos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.blocos FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir ALL para usuários logados" ON public.cargos FOR ALL TO authenticated USING (true);

CREATE POLICY "Permitir Leitura para usuários logados" ON public.categorias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.categorias FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir Leitura para usuários logados" ON public.comodos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.comodos FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir ALL para usuários logados" ON public.contratos_empresas FOR ALL TO authenticated USING (auth.uid() = '03a64e9a-844b-4483-a4dd-fa5d740cc1fa');
CREATE POLICY "Permitir ALL para usuários logados" ON public.disponibilidade_semanal FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir ALL para usuarios vinculados" ON public.empresas FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Permitir Leitura para usuários logados" ON public.empresas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir ALL para admin" ON public.funcoes FOR ALL TO authenticated USING (auth.uid() = '03a64e9a-844b-4483-a4dd-fa5d740cc1fa');
CREATE POLICY "Permitir Leitura para logados" ON public.funcoes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir Leitura para usuários logados" ON public.horarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.horarios FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir Leitura para usuários logados" ON public.imoveis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.imoveis FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir ALL para admin" ON public.modelos FOR ALL TO authenticated USING (auth.uid() = '03a64e9a-844b-4483-a4dd-fa5d740cc1fa');
CREATE POLICY "Permitir Leitura para usuários logados" ON public.modelos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir Leitura para usuários logados" ON public.pavimentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.pavimentos FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir Leitura para usuários logados" ON public.produtos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.produtos FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir Leitura para usuários logados" ON public.quadro_de_funcionamento FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Edição para funções específicas" ON public.quadro_de_funcionamento FOR ALL TO authenticated USING (public.pode_editar_cadastro());

CREATE POLICY "Permitir ALL para usuários logados" ON public.tipos_areas FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir Leitura de usuarios para logados" ON public.usuarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir Insercao de usuarios para logados" ON public.usuarios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Permitir Atualizacao de usuarios para logados" ON public.usuarios FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Permitir ALL para usuários logados" ON public.usuarios_empresas FOR ALL TO authenticated USING (true);

-- Garante que uma empresa não relacione o mesmo usuário duas vezes na tabela (Evita duplicatas)
ALTER TABLE public.usuarios_empresas
ADD CONSTRAINT unique_usuario_empresa UNIQUE (usuario_id, empresa_id);
