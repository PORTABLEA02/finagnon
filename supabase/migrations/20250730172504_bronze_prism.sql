/*
  # Données d'exemple pour le système de gestion médicale

  1. Profils utilisateurs de base
  2. Patients d'exemple
  3. Médicaments et fournitures de base
  4. Quelques rendez-vous et consultations d'exemple
*/

-- Insérer des profils utilisateurs (ces utilisateurs doivent être créés via Supabase Auth)
-- Note: Les IDs doivent correspondre aux utilisateurs créés dans auth.users

-- Insérer des patients d'exemple
INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, phone, email, address, emergency_contact, blood_type, allergies) VALUES
  (
    uuid_generate_v4(),
    'Jean',
    'Nguema',
    '1985-03-15',
    'M',
    '+237 690 123 456',
    'jean.nguema@email.com',
    'Yaoundé, Quartier Bastos',
    '+237 690 654 321',
    'A+',
    ARRAY['Pénicilline']
  ),
  (
    uuid_generate_v4(),
    'Marie',
    'Atangana',
    '1992-07-22',
    'F',
    '+237 690 987 654',
    'marie.atangana@email.com',
    'Douala, Akwa',
    '+237 690 111 222',
    'O-',
    ARRAY[]::TEXT[]
  ),
  (
    uuid_generate_v4(),
    'Paul',
    'Mballa',
    '1978-11-08',
    'M',
    '+237 690 555 777',
    'paul.mballa@email.com',
    'Yaoundé, Quartier Melen',
    '+237 690 888 999',
    'B+',
    ARRAY['Aspirine']
  ),
  (
    uuid_generate_v4(),
    'Fatima',
    'Oumarou',
    '1995-06-12',
    'F',
    '+237 690 333 444',
    'fatima.oumarou@email.com',
    'Douala, Bonanjo',
    '+237 690 222 333',
    'AB-',
    ARRAY[]::TEXT[]
  );

-- Insérer des médicaments et fournitures
INSERT INTO medicines (name, category, manufacturer, batch_number, expiry_date, current_stock, min_stock, unit_price, location, unit, description) VALUES
  ('Paracétamol 500mg', 'medication', 'Pharma Cameroun', 'PC2024001', '2025-12-31', 150, 50, 250, 'Pharmacie - Étagère A1', 'boîte', 'Antalgique et antipyrétique'),
  ('Amoxicilline 250mg', 'medication', 'MediCam', 'MC2024002', '2025-06-30', 80, 30, 1800, 'Pharmacie - Étagère B2', 'boîte', 'Antibiotique à large spectre'),
  ('Aspirine 100mg', 'medication', 'Pharma Plus', 'PP2024003', '2025-09-15', 120, 40, 180, 'Pharmacie - Étagère A2', 'boîte', 'Antiagrégant plaquettaire'),
  ('Seringues jetables 5ml', 'medical-supply', 'MedSupply', 'MS2024004', '2026-03-15', 500, 200, 50, 'Salle de soins - Armoire 1', 'pièce', 'Seringues stériles à usage unique'),
  ('Gants latex stériles', 'medical-supply', 'SafeHands', 'SH2024005', '2025-08-20', 25, 20, 1200, 'Salle de soins - Armoire 2', 'boîte de 100', 'Gants d\'examen en latex poudrés'),
  ('Compresses stériles 10x10cm', 'medical-supply', 'SterileSupply', 'SS2024006', '2025-11-30', 60, 30, 800, 'Salle de soins - Étagère C1', 'paquet de 50', 'Compresses de gaze stériles'),
  ('Thermomètre digital', 'equipment', 'MedTech', 'MT2024007', '2027-01-15', 8, 5, 15000, 'Cabinet médical', 'pièce', 'Thermomètre électronique médical'),
  ('Alcool médical 70°', 'consumable', 'ChemMed', 'CM2024008', '2025-09-10', 25, 15, 2500, 'Salle de soins - Armoire 3', 'litre', 'Solution désinfectante'),
  ('Bandelettes test glucose', 'diagnostic', 'DiagnoTest', 'DT2024009', '2025-04-30', 12, 10, 8500, 'Laboratoire - Réfrigérateur', 'boîte de 50', 'Test rapide de glycémie'),
  ('Coton hydrophile', 'consumable', 'CottonCare', 'CC2024010', '2026-12-31', 18, 20, 1500, 'Salle de soins - Étagère D1', 'paquet 500g', 'Coton médical stérile');

