import * as vscode from 'vscode';
import { ObjjDocumentSymbolProvider } from './symbols';
import { Linter } from './linter';

const OBJJ_FILTER: vscode.DocumentFilter = { language: 'objj', scheme: 'file' };

export function activate(context: vscode.ExtensionContext) {
    // Symbol Provider
    let documentSymbolProvider: vscode.Disposable =
        vscode.languages.registerDocumentSymbolProvider(OBJJ_FILTER, new ObjjDocumentSymbolProvider());
    context.subscriptions.push(documentSymbolProvider);

    // Linting Provider
    let linter = new Linter();
    linter.lintOpenFiles();
    context.subscriptions.push(linter.diagnosticCollection);
	context.subscriptions.push(
		vscode.workspace.onDidOpenTextDocument(linter.lint, linter),
		vscode.workspace.onDidSaveTextDocument(linter.lint, linter)
    );
}