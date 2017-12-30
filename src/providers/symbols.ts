import * as vscode from 'vscode';

export class ObjjDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<Array<vscode.SymbolInformation>> {
        let symbols: vscode.SymbolInformation[] = [];
        let lineCount = document.lineCount;

        for (let i = 0; i < lineCount; ++i) {
            let line = document.lineAt(i);
            let rawText = line.text
            let word = rawText.substr(0, rawText.indexOf(' '));

            if (word.startsWith('@')) {
                let name = rawText.split(' ')[1].replace(/^"(.*)?(.j)"$/, '$1');

                if (word == '@implementation') {
                    symbols.push( this.makeSymbol(name, vscode.SymbolKind.Class, line) );
                } else if (word == '@import') {
                    symbols.push( this.makeSymbol(name, vscode.SymbolKind.Package, line) );
                }
            } else if (word.startsWith('+') || word.startsWith('-')) {
                let matches = rawText.match(/^[-+]\s*\(\w+\)\s*(\w+)/)
                if (matches) {
                    symbols.push( this.makeSymbol(matches[1], vscode.SymbolKind.Method, line) );
                }
            }
        }

        return symbols;
    }

    private makeSymbol(name: string, kind: vscode.SymbolKind, line: vscode.TextLine): vscode.SymbolInformation {
        return new vscode.SymbolInformation(
            name,
            kind,
            line.range,
            undefined,
            ''
        )
    }
}