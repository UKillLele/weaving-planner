
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pattern } from "../models/pattern.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor (private http: HttpClient) { }

    private userIdSubject = new BehaviorSubject<any>(null);
    userId = this.userIdSubject.asObservable();
    private userDetailsSubject = new BehaviorSubject<any>(null);
    userDetails = this.userDetailsSubject.asObservable();

    async getUserInfo() {
        try {
            const response = await fetch('/.auth/me');
            const payload = await response.json();
            const { clientPrincipal } = payload;
            this.userIdSubject.next(clientPrincipal.userId);
            this.userDetailsSubject.next(clientPrincipal.userDetails);
        } catch (error) {
            console.error('No profile could be found');
        }
    }

    getPatterns(): Promise<Response> {
        return this.http.get<Response>(`/api/getPatterns?for=${this.userIdSubject.value}`).toPromise();
    }

    getPattern(id: any): Promise<Response> {
        return this.http.get<Response>(`/api/getPattern?for=${this.userIdSubject.value}&id=${id}`).toPromise();
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