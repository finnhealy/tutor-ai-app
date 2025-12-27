---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Predefined Functions
---

The predefined functions that you need to know at Higher cover the following areas:

- creating substrings (`Strings.Left()`, `Strings.Mid()`, `Strings.Right()`)
- converting from character to ASCII and vice versa (`Chr()` and `Asc()`)
- converting floating-point numbers to integers (`Int()` and `Round()`)
- modulus (`Mod`)

## Creating Substrings

A **substring** is a smaller part taken from a larger string.

VB provides three predefined functions to extract substrings:

- `Strings.Left(text, numberOfCharacters)`  
  Returns the leftmost characters from a string.

- `Strings.Right(text, numberOfCharacters)`  
  Returns the rightmost characters from a string.

- `Strings.Mid(text, startPosition, length)`  
  Returns a section from the middle of a string.

Example:
```vb
Dim word As String = "Computer"
Dim result As String

result = Strings.Left(word, 3)   ' "Com"
result = Strings.Right(word, 4)  ' "uter"
result = Strings.Mid(word, 2, 3) ' "omp"
```

> **Important:** String positions in `Mid()` start at **1**, not 0.

---

## Converting from Characters to ASCII

Each character has an **ASCII code**, which is a number representing that character.

VB provides two predefined functions for conversion:

- `Asc(character)`  
  Converts a character into its ASCII value.

- `Chr(number)`  
  Converts an ASCII value into the corresponding character.

Example:
```vb
Dim code As Integer
Dim letter As Char

code = Asc("A")      ' 65
letter = Chr(66)     ' "B"
```

---

## Converting Floating-Point Numbers to Integers

Sometimes programs need to convert decimal numbers into whole numbers.

VB provides two predefined functions for this:

- `Int(number)`  
  Removes the decimal part by rounding **down**.

- `Round(number)`  
  Rounds to the **nearest whole number**.

Example:
```vb
Dim value As Double = 7.6
Dim a As Integer
Dim b As Integer

a = Int(value)    ' 7
b = Round(value)  ' 8
```

---

## Modulus

The **modulus operator (`Mod`)** returns the remainder after division.

Example:
```vb
Dim result As Integer

result = 10 Mod 3   ' 1
result = 20 Mod 5   ' 0
```

---

### Summary

- Substring functions extract parts of strings
- `Asc()` and `Chr()` convert between characters and ASCII values
- `Int()` and `Round()` convert decimals to integers
- `Mod` is used to find remainders and detect patterns
