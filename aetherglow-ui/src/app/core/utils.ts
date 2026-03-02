export function removeFromArray(arr: unknown[], ...items: unknown[]) {
    items.forEach(item => {
        const idx = arr.findIndex(x => x === item);
        if (idx >= 0) {
            arr.splice(idx, 1);
        }
    });
}
