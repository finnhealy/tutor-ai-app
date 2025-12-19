---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Records
---

Records are used to store multiple pieces of related data about a single entity. For example, a movie record can store
the name, rating and certificate in one record. This allows us to organise multiple pieces
of related data in a structured way.
In Visual Basic, records are created using structures.

```vb
Structure Movie

	Dim Name As String
	Dim Rating As Single
	Dim Certificate As String

End Structure


```

After defining the initial structure, we can create the record.
```vb
Dim myMovie As Movie
myMovie.Name = "Jaws"
myMovie.Rating = 8.1
myMovie.Certificate = "12"
```

If we want to display information using records we can access it like so:

```vb
MsgBox("Movie: " & myMovie.Name & " has rating " & myMovie.Rating & " and certificate " & myMovie.Certificate )
```



