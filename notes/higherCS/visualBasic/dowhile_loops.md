Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Iteration – While Loops

A Do While loop is used when we want code to repeat while a certain condition is true. 

```
Syntax:
Do while password <> "admin"
    password = InputBox("Enter Password")
Loop
```

This loop will run until the user enters the word "admin".

Common mistakes at Higher level:
- Forgetting the loop always runs at least once
- Writing the condition for when the loop should stop, instead of when it should repeat.

When not to use a do while loop:
- When the number of repetitions is known in advance (use a for loop instead)
- Looping through an array
- Linear search, count occurrences or find min/max (use a for loop)

SQA-style example:
Write code that asks the user for numbers until they enter -1.

Model answer:

```
Dim number As Integer = InputBox("Enter a number (-1 to stop)")

While number <> -1
MsgBox("You entered " & number)
number = InputBox("Enter a number (-1 to stop)")
End While
```
Typical uses of a Do..While loop:
- Input validation
- File reading/writing
- Situations where code must run at least once
