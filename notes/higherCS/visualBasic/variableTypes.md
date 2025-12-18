Subject: Higher Computing Science (Scotland)
Language: Visual Basic .NET (VB8)
Student Level: Higher
Topic: Variables and Data Types

A variable is a named location in memory used to store data while a program is running.
Each variable must have a data type, which determines what kind of value it can store

Common data types at Higher level
•	Integer – stores whole numbers
Example: Dim age As Integer
•	String – stores text
Example: Dim name As String
•	Boolean – stores True or False
Example: Dim isLoggedIn As Boolean
•	Double – stores decimal numbers
Example: Dim average As Double

Declaring and assigning variables

Variables are declared using the Dim keyword, followed by the variable name and data type.

Dim score As Integer
score = 10

You can also declare and assign a value on the same line:

Dim name As String = "Sebi"


Why data types are important
•	They control what operations can be performed on a variable
•	They help prevent logic and runtime errors
•	They make programs easier to understand and debug

For example, you cannot store text in an Integer variable.

⸻

Common mistakes at Higher level
•	Using the wrong data type (e.g. Integer instead of Double)
•	Forgetting to declare a variable before using it
•	Trying to store text in a numeric variable
•	Confusing assignment (=) with comparison in conditions

⸻

SQA-style example

Question:
Declare a variable called total that stores a decimal value.
Dim total As Double


Typical uses of variables
•	Storing user input
•	Keeping track of totals, counters, or averages
•	Controlling program logic using Boolean variables
•	Holding values that change during a loop or calculation

⸻

When to choose each type
•	Use Integer for counting or indexing
•	Use Double for calculations involving decimals
•	Use String for names or messages
•	Use Boolean for decisions and conditions


Note:
Variables store a single value.
Arrays store multiple values of the same data type.
Records store multiple values of different data types.