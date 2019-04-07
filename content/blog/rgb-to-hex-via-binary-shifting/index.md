---
title: RGB to Hex via Binary Shifting
date: "2015-04-16T09:00:00.000Z"
---

A colleague of mine presented me with this code, baffled as to how it works.

```js
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
```

We know it converts an RGB value to it's hexadecimal equivalent, but how? It's doing some crazy stuff with binary, but when broken down it's actually incredibly simple and very clever.

## Hex Codes

Hex codes are six characters long, the first two being red, middle two being green and the last two being blue. Each character is a hexadecimal number.

<div class="scroll" markdown="1">

|    | R | R | G | G | B | B |
|----|---|---|---|---|---|---|
| \# | 0 | 0 | 0 | 0 | 0 | 0 |

</div>

### Hexadecimal Numbers

A hex value can go from `0` to `F` - a maximum of 16 different values. When putting two together, we can now have a maximum of 256 (16 multiplied by 16) values (`0` through to `255`). We can represent `0` through to `255` in 8 bits.

*0 represented in 8 bits*

<div class="scroll" markdown="1">

|128|64|32|16|8|4|2|1|
|---|--|--|--|-|-|-|-|
|0  |0 |0 |0 |0|0|0|0|

</div>

*256 represented in 8 bits*

<div class="scroll" markdown="1">

|128|64|32|16|8|4|2|1|
|---|--|--|--|-|-|-|-|
|1  |1 |1 |1 |1|1|1|1|

</div>

This means that red, green and blue can have 256 different variations each - that's 16,581,375 colours we can reference in just 6 characters!

## Double Arrow?

If you don't know about bitwise operators, you might be very confused to see a `<<` in JavaScript. Don't worry, what it does is very easy to understand.

The `<<` operator is also known as a left shift. This will shift the value of `r` 16 bits to the left. You can, at a maximum, shift a number 31 bits to the left.

### Let's do an example

The number one, represented as a decimal, is `1`. Represented as binary (in 17 bits for the sake of consistency), is -

<div class="scroll" markdown="1">

|65536|32768|16384|8192|4096|2048|1024|512|256|128|64|32|16|8|4|2|1|
|-----|-----|-----|----|----|----|----|---|---|---|--|--|--|-|-|-|-|
|0    |0    |0    |0   |0   |0   |0   |0  |0  |0  |0 |0 |0 |0|0|0|1|


</div>

When we shift `1` 16 bits to the left, we're adding 16 `0`'s to the right of the one.

<div class="scroll" markdown="1">

|65536|32768|16384|8192|4096|2048|1024|512|256|128|64|32|16|8|4|2|1|
|-----|-----|-----|----|----|----|----|---|---|---|--|--|--|-|-|-|-|
|1    |0    |0    |0   |0   |0   |0   |0  |0  |0  |0 |0 |0 |0|0|0|0|

</div>

Which as a decimal, is equal to `65536`.

That's all it does! Told you it was simple.

## Breaking it down

We're going to start with the middle section - the part that deals with converting the red value to hexadecimal.

### Red

The code that does this is `(r << 16)`. The red value is always first in a hex code, so in order to make room for green and blue, we shift it 16 bits to the left. This gives us the red value in binary, as well as 16 bits on the end - 8 bits for green and 8 bits for blue.

If we do `(255 << 16)`, we get the binary

`111111110000000000000000`

Which, when converted to hexadecimal, is equal to <span style="width: 10px; height: 10px; display: inline-block; background: #ff0000"></span> `ff0000`.

### Green

Now that we have converted red to binary and left room for green and blue, we can shift the green value 8 bits to the left. The code that does this is `(g << 8)`.

If we shift 255 to the left by 8 bits and represent it in 24 bits, we get this -

`000000001111111100000000`

Which, as hexadecimal, is equal to <span style="width: 10px; height: 10px; display: inline-block; background: #00ff00"></span> `00ff00`.

If you compare that table and the table in the red section, you can see that they line up perfectly - we can add the two values together without them conflicting.

*Take the red value*

`111111110000000000000000`

*add the green value*

`000000001111111100000000`

*and we get*

`111111111111111100000000`

When this is converted to hexadecimal, it is <span style="width: 10px; height: 10px; display: inline-block; background: #ffff00"></span> `ffff00` - the correct representation of `rgb(255, 255, 0)` as a hex.

### Blue

We don't need to shift our blue value to the left, because we are taking up the last 8 bits with it. If you look at the original code, you can see it just does `+ b` at the end. This is because when adding a binary number and a decimal number in JavaScript, the decimal will be converted over to binary before it's added.

If our blue value is 255, the binary representation of it is (again, in 24 bits)

`000000000000000011111111`

Which, when added to our red and green value, outputs

`111111111111111111111111`

Which is equal to "ffffff" when converted to a hexadecimal! Most of you will know that this colour is in fact white, or `rgb(255, 255, 255)`.

### Padding

Wait a minute - what's that `(1 << 24)` at the start? Why is it needed?

The decimal number `1` shifted 24 bits to the left provides us with the necessary padding for our RGB values in binary. When you convert a decimal number to a binary number, you aren't guaranteed 8 bits back - you will get the amount of bits it takes to represent that number (the reason we got 8 bits back for our 255 values is because it takes 8 bits to represent 255 in binary) - if you convert decimal `0` to binary you will only get one bit back - `0`, or if you convert 13 to binary you will get four bits back - `1101`.

When we shift 1 to the left 24 bits, we get this -

`1000000000000000000000000`

The number 1 followed by 24 bits - 8 bits for each of our colour values.

This means that whenever we add the results from converting our RGB values to binary, regardless of how many bits the result is, it'll always add into the correct section of bits because we are shifting the values to the left by either 16, 8 or 0 bits.

## Binary to Hexadecimal

We can convert our binary number into a hexadecimal string by using `toString` and passing it `16` as a value. Alternatively, you can use `2` for binary or `8` for octal.

```js
function rgbToHex(r, g, b) {
    // r = 255, g = 255, b = 255
    return "#" +
    (
        (1 << 24)
            // Value: 16777216 or 1000000000000000000000000
        + (r << 16)
            // Value: 16711680 or 111111110000000000000000
            // Total: 33488896 or 1111111110000000000000000
        + (g << 8)
            // Value: 65280 or 1111111100000000
            // Total: 33554176 or 1111111111111111100000000
        + b
            // Value: 255 or 11111111
            // Total: 33554431 or 1111111111111111111111111
    )
    .toString(16) // "1ffffff"
    .slice(1); // "ffffff"
}

rgbToHex(255, 255, 255); // #ffffff
```

## Conclusion

As you can see, the code used above is very clever but also very daunting to look at if you don't understand what's happening underneath the hood. Hopefully this post makes it all a lot clearer!

If you have any queries, feel free to contact me on Twitter via <a href="https://twitter.com/rynclark" target="_blank">@rynclark</a>

Credit to the appropriate authors in this <a href="http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb" target="_blank">stackoverflow post.</a>
