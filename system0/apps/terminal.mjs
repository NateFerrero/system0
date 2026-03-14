import { BayouTerminalApp } from './tapps/bayou.mjs'

function toCodes(string) {
 const codes = []
 for (let x = 0; x < string.length; x++) {
  codes.push(string.charCodeAt(x))
 }
 return codes
}

export function terminal(scope, message) {
 if (message === 'init') {
  scope.tapp = BayouTerminalApp
  scope.prompt = '\r> '
  scope.inputQueue = ''
  scope.pad = {
   ''(scope, padIndex) {
    console.log(
     `You found a blank pad: ${padIndex}, scope contains ${Object.getOwnPropertyNames(
      scope,
     )
      .map((x) => JSON.stringify(x))
      .join(', ')}`,
    )
   },
  }
  scope.inputPad = [
   ['', '', ''],
   ['', '', ''],
   ['', '', ''],
  ]
  scope.inputPad[0][0] = 'echo'
  scope.pad.echo = function () {
   console.log('hello from echo')
  }
  scope.showInput = function () {
   function w(x) {
    const s = String(x)
    const space = '                '.substring(
     0,
     Math.max(0, 16 - s.length),
    )
    return `${s.substring(0, 16)}${s.length > 16 ? '...' : '   '}${space}`
   }
   const padText = [[], [], []]
    .map((x, i) => scope.inputPad[i] ?? x)
    .map((x) =>
     ['', '', '']
      .map((y, i) => x[i] ?? y)
      .map(w)
      .join(' | '),
    )
    .join('\n')
   scope.output(`\n\n${padText} [ ]\x1b[D\x1b[D`)
  }
  scope.tapp(scope, message)
  scope.showInput()
  return
 }
 const codes = toCodes(message)
 const [first, ...rest] = codes
 if (first > 48 && first < 58) {
  const padIndex = first - 48
  scope.output(`${padIndex}] `)
  const access = layout[padIndex - 1]
  const key =
   scope.inputPad[access[0]]?.[access[1]]?.split(
    ' ',
   )?.[0] ?? ''
  console.log(`[${key}] ${typeof scope.pad[key]}`)
  if (typeof scope.pad[key] === 'function') {
   scope.pad[key](scope, padIndex)
  }
 } else {
  scope.output(
   `Got ${first} code: ${rest.join('-')}\n`,
  )
 }
 scope.tapp(scope, message)
 scope.showInput()
}

const layout = [
 [2, 0],
 [2, 1],
 [2, 2],
 [1, 0],
 [1, 1],
 [1, 2],
 [0, 0],
 [0, 1],
 [0, 2],
]
