
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pattern } from "../models/pattern.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor (private http: HttpClient) { }

    userId = localStorage.getItem('auth@aad') && JSON.parse(localStorage.getItem('auth@aad')!).userId;
    userDetails: string = localStorage.getItem('auth@aad') && JSON.parse(localStorage.getItem('auth@aad')!).userDetails;

    async getUserInfo() {
        try {
            await fetch('/.auth/me');
        } catch (error) {
            console.error('No profile could be found');
        }
    }

    getPatterns(): Promise<Pattern[]> {
        return this.http.get<Pattern[]>(`/api/getPatterns?for=${this.userId}`).toPromise();
    }

    getPattern(id: any): Promise<Pattern[]> {
        return this.http.get<Pattern[]>(`/api/getPattern?for=${this.userId}&id=${id}`).toPromise();
    }

    putPattern(pattern: Pattern): Promise<any> {
        return this.http.put<any>(`/api/putPattern`, pattern).toPromise();
    }
}