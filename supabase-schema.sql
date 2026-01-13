-- =============================================
-- Schema completo para Sistema de Planes Nutricionales
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Eliminar tablas existentes si es necesario (en orden correcto por dependencias)
DROP TABLE IF EXISTS meal_entry CASCADE;
DROP TABLE IF EXISTS nutritional_plan CASCADE;
DROP TABLE IF EXISTS customer CASCADE;

-- Eliminar tipos ENUM existentes
DROP TYPE IF EXISTS day_of_week CASCADE;
DROP TYPE IF EXISTS meal_type CASCADE;
DROP TYPE IF EXISTS gender CASCADE;
DROP TYPE IF EXISTS activity_level CASCADE;
DROP TYPE IF EXISTS goal_type CASCADE;
DROP TYPE IF EXISTS plan_status CASCADE;

-- =============================================
-- TIPOS ENUM
-- =============================================

CREATE TYPE day_of_week AS ENUM (
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO'
);

CREATE TYPE meal_type AS ENUM (
  'DESAYUNO',
  'COLACION_1',
  'ALMUERZO',
  'COLACION_2',
  'CENA'
);

CREATE TYPE gender AS ENUM (
  'MASCULINO',
  'FEMENINO',
  'OTRO'
);

CREATE TYPE activity_level AS ENUM (
  'SEDENTARIO',      -- Poco o nada de ejercicio
  'LIGERO',          -- Ejercicio 1-3 días/semana
  'MODERADO',        -- Ejercicio 3-5 días/semana
  'ACTIVO',          -- Ejercicio 6-7 días/semana
  'MUY_ACTIVO'       -- Ejercicio intenso diario o trabajo físico
);

CREATE TYPE goal_type AS ENUM (
  'PERDER_PESO',
  'MANTENER_PESO',
  'GANAR_PESO',
  'GANAR_MUSCULO',
  'MEJORAR_SALUD'
);

CREATE TYPE plan_status AS ENUM (
  'BORRADOR',
  'ACTIVO',
  'PAUSADO',
  'COMPLETADO',
  'CANCELADO'
);

-- =============================================
-- TABLA: customer (Cliente/Paciente)
-- =============================================

CREATE TABLE customer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Datos personales
  id_card TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  cell_phone TEXT,
  gender gender,
  birth_date DATE,
  
  -- Datos físicos (para cálculos nutricionales)
  age INTEGER,                    -- Se puede calcular de birth_date
  weight DECIMAL(5,2),            -- Peso en kg (max 999.99)
  height DECIMAL(3,2),            -- Altura en metros (max 9.99)
  imc DECIMAL(4,2),               -- IMC calculado automáticamente
  body_fat_percentage DECIMAL(4,2), -- % de grasa corporal
  
  -- Información nutricional
  activity_level activity_level DEFAULT 'MODERADO',
  goal goal_type DEFAULT 'MANTENER_PESO',
  daily_calorie_target INTEGER,   -- Calorías diarias objetivo
  
  -- Información médica
  allergies TEXT,                 -- Alergias alimentarias
  medical_conditions TEXT,        -- Condiciones médicas relevantes
  medications TEXT,               -- Medicamentos que afectan dieta
  dietary_restrictions TEXT,      -- Restricciones dietéticas (vegetariano, vegano, etc.)
  
  -- Notas
  notes TEXT,                     -- Notas adicionales del nutricionista
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: nutritional_plan (Plan Nutricional)
-- =============================================

CREATE TABLE nutritional_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información básica
  name TEXT NOT NULL,
  description TEXT,
  status plan_status DEFAULT 'BORRADOR',
  
  -- Fechas
  start_date DATE,
  end_date DATE,
  
  -- Objetivos nutricionales del plan
  daily_calories INTEGER,         -- Calorías diarias objetivo
  protein_grams INTEGER,          -- Proteínas en gramos
  carbs_grams INTEGER,            -- Carbohidratos en gramos
  fat_grams INTEGER,              -- Grasas en gramos
  fiber_grams INTEGER,            -- Fibra en gramos
  water_liters DECIMAL(3,1),      -- Litros de agua recomendados
  
  -- Notas
  notes TEXT,                     -- Notas/instrucciones del nutricionista
  
  -- Relaciones
  customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: meal_entry (Entrada de Comida)
-- =============================================

