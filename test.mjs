#!/usr/bin/env node
import { system0 } from './system0.mjs'

console.log('# Hello from test.mjs')

await system0()

console.log('# Farewell from test.mjs')
