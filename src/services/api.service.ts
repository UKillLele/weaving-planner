
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pattern } from "../models/pattern.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor (private http: HttpClient) { }

    userId: string = localStorage.getItem('auth@aad') && JSON.parse(localStorage.getItem('auth@aad')!).userId;
    userDetails: string = localStorage.getItem('auth@aad') && JSON.parse(localStorage.getItem('auth@aad')!).userDetails;

    async getUserInfo() {
        try {
            const response = await fetch('/.auth/me');
            const payload = await response.json();
            const { clientPrincipal } = payload;
            localStorage.setItem("auth@aad", JSON.stringify(clientPrincipal));
            this.userId = clientPrincipal.userId;
            this.userDetails = clientPrincipal.userDetails;
        } catch (error) {
            console.error('No profile could be found');
        }
    }

    getPatterns(): Promise<Response> {
        return this.http.get<Response>(`/api/getPatterns?for=${this.userId}`).toPromise();
    }

    getPattern(id: any): Promise<Response> {
        return this.http.get<Response>(`/api/getPattern?for=${this.userId}&id=${id}`).toPromise();
    }

    putPattern(pattern: Pattern): Promise<Response> {
        return this.http.post<Response>(`/api/putPattern`, pattern).toPromise();
    }
}

class Response {
    success?: boolean;
    data: any = null;
    error?: string;
}