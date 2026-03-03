import { isWeakObj, WeakObj } from '@app/typing';
import { camelCase, snakeCase } from 'change-case';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

export function removeFromArray(arr: unknown[], ...items: unknown[]) {
    items.forEach(item => {
        const idx = arr.findIndex(x => x === item);
        if (idx >= 0) {
            arr.splice(idx, 1);
        }
    });
}

export function transformObjCase(val: WeakObj, caseFunc: (x: string) => string, ...ignoredKeys: string[]): WeakObj {

    const newObj: WeakObj = {};
    Object.keys(val).forEach(key => {
        const origValue = val[key];
        //if (isWeakObj(origValue) && !(key in ignoredKeys)) origValue = transformObjCase(origValue, caseFunc, ...ignoredKeys);
        newObj[caseFunc(key)] = origValue;
    });

    return newObj;
}

export function fromPythonObj(val: WeakObj, ...ignoredKeys: string[]): WeakObj {
    return transformObjCase(val, camelCase, ...ignoredKeys);
}

export function toPythonObj(val: WeakObj, ...ignoredKeys: string[]) {
    return transformObjCase(val, snakeCase, ...ignoredKeys);
}

export function downloadTextAsFile(text: string, filename: string = 'chat_log.txt') {
    // Create a Blob object with the text and specify the MIME type
    const blob = new Blob([text], { type: 'text/plain' });

    // Create a URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element for the download
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename); // Set the default filename for the download

    // Hide the element, append it to the body, and click it to trigger the download
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();

    // Clean up: remove the element and revoke the object URL to free memory
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
}


export function getDialogData(ref: DynamicDialogRef, svc: DialogService) {

    return svc.getInstance(ref)?.data;
}

// Example usage:
// downloadTextAsFile("hello.txt", "This is the content of my file :)");
