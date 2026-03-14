import { terminal } from './apps/terminal.mjs'

export function kernel(scope, message) {
 if (message === 'init') {
  scope.output(
   '# Hello from system0/kernel.mjs\n',
  )
  scope.app = terminal
 }
 scope.app(scope, message)
}
