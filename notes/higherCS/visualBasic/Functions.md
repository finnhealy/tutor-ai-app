---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Functions
---

## What Is a Function?

Functions allow us to write maintainable and reusable code by grouping instructions together under a meaningful name.

A function is similar to a procedure, but with one key difference:

A function always returns a value.

This value can be:
- stored in a variable
- used in a calculation
- passed into another function
- displayed to the user

---

## Structure of a Function

In VB.NET, a function has:
- a name
- parameters (inputs)
- a return type
- a return value

### General Syntax

```vb
Function functionName(parameters) As DataType
    ' code
    Return value
End Function
```

---

## Example: Function to Add Two Numbers

```vb
Function add(ByVal x As Integer, ByVal y As Integer) As Integer
    Return x + y
End Function
```

### Explanation
- x and y are parameters
- As Integer specifies the return type
- Return x + y sends the result back to where the function was called

---

## Using (Calling) a Function

```vb
Dim result As Integer
result = add(5, 6)
```

After this code runs:

result = 11

---

## Why Functions Are Useful

Functions help to:
- avoid repeating code
- make programs easier to read
- make programs easier to test and debug
- break large problems into smaller, manageable parts



## Exam Tip (Higher)

You should be able to:
- write a function with parameters
- state the return type
- explain the difference between a function and a procedure
- trace a function call and find the returned value
