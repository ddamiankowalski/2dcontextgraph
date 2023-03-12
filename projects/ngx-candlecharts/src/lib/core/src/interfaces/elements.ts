import { Element } from "../chart/elements/element";

export interface IElements {
  elementsMap: Map<string, Element[]>;
  dirty: IDirty[];
}

type IDirty = Record<string, boolean>;
