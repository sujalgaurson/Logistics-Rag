import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AskResponse {
  answer: string;
  supporting_source_text: string[];
  confidence_score: number;
}

export interface ExtractResponse {
  shipment_id: string | null;
  shipper: string | null;
  consignee: string | null;
  pickup_datetime: string | null;
  delivery_datetime: string | null;
  equipment_type: string | null;
  mode: string | null;
  rate: number | null;
  currency: string | null;
  weight: string | null;
  carrier_name: string | null;
}

export async function uploadFile(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function askQuestion(question: string): Promise<AskResponse> {
  const { data } = await api.post<AskResponse>('/ask', { question });
  return data;
}

export async function extractShipment(): Promise<ExtractResponse> {
  const { data } = await api.post<ExtractResponse>('/extract');
  return data;
}
