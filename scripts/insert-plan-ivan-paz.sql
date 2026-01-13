-- =============================================
-- Script para insertar un plan nutricional completo para Ivan Paz
-- Ejecutar en el SQL Editor de Supabase DESPUÉS del schema principal
-- =============================================

-- Primero obtenemos el ID del cliente Ivan Paz
-- Si no existe, lo creamos
DO $$
DECLARE
  v_customer_id UUID;
  v_plan_id UUID;
BEGIN
  -- Buscar o crear el cliente Ivan Paz
  SELECT id INTO v_customer_id FROM customer WHERE id_card = '1234567890';
  
  IF v_customer_id IS NULL THEN
    INSERT INTO customer (
      id_card, first_name, last_name, email, cell_phone,
      gender, birth_date, weight, height,
      activity_level, goal,
      allergies, dietary_restrictions, medical_conditions, medications,
      notes, daily_calorie_target
    ) VALUES (
      '1234567890', 'Ivan', 'Paz', 'ivan.paz@email.com', '0999123456',
      'MASCULINO', '1995-06-15', 84.00, 1.69,
      'MODERADO', 'PERDER_PESO',
      'Mariscos', 'Sin gluten', NULL, NULL,
      'Cliente comprometido con su plan de pérdida de peso. Prefiere comidas prácticas.', 2000
    ) RETURNING id INTO v_customer_id;
    
    RAISE NOTICE 'Cliente Ivan Paz creado con ID: %', v_customer_id;
  ELSE
    RAISE NOTICE 'Cliente Ivan Paz encontrado con ID: %', v_customer_id;
  END IF;

  -- Crear el plan nutricional
  INSERT INTO nutritional_plan (
    name, description, status,
    start_date, end_date,
    daily_calories, protein_grams, carbs_grams, fat_grams, fiber_grams, water_liters,
    notes, customer_id
  ) VALUES (
    'Plan de Pérdida de Peso - Semana 1',
    'Plan diseñado para pérdida de peso gradual con déficit calórico moderado de 500 kcal. Enfocado en alimentos naturales y preparaciones sencillas.',
    'ACTIVO',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days',
    2000, 150, 200, 67, 30, 2.5,
    'Recomendaciones: Beber agua antes de cada comida. Evitar azúcares refinados. Priorizar proteínas en cada comida. Realizar 30 min de caminata diaria.',
    v_customer_id
  ) RETURNING id INTO v_plan_id;

  RAISE NOTICE 'Plan nutricional creado con ID: %', v_plan_id;

  -- Insertar todas las comidas del plan
  
  -- ==================== LUNES ====================
  INSERT INTO meal_entry (nutritional_plan_id, day_of_week, meal_type, meal_description, calories, protein_grams, carbs_grams, fat_grams) VALUES
  (v_plan_id, 'LUNES', 'DESAYUNO', 
   '2 huevos revueltos con espinacas
1 rebanada de pan integral sin gluten
1 taza de té verde
1/2 aguacate', 
   420, 22, 28, 24),
  (v_plan_id, 'LUNES', 'COLACION_1', 
   '1 manzana mediana
10 almendras', 
   160, 4, 21, 8),
  (v_plan_id, 'LUNES', 'ALMUERZO', 
   'Pechuga de pollo a la plancha (150g)
Arroz integral (1 taza cocido)
Ensalada mixta con aceite de oliva
Agua con limón', 
   520, 45, 48, 14),
  (v_plan_id, 'LUNES', 'COLACION_2', 
   'Yogurt griego natural (150g)
1 cucharada de miel
Fresas picadas', 
   180, 15, 20, 5),
  (v_plan_id, 'LUNES', 'CENA', 
   'Salmón al horno (150g)
Vegetales asados (brócoli, zanahoria, calabacín)
Quinoa (1/2 taza)', 
   480, 40, 30, 22);

  -- ==================== MARTES ====================
  INSERT INTO meal_entry (nutritional_plan_id, day_of_week, meal_type, meal_description, calories, protein_grams, carbs_grams, fat_grams) VALUES
  (v_plan_id, 'MARTES', 'DESAYUNO', 
   'Avena sin gluten cocida (1 taza)
1 plátano en rodajas
1 cucharada de mantequilla de maní
Canela al gusto', 
   380, 12, 58, 14),
  (v_plan_id, 'MARTES', 'COLACION_1', 
   '1 pera mediana
Queso cottage (100g)', 
   170, 14, 22, 3),
  (v_plan_id, 'MARTES', 'ALMUERZO', 
   'Carne de res magra a la plancha (150g)
Puré de papa (sin leche)
Ensalada de pepino y tomate
Agua natural', 
   550, 42, 45, 18),
  (v_plan_id, 'MARTES', 'COLACION_2', 
   'Batido de proteína con agua
1 mandarina', 
   180, 25, 15, 2),
  (v_plan_id, 'MARTES', 'CENA', 
   'Tortilla de claras (4 claras) con champiñones
Ensalada verde grande
1 rebanada pan sin gluten', 
   320, 28, 25, 8);

  -- ==================== MIERCOLES ====================
  INSERT INTO meal_entry (nutritional_plan_id, day_of_week, meal_type, meal_description, calories, protein_grams, carbs_grams, fat_grams) VALUES
  (v_plan_id, 'MIERCOLES', 'DESAYUNO', 
   'Smoothie verde:
- Espinacas
- Plátano
- Leche de almendras
- Proteína en polvo
- Semillas de chía', 
   350, 28, 38, 10),
  (v_plan_id, 'MIERCOLES', 'COLACION_1', 
   'Zanahorias baby (1 taza)
Hummus (3 cucharadas)', 
   150, 5, 18, 7),
  (v_plan_id, 'MIERCOLES', 'ALMUERZO', 
   'Bowl de pollo:
- Pechuga desmenuzada (150g)
- Arroz integral
- Frijoles negros
- Pico de gallo
- Aguacate', 
   580, 48, 52, 18),
  (v_plan_id, 'MIERCOLES', 'COLACION_2', 
   '1 naranja grande
Nueces (15g)', 
   170, 4, 22, 9),
  (v_plan_id, 'MIERCOLES', 'CENA', 
   'Filete de tilapia al vapor (150g)
Vegetales salteados
Camote asado (100g)', 
   380, 35, 35, 8);

  -- ==================== JUEVES ====================
  INSERT INTO meal_entry (nutritional_plan_id, day_of_week, meal_type, meal_description, calories, protein_grams, carbs_grams, fat_grams) VALUES
  (v_plan_id, 'JUEVES', 'DESAYUNO', 
   'Pancakes de avena sin gluten (3 unidades)
Miel de maple (1 cda)
Frutos rojos frescos
Té o café sin azúcar', 
   400, 15, 62, 10),
  (v_plan_id, 'JUEVES', 'COLACION_1', 
   'Yogurt griego (150g)
Granola sin gluten (30g)', 
   220, 18, 24, 6),
  (v_plan_id, 'JUEVES', 'ALMUERZO', 
   'Ensalada César (sin croutones):
- Pollo a la parrilla (150g)
- Lechuga romana
- Queso parmesano
- Aderezo light', 
   480, 45, 15, 28),
  (v_plan_id, 'JUEVES', 'COLACION_2', 
   'Edamames (1/2 taza)
Pepino en rodajas con limón', 
   130, 11, 10, 5),
  (v_plan_id, 'JUEVES', 'CENA', 
   'Lomo de cerdo al horno (150g)
Puré de coliflor
Espárragos a la plancha', 
   420, 38, 18, 22);

  -- ==================== VIERNES ====================
  INSERT INTO meal_entry (nutritional_plan_id, day_of_week, meal_type, meal_description, calories, protein_grams, carbs_grams, fat_grams) VALUES
  (v_plan_id, 'VIERNES', 'DESAYUNO', 
   'Omelette de vegetales:
- 3 huevos
- Pimiento
- Cebolla
- Espinacas
Fruta fresca al lado', 
   380, 24, 20, 24),
  (v_plan_id, 'VIERNES', 'COLACION_1', 
   'Batido de frutas con proteína:
- Fresas
- Leche de almendras
- Proteína', 
   200, 25, 18, 4),
  (v_plan_id, 'VIERNES', 'ALMUERZO', 
   'Wrap de pavo (tortilla sin gluten):
- Pavo rebanado (100g)
- Lechuga, tomate
- Mostaza
Sopa de vegetales', 
   450, 35, 42, 14),
  (v_plan_id, 'VIERNES', 'COLACION_2', 
   'Galletas de arroz (3 unidades)
Mantequilla de almendras (1 cda)', 
   160, 4, 18, 9),
  (v_plan_id, 'VIERNES', 'CENA', 
   'Pollo al curry (sin crema):
- Pechuga de pollo (150g)
- Vegetales mixtos
- Arroz basmati (1/2 taza)
- Curry con leche de coco light', 
   520, 42, 45, 18);

  -- ==================== SABADO ====================
  INSERT INTO meal_entry (nutritional_plan_id, day_of_week, meal_type, meal_description, calories, protein_grams, carbs_grams, fat_grams) VALUES
  (v_plan_id, 'SABADO', 'DESAYUNO', 
   'Huevos benedictinos saludables:
- 2 huevos pochados
- Aguacate en lugar de salsa
- Pan sin gluten tostado
Jugo de naranja natural', 
   450, 20, 35, 28),
  (v_plan_id, 'SABADO', 'COLACION_1', 
   'Mix de frutos secos (30g)
1 manzana verde', 
   200, 5, 25, 12),
  (v_plan_id, 'SABADO', 'ALMUERZO', 
   'Hamburguesa casera saludable:
- Carne magra (150g)
- Pan sin gluten
- Lechuga, tomate, cebolla
- Papas al horno (no fritas)', 
   600, 40, 50, 25),
  (v_plan_id, 'SABADO', 'COLACION_2', 
   'Palitos de apio
Mantequilla de maní (2 cdas)', 
   200, 8, 8, 16),
  (v_plan_id, 'SABADO', 'CENA', 
   'Pizza casera saludable:
- Base de coliflor sin gluten
- Pollo desmenuzado
- Vegetales
- Queso mozzarella light', 
   450, 35, 30, 22);

  -- ==================== DOMINGO ====================
  INSERT INTO meal_entry (nutritional_plan_id, day_of_week, meal_type, meal_description, calories, protein_grams, carbs_grams, fat_grams) VALUES
  (v_plan_id, 'DOMINGO', 'DESAYUNO', 
   'Brunch dominical:
- Tortilla española sin gluten
- Ensalada de frutas
- Té verde o café', 
   420, 22, 40, 20),
  (v_plan_id, 'DOMINGO', 'COLACION_1', 
   'Smoothie bowl:
- Açaí
- Plátano
- Granola sin gluten
- Coco rallado', 
   280, 6, 45, 10),
  (v_plan_id, 'DOMINGO', 'ALMUERZO', 
   'Asado familiar (porción controlada):
- Carne de res magra (150g)
- Ensalada variada grande
- Chimichurri
- Agua con limón', 
   500, 45, 15, 30),
  (v_plan_id, 'DOMINGO', 'COLACION_2', 
   'Gelatina sin azúcar
Nueces (15g)', 
   120, 4, 8, 9),
  (v_plan_id, 'DOMINGO', 'CENA', 
   'Cena ligera:
- Sopa de pollo con vegetales
- Tostadas sin gluten (2)
- Té de manzanilla', 
   320, 25, 35, 8);

  RAISE NOTICE '✅ Plan nutricional completo insertado exitosamente!';
  RAISE NOTICE 'Customer ID: %', v_customer_id;
  RAISE NOTICE 'Plan ID: %', v_plan_id;
  RAISE NOTICE 'Total de comidas insertadas: 35';
  
END $$;

-- Verificar los datos insertados
SELECT 
  c.first_name || ' ' || c.last_name AS cliente,
  c.age AS edad,
  c.weight AS peso_kg,
  c.imc,
  np.name AS plan,
  np.status AS estado,
  np.daily_calories AS calorias_diarias,
  COUNT(me.id) AS total_comidas
FROM customer c
JOIN nutritional_plan np ON np.customer_id = c.id
LEFT JOIN meal_entry me ON me.nutritional_plan_id = np.id
WHERE c.id_card = '1234567890'
GROUP BY c.id, np.id
ORDER BY np.created_at DESC;
