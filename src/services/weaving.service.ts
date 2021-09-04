import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Box } from '../models/box.model';

@Injectable({
    providedIn: 'root'
})

export class WeavingService {    
    constructor() { }
    
    private threadingBoxesSubject = new BehaviorSubject<any>(null);
    threadingBoxes = this.threadingBoxesSubject.asObservable();
    private tieUpBoxesSubject = new BehaviorSubject<any>(null);
    tieUpBoxes = this.tieUpBoxesSubject.asObservable();
    private treadlingBoxesSubject = new BehaviorSubject<any>(null);
    treadlingBoxes = this.treadlingBoxesSubject.asObservable();
    private visualizerBoxesSubject = new BehaviorSubject<any>(null);
    visualizerBoxes = this.visualizerBoxesSubject.asObservable();
    private colorBoxesSubject = new BehaviorSubject<any>(null);
    colorBoxes = this.colorBoxesSubject.asObservable();
    private shaftsSubject = new BehaviorSubject<any>(null);
    shafts = this.shaftsSubject.asObservable();
    private treadlesSubject = new BehaviorSubject<any>(null);
    treadles = this.treadlesSubject.asObservable();
    private warpSubject = new BehaviorSubject<any>(null);
    warp = this.warpSubject.asObservable();
    private widthSubject = new BehaviorSubject<any>(null);
    width = this.widthSubject.asObservable();
    private trompAsWritSubject = new BehaviorSubject<any>(null);
    trompAsWrit = this.trompAsWritSubject.asObservable();
    private halfSettSubject = new BehaviorSubject<any>(null);
    halfSett = this.halfSettSubject.asObservable();
    private patternLengthSubject = new BehaviorSubject<any>(null);
    patternLength = this.patternLengthSubject.asObservable();
    private epiSubject = new BehaviorSubject<any>(null);
    epi = this.epiSubject.asObservable();
    private workingWidthSubject = new BehaviorSubject<any>(null);
    workingWidth = this.workingWidthSubject.asObservable();
    private boxWidthSubject = new BehaviorSubject<any>(null);
    boxWidth = this.boxWidthSubject.asObservable();
    private internalWidthSubject = new BehaviorSubject<any>(null);
    internalWidth = this.internalWidthSubject.asObservable();
    private selectedColorSubject = new BehaviorSubject<any>(null);
    selectedColor = this.selectedColorSubject.asObservable();

    changeThreadingBoxes(b: Box[]) {
        if (b) {
            this.threadingBoxesSubject.next(b);
        }
    }
    changeTieUpBoxes(b: Box[]) {
        if (b) {
            this.tieUpBoxesSubject.next(b);
        }
    }
    changeTreadlingBoxes(b: Box[]) {
        if (b) {
            this.treadlingBoxesSubject.next(b);
        }
    }
    changeVisualizerBoxes(b: Box[]) {
        if (b) {
            this.visualizerBoxesSubject.next(b);
        }
    }
    changeColorBoxes(b: Box[][]) {
        if (b) {
            this.colorBoxesSubject.next(b);
        }
    }
    changeShafts(b: number) {
        if (b) {
            this.shaftsSubject.next(b);
        }
    }
    changeTreadles(b: number) {
        if (b) {
            this.treadlesSubject.next(b);
        }
    }
    changeWarp(b: number) {
        if (b) {
            this.warpSubject.next(b);
        }
    }
    changeTromp(b: boolean) {
        if (b) {
            this.trompAsWritSubject.next(b);
        }
    }
    changeHalfSett(b: boolean) {
        if (b) {
            this.halfSettSubject.next(b);
        }
    }
    changePatternLength(b: number) {
        if (b) {
            this.patternLengthSubject.next(b);
        }
    }
    changeEpi(b: number) {
        if (b) {
            this.epiSubject.next(b);
        }
    }
    changeWorkingWidth(b: number) {
        if (b) {
            this.workingWidthSubject.next(b);
        }
    }
    changeBoxWidth(b: number) {
        if (b) {
            this.boxWidthSubject.next(b);
        }
    }
    changeInternalWidth(b: number) {
        if (b) {
            this.internalWidthSubject.next(b);
        }
    }
    changeSelectedColor(b: string) {
        if (b) {
            this.selectedColorSubject.next(b);
        }
    }
}