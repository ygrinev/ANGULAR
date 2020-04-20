import {NoteSectionEnum, NoteTypeEnum} from './enums';

export class Note {
    constructor(eb:string, sid:NoteSectionEnum, tid: NoteTypeEnum) {
        this.enteredBy = eb;
        this.sectionId = sid;
        this.typeId = tid;
        this.enteredOn = new Date();
    }
    enteredBy: string;
    enteredOn: Date;
    text?: string;
    sectionId: NoteSectionEnum;
    typeId: NoteTypeEnum;
    requestId: number;
}

