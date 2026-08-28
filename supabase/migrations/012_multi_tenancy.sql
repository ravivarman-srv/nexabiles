-- 1. Add org_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS org_id UUID;
UPDATE public.profiles SET org_id = user_id WHERE org_id IS NULL;
ALTER TABLE public.profiles ALTER COLUMN org_id SET NOT NULL;

-- 2. Create get_current_org_id()
CREATE OR REPLACE FUNCTION public.get_current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 3. Update handle_new_user() trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, org_id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'org_id')::uuid, NEW.id),
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- 4. Rename user_id to org_id in entity tables (idempotent)
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN 
        SELECT unnest(ARRAY[
            'contacts', 'tags', 'custom_fields', 'contact_notes', 
            'conversations', 'whatsapp_config', 'message_templates', 
            'pipelines', 'deals', 'broadcasts', 'automations', 
            'automation_logs', 'error_logs'
        ])
    LOOP
        -- Only rename if user_id still exists (i.e., not already renamed)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = t_name
            AND column_name = 'user_id'
        ) THEN
            EXECUTE format('ALTER TABLE %I RENAME COLUMN user_id TO org_id', t_name);
        END IF;
    END LOOP;
END $$;

-- 5. Drop old policies and create new ones
-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id OR org_id = public.get_current_org_id());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- contacts
DROP POLICY IF EXISTS "Users can manage own contacts" ON contacts;
CREATE POLICY "Users can manage own contacts" ON contacts FOR ALL USING (org_id = public.get_current_org_id());

-- tags
DROP POLICY IF EXISTS "Users can manage own tags" ON tags;
CREATE POLICY "Users can manage own tags" ON tags FOR ALL USING (org_id = public.get_current_org_id());

-- contact_tags
DROP POLICY IF EXISTS "Users can manage contact tags" ON contact_tags;
CREATE POLICY "Users can manage contact tags" ON contact_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM contacts WHERE contacts.id = contact_tags.contact_id AND contacts.org_id = public.get_current_org_id()));

-- custom_fields
DROP POLICY IF EXISTS "Users can manage own custom fields" ON custom_fields;
CREATE POLICY "Users can manage own custom fields" ON custom_fields FOR ALL USING (org_id = public.get_current_org_id());

-- contact_custom_values
DROP POLICY IF EXISTS "Users can manage contact custom values" ON contact_custom_values;
CREATE POLICY "Users can manage contact custom values" ON contact_custom_values FOR ALL
  USING (EXISTS (SELECT 1 FROM contacts WHERE contacts.id = contact_custom_values.contact_id AND contacts.org_id = public.get_current_org_id()));

-- contact_notes
DROP POLICY IF EXISTS "Users can manage own notes" ON contact_notes;
CREATE POLICY "Users can manage own notes" ON contact_notes FOR ALL USING (org_id = public.get_current_org_id());

-- conversations
DROP POLICY IF EXISTS "Users can manage own conversations" ON conversations;
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (org_id = public.get_current_org_id());

-- messages
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Service role can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can manage messages" ON messages;
CREATE POLICY "Users can manage messages" ON messages FOR ALL
  USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.org_id = public.get_current_org_id()));

-- whatsapp_config
DROP POLICY IF EXISTS "Users can manage own config" ON whatsapp_config;
CREATE POLICY "Users can manage own config" ON whatsapp_config FOR ALL USING (org_id = public.get_current_org_id());

-- message_templates
DROP POLICY IF EXISTS "Users can manage own templates" ON message_templates;
CREATE POLICY "Users can manage own templates" ON message_templates FOR ALL USING (org_id = public.get_current_org_id());

-- pipelines
DROP POLICY IF EXISTS "Users can manage own pipelines" ON pipelines;
CREATE POLICY "Users can manage own pipelines" ON pipelines FOR ALL USING (org_id = public.get_current_org_id());

-- pipeline_stages
DROP POLICY IF EXISTS "Users can manage pipeline stages" ON pipeline_stages;
CREATE POLICY "Users can manage pipeline stages" ON pipeline_stages FOR ALL
  USING (EXISTS (SELECT 1 FROM pipelines WHERE pipelines.id = pipeline_stages.pipeline_id AND pipelines.org_id = public.get_current_org_id()));

-- deals
DROP POLICY IF EXISTS "Users can manage own deals" ON deals;
CREATE POLICY "Users can manage own deals" ON deals FOR ALL USING (org_id = public.get_current_org_id());

-- broadcasts
DROP POLICY IF EXISTS "Users can manage own broadcasts" ON broadcasts;
CREATE POLICY "Users can manage own broadcasts" ON broadcasts FOR ALL USING (org_id = public.get_current_org_id());

-- broadcast_recipients
DROP POLICY IF EXISTS "Users can manage broadcast recipients" ON broadcast_recipients;
CREATE POLICY "Users can manage broadcast recipients" ON broadcast_recipients FOR ALL
  USING (EXISTS (SELECT 1 FROM broadcasts WHERE broadcasts.id = broadcast_recipients.broadcast_id AND broadcasts.org_id = public.get_current_org_id()));

-- automations
DROP POLICY IF EXISTS "Users can manage own automations" ON automations;
CREATE POLICY "Users can manage own automations" ON automations FOR ALL USING (org_id = public.get_current_org_id());

-- automation_logs
DROP POLICY IF EXISTS "Users can manage own automation logs" ON automation_logs;
CREATE POLICY "Users can manage own automation logs" ON automation_logs FOR ALL USING (org_id = public.get_current_org_id());

-- error_logs
DROP POLICY IF EXISTS "Users can insert their own error logs" ON error_logs;
DROP POLICY IF EXISTS "Users can view their own error logs" ON error_logs;
DROP POLICY IF EXISTS "Users can manage own error logs" ON error_logs;
CREATE POLICY "Users can manage own error logs" ON error_logs FOR ALL USING (org_id = public.get_current_org_id());
