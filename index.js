// --- Directions
// Write a function that accepts an integer N
// and returns a NxN spiral matrix.
// --- Examples
//   matrix(2)
//     [[1, 2],
//     [4, 3]]
//   matrix(3)
//     [[1, 2, 3],
//     [8, 9, 4],
//     [7, 6, 5]]
//  matrix(4)
//     [[1,  2,  3, 4],
//     [12, 13, 14, 5],
//     [11, 16, 15, 6],
//     [10,  9,  8, 7]]

function matrix(n, idxStart = 1, cnt = 0, a = null) {
    if(idxStart > n) // print array
    {
        let i = -1;
        for(let sarr of a)
        {
            //console.log((i == 0 ? '[' : '') + sarr + (i < n ? ',' : ']'));
            console.log(sarr);
            i++;
        }
        return;
    }
    if(!a) 
    {
        a = new Array(n).fill(new Array(n).fill(-1));
        let j = 0;
        for(let sarr of a)
        {
            sarr.fill(--j);
            console.log(sarr);
        }
        console.log();
    }
    
    let rng = (cnt + cnt%2)/2;
    let offsIdx =  (cnt-1 + 4 - (cnt-1)%4)/4; // 0 1 1 1 1 2 2 2 2
    let offsEdge = (cnt - cnt%4)/4;
    let val = idxStart;
    // fill horiz row
    while(n < idxStart + rng)
    {
        let idxDlt = val - idxStart;
        switch(cnt%2)
        {
            case 0: // -> right
                a[offsEdge][offsIdx + idxDlt] = val;
                break;
            case 1: // -> down
                a[offsIdx + idxDlt][n - offsEdge - 1] = val;
                break;
            case 2: // -> left
                a[n - offsEdge - 1][n - offsIdx - idxDlt - 1] = val;
                break;
            case 3: // -> up
                a[n - offsIdx - idxDlt - 1][offsEdge] = val;
                break;
        }
        n++;
        // if(cnt%2 == 0) // right->down
        // {
        //     if(n < idxStart+(n-cnt)) // right, row = cnt/2
        //     {
        //         a[cnt/2][cnt/2 + n - idxStart] = n;
        //     }
        //     else // down, col = n-cnt/2
        //     {
        //         a[cnt/2 + n - idxStart - (n-cnt) + 1][n - cnt/2] = n;
        //     }
        // }
        // else // left->up
        // {
        //     if(n < idxStart+(n-cnt)) // left, row = n - (col+1)/2
        //     {
        //         a[n - (cnt+1)/2][n - (cnt+1)/2 - n + idxStart] = n;         
        //     }
        //     else // up, col = (cnt-1)/2
        //     {
        //         a[n - 1 - n - idxStart - (n-cnt)][(cnt-1)/2] = n;         
        //     }
        // }
    }
    matrix(n, val+(n-cnt), cnt+1, a);
}

matrix(4);

module.exports = matrix;
