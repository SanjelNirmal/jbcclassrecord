import { Template, ClassRecord } from '../types';
import { supabase } from './supabase';

export const api = {
  getTemplates: async (): Promise<Template[]> => {
    let { data, error } = await supabase.from('templates').select('*').order('id', { ascending: true });
    if (error) throw error;
    
    // Auto-seed default template if none exist
    if (!data || data.length === 0) {
      const defaultFields = {"fields":[{"id":"level","key":"level","label":"Level","x":130,"y":270,"fontSize":16,"fontFamily":"Arial","align":"left","width":150},{"id":"program_year","key":"program_year","label":"Program Year","x":480,"y":270,"fontSize":16,"fontFamily":"Arial","align":"left","width":150},{"id":"month","key":"month","label":"Month","x":770,"y":270,"fontSize":16,"fontFamily":"Arial","align":"left","width":150},{"id":"date","key":"date","label":"Date","x":80,"y":380,"fontSize":14,"fontFamily":"Arial","align":"center","width":50,"isRepeating":true,"rowSpacing":75},{"id":"period","key":"period","label":"Period","x":150,"y":380,"fontSize":14,"fontFamily":"Arial","align":"center","width":60,"isRepeating":true,"rowSpacing":75},{"id":"subject","key":"subject","label":"Subject","x":230,"y":380,"fontSize":14,"fontFamily":"Arial","align":"left","width":230,"isRepeating":true,"rowSpacing":75},{"id":"topic","key":"topic","label":"Topic","x":480,"y":380,"fontSize":14,"fontFamily":"Arial","align":"left","width":180,"isRepeating":true,"rowSpacing":75},{"id":"start_time","key":"start_time","label":"Start Time","x":680,"y":380,"fontSize":14,"fontFamily":"Arial","align":"center","width":60,"isRepeating":true,"rowSpacing":75},{"id":"end_time","key":"end_time","label":"End Time","x":760,"y":380,"fontSize":14,"fontFamily":"Arial","align":"center","width":70,"isRepeating":true,"rowSpacing":75},{"id":"pedagogy","key":"pedagogy","label":"Pedagogy","x":850,"y":380,"fontSize":14,"fontFamily":"Arial","align":"center","width":90,"isRepeating":true,"rowSpacing":75}]};
      
      const { data: newData, error: insertError } = await supabase.from('templates').insert({
        name: 'Default A4 Landscape',
        width: 1123,
        height: 794,
        image_url: '',
        coordinate_json: JSON.stringify(defaultFields)
      }).select('*').single();
      
      if (!insertError && newData) {
        return [newData];
      }
    }
    
    return data || [];
  },
  getTemplate: async (id: number): Promise<Template> => {
    const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  createTemplate: async (formData: FormData): Promise<{ id: number }> => {
    const name = formData.get('name') as string;
    const width = Number(formData.get('width'));
    const height = Number(formData.get('height'));
    const coordinate_json = formData.get('coordinate_json') as string;
    const file = formData.get('image') as File | null;

    let image_url = '';
    if (file) {
      image_url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const { data, error } = await supabase.from('templates').insert({
      name, width, height, coordinate_json, image_url
    }).select('id').single();
    if (error) throw error;
    return data;
  },
  updateTemplate: async (id: number, data: Partial<Template>): Promise<{ success: boolean }> => {
    const { error } = await supabase.from('templates').update(data).eq('id', id);
    if (error) throw error;
    return { success: true };
  },
  uploadTemplateImage: async (id: number, formData: FormData): Promise<{ image_url: string }> => {
    const file = formData.get('image') as File;
    if (!file) throw new Error('No image file provided');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        const { error: updateError } = await supabase.from('templates').update({ image_url: base64String }).eq('id', id);
        if (updateError) {
           reject(updateError);
        } else {
           resolve({ image_url: base64String });
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },
  getRecords: async (): Promise<ClassRecord[]> => {
    const { data, error } = await supabase.from('records').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  getRecord: async (id: number): Promise<ClassRecord> => {
    const { data: record, error } = await supabase.from('records').select('*').eq('id', id).single();
    if (error) throw error;

    const { data: rows, error: rowsError } = await supabase.from('record_rows').select('*').eq('record_id', id).order('id', { ascending: true });
    if (rowsError) throw rowsError;

    return { ...record, rows };
  },
  createRecord: async (data: ClassRecord): Promise<{ id: number }> => {
    const { data: userData } = await supabase.auth.getUser();
    
    // Insert record
    const { rows, id, created_at, ...recordFields } = data;
    const { data: newRecord, error } = await supabase.from('records').insert({
      ...recordFields,
      user_id: userData.user?.id
    }).select('id').single();
    if (error) throw error;

    // Insert rows
    if (rows && rows.length > 0) {
      const rowsToInsert = rows.map(r => ({
        record_id: newRecord.id,
        date: r.date,
        period: r.period,
        subject: r.subject,
        topic: r.topic,
        start_time: r.start_time,
        end_time: r.end_time,
        pedagogy: r.pedagogy
      }));
      const { error: rowsError } = await supabase.from('record_rows').insert(rowsToInsert);
      if (rowsError) throw rowsError;
    }

    return newRecord;
  },
  updateRecord: async (id: number, data: ClassRecord): Promise<{ success: boolean }> => {
    const { rows, id: _id, created_at, user_id, ...recordFields } = data as any;
    
    // Update record
    const { error } = await supabase.from('records').update(recordFields).eq('id', id);
    if (error) throw error;

    // Delete existing rows and re-insert
    const { error: deleteError } = await supabase.from('record_rows').delete().eq('record_id', id);
    if (deleteError) throw deleteError;

    if (rows && rows.length > 0) {
      const rowsToInsert = rows.map(r => ({
        record_id: id,
        date: r.date,
        period: r.period,
        subject: r.subject,
        topic: r.topic,
        start_time: r.start_time,
        end_time: r.end_time,
        pedagogy: r.pedagogy
      }));
      const { error: rowsError } = await supabase.from('record_rows').insert(rowsToInsert);
      if (rowsError) throw rowsError;
    }

    return { success: true };
  }
};
