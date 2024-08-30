import { janitorKim } from "../instances";
import { OptionsCharacterDetails, ResponseCharacterDetails } from "./types";

export const characterDetails = ({ params: { id } }: OptionsCharacterDetails) =>
  janitorKim<ResponseCharacterDetails>(`/characters/${id}`);
