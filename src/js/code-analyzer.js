import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

let jsonTable;

const parseCode = (codeToParse) => {
    jsonTable = [];
    parsedJson(esprima.parseScript(codeToParse, {loc: true}));
    return jsonTable;
};

export {parseCode};

const parsedJson = (data) => {
    switch (data.type) {
    case 'Program' :
        return parsedProgram(data.body);
    case 'FunctionDeclaration' :
        return parsedFunctionDeclaration(data);
    case 'VariableDeclaration' :
        return parsedVariableDeclaration(data);
    case 'ExpressionStatement' :
        return parsedExpressionStatement(data.expression);
    default :
        nextOption(data);
    }
};

const nextOption = (data) => {
    switch (data.type) {
    case 'WhileStatement' :
        return parsedWhileStatement(data);
    case 'ForStatement' :
        return parsedForStatement(data);
    case 'IfStatement' :
        return parsedIfStatement(data);
    case 'ElseIfStatement' :
        return parsedElseIfStatement(data);
    default : nextOption2(data);
    }
};

const nextOption2 = (data) => {
    switch (data.type) {
    case 'ReturnStatement':
        return parsedReturnStatement(data);
    case 'BlockStatement':
        return parsedBlockStatement(data.body);
    case 'UpdateExpression' :
        return parsedUpdateExpression(data);
    default:
        expressionOptions(data);
    }
};

const expressionOptions = (data) => {
    switch (data.type) {
    case 'AssignmentExpression' :
        return parsedAssignmentExpression(data);
    case 'BinaryExpression' :
        return parsedBinaryExpression(data);
    case 'MemberExpression' :
        return parsedMemberExpression(data);
    case 'UnaryExpression' :
        return parsedUnaryExpression(data);
    default: expressionOptions2(data);
    }
};

const expressionOptions2 = (data) => {
    switch(data.type){
    case 'Identifier' :
        return data.name;
    case 'Literal' :
        return data.value;
    }
};

function initializeArray(line, type, name, condition, value){
    jsonTable.push({line: line , type: type , name: name , condition: condition , value: value});
}

function parsedProgram(bodyElement){
    let i;
    for(i=0;i<bodyElement.length;i++)
        parsedJson(bodyElement[i]);
}

function initializeParams(params) {
    params.forEach(function(eachParam) {
        let line  = eachParam.loc.start.line;
        let type = 'VariableDeclaration';
        let name = eachParam.name;
        let condition = '';
        let value = '';
        initializeArray(line, type, name, condition, value);
    });
}

function parsedFunctionDeclaration(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'FunctionDeclaration';
    let name = bodyElement.id.name;
    let condition = '';
    let value = '';
    initializeArray(line, type, name, condition, value);
    initializeParams(bodyElement.params);
    parsedJson(bodyElement.body);
}

function parsedBlockStatement(bodyElement) {
    bodyElement.forEach(function(eachBody){
        parsedJson(eachBody);
    });
}

function parsedVariableDeclaration(bodyElement) {
    bodyElement.declarations.forEach(function(eachVar){
        let line = eachVar.loc.start.line;
        let type = 'VariableDeclaration';
        let name = eachVar.id.name;
        let condition = '';
        let value;
        if(eachVar.init === null)
            value = '';
        else {
            value = escodegen.generate(eachVar.init);
            parsedJson(eachVar.init);
        }
        initializeArray(line, type, name, condition, value);
    });
}

function parsedExpressionStatement(bodyElement) {
    parsedJson(bodyElement);
}

function parsedAssignmentExpression(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'AssignmentExpression';
    let name = escodegen.generate(bodyElement.left);
    let condition = '';
    let value = escodegen.generate(bodyElement.right);
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.left);
    parsedJson(bodyElement.right);
}

function parsedBinaryExpression(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'BinaryExpression';
    let name = '';
    let condition = '';
    let value = escodegen.generate(bodyElement);
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.left);
    parsedJson(bodyElement.right);
}

function parsedWhileStatement(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'WhileStatement';
    let name = '';
    let condition = escodegen.generate(bodyElement.test);
    let value = '';
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.test);
    parsedJson(bodyElement.body);
}

function parsedIfStatement(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'IfStatement';
    let name = '';
    let condition = escodegen.generate(bodyElement.test);
    let value = '';
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.test);
    parsedJson(bodyElement.consequent);
    if(bodyElement.alternate && bodyElement.alternate.type === 'IfStatement'){
        bodyElement.alternate.type = 'ElseIfStatement';
    }
    if(bodyElement.alternate!=null){
        parsedJson(bodyElement.alternate);
    }
}

function parsedElseIfStatement(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'ElseIfStatement';
    let name = '';
    let condition = escodegen.generate(bodyElement.test);
    let value = '';
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.test);
    parsedJson(bodyElement.consequent);
    if(bodyElement.alternate && bodyElement.alternate.type === 'IfStatement'){
        bodyElement.alternate.type = 'ElseIfStatement';
    }
    if(bodyElement.alternate!=null){
        parsedJson(bodyElement.alternate);
    }
}

function parsedForStatement(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'ForStatement';
    let name = '';
    let condition = '';
    if(bodyElement.test!=null){
        condition = escodegen.generate(bodyElement.test);
        parsedJson(bodyElement.test);
    }
    else{
        condition = '';
    }
    let value = '';
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.init);
    parsedJson(bodyElement.update);
    parsedJson(bodyElement.body);
}

function parsedUpdateExpression(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'UpdateExpression';
    let name = escodegen.generate(bodyElement.argument);
    let condition = '';
    let value = escodegen.generate(bodyElement.argument) + bodyElement.operator;
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.argument);
    parsedJson(bodyElement.argument);
}

function parsedReturnStatement(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'ReturnStatement';
    let name = '';
    let condition = '';
    let value = escodegen.generate(bodyElement.argument);
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.argument);
}

function parsedMemberExpression(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'MemberExpression';
    let name = '';
    let condition = '';
    let value = escodegen.generate(bodyElement.object) + '[' + escodegen.generate(bodyElement.property) + ']';
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.object);
    parsedJson(bodyElement.property);
}

function parsedUnaryExpression(bodyElement) {
    let line = bodyElement.loc.start.line;
    let type = 'UnaryExpression';
    let name = '';
    let condition = '';
    let value = bodyElement.operator + escodegen.generate(bodyElement.argument);
    initializeArray(line, type, name, condition, value);
    parsedJson(bodyElement.argument);
}


