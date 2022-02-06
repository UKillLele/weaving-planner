import { Box } from "./box.model";
import { UUID } from 'angular2-uuid';

export class Yarn {
  colorCode: string = "";
  colorInches: number = 0;
  colorYds: number = 0;
  colorPricePerUnit: number | null = null;
  colorUnitYds: number | null = null;
  colorUnitsNeeded: number | null = null;
  colorTotalPrice: number | null = null;
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
  finishedWidth: number | null = null;
  selvedgeWidth: number | null = null;
  waste: number | null = null;
  trompAsWrit: boolean = false;
  halfSett: boolean = false;
  topEdgeType: string = "";
  topEdgeLength: number | null = null;
  bottomEdgeType: string = "";
  bottomEdgeLength: number | null = null;
  pieces: number | null = null;
  patternWidth: number | null = null;
  warpMaterial: string = "";
  warpTakeUp: number | null = null;
  warpShrinkage: number | null = null;
  weftLeftFringe: number | null = null;
  weftRightFringe: number | null = null;
  ppi: number | null = null;
  finishedLength: number | null = null;
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
  weftYds: number = 0;
  warpYds: number = 0;
  totalYds: number = 0;
  sampleLength: number | null = null;
  sampleOffLoomLength: number | null = null;
  sampleAfterWashLength: number | null = null;
  sampleOffLoomWidth: number | null = null;
  sampleAfterWashWidth: number | null = null;
  lpr: number = 1;
  wpr: number = 1;
  widthInReed: number = 0;
  widthInReedNoFringe: number = 0;
  lengthOnLoom: number = 0;
  totalPrice: number = 0;
};