import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

function eachObject(lineObjects){
    let output;
    output = '{' + lineObjects.line + ' ' + lineObjects.type
        + ' ' + lineObjects.name + ' ' +lineObjects.condition+ ' ' +lineObjects.value + '}';
    return output;
}

function arrayOfObjToString(array){
    let output = '[';
    array.forEach(function(element){
        output = output + eachObject(element);
    });
    output = output + ']';
    return output;
}

describe('The javascript parser', () => {
    it('Test 1', () => {
        assert.equal(arrayOfObjToString(parseCode('')),arrayOfObjToString([])
        );
    });
});

describe('Variable declaration test:', () => {
    it('Test 2', () => {
        assert.equal(arrayOfObjToString(parseCode('let a = 1;')),
            arrayOfObjToString([{line: 1,type:'VariableDeclaration',name:'a',condition:'', value: '1'}])
        );
        assert.equal(arrayOfObjToString(parseCode('let a = a++;')),
            arrayOfObjToString([
                {line: 1,type:'UpdateExpression',name:'a',condition:'', value: 'a++'},
                {line: 1,type:'VariableDeclaration',name:'a',condition:'', value: 'a++'}])
        );
        assert.equal(arrayOfObjToString(parseCode('let x;')),
            arrayOfObjToString([{line: 1,type:'VariableDeclaration',name:'x',condition:'', value: ''}])
        );
        assert.equal(arrayOfObjToString(parseCode('let x = M[0];')),
            arrayOfObjToString([
                {line: 1,type:'MemberExpression',name:'',condition:'', value: 'M[0]'},
                {line: 1,type:'VariableDeclaration',name:'x',condition:'', value: 'M[0]'}])
        );
    });
});

describe('Assignment expression test:', () => {
    it('Test 3', () => {
        assert.equal(arrayOfObjToString(parseCode('a = 1;')),
            arrayOfObjToString([{line: 1,type:'AssignmentExpression',name:'a',condition:'', value: '1'}])
        );
        assert.equal(arrayOfObjToString(parseCode('x = -1;')),
            arrayOfObjToString([
                {line: 1,type:'AssignmentExpression',name:'x',condition:'', value: '-1'},
                {line: 1,type:'UnaryExpression',name:'',condition:'', value: '-1'}])
        );
    });
});

describe('If Statement test:', () => {
    it('Test 4', () => {
        assert.equal(arrayOfObjToString(parseCode('if(x>1)\n x=1;')),
            arrayOfObjToString([
                {line: 1,type:'IfStatement',name:'',condition:'x > 1', value:''},
                {line: 1, type: 'BinaryExpression',name: '',condition:'', value:'x > 1'},
                {line: 2,type:'AssignmentExpression',name:'x',condition:'',value:'1'}])
        );
        assert.equal(arrayOfObjToString(parseCode('if(x<1)\na = a+x;\nelse\na++;')),
            arrayOfObjToString([
                {line: 1,type:'IfStatement',name:'',condition:'x < 1', value:''},
                {line: 1, type:'BinaryExpression',name: '',condition:'', value:'x < 1'},
                {line: 2,type:'AssignmentExpression',name:'a',condition:'',value:'a + x'},
                {line: 2,type:'BinaryExpression',name:'',condition:'',value:'a + x'},
                {line: 4,type:'UpdateExpression',name:'a',condition:'',value:'a++'}])
        );
    });
});

describe('If Statement test:', () => {
    it('Test 4', () => {
        assert.equal(arrayOfObjToString(parseCode('if(x=1)\nx++;\nif(x=0)\nx=x+10;')),
            arrayOfObjToString([
                {line: 1,type:'IfStatement',name:'',condition:'x = 1', value:''},
                {line: 1, type:'AssignmentExpression',name: 'x',condition:'', value:'1'},
                {line: 2,type:'UpdateExpression',name:'x',condition:'',value:'x++'},
                {line: 3,type:'IfStatement',name:'',condition:'x = 0',value:''},
                {line: 3,type:'AssignmentExpression',name:'x',condition:'',value:'0'},
                {line: 4,type:'AssignmentExpression',name:'x',condition:'',value:'x + 10'},
                {line: 4,type:'BinaryExpression',name:'',condition:'',value:'x + 10'}])
        );
    });
});

describe('Else If Statement test:', () => {
    it('Test 5', () => {
        assert.equal(arrayOfObjToString(parseCode('if(x=1)\ny = y++;\nelse if(x>1)\nx = x++;')),
            arrayOfObjToString([
                {line: 1,type:'IfStatement',name:'',condition:'x = 1', value:''},
                {line: 1, type: 'AssignmentExpression',name: 'x',condition:'', value:'1'},
                {line: 2,type:'AssignmentExpression',name:'y',condition:'',value:'y++'},
                {line: 2,type:'UpdateExpression',name:'y',condition:'',value:'y++'},
                {line: 3,type:'ElseIfStatement',name:'',condition:'x > 1',value:''},
                {line: 3,type:'BinaryExpression',name:'',condition:'',value:'x > 1'},
                {line: 4,type:'AssignmentExpression',name:'x',condition:'',value:'x++'},
                {line: 4,type:'UpdateExpression',name:'x',condition:'',value:'x++'}])
        );
    });
});

