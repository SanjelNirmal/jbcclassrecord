-- Run this inside your Supabase SQL Editor

-- 1. Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    image_url TEXT,
    coordinate_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create records table
CREATE TABLE IF NOT EXISTS public.records (
    id SERIAL PRIMARY KEY,
    level TEXT NOT NULL,
    program_year TEXT NOT NULL,
    month TEXT NOT NULL,
    program TEXT,
    academic_level TEXT,
    academic_year TEXT,
    template_id INTEGER REFERENCES public.templates(id),
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create record_rows table
CREATE TABLE IF NOT EXISTS public.record_rows (
    id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES public.records(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    period TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    pedagogy TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert Default Template
INSERT INTO public.templates (name, width, height, image_url, coordinate_json)
VALUES (
    'Default A4 Landscape', 
    1123, 794, '', 
    '{"fields":[{"id":"level","key":"level","label":"Level","x":100,"y":100,"fontSize":14,"fontFamily":"Arial","align":"left","width":150},{"id":"program_year","key":"program_year","label":"Program Year","x":400,"y":100,"fontSize":14,"fontFamily":"Arial","align":"left","width":150},{"id":"month","key":"month","label":"Month","x":800,"y":100,"fontSize":14,"fontFamily":"Arial","align":"left","width":150},{"id":"date","key":"date","label":"Date","x":80,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":60,"isRepeating":true,"rowSpacing":40},{"id":"period","key":"period","label":"Period","x":150,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":60,"isRepeating":true,"rowSpacing":40},{"id":"subject","key":"subject","label":"Subject","x":220,"y":200,"fontSize":12,"fontFamily":"Arial","align":"left","width":250,"isRepeating":true,"rowSpacing":40},{"id":"topic","key":"topic","label":"Topic","x":500,"y":200,"fontSize":12,"fontFamily":"Arial","align":"left","width":250,"isRepeating":true,"rowSpacing":40},{"id":"start_time","key":"start_time","label":"Start Time","x":780,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":80,"isRepeating":true,"rowSpacing":40},{"id":"end_time","key":"end_time","label":"End Time","x":880,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":80,"isRepeating":true,"rowSpacing":40},{"id":"pedagogy","key":"pedagogy","label":"Pedagogy","x":980,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":100,"isRepeating":true,"rowSpacing":40}]}'
);

