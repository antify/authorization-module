# Docs

## Why use jose instead of jsonwebtoken?
This package should be usable on client- and server side. Jose supports 
different environments like browser and node, what jsonwebtoken not does.

Therefor using jsonwebtoken whould lead in a "util.*" does not exist on client side, 
which means that utils from the node env are missing on client side. 
