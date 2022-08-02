var sum = function (a, b) {
    return a + b;
};
var wizard = {
    a: 'John'
};
// Tuple
var basket;
basket = ['basket', 3];
// Enum
var Size;
(function (Size) {
    Size[Size["Small"] = 1] = "Small";
    Size[Size["Medium"] = 2] = "Medium";
    Size[Size["Large"] = 3] = "Large";
})(Size || (Size = {}));
var sizeName = Size[2];
var sizeNumber = Size.Medium;
