import { Box } from "./box.model";
import { UUID } from 'angular2-uuid';

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
  id?: UUID;
  userId?: string;
  name: string = "";
  shafts: number | null = null;
  treadles: number | null = null;
  dpi: number | null = null;
  epi: number | null = null;
  workingWidth: number | null = null;
  selvageWidth: number | null = null;
  waste: number | null = null;
  trompAsWrit: boolean = false;
  halfSett: boolean = false;
  edgeType: string = "";
  edgeLength: number | null = null;
  pieces: number | null = null;
  patternWidth: number | null = null;
  warpMaterial: string = "";
  warpTakeUp: number | null = null;
  warpShrinkage: number | null = null;
  ppi: number | null = null;
  workingLength: number | null = null;
  patternLength: number | null = null;
  weftMaterial: string = "";
  weftTakeUp: number | null = null;
  weftShrinkage: number | null = null;
  srtThreadcount: string = "";
  srtPalette: string = "";
  colorBoxes: Array<Array<Box>> = [];
  threadingBoxes: Array<Box> = [];
  treadlingBoxes: Array<Box> = [];
  tieUpBoxes: Array<Box> = [];
  colors: Array<Yarn> = [];
  sleyOrder: Array<number> = [];
  sleyEpi: string = "";
  weftIn: number = 0;
  warpIn: number = 0;
  totalIn: number = 0;
};