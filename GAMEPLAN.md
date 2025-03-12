# Conversion of LHG CollegeBB to modern codebase

## Step 1: Converting Game Files

The first milestone of this project would be to have a converted game engine. For that, need to solve for the inputs first. The inputs to a single game
are pretty straightforward. First, you need the team data. Second, you need the game parameters. And everything after that is just game logic.

So the first thing I want to do is take the LHGCBB team data files and convert them to something readable (they are binary right now). This is probably
going to involve writing some QuickBasic code. What I basically want is a utility that can take a single team data file, suck it in, and output the
data in plain text. From there, I can script that data out into something more readable (like JSON). Then the game file for the new game becomes a fully
readable / editable JSON text file.

Jason said he was looking to use something like SQLlite for the program's data. That would certainly be do-able, it is just a matter of sucking up all 
the JSON team files (and, later, data like scheduling and conference) into database tables and using that as the core data source for the program.

## Step 2: Build Out The Game Engine

One core goal is to build the game engine totally separate from the UI.  This will allow any kind of UI to be built for it, and I'll probably start with a "classic" UI that mimics the LH console look (except using a HTML view or something like that). The classic look was an 80x25 (character) display.