CREATE TABLE meal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Clasificación
  day_of_week day_of_week NOT NULL,
  meal_type meal_type NOT NULL,
  
  -- Descripción de la comida
  meal_description TEXT NOT NULL,
  
  -- Información nutricional estimada (opcional)
  calories INTEGER,               -- Calorías estimadas
  protein_grams DECIMAL(5,1),     -- Proteínas en gramos
  carbs_grams DECIMAL(5,1),       -- Carbohidratos en gramos
  fat_grams DECIMAL(5,1),         -- Grasas en gramos
  fiber_grams DECIMAL(5,1),       -- Fibra en gramos
  
  -- Información adicional
  portion_size TEXT,              -- Tamaño de porción (ej: "1 taza", "200g")
  preparation_notes TEXT,         -- Notas de preparación
  
  -- Relaciones
  nutritional_plan_id UUID NOT NULL REFERENCES nutritional_plan(id) ON DELETE CASCADE,
  
  -- Constraint único
  UNIQUE(nutritional_plan_id, day_of_week, meal_type)
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_customer_email ON customer(email);
CREATE INDEX idx_customer_id_card ON customer(id_card);
CREATE INDEX idx_nutritional_plan_customer ON nutritional_plan(customer_id);
CREATE INDEX idx_nutritional_plan_status ON nutritional_plan(status);
CREATE INDEX idx_nutritional_plan_dates ON nutritional_plan(start_date, end_date);
CREATE INDEX idx_meal_entry_plan ON meal_entry(nutritional_plan_id);

-- =============================================
-- FUNCIONES
-- =============================================

-- Función para calcular IMC automáticamente
CREATE OR REPLACE FUNCTION calculate_imc()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.weight IS NOT NULL AND NEW.height IS NOT NULL AND NEW.height > 0 THEN
    NEW.imc = ROUND((NEW.weight / (NEW.height * NEW.height))::numeric, 2);
  ELSE
    NEW.imc = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular edad desde fecha de nacimiento
CREATE OR REPLACE FUNCTION calculate_age_from_birthdate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.birth_date IS NOT NULL THEN
    NEW.age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birth_date))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Triggers para customer
CREATE TRIGGER calculate_customer_imc
  BEFORE INSERT OR UPDATE OF weight, height ON customer
  FOR EACH ROW
  EXECUTE FUNCTION calculate_imc();

CREATE TRIGGER calculate_customer_age
  BEFORE INSERT OR UPDATE OF birth_date ON customer
  FOR EACH ROW
  EXECUTE FUNCTION calculate_age_from_birthdate();

CREATE TRIGGER update_customer_updated_at
  BEFORE UPDATE ON customer
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers para nutritional_plan
CREATE TRIGGER update_nutritional_plan_updated_at
  BEFORE UPDATE ON nutritional_plan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMENTARIOS (Documentación)
-- =============================================

COMMENT ON TABLE customer IS 'Clientes/Pacientes del sistema de nutrición';
COMMENT ON TABLE nutritional_plan IS 'Planes nutricionales semanales asignados a clientes';
COMMENT ON TABLE meal_entry IS 'Entradas individuales de comidas dentro de un plan';

COMMENT ON COLUMN customer.imc IS 'Índice de Masa Corporal calculado automáticamente (peso/altura²)';
COMMENT ON COLUMN customer.age IS 'Edad calculada automáticamente desde birth_date';
COMMENT ON COLUMN customer.daily_calorie_target IS 'Objetivo de calorías diarias basado en actividad y objetivo';

-- =============================================
-- DATOS DE PRUEBA (Opcional - comentar si no se necesita)
-- =============================================

-- Cliente de prueba: Ivan Paz
INSERT INTO customer (
  id_card,
  first_name,
  last_name,
  email,
  cell_phone,
  gender,
  birth_date,
  weight,
  height,
  activity_level,
  goal
) VALUES (
  '1234567890',
  'Ivan',
  'Paz',
  'ivan.paz@email.com',
  '0999123456',
  'MASCULINO',
  '1995-06-15',  -- Edad se calcula automáticamente
  84.00,
  1.69,
  'MODERADO',
  'PERDER_PESO'
);

-- Verificar datos insertados con IMC y edad calculados
SELECT 
  first_name || ' ' || last_name AS nombre,
  age AS edad_calculada,
  weight AS peso_kg,
  height AS altura_m,
  imc,
  CASE 
    WHEN imc < 18.5 THEN 'Bajo peso'
    WHEN imc >= 18.5 AND imc < 25 THEN 'Normal'
    WHEN imc >= 25 AND imc < 30 THEN 'Sobrepeso'
    WHEN imc >= 30 AND imc < 35 THEN 'Obesidad I'
    WHEN imc >= 35 AND imc < 40 THEN 'Obesidad II'
    ELSE 'Obesidad III'
  END AS clasificacion_imc,
  activity_level AS nivel_actividad,
  goal AS objetivo
FROM customer
WHERE id_card = '1234567890';

-- =============================================
-- Referencia de clasificación de IMC (OMS):
-- < 18.5       = Bajo peso
-- 18.5 - 24.9  = Normal
-- 25.0 - 29.9  = Sobrepeso
-- 30.0 - 34.9  = Obesidad grado I
-- 35.0 - 39.9  = Obesidad grado II
-- >= 40        = Obesidad grado III
-- =============================================
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entry ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (ajustar según necesidades de auth)
CREATE POLICY "Allow all for customer" ON customer FOR ALL USING (true);
CREATE POLICY "Allow all for nutritional_plan" ON nutritional_plan FOR ALL USING (true);
CREATE POLICY "Allow all for meal_entry" ON meal_entry FOR ALL USING (true);
