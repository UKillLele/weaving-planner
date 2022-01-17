
import { HttpClient } from '@angular/common/http';

export class ApiService {
    constructor (private http: HttpClient) { }

    getPatterns() {
        let result = "";
        this.http.get('/api/getPatterns')
            .subscribe((resp: any) => result = resp.text);
        return result;
    }
}