
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from '../models/user-info.model';
import { Pattern } from "../models/pattern.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor (private http: HttpClient) { }

    private userSubject = new BehaviorSubject<UserInfo>(new UserInfo());
    user = this.userSubject.asObservable();

    async getUserInfo() {
        try {
            const response = await fetch('/.auth/me');
            const payload = await response.json();
            const { clientPrincipal } = payload;
            this.userSubject.next(clientPrincipal);
        } catch (error) {
            console.error('No profile could be found');
        }
    }

    getPatterns(): Promise<Response> {
        const user = this.userSubject.getValue();
        return this.http.get<Response>(`/api/getPatterns?for=${user.userId}`).toPromise();
    }

    getPattern(id: any): Promise<Response> {
        const user = this.userSubject.getValue();
        return this.http.get<Response>(`/api/getPattern?for=${user.userId}&id=${id}`).toPromise();
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