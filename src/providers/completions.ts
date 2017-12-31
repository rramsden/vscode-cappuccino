import * as vscode from 'vscode';
import { isPositionInString, isUppercase } from '../utils';

interface ClassSuggestion {
    className: string,
    superclass: string,
    ignore: boolean
}

const CLASS_REGEXP = /((\[[A-Z][a-zA-Z]*\])|(\([A-Z][a-zA-Z]*\))|(^\s*[A-Z][A-Za-z]*$))/

const classes:Array<ClassSuggestion> = require('../../lib/classes.json');

export class ObjjCompletionItemProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            let filename = document.fileName;
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);
            let suggestions:Array<vscode.CompletionItem> = [];

            // ignore opening a comment
            if (lineText.match(/^\s*\/\//)) {
                return resolve([]);
            }

            // ignore when opening a string
            let inString = isPositionInString(document, position);
            if (!inString && lineTillCurrentPosition.endsWith('\"')) {
                return resolve([]);
            }

            // get current word
            let wordAtPosition = document.getWordRangeAtPosition(position);
            let currentWord = '';
            if (wordAtPosition && wordAtPosition.start.character < position.character) {
                let word = document.getText(wordAtPosition);
                currentWord = word.substr(0, position.character - wordAtPosition.start.character);
            }

            // ignore words with digits
            if (currentWord.match(/^\d+$/)) {
                return resolve([]);
            }

            if (currentWord.length > 0) {
                // class name matching
                if (isUppercase(currentWord)) {
                    if (CLASS_REGEXP.test(lineText)) {
                        classes.forEach(klass => {
                            if (!klass.ignore && klass.className.startsWith(currentWord)) {
                                suggestions.push(new vscode.CompletionItem(klass.className, vscode.CompletionItemKind.Class))
                            }
                        })
                    }
                }
            }

            resolve(suggestions)
        })
    }
}