Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Standard Algorithms - Count Occurrences


Count Occurrences is a standard algorithm that students are expected to know.
It checks every element in an array, counting how many match the condition.
It counts the number of elements that match a specified target.
Students may also be asked to search using conditions other than equality, such as values greater than or less than a given value.

```vb
Dim scores(4) as Integer
Dim count as Integer = 0
Dim target As Integer = 15
scores = {28, 37, 15, 28, 15}

For counter = 0 To scores.Length - 1
    if scores(counter) = target Then
        count += 1
    End If
Next

MsgBox("Score 15 appeared " & count & " times.")
```

Common mistakes at higher level
- Not increasing the count when an occurence is found
- Not subtracting one from the length of the array
- Using a Boolean flag instead of a counter variable

SQA-style example:

You have an array that stores a list of people’s favourite colours. 
These colours can appear more than once in the list. 
Your task is to ask the user to type in a colour they want to check. 
The program should then go through the array, count how many times that colour appears,
and display the total number of matches to the user.


