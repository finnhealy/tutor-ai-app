---
Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Array of Records
---


A record only stores information about one subject - in order to store information about multiple subjects
we can use an array of records. First, we create our record structure as normal.

```vb
Structure Movie

	Dim Name As String
	Dim Rating As Single
	Dim Certificate As String

End Structure
```

We can now create an array of movies and populate it by doing
```vb
Dim movies(2) as movie

movies(0).name = "cars"
movies(0).rating = 9
movies(0).Certificate = "12a"

movies(1).name = "cars2"
movies(1).rating = 9
movies(1).Certificate = "12a"

movies(2).name = "cars3"
movies(2).rating = 8
movies(2).Certificate = "15"
```

It is common to iterate through an array of records. The code below iterates through the array,
displaying the movie name, rating and certificate.

```vb
For counter = 0 to movies.Length - 1
    MsgBox(movies(counter).name & movies(counter).rating & movies(counter).Certificate)
Next
```

Common Mistakes
- Trying to access a field using `Movies.Name(counter)` instead of using dot notation correctly as `Movies(counter).Name`
- Getting confused with parallel 1D arrays e.g. assuming there are 3 arrays (names, ratings, certificates) instead of one movie array.