export function mergeArrays(a, b) {
    for (let [i, x] of b.entries()) a[i] = a[i] || x
    return a
}
