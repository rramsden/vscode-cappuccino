import * as vscode from 'vscode';
import { Formatter, ObjjDocumentRangeFormattingEditProvider } from './formatter';

const OBJJ_FILTER: vscode.DocumentFilter = { language: 'objj', scheme: 'file' };

export function activate(context: vscode.ExtensionContext) {
    // Register our formatting provider
    let formattingProvider: vscode.Disposable =
        vscode.languages.registerDocumentRangeFormattingEditProvider(OBJJ_FILTER, new ObjjDocumentRangeFormattingEditProvider());
    context.subscriptions.push(formattingProvider);
}