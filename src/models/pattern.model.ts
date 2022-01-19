import { Box } from "./box.model";
import { Guid } from 'guid-typescript';

export class Yarn {
  colorName: string = "";
  colorCode: string = "";
  colorInches: number = 0;
  perfectMatch: boolean = false;
}

export class SRTColor {
  key: string = "";
  hex: string = "";
}

export class Pattern {
  id?: Guid;
  userId?: string;
  name: string = "";
  shafts: number = 0;
  treadles: number = 0;
  epi: number = 0;
  workingWidth: number = 0;
  selvageWidth: number = 0;
  waste: number = 0;
  trompAsWrit: boolean = false;
  halfSett: boolean = false;
  edgeType: string = "";
  edgeLength: number = 0;
  pieces: number = 0;
  patternWidth: number = 0;
  warpMaterial: string = "";
  warpDrawIn: number = 0;
  warpShrinkage: number = 0;
  ppi: number = 0;
  workingLength: number = 0;
  patternLength: number = 0;
  weftMaterial: string = "";
  weftDrawIn: number = 0;
  weftShrinkage: number = 0;
  srtThreadcount: string = "";
  srtPalette: string = "";
  colorBoxes: Array<Array<Box>> = [];
  threadingBoxes: Array<Box> = [];
  treadlingBoxes: Array<Box> = [];
  colors: Array<Yarn> = [];
  weftIn: number = 0;
  warpIn: number = 0;
  totalIn: number = 0;
};