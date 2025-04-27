# robotix web client


## Development

### Crane Render Scale

1 unit is 1 meter, this is the Three.js (and thus fiber) default.

Example:
```
// If you want a box 100mm wide, 200mm tall, 50mm deep:
<boxGeometry args={[0.1, 0.2, 0.05]} /> // 100mm = 0.1m, etc.
```

```
// assuming some kind of normalizing mm function
<mesh position={[mm(x), mm(y), mm(z)]}>
  <boxGeometry args={[mm(width), mm(height), mm(depth)]} />
</mesh>
```

Summary Table
| Real World | Three.js Units |
|------------|-----------------------------|
| 1 mm | 0.001 |
| 10 mm | 0.01 |
| 100 mm | 0.1 |
| 1000 mm | 1 |


