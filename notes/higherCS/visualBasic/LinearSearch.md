Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Standard Algorithms - Linear Search


Linear search is a standard algorithm that students are expected to know.
It is used to search through an array, checking each element one at a time.
A message is displayed if a certain item is found.
Alternatively, each matching item may be listed - these are both considered linear search at higher.

```
Dim names(4) as String
Dim found as Boolean = False
Dim target As String = "Sebi"
names = {"Finn", "Sebi", "Lottie", "Aidan", "Declan"}

For counter = 0 To names.Length - 1
    if names(counter) = target Then
        found = True
    End If
Next

If found = True Then
    MsgBox("Found Sebi")
Else
    MsgBox("Couldn't find Sebi")
End If
```

Common mistakes at Higher level:
- Not indexing the array inside the loop (using names instead of names(counter))
- Forgetting to subtract one from the length of the array
- Forgetting to set the boolean variable to false initially
- Forgetting to set the Boolean variable to True when the value is found
- 
SQA-style example:

An array called scores stores the test scores of five pupils.
Dim scores() As Integer = {45, 62, 78, 55, 90}
Write code to search the array to check if the value 78 is stored.

```
Dim found as Boolean = False
Dim target As Integer = 78

For counter = 0 To scores.Length - 1
    if scores(counter) = target Then
        found = True
    End If
Next

If found = True Then
    MsgBox("Found score 78")
Else
    MsgBox("Couldn't find score 78")
End If

```

Typical uses of a linear search
-Searching an array for a specific value
-Finding the position of a value in an array