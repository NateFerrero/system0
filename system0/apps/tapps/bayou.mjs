export function BayouTerminalApp(scope, message) {
 if (message === 'init') {
  scope.inputPad = home(scope)
  scope.menuStack = []
  Object.assign(scope.pad, bayou)
 }
}

function home(scope) {
 return [
  ['bayou', `value [${typeof scope.value}]`],
  [null],
  [null, null, 'exit'],
 ]
}

function enterMenu(scope, x) {
 if (!(1 in x)) {
  x[1] = []
 }
 x[1][1] = 'back'
 scope.menuStack.push(scope.inputPad)
 scope.inputPad = x
}

const bayou = {
 back(scope) {
  if (scope.menuStack.length === 0) {
   console.log(
    '[back] nowhere left to go back...',
   )
  } else {
   scope.inputPad = scope.menuStack.pop()
  }
 },
 bayou(scope) {
  enterMenu(scope, [['about bayou', 'v 0.0.0']])
 },
 exit() {
  process.exit(1)
 },
 value(scope) {
  console.log(
   `[value] ${typeof scope.value}:`,
   scope.value,
  )
 },
}
