---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Standard Algorithms - Find Min/Max
---


Find Min/Max is a standard algorithm that students are expected to know.
It traverses the array in sequence, continually updating the minimum or maximum value.
Once the array has been traversed, the minimum/maximum value is found.


To find the minimum value, change the comparison operator and variable name accordingly.
```vb
Dim numbers(5) as Integer = {282, 383, 1904, 193, 289, 92}
Dim max as Integer = numbers(0)

For counter = 1 To numbers.Length - 1
    if numbers(counter) > max Then
        max = numbers(counter)
    End if
Next

MsgBox("The biggest number is " & max) 


```

Common mistakes at higher level
- Using the wrong sign e.g. < instead of > or vice versa
- Not subtracting one from the length of the array
- updating the array instead of the variable

SQA-style example:

You have an array of test scores. Find and display the highest score and the lowest score. 
Start by using the first score as both the current maximum and current minimum, then check the rest of the array.

Note:
In exam questions, finding the *longest word* or *most characters* is an example of the find maximum algorithm.