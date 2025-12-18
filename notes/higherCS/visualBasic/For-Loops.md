Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Iteration – For Loops

A For loop is used when the number of repetitions is known in advance.

Syntax:
```vb
For counter = 1 To 10
    MsgBox(counter)
Next
```


This loop will run 10 times, with counter taking values from 1 to 10 inclusive.

Common mistakes at Higher level:
- Forgetting that the end value is inclusive
- Using a For loop when a While loop would be more appropriate
- Modifying the loop counter inside the loop

When not to use a For loop:
- When the number of repetitions is not known in advance (use a While loop instead)

SQA-style example:
Write code that outputs the numbers 1 to 20.

Model answer:
For counter = 1 To 20
    MsgBox(counter)
Next

Typical uses of a For loop:
- Repeating an action a fixed number of times
- Counting from one value to another
- Working through an array using an index (for example, outputting each name stored in an array)
- Looping through multiple arrays at once (Parallel 1D arrays)
