export class Sorter {
    constructor(public collection: number[]) {}
    sort(): void {
        let {length} = this.collection;
        for(let i = 0; i < length; i++)
            for(let j = 0; j < length - i - 1; j++)
            {
                let left = this.collection[j], right = this.collection[j+1];
                if(left > right)
                {
                    this.collection[j] = right;
                    this.collection[j+1] = left;
                }
            }
    }
}

const sorter = new Sorter([10,3,-5,0]);
sorter.sort();
console.log(sorter.collection);
// console.log('HELLO MY WONDERFUL WORLD!');
// console.log('.........................');