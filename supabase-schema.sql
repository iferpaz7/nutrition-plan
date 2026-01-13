-- =============================================
-- SQL para crear las tablas en Supabase
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Crear tipos ENUM
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

-- Tabla Customer
CREATE TABLE customer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_card TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  cell_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla NutritionalPlan
CREATE TABLE nutritional_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE
);

-- Tabla MealEntry
CREATE TABLE meal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week day_of_week NOT NULL,
  meal_type meal_type NOT NULL,
  meal_description TEXT NOT NULL,
  nutritional_plan_id UUID NOT NULL REFERENCES nutritional_plan(id) ON DELETE CASCADE,
  UNIQUE(nutritional_plan_id, day_of_week, meal_type)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_nutritional_plan_customer ON nutritional_plan(customer_id);
CREATE INDEX idx_meal_entry_plan ON meal_entry(nutritional_plan_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_customer_updated_at
  BEFORE UPDATE ON customer
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutritional_plan_updated_at
  BEFORE UPDATE ON nutritional_plan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (opcional, para seguridad)
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entry ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (ajustar según necesidades de auth)
CREATE POLICY "Allow all for customer" ON customer FOR ALL USING (true);
CREATE POLICY "Allow all for nutritional_plan" ON nutritional_plan FOR ALL USING (true);
CREATE POLICY "Allow all for meal_entry" ON meal_entry FOR ALL USING (true);
