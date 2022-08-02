const sum = (a: number, b: number) => {
  return a + b;
}

let wizard: object = {
  a: 'John'
}

// Tuple
let basket: [string, number];

basket = ['basket', 3]

// Enum
enum Size { Small = 1, Medium = 2, Large = 3 }
let sizeName: string = Size[2] 
let sizeNumber: number = Size.Medium 