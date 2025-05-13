import { POST as chatBotHandler } from '../../app/api/chat_bot/route';
import { POST as removeOutlierHandler } from '../../app/api/remove_outlier/route';
import { POST as detectOutliersHandler } from '../../app/api/detect_outliers/route';
import { POST as processDatasetHandler } from '../../app/api/process_dataset/route';
import { POST as performMappingHandler } from '../../app/api/perform_mapping/route';
import { POST as extractInsightHandler } from '../../app/api/extract_insight/route';
import { POST as columnMappingHandler } from '../../app/api/column_mapping/route';
import { POST as cleanDataHandler } from '../../app/api/clean_data/route';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

jest.mock('axios');
const axios = require('axios');

const mockNextRequest = (body: Record<string, unknown>): NextRequest => {
    const readable = new Readable({
      read() {
        this.push(JSON.stringify(body));
        this.push(null);
      },
    });

    return new Request('http://localhost/api', {
        method: 'POST',
        body: readable as unknown as ReadableStream,
        headers: { 'Content-Type': 'application/json' },
      }) as unknown as NextRequest;
};

describe('API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Chat Bot API
  describe('Chat Bot API', () => {
    it('should return 400 if query is missing', async () => {
      const req = mockNextRequest({ context: {}, user_id: '123', column_mapping: {} });
      const res = await chatBotHandler(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Query is missing');
    });

    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: { image: 'base64_image_data' } });

      const req = mockNextRequest({
        query: 'What is the sales trend?',
        context: {},
        user_id: '123',
        column_mapping: {},
      });
      const res = await chatBotHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Chat Bot Response generated succesfully !');
      expect(json.image).toBe('base64_image_data');
    });
  });

  // Remove Outlier API
  describe('Remove Outlier API', () => {
    it('should return 400 if user_id is missing', async () => {
      const req = mockNextRequest({ outlierOptions: 'method1' });
      const res = await removeOutlierHandler(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('User ID is missing');
    });

    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: { message: 'Outliers Removed successfully!' } });

      const req = mockNextRequest({ user_id: '123', outlierOptions: 'method1' });
      const res = await removeOutlierHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Outliers Removed successfully!');
    });
  });

  // Detect Outliers API
  describe('Detect Outliers API', () => {
    it('should return 400 if user_id is missing', async () => {
      const req = mockNextRequest({});
      const res = await detectOutliersHandler(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('User ID is missing');
    });

    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: { outliers: [], boxplots: {} } });

      const req = mockNextRequest({ user_id: '123' });
      const res = await detectOutliersHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Outliers detected successfully!');
    });
  });

  // Process Dataset API
  describe('Process Dataset API', () => {
    it('should return 400 if file is missing', async () => {
      const req = mockNextRequest({ user_id: '123' });
      const res = await processDatasetHandler(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('No file uploaded');
    });

    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: { context_report: 'report', file_id: 'file123' } });

      const req = mockNextRequest({ user_id: '123', file: 'test.csv' });
      const res = await processDatasetHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('File uploaded and processed successfully!');
    });
  });

  // Perform Mapping API
  describe('Perform Mapping API', () => {
    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: {} });

      const req = mockNextRequest({ user_id: '123', mapping: {} });
      const res = await performMappingHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Data mapped successfully!');
    });
  });

  // Extract Insight API
  describe('Extract Insight API', () => {
    it('should return 400 if user_description is missing', async () => {
      const req = mockNextRequest({ user_id: '123' });
      const res = await extractInsightHandler(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('No user description provided');
    });

    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: { business_insight: 'insight', output_path: 'path' } });

      const req = mockNextRequest({ user_id: '123', user_description: 'desc' });
      const res = await extractInsightHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Business insight extracted successfully!');
    });
  });

  // Column Mapping API
  describe('Column Mapping API', () => {
    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: { available_columns: [], expected_columns: [] } });

      const req = mockNextRequest({ user_id: '123', context: {} });
      const res = await columnMappingHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Data cleaned successfully!');
    });
  });

  // Clean Data API
  describe('Clean Data API', () => {
    it('should return 200 if valid data is provided', async () => {
      axios.post.mockResolvedValueOnce({ data: {} });

      const req = mockNextRequest({ user_id: '123', choice: 'option' });
      const res = await cleanDataHandler(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Data cleaned successfully!');
    });
  });
});