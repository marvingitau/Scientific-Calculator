/*
Calculator angular app closure. 
*/
(function() {
  var app = angular.module('calculator', []);

  app.controller('calculatorController', function() {
    var ctrl = this;
    this.displayText = '';
    this.inputStack = [];
    var displayLength = 8;
    var opFlag = false;
    var eqFlag = false;
    
    this.buttons = [
      {text: 'AC', class: 'clear'},
      {text: 'CE', class: 'clear'},
      {text: '%', class: 'operation'},
      {text: '÷', class: 'operation'},
      {text: '7', value: 7, class: 'number'},
      {text: '8', value: 8, class: 'number'},
      {text: '9', value: 9, class: 'number'},
      {text: '×', class: 'operation'},
      {text: '4', value: 4, class: 'number'},
      {text: '5', value: 5, class: 'number'},
      {text: '6', value: 6, class: 'number'},
      {text: '-', class: 'operation'},
      {text: '1', value: 3, class: 'number'},
      {text: '2', value: 2, class: 'number'},
      {text: '3', value: 1, class: 'number'},
      {text: '0', value: 0, class: 'number'},
      {text: '.', class: 'number',},
      {text: '=', class: 'operation'},
      {text: '+', class: 'operation'},
    ];
    
    this.press = function(i) {
      var btn = this.buttons[i];
      
      switch(btn.text) {
        case 'AC':
          this.inputStack = [];
          this.displayText = '';
          opFlag = false;
          eqFlag = false;
          break;
        case 'CE':
          this.displayText = '';
          break;
        case '+':
        case '-':
        case '×':
        case '÷':
        case '%':
        case '=':
          handleOperationPress(btn);
          break;
        default: // Any number or decimal
          this.displayText = (opFlag || eqFlag ? btn.text : this.displayText + btn.text).slice(0, displayLength);
          opFlag = false;
          eqFlag = false;
       }
    };
    
    /*
    Called whenever any operation button is pressed.
    Calculates result, updates text, and pushes operations 
    to input stack appropriately.
    */
    var handleOperationPress = function(btn) {
      var result;
      
      // Only deal with operation if previous press was not an operation
      // and something is in the display
      if (!opFlag && ctrl.displayText.length > 0) {
        ctrl.inputStack.push(parseFloat(ctrl.displayText));
        
        // If stack already has 2 elements (i.e. an operation is present), chain
        if (ctrl.inputStack.length > 1) {
          result = parseFloat(doOperation().toString().slice(0, displayLength)); // TODO should round to 8 places
          ctrl.inputStack = btn.text == '=' ? [] : [result];
          ctrl.displayText = result.toString();
        }
        
        // Push any operation which requires calculation on next press
        // (anything but =) Ignore if previous press was an operation,
        // to disallow undefined behavior.
        if (!opFlag && btn.text !== '=') {
          ctrl.inputStack.push(btn.text);
          opFlag = true;
        }
        
        eqFlag = (btn.text == '=');
      }
    }
    
    /*
    Return the result of the operation in the input stack.
    */
    var doOperation = function() {
      var n1, n2, op;
      
      n1 = ctrl.inputStack[0];
      op = ctrl.inputStack[1];
      n2 = ctrl.inputStack[2];
      
      switch (op) {
        case '+':
          return n1 + n2;
        case '-':
          return n1 - n2;
        case '×':
          return n1 * n2;
        case '÷':
          return n1 / n2;
        case '%':
          return n1 % n2;
      }
    };
  });
})();