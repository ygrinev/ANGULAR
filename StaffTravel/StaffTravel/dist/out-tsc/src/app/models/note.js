"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Note = /** @class */ (function () {
    function Note(eb, sid, tid) {
        this.enteredBy = eb;
        this.sectionId = sid;
        this.typeId = tid;
        this.enteredOn = new Date();
    }
    return Note;
}());
exports.Note = Note;
//# sourceMappingURL=note.js.map