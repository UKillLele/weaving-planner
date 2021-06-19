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
    private patternLengthSubject = new BehaviorSubject<any>(null);
    patternLength = this.patternLengthSubject.asObservable();
    private epiSubject = new BehaviorSubject<any>(null);
    epi = this.patternLengthSubject.asObservable();
    private workingWidthSubject = new BehaviorSubject<any>(null);
    workingWidth = this.workingWidthSubject.asObservable();
    private leftColSubject = new BehaviorSubject<any>(null);
    leftCol = this.leftColSubject.asObservable();
    private rightColSubject = new BehaviorSubject<any>(null);
    rightCol = this.rightColSubject.asObservable();
    private internalWidthSubject = new BehaviorSubject<any>(null);
    internalWidth = this.internalWidthSubject.asObservable();

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
    changeLeftCol(b: number) {
        if (b) {
            this.leftColSubject.next(b);
        }
    }
    changeRightCol(b: number) {
        if (b) {
            this.rightColSubject.next(b);
        }
    }
    changeInternalWidth(b: number) {
        if (b) {
            console.log(b)
            this.internalWidthSubject.next(b);
        }
    }
}