-- Fonction pour générer des données d'exemple après création des utilisateurs
CREATE OR REPLACE FUNCTION generate_sample_appointments_and_records()
RETURNS void AS $$
DECLARE
  patient_ids UUID[];
  doctor_ids UUID[];
  admin_ids UUID[];
  sample_patient_id UUID;
  sample_doctor_id UUID;
  sample_appointment_id UUID;
  sample_record_id UUID;
BEGIN
  -- Récupérer les IDs des patients
  SELECT ARRAY(SELECT id FROM patients LIMIT 4) INTO patient_ids;
  
  -- Récupérer les IDs des médecins
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'doctor' LIMIT 2) INTO doctor_ids;
  
  -- Récupérer les IDs des admins
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'admin' LIMIT 1) INTO admin_ids;
  
  -- Vérifier qu'on a des données
  IF array_length(patient_ids, 1) > 0 AND array_length(doctor_ids, 1) > 0 THEN
    
    -- Créer quelques rendez-vous d'exemple
    INSERT INTO appointments (patient_id, doctor_id, date, time, duration, reason, status, created_by) VALUES
      (patient_ids[1], doctor_ids[1], CURRENT_DATE + INTERVAL '1 day', '09:00', 30, 'Consultation de routine', 'confirmed', COALESCE(admin_ids[1], doctor_ids[1])),
      (patient_ids[2], doctor_ids[1], CURRENT_DATE + INTERVAL '1 day', '10:30', 45, 'Contrôle cardiologique', 'scheduled', COALESCE(admin_ids[1], doctor_ids[1])),
      (patient_ids[1], doctor_ids[1], CURRENT_DATE - INTERVAL '5 days', '14:00', 30, 'Douleurs thoraciques', 'completed', COALESCE(admin_ids[1], doctor_ids[1]));
    
    -- Créer des dossiers médicaux pour les consultations passées
    SELECT id INTO sample_appointment_id FROM appointments WHERE status = 'completed' LIMIT 1;
    SELECT patient_id INTO sample_patient_id FROM appointments WHERE id = sample_appointment_id;
    SELECT doctor_id INTO sample_doctor_id FROM appointments WHERE id = sample_appointment_id;
    
    IF sample_appointment_id IS NOT NULL THEN
      INSERT INTO medical_records (patient_id, doctor_id, appointment_id, date, type, reason, symptoms, diagnosis, treatment, notes)
      VALUES (
        sample_patient_id,
        sample_doctor_id,
        sample_appointment_id,
        CURRENT_DATE - INTERVAL '5 days',
        'specialist',
        'Douleurs thoraciques',
        'Douleur oppressante au niveau du thorax, essoufflement léger',
        'Suspicion d''angine de poitrine',
        'Repos, surveillance, examens complémentaires',
        'Patient anxieux, antécédents familiaux de maladie cardiaque'
      ) RETURNING id INTO sample_record_id;
      
      -- Ajouter des prescriptions
      INSERT INTO prescriptions (medical_record_id, medication, dosage, frequency, duration, instructions) VALUES
        (sample_record_id, 'Aspirine 75mg', '1 comprimé', '1 fois par jour', '30 jours', 'À prendre le matin avec un verre d''eau'),
        (sample_record_id, 'Atorvastatine 20mg', '1 comprimé', '1 fois par jour le soir', '90 jours', 'À prendre après le dîner');
    END IF;
    
    -- Créer quelques factures d'exemple
    INSERT INTO invoices (id, patient_id, appointment_id, date, subtotal, tax, total, status, created_by) VALUES
      ('INV-2024-00001', patient_ids[1], sample_appointment_id, CURRENT_DATE - INTERVAL '5 days', 40000, 0, 40000, 'paid', COALESCE(admin_ids[1], doctor_ids[1])),
      ('INV-2024-00002', patient_ids[2], NULL, CURRENT_DATE - INTERVAL '2 days', 35000, 0, 35000, 'pending', COALESCE(admin_ids[1], doctor_ids[1]));
    
    -- Ajouter des éléments de facture
    INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES
      ('INV-2024-00001', 'Consultation cardiologique', 1, 25000, 25000),
      ('INV-2024-00001', 'ECG', 1, 15000, 15000),
      ('INV-2024-00002', 'Consultation générale', 1, 15000, 15000),
      ('INV-2024-00002', 'Analyses sanguines', 1, 20000, 20000);
    
    -- Ajouter un paiement pour la facture payée
    INSERT INTO payments (invoice_id, amount, payment_method, payment_date, reference, created_by) VALUES
      ('INV-2024-00001', 40000, 'card', CURRENT_DATE - INTERVAL '5 days', 'CARD-20240115-0001', COALESCE(admin_ids[1], doctor_ids[1]));
    
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Note: Cette fonction sera appelée après la création des utilisateurs via l'interface