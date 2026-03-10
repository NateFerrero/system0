export async function system0() {
console.log('# Hello from system0.mjs')

await work()

console.log('# Farewell from system0.mjs')
}

async function work() {}
