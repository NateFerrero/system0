import { kernel } from './system0/kernel.mjs'

export async function system0() {
 console.log('# Hello from system0.mjs')
 let ok = true
 try {
  await work()
 } catch (e) {
  ok = false
  console.error(e)
 }
 console.log(
  `# Farewell from system0.mjs (${ok ? 'ok' : 'not ok'})`,
 )
}

async function work() {
 return new Promise((_resolve, _reject) => {
  let alive = true
  const inputQueue = []

  function tick() {
   if (inputQueue.length > 0) {
    const nextInput = inputQueue.shift()
    kernel(scope, nextInput)
   }
  }

  let tickTimeout

  function frame() {
   if (!alive) {
    throw new Error(
     'cannot call frame() after exit',
    )
   }
   clearTimeout(tickTimeout)
   tickTimeout = setTimeout(tick)
  }

  function input(x) {
   if (!alive) {
    throw new Error(
     'cannot call input() after exit',
    )
   }
   inputQueue.push(x)
   process.nextTick(frame)
  }

  function output(x) {
   if (!alive) {
    throw new Error(
     'cannot call output() after exit',
    )
   }
   process.stdout.write(x)
  }

  function listener(key) {
   // Ctrl+C to exit the process
   if (key === '\u0003') {
    reject('Interrupt')
    setTimeout(() => {
     console.log('Exiting after 0.25s')
     process.exit(1)
    }, 250)
    return
   }

   input(key)
  }

  function cleanup() {
   alive = false
   clearTimeout(tickTimeout)
   process.stdin.off('data', listener)
  }

  function resolve(x) {
   cleanup()
   _resolve(x)
  }

  function reject(x) {
   cleanup()
   _reject(x)
  }

  const scope = {
   globalThis,
   input,
   inputQueue,
   output,
   reject,
   resolve,
  }

  // Set stdin to raw mode to capture individual keystrokes without needing Enter
  process.stdin.setRawMode(true)

  // Resume stdin so the script doesn't exit immediately
  process.stdin.resume()

  // Set encoding to handle characters correctly
  process.stdin.setEncoding('utf8')

  // Listen for input
  process.stdin.on('data', listener)

  // Initial message for kernel startup
  input('init')
 })
}
