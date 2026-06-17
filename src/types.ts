export interface RecordRow {
  id?: number;
  date: string;
  period: string;
  subject: string;
  topic: string;
  start_time: string;
  end_time: string;
  pedagogy: string;
}

export interface ClassRecord {
  id?: number;
  level: string;
  program_year: string;
  month: string;
  program?: string;
  academic_level?: string;
  academic_year?: string;
  template_id: number;
  created_at?: string;
  rows?: RecordRow[];
}

export interface TemplateField {
  id: string;
  key: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  align: 'left' | 'center' | 'right';
  width: number;
  isRepeating?: boolean; // If true, repeats for every row
  rowSpacing?: number; // How much Y increases per row
}

export interface PrintingCoordinateData {
  fields: TemplateField[];
}

export interface Template {
  id?: number;
  name: string;
  width: number; // document physical dimensions (px at 96dpi or mm)
  height: number;
  image_url: string;
  coordinate_json: string; // serialized PrintingCoordinateData
}
