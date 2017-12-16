import * as vscode from 'vscode';
import * as acorn from 'acorn-objj';

const packageJson = require('../package.json')
const objjMarkdownId = "objj"
const parser = acorn.parse;

export class Linter {
    public diagnosticCollection: vscode.DiagnosticCollection = null;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection(packageJson.displayName)
    }

    public lintOpenFiles() {
        (vscode.workspace.textDocuments || []).forEach(this.lint, this);
    }

    public lint(document: vscode.TextDocument): void {
        const diagnostics: Array<vscode.Diagnostic> = [];

        if (document.languageId != objjMarkdownId) {
            return;
        }

        try {
            parser.parse(document.getText());
        } catch (e) {
            let lineInfo = e.lineInfo;
            let range = document.lineAt(lineInfo.line - 1).range;
            let message = e.message;
            let diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);

            diagnostics.push(diagnostic);
        }

        this.diagnosticCollection.set(document.uri, diagnostics);
    }
}