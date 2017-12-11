import * as vscode from 'vscode';
import { ObjjDocumentSymbolProvider } from './symbols';

const OBJJ_FILTER: vscode.DocumentFilter = { language: 'objj', scheme: 'file' };

export function activate(context: vscode.ExtensionContext) {
    let documentSymbolProvider: vscode.Disposable =
        vscode.languages.registerDocumentSymbolProvider(OBJJ_FILTER, new ObjjDocumentSymbolProvider());

    context.subscriptions.push(documentSymbolProvider);
}