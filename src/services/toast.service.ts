import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Box } from '../models/box.model';

@Injectable({
    providedIn: 'root'
})

export class ToastService {    
    toasts: any[] = [];

    show({header, body}: Toast) {
      this.toasts.push({ header, body });
    }

    remove(toast: Toast) {
        this.toasts = this.toasts.filter(t => t != toast);
      }
}

class Toast {
    header?: string;
    body?: string;
}