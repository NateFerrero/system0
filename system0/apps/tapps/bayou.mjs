export function BayouTerminalApp(scope, message) {
 if (message === 'init') {
  scope.menuStack = []
  scope.menuLabelStack = []
  Object.assign(scope.pad, bayou)
  home(scope)
 }
 console.log()
 scope.menuLabelStack.forEach((label, i) => {
  console.log(
   new Array(i + 1)
    .fill(0)
    .reduce((a) => `[${a}]`, label),
  )
 })
}

function home(scope) {
 scope.inputPad = [
  ['bayou', `value [${typeof scope.value}]`],
  [null],
  [null, null, 'exit'],
 ]
}

function enterMenu(label, scope, x) {
 if (!(1 in x)) {
  x[1] = []
 }
 x[1][1] = 'back'
 scope.menuLabelStack.push(label)
 scope.menuStack.push(scope.inputPad)
 scope.inputPad = x
}

const bayou = {
 about(scope) {
  enterMenu('about', scope, [['more']])
 },
 more(scope) {
  enterMenu('more', scope, [['bayou']])
 },
 back(scope) {
  if (scope.menuStack.length === 0) {
   console.log(
    '[back] nowhere left to go back...',
   )
  } else {
   scope.inputPad = scope.menuStack.pop()
   scope.menuLabelStack.pop()
  }
 },
 bayou(scope) {
  enterMenu('bayou', scope, [
   ['about bayou', 'v 0.0.0'],
  ])
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
