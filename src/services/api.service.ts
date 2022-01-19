
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pattern } from "../models/pattern.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor (private http: HttpClient) { }

    id = localStorage.getItem('auth@aad') ? JSON.parse(localStorage.getItem('auth@aad')!).userId : "";
    userDetails: string = localStorage.getItem('auth@aad') && JSON.parse(localStorage.getItem('auth@aad')!).userDetails;

    async getUserInfo() {
        try {
            await fetch('/.auth/me');
        } catch (error) {
            console.error('No profile could be found');
        }
    }

    getPatterns(): Promise<Pattern[]> {
        return this.http.get<Pattern[]>(`/api/getPatterns?for=${this.id}`).toPromise();
    }

    async getPattern(id: any): Promise<Pattern> {
        console.log(`/api/getPattern?for=${this.id}&id=${id}`)
        return this.http.get<Pattern>(`/api/getPattern?for=${this.id}&id=${id}`).toPromise();
    }

    putPattern(pattern: Pattern): Promise<Pattern> {
        return this.http.put<Pattern>(`/api/putPattern?for=${this.id}`, JSON.stringify(pattern)).toPromise();
    }
}