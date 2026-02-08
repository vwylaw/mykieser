
const API_BASE_URL = 'https://api.prod.client.kieser-logic.plus/v7/konnect';

import type { AuthResponse, TrainingCardItem, TrainingCardSession, TrainingCardSessionResult } from './types';

export class KieserClient {
    private token: string | null = null;
    private refreshToken: string | null = null;

    constructor() {
        this.token = localStorage.getItem('token');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    setToken(token: string, refreshToken: string) {
        this.token = token;
        this.refreshToken = refreshToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    }

    clearToken() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data;
    }

    async refreshAuth(): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshtoken: this.refreshToken }),
        });
        if (!response.ok) {
            this.clearToken();
            throw new Error('Refresh failed');
        }
        return await response.json();
    }

    private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
        if (!this.token) {
            throw new Error('No token');
        }

        const makeRequest = async (token: string) => {
            const headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            return fetch(`${API_BASE_URL}${url}`, { ...options, headers });
        };

        let response = await makeRequest(this.token);

        if (response.status === 401) {
            // Try refresh
            try {
                const refreshData = await this.refreshAuth();
                // Update token
                this.setToken(refreshData.data.token, refreshData.data.refreshtoken);
                // Retry original request
                response = await makeRequest(this.token!);
            } catch (e) {
                // Refresh failed, redirect to login or throw
                this.clearToken();
                window.location.hash = '#/login'; // Redirect to login on hash router
                throw e;
            }
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async getTrainingCard(id?: string): Promise<{ data: { extra: { trainingcarditem: TrainingCardItem[] }, lists: any, record?: any } }> {
        const url = id ? `/training-card?id=${id}` : '/training-card';
        return this.fetchWithAuth(url);
    }

    async getSessions(): Promise<{ data: { query: { rows: TrainingCardSession[] } } }> {
        return this.fetchWithAuth('/training-card-session/query');
    }

    async getSessionResults(kiesermachineId?: string): Promise<{ data: { query: { rows: TrainingCardSessionResult[] } } }> {
        let url = '/training-card-session-result/query';
        if (kiesermachineId) {
            url += `?kiesermachine=${kiesermachineId}`;
        }
        return this.fetchWithAuth(url);
    }
}

export const apiClient = new KieserClient();
