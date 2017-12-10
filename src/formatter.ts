import { 
    window,
    Disposable,
    TextDocument,
    Range,
    TextEdit,
    TextEditorEdit,
    DocumentRangeFormattingEditProvider,
    FormattingOptions,
    CancellationToken 
 } from 'vscode';

export class Formatter {
    constructor() { }

    /**
     * Applies the appropriate formats to the active text editor.
     * 
     * @param document TextDocument to format. Edits will be applied to this document.
     * @param selection Range to format. If there is no selection, or the selection is empty, the whole document will be formatted.
     */
    public formatDocument(document: TextDocument, selection?: Range) {
        this.getTextEdits(document, selection).then((textEdits) => {
            textEdits.forEach((te) => {
                window.activeTextEditor.edit((textEditorEdit: TextEditorEdit) => {
                    textEditorEdit.replace(te.range, te.newText);
                });
            });
        });
    }

    /**
     * Returns a Promise with an array of TextEdits that should be applied when formatting.
     * 
     * @param document TextDocument to format. Edits will be applied to this document.
     * @param selection Range to format. If there is no selection, or the selection is empty, the whole document will be formatted.
     * @return Promise with an array of TextEdit.
     */
    public getTextEdits(document: TextDocument, selection?: Range): Thenable<TextEdit[]> {
        return new Promise((resolve, reject) => {
            const firstLine = document.lineAt(0);
            console.log(firstLine)
            let textEdits: TextEdit[] = [];
            return resolve(textEdits)
        });
    }
}

export class ObjjDocumentRangeFormattingEditProvider implements DocumentRangeFormattingEditProvider {
    private formatter: Formatter;

    constructor() {
        this.formatter = new Formatter();
    }

    public provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): Thenable<TextEdit[]> {
        return this.formatter.getTextEdits(document, range);
    }
}