describe('Else If Statement test:', () => {
    it('Test 5', () => {
        assert.equal(arrayOfObjToString(parseCode('if(x=0)\nx++;\nelse if(x=1)\nx=x+10;\nelse if(x=2)\nx=x+20;')),
            arrayOfObjToString([
                {line: 1,type:'IfStatement',name:'',condition:'x = 0', value:''},
                {line: 1, type:'AssignmentExpression',name: 'x',condition:'', value:'0'},
                {line: 2,type:'UpdateExpression',name:'x',condition:'',value:'x++'},
                {line: 3,type:'ElseIfStatement',name:'',condition:'x = 1',value:''},
                {line: 3,type:'AssignmentExpression',name:'x',condition:'',value:'1'},
                {line: 4,type:'AssignmentExpression',name:'x',condition:'',value:'x + 10'},
                {line: 4,type:'BinaryExpression',name:'',condition:'',value:'x + 10'},
                {line: 5,type:'ElseIfStatement',name:'',condition:'x = 2',value:''},
                {line: 5,type:'AssignmentExpression',name:'x',condition:'',value:'2'},
                {line: 6,type:'AssignmentExpression',name:'x',condition:'',value:'x + 20'},
                {line: 6,type:'BinaryExpression',name:'',condition:'',value:'x + 20'}])
        );
    });
});

describe('While Statement test:', () => {
    it('Test 6', () => {
        assert.equal(arrayOfObjToString(parseCode('while(1){}')),
            arrayOfObjToString([
                {line: 1,type:'WhileStatement',name:'',condition:'1', value:''},])
        );
        assert.equal(arrayOfObjToString(parseCode('while(x>M[0])\n{x++;}')),
            arrayOfObjToString([
                {line: 1,type:'WhileStatement',name:'',condition:'x > M[0]', value:''},
                {line: 1,type:'BinaryExpression',name:'',condition:'', value:'x > M[0]'},
                {line: 1,type:'MemberExpression',name:'',condition:'', value:'M[0]'},
                {line: 2,type:'UpdateExpression',name:'x',condition:'', value:'x++'},])
        );
    });
});

describe('For Statement test:', () => {
    it('Test 7', () => {
        assert.equal(arrayOfObjToString(parseCode('let i;\nfor(i=0;i<2;i++){}')),
            arrayOfObjToString([
                {line: 1,type:'VariableDeclaration',name:'i',condition:'', value:''},
                {line: 2,type:'BinaryExpression',name:'',condition:'', value:'i < 2'},
                {line: 2,type:'ForStatement',name:'',condition:'i < 2', value:''},
                {line: 2,type:'AssignmentExpression',name:'i',condition:'', value:'0'},
                {line: 2,type:'UpdateExpression',name:'i',condition:'', value:'i++'}])
        );
        assert.equal(arrayOfObjToString(parseCode('let i;\nfor(i=0;;i++){}')),
            arrayOfObjToString([
                {line: 1,type:'VariableDeclaration',name:'i',condition:'', value:''},
                {line: 2,type:'ForStatement',name:'',condition:'', value:''},
                {line: 2,type:'AssignmentExpression',name:'i',condition:'', value:'0'},
                {line: 2,type:'UpdateExpression',name:'i',condition:'', value:'i++'}])
        );
    });
});

describe('Function declaration test:', () => {
    it('Test 8', () => {
        assert.equal(arrayOfObjToString(parseCode('function f(x,y){}')),
            arrayOfObjToString([
                {line: 1,type:'FunctionDeclaration',name:'f',condition:'', value:''},
                {line: 1,type:'VariableDeclaration',name:'x',condition:'', value:''},
                {line: 1,type:'VariableDeclaration',name:'y',condition:'', value:''}])
        );
    });
});

describe('Return statement test:', () => {
    it('Test 9', () => {
        assert.equal(arrayOfObjToString(parseCode('function x(){\nreturn 1};\n')),
            arrayOfObjToString([
                {line: 1,type:'FunctionDeclaration',name:'x',condition:'', value:''},
                {line: 2,type:'ReturnStatement',name:'',condition:'', value:'1'},
            ])
        );
    });
});

describe('Update expression test:', () => {
    it('Test 10', () => {
        assert.equal(arrayOfObjToString(parseCode('x++;\n')),
            arrayOfObjToString([
                {line: 1,type:'UpdateExpression',name:'x',condition:'', value:'x++'}])
        );
    });
});