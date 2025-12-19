---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Functions
---

Functions allow us to write more maintainable, reuseable code. 
Functions differ from procedures as they return a value. 
They can take parameters (See the note on parameter passing).
Here is an example function that adds two numbers

```vb
Function add(Integer x, Integer y)
    return x + y
End Function
```

We would use this function by doing:

```vb
Dim result as Integer
result = add(5,6)
```

