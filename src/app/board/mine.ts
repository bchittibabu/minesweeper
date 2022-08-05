export interface Box {
  index: number;
  isMine: boolean
  noOfMinesAround: number;
  isOpened: boolean;
  showDanger: boolean;
  isFlagged: boolean;
}
