---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Parameter Passing
---


## What is Parameter Passing?

Parameter passing is used when data is sent to a subprogram (a procedure or function).
It allows values to be passed from the main program into a subprogram so they can be used or modified.

## Actual and Formal Parameters

When using parameter passing, there are two types of parameters:

- Actual parameters – the values or variables passed to the subprogram when it is called
- Formal parameters – the variables defined in the subprogram that receive the values

### Example

```vb
Sub Increase(ByVal value As Integer)
    'Some code here
End Sub

Increase(score)

```
In this example:
- score is the actual parameter
- value is the formal parameter

## ByVal (Pass by Value)

When a parameter is passed ByVal, a copy of the value is sent to the subprogram.

This means:
- Changes made inside the subprogram do not affect the original variable
- The original value remains unchanged after the subprogram finishes

### Example
```vb
Sub AddOne(ByVal num As Integer)
    num = num + 1
End Sub

Dim x As Integer = 5
AddOne(x)
```


After this code runs:
- x is still 5

This is because only a copy of x was modified.

## ByRef (Pass by Reference)

When a parameter is passed ByRef, the original variable is passed to the subprogram.

This means:
- Changes made inside the subprogram do affect the original variable
- The value can be permanently changed

### Example

```vb
Sub AddOne(ByRef num As Integer)
num = num + 1
End Sub

Dim x As Integer = 5
AddOne(x)
```
After this code runs:
- x is now 6

## Key Differences Between ByVal and ByRef

ByVal:
- A copy of the value is passed
- Original value does not change
- Safer to use

ByRef:
- The original variable is passed
- Original value can change
- More powerful but riskier

## When to Use ByVal or ByRef

- Use ByVal when you only need to use a value
- Use ByRef when you need to change a value and return it to the main program

In Higher Computing Science, ByVal is used by default unless ByRef is specified.

## Exam Tip

In exam questions, you may be asked to:
- identify actual and formal parameters
- explain the difference between ByVal and ByRef
- predict the final value of a variable after a subprogram call

Always check whether the parameter is passed ByVal or ByRef.

## Common Mistakes

- Forgetting that ByVal does not change the original variable
- Using ByRef when it is not required
- Confusing actual and formal parameters