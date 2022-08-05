import { Component, OnInit } from '@angular/core';
import { Box } from './mine';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  boxArr: Box[] = [];
  numberOfRows: number = 9;
  numberOfColumns: number = 9;
  numberOfMines: number = 12;
  total: number = 0;
  gridRow: string = '';
  gridColumn: string = '';
  constructor() { }

  ngOnInit(): void {
    this.gridRow = `repeat(${this.numberOfRows},4rem)`
    this.gridColumn = `repeat(${this.numberOfColumns},4rem)`
    this.total = this.numberOfRows * this.numberOfColumns;
    this.prepareBoxes();
  }

  prepareBoxes() {
    for(let i = 1; i <= this.total; i++){
      const box: Box = {
        index: i,
        isMine: false,
        noOfMinesAround: 0,
        isOpened: false,
        showDanger: false,
        isFlagged: false
      }
      this.boxArr.push(box);
    }

    const boxesWithMine = this.getRandomBoxesForSettingMines();
    boxesWithMine.map((a)=>{
      a.isMine = true;
    });

    for(let i = 0; i < this.total; i++){
     const box = this.boxArr[i];
     if(box.isMine){
       continue;
     }
     let noOfMinesAround = 0;
     let filterArr: number[] = this.getFilterArray(box);
     filterArr.forEach(index => {
       const selectedBoxIndex = box.index - 1 + index;
       if(selectedBoxIndex >= 0 && selectedBoxIndex < this.total){
         if(this.boxArr[selectedBoxIndex].isMine){
           noOfMinesAround++;
         }
       }
     });
     box.noOfMinesAround = noOfMinesAround;

    }
  }

  open(box: Box){
    if(box.isOpened){
      return;
    }
    if(box.isMine){
      box.showDanger = true;
      this.openAll();
    }
    else{
      box.isOpened = true;
      this.openEmptyBoxes(box);
    }

    const unOpenedBoxed = this.boxArr.filter(b => !b.isOpened);
    if(unOpenedBoxed.length === this.numberOfMines){
      this.openAll();
    }
  }

  onRightClick(box: Box, event: Event) {
    if(event){
      event.preventDefault();
    }
    if(box.isFlagged){
      box.isFlagged = false
    }
    else{
      box.isFlagged = true;
    }
  }

  openEmptyBoxes(box: Box) {
    const filterArr = this.getFilterArray(box);
    for (let index of filterArr) {
      const selectedBoxIndex = box.index - 1 + index;
      if (selectedBoxIndex >= 0 && selectedBoxIndex < this.total) {
        const boxFound = this.boxArr[selectedBoxIndex];
        if (boxFound.isOpened || box.noOfMinesAround > 0) {
          continue;
        }
        if (!boxFound.isMine) {
          boxFound.isOpened = true;
          this.openEmptyBoxes(boxFound);
        }
        else {
          break;
        }
      }
    }
  }

  openAll() {
    this.boxArr.map((a)=>{
      a.isOpened = true;
    });
  }

  getRandomBoxesForSettingMines() {
    const randomArr = [...this.boxArr];
    return randomArr.sort(() => Math.random() - Math.random()).slice(0, this.numberOfMines)
  }

  getFilterArray(box: Box) {
    const columns = this.numberOfColumns;
    let filterArr = [1, -1, columns, -(columns), columns - 1, -(columns - 1), columns + 1, -(columns + 1)];
    if (box.index % columns === 0) {
      filterArr = [-1, -(columns + 1), columns - 1, -(columns), columns]
    }
    else if ((box.index - 1) % columns === 0) {
      filterArr = [1, (columns + 1), -(columns - 1), -(columns), columns]
    }
    return filterArr;
  }
}
