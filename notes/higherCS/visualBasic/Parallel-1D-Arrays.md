---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Parallel 1D Arrays
---

Parallel 1D Arrays are used to hold related information. Each array stores a different attribute but the data is linked by the same index position. 
For example, we can store a student's name, test score, 
and school. We can do this by having three arrays. The data is linked by the position in the array, so names(0), testScores(0)
and school(0) contains all the data for the first student. We can iterate through these arrays using a for loop.

Example of declaring parallel 1D arrays

```vb
Dim names(5) As String
Dim testScores(5) As Integer
Dim schools(5) As String
```

Parallel 1D arrays can be iterated through using a for loop similar to normal arrays.
Since all arrays are the same length we can pick the length of any of them as the end value for our for loop.

```vb
For counter = 0 To names.Length - 1
    MsgBox(names(counter) & " from school " & schools(counter) & " scored " &  testScores(counter))
Next